"""
Agent-to-agent communication server for restaurant market research.
This module handles the communication between the restaurant market research agent and other agents.
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import json
import asyncio
import logging
from .agent import create_agent
from .state import AgentState

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create the FastAPI application
app = FastAPI(title="Restaurant Market Research Agent")

# Initialize an empty dict to store active connections
active_connections: Dict[str, WebSocket] = {}

# Initialize an empty dict to store agent states
agent_states: Dict[str, Dict] = {}

class MarketResearchRequest(BaseModel):
    """Market research request model"""
    query: str
    location: str
    cuisine_type: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None

class ResearchResponse(BaseModel):
    """Research response model"""
    id: str
    result: Dict[str, Any]
    status: str = "complete"
    message: Optional[str] = None

@app.post("/api/research", response_model=ResearchResponse)
async def handle_research_request(request: MarketResearchRequest):
    """Handle market research requests"""
    try:
        # Create a new agent instance
        agent = create_agent()
        
        # Initialize agent state
        state = {
            "messages": [
                {
                    "type": "human",
                    "content": f"I want to research {request.query} for a {request.cuisine_type or 'restaurant'} in {request.location}."
                }
            ],
            "research_projects": [],
            "establishments": [],
            "insights": [],
            "selected_project_id": None,
            "search_progress": [],
            "research_data": {}
        }
        
        # Invoke the agent
        result = agent.invoke(state)
        
        # Generate a unique ID for this request
        import uuid
        request_id = str(uuid.uuid4())
        
        # Store the state
        agent_states[request_id] = result
        
        # Extract the response
        ai_messages = [msg for msg in result["messages"] if msg["type"] == "ai"]
        response_content = ai_messages[-1]["content"] if ai_messages else "No response generated"
        
        # Return the response
        return ResearchResponse(
            id=request_id,
            result={
                "content": response_content,
                "research_data": result.get("research_data", {})
            },
            status="complete"
        )
    except Exception as e:
        logger.error(f"Error handling research request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class ChatMessage(BaseModel):
    """Chat message model"""
    session_id: str
    message: str
    parameters: Optional[Dict[str, Any]] = None

@app.post("/api/chat", response_model=Dict[str, Any])
async def handle_chat_message(request: ChatMessage):
    """Handle chat messages for ongoing sessions"""
    try:
        # Check if the session exists
        if request.session_id not in agent_states:
            # Create a new session if it doesn't exist
            agent_states[request.session_id] = {
                "messages": [],
                "research_projects": [],
                "establishments": [],
                "insights": [],
                "selected_project_id": None,
                "search_progress": [],
                "research_data": {}
            }
        
        # Get the current state
        state = agent_states[request.session_id]
        
        # Add the user message
        state["messages"].append({
            "type": "human",
            "content": request.message
        })
        
        # Create a new agent instance
        agent = create_agent()
        
        # Invoke the agent
        result = agent.invoke(state)
        
        # Update the state
        agent_states[request.session_id] = result
        
        # Extract the response
        ai_messages = [msg for msg in result["messages"] if msg["type"] == "ai"]
        response_content = ai_messages[-1]["content"] if ai_messages else "No response generated"
        
        # Handle tool calls if present
        if ai_messages and "tool_calls" in ai_messages[-1] and ai_messages[-1]["tool_calls"]:
            tool_call = ai_messages[-1]["tool_calls"][0]
            return {
                "content": response_content,
                "tool_call": {
                    "name": tool_call["name"],
                    "arguments": tool_call["args"]
                }
            }
        
        # Return the response
        return {
            "content": response_content
        }
    except Exception as e:
        logger.error(f"Error handling chat message: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class ToolResult(BaseModel):
    """Tool result model"""
    session_id: str
    name: str
    result: Any

@app.post("/api/tool_result", response_model=Dict[str, Any])
async def handle_tool_result(request: ToolResult):
    """Handle tool execution results"""
    try:
        # Check if the session exists
        if request.session_id not in agent_states:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Get the current state
        state = agent_states[request.session_id]
        
        # Find the last AI message with tool calls
        ai_messages = [msg for msg in state["messages"] if msg["type"] == "ai"]
        if not ai_messages or "tool_calls" not in ai_messages[-1]:
            raise HTTPException(status_code=400, detail="No tool call to respond to")
        
        tool_call = ai_messages[-1]["tool_calls"][0]
        
        # Add the tool message
        state["messages"].append({
            "type": "tool",
            "name": request.name,
            "content": json.dumps(request.result) if not isinstance(request.result, str) else request.result,
            "tool_call_id": tool_call["id"]
        })
        
        # Create a new agent instance
        agent = create_agent()
        
        # Invoke the agent
        result = agent.invoke(state)
        
        # Update the state
        agent_states[request.session_id] = result
        
        # Extract the response
        ai_messages = [msg for msg in result["messages"] if msg["type"] == "ai"]
        response_content = ai_messages[-1]["content"] if ai_messages else "No response generated"
        
        # Handle tool calls if present
        if ai_messages and "tool_calls" in ai_messages[-1] and ai_messages[-1]["tool_calls"]:
            tool_call = ai_messages[-1]["tool_calls"][0]
            return {
                "content": response_content,
                "tool_call": {
                    "name": tool_call["name"],
                    "arguments": tool_call["args"]
                }
            }
        
        # Return the response
        return {
            "content": response_content
        }
    except Exception as e:
        logger.error(f"Error handling tool result: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/research/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for real-time research updates"""
    await websocket.accept()
    
    # Store the connection
    active_connections[session_id] = websocket
    
    try:
        # Initialize agent state if it doesn't exist
        if session_id not in agent_states:
            agent_states[session_id] = {
                "messages": [],
                "research_projects": [],
                "establishments": [],
                "insights": [],
                "selected_project_id": None,
                "search_progress": [],
                "research_data": {}
            }
        
        # Create the agent
        agent = create_agent()
        
        # Main WebSocket loop
        while True:
            # Wait for a message
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Get current state
            state = agent_states[session_id]
            
            # Add user message to state
            state["messages"].append({
                "type": "human",
                "content": message_data["message"]
            })
            
            # Invoke the agent
            result = agent.invoke(state)
            
            # Update the state
            agent_states[session_id] = result
            
            # Extract the AI message
            ai_messages = [msg for msg in result["messages"] if msg["type"] == "ai"]
            response = ai_messages[-1] if ai_messages else {"content": "No response generated"}
            
            # Handle tool calls if present
            if "tool_calls" in response and response["tool_calls"]:
                tool_call = response["tool_calls"][0]
                await websocket.send_json({
                    "content": response["content"],
                    "tool_call": {
                        "name": tool_call["name"],
                        "arguments": tool_call["args"]
                    }
                })
                
                # Wait for tool result
                tool_result_data = await websocket.receive_text()
                tool_result = json.loads(tool_result_data)
                
                # Add tool message
                state["messages"].append({
                    "type": "tool",
                    "name": tool_call["name"],
                    "content": json.dumps(tool_result["result"]) if not isinstance(tool_result["result"], str) else tool_result["result"],
                    "tool_call_id": tool_call["id"]
                })
                
                # Invoke agent again
                result = agent.invoke(state)
                agent_states[session_id] = result
                
                # Extract AI response
                ai_messages = [msg for msg in result["messages"] if msg["type"] == "ai"]
                response = ai_messages[-1] if ai_messages else {"content": "No response generated"}
            
            # Send the response
            await websocket.send_json({
                "content": response["content"],
                "research_data": result.get("research_data", {})
            })
            
    except WebSocketDisconnect:
        # Clean up the connection
        if session_id in active_connections:
            del active_connections[session_id]
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.close(code=1011, reason=str(e))

@app.get("/api/sessions/{session_id}/data", response_model=Dict[str, Any])
async def get_session_data(session_id: str):
    """Get data for a specific session"""
    if session_id not in agent_states:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "research_data": agent_states[session_id].get("research_data", {}),
        "establishments": agent_states[session_id].get("establishments", []),
        "insights": agent_states[session_id].get("insights", [])
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "active_sessions": len(agent_states)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
