"""
CopilotKit integration for the restaurant market research agent.
"""

import os
import json
from .agent import create_agent
from .state import AgentState

def copilotkit_handler(messages):
    """
    This is the handler for the CopilotKit integration.
    It handles the CopilotKit message format and returns the response.
    
    Args:
        messages: CopilotKit messages
        
    Returns:
        The agent's response
    """
    # Initialize state
    state = {
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
    
    # Convert CopilotKit messages to the format expected by the agent
    for message in messages:
        role = message["role"]
        
        if role == "system":
            # Currently don't do anything with system messages
            pass
        elif role == "user":
            # Add user message
            state["messages"].append({
                "type": "human", 
                "content": message["content"]
            })
        elif role == "assistant":
            # Add assistant message
            state["messages"].append({
                "type": "ai", 
                "content": message["content"]
            })
        elif role == "function":
            # Add function message as a tool message
            state["messages"].append({
                "type": "tool",
                "name": message["name"],
                "content": message["content"],
                # It's not possible to know the tool_call_id, so this is a placeholder
                "tool_call_id": "function-call-id"
            })
    
    # Call the agent
    result = agent.invoke(state)
    
    # Get the most recent AI message
    recent_ai_messages = [msg for msg in result["messages"] if msg["type"] == "ai"]
    
    if not recent_ai_messages:
        return {"role": "assistant", "content": "I don't have a response."}
    
    recent_message = recent_ai_messages[-1]
    
    # Check if the message has tool calls and convert to CopilotKit format
    if "tool_calls" in recent_message and recent_message["tool_calls"]:
        tool_call = recent_message["tool_calls"][0]
        
        # Return as function call
        return {
            "role": "assistant",
            "content": recent_message["content"],
            "function_call": {
                "name": tool_call["name"],
                "arguments": json.dumps(tool_call["args"])
            }
        }
    
    # Return as normal message
    return {
        "role": "assistant", 
        "content": recent_message["content"]
    }