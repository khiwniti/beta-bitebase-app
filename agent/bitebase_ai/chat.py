"""
Chat handling for restaurant market research agent.
"""

import json
import logging
from typing import cast, Optional, Dict, Any
from langchain_core.messages import SystemMessage, AIMessage, ToolMessage
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool
from .state import AgentState
from .restaurant_research import analyze_market, analyze_demographics, analyze_competitors
from .restaurant_research import analyze_nearby_restaurants, analyze_location, calculate_foot_traffic, analyze_area

# Load the OpenAI API key from environment variables
import os
from dotenv import load_dotenv
from .core.llm_client import LLMClient

# Import AIQToolkit evaluation if available
try:
    from aiq.eval.evaluator import Evaluator
    AIQ_AVAILABLE = True
except ImportError:
    AIQ_AVAILABLE = False

load_dotenv()

# Set up logging
logger = logging.getLogger("chat_node")

# Initialize the LLM
llm = ChatOpenAI(model="gpt-3.5-turbo")

# Initialize the AIQ Evaluator if available
aiq_evaluator = None
if AIQ_AVAILABLE:
    try:
        aiq_evaluator = Evaluator()
        logger.info("AIQToolkit evaluation enabled for chat node")
    except Exception as e:
        logger.warning(f"Failed to initialize AIQToolkit evaluator: {str(e)}")

# Define tools available to chat node
tools = [
    analyze_market, 
    analyze_demographics, 
    analyze_competitors, 
    analyze_nearby_restaurants, 
    analyze_location, 
    calculate_foot_traffic, 
    analyze_area
]

async def chat_node(state: AgentState, config: RunnableConfig):
    """Handle chat operations for restaurant market research"""
    llm_with_tools = llm.bind_tools(tools, parallel_tool_calls=False)

    # Get research data for system message
    research_data = state.get("research_data", {})
    research_projects = state.get("research_projects", [])
    selected_project_id = state.get("selected_project_id", None)
    
    # Find the selected project
    selected_project = None
    if selected_project_id:
        for project in research_projects:
            if project.get("id") == selected_project_id:
                selected_project = project
                break

    # Create system message
    system_message = f"""
    You are an expert restaurant market research agent. Your goal is to help users analyze markets, 
    locations, and competitors for restaurant businesses. You can provide insights on:
    
    1. Market analysis - demographics, trends, opportunities
    2. Competitor analysis - identify and analyze nearby restaurants
    3. Location analysis - foot traffic, accessibility, suitability
    
    Use the available tools to gather and analyze data about specific locations and cuisine types.
    Ask clarifying questions if the user doesn't provide enough information.
    Be professional, insightful, and provide actionable recommendations.
    
    Current research data: {json.dumps(research_data) if research_data else "No research data yet"}
    
    {f"Current project: {json.dumps(selected_project)}" if selected_project else "No project selected"}
    """

    # Extract the user's query if available
    user_query = None
    for message in state.get("messages", []):
        if message.get("type") == "human":
            user_query = message.get("content")
            break

    # Call LLM with tools
    response = await llm_with_tools.ainvoke(
        [
            SystemMessage(content=system_message),
            *state["messages"]
        ],
        config=config,
    )

    ai_message = cast(AIMessage, response)
    
    # Evaluate response with AIQToolkit if available
    if AIQ_AVAILABLE and aiq_evaluator and user_query:
        try:
            response_text = ai_message.content
            
            # Evaluate the response
            criteria = ["accuracy", "relevance", "helpfulness"]
            evaluation_results = {}
            
            for criterion in criteria:
                try:
                    score = aiq_evaluator.evaluate(
                        criterion=criterion,
                        query=user_query,
                        response=response_text
                    )
                    evaluation_results[criterion] = score
                except Exception as e:
                    logger.warning(f"Error evaluating {criterion}: {str(e)}")
                    evaluation_results[criterion] = 0.0
            
            # Calculate overall score
            if evaluation_results:
                evaluation_results["overall"] = sum(evaluation_results.values()) / len(criteria)
            
            # Add evaluation results to research data
            if "evaluation" not in research_data:
                research_data["evaluation"] = []
                
            research_data["evaluation"].append({
                "query": user_query,
                "response": response_text,
                "scores": evaluation_results,
                "timestamp": state.get("timestamp", "")
            })
            
            logger.info(f"Response evaluation: {evaluation_results}")
        except Exception as e:
            logger.error(f"Error evaluating response: {str(e)}")

    # Return updated state
    return {
        "messages": [response],
        "research_data": research_data
    }
