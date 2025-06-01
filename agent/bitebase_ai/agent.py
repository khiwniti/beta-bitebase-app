"""
This is the main entry point for the AI.
It defines the workflow graph and the entry point for the agent.
"""
# pylint: disable=line-too-long, unused-import
from typing import cast, Optional, Dict, Any
from langchain_core.messages import ToolMessage, AIMessage
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

# Import AIQToolkit integration if available
try:
    from aiq.profiler.callbacks.langchain_callback_handler import LangchainCallbackHandler
    AIQ_AVAILABLE = True
except ImportError:
    AIQ_AVAILABLE = False

from .state import AgentState
from .chat import chat_node
from .search import search_node
from .restaurant_research import market_analysis_node, competitor_analysis_node, location_analysis_node

# Route is responsible for determining the next node based on the last message
def route(state: AgentState):
    """Route after the chat node."""
    messages = state.get("messages", [])
    if not messages:
        return END
    
    last_message = messages[-1]
    
    # Handle AI messages with tool calls
    if isinstance(last_message, AIMessage):
        ai_message = cast(AIMessage, last_message)
        
        # If the last AI message has tool calls, determine which node to route to
        if ai_message.tool_calls:
            tool_name = ai_message.tool_calls[0]["name"]
            
            # Market analysis tools
            if tool_name in ["analyze_market", "analyze_demographics"]:
                return "market_analysis_node"
                
            # Competitor analysis tools
            elif tool_name in ["analyze_competitors", "analyze_nearby_restaurants"]:
                return "competitor_analysis_node"
                
            # Location analysis tools
            elif tool_name in ["analyze_location", "calculate_foot_traffic", "analyze_area"]:
                return "location_analysis_node"
                
            # Search tools
            elif tool_name in ["search_for_places", "get_place_details"]:
                return "search_node"
                
            # Default back to chat node for unknown tools
            return "chat_node"
    
    # Handle tool messages by returning to chat node for processing
    if isinstance(last_message, ToolMessage):
        return "chat_node"
    
    return END

def create_agent(memory_saver=None, config: Optional[Dict[str, Any]] = None):
    """
    Create the agent state graph.
    
    Args:
        memory_saver: Memory saver for the agent (optional)
        config: Configuration for the agent (optional)
        
    Returns:
        The compiled agent graph
    """
    # Use the provided memory saver or create a new one
    memory = memory_saver or MemorySaver()
    
    # Default configuration
    config = config or {}
    
    # Setup AIQToolkit profiling if available
    callbacks = []
    if AIQ_AVAILABLE and config.get("use_aiq", True):
        try:
            callbacks.append(LangchainCallbackHandler())
        except Exception as e:
            import logging
            logging.warning(f"Failed to initialize AIQToolkit callback: {str(e)}")
    
    # Create workflow graph
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("chat_node", chat_node)
    workflow.add_node("search_node", search_node)
    workflow.add_node("market_analysis_node", market_analysis_node)
    workflow.add_node("competitor_analysis_node", competitor_analysis_node)
    workflow.add_node("location_analysis_node", location_analysis_node)

    # Define the edges of the graph
    workflow.add_edge(START, "chat_node")
    workflow.add_edge("chat_node", route)
    workflow.add_edge("market_analysis_node", route)
    workflow.add_edge("competitor_analysis_node", route)
    workflow.add_edge("location_analysis_node", route)
    workflow.add_edge("search_node", route)
    
    # Compile the graph with callbacks for AIQ profiling
    graph = workflow.compile(checkpointer=memory, callbacks=callbacks)
    
    return graph
