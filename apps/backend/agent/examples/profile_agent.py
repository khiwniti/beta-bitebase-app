#!/usr/bin/env python3
"""
Profile Agent - Demonstrates AIQToolkit integration with the agent for profiling and evaluation.

This script shows how to use AIQToolkit to profile and evaluate the agent's performance.
"""

import os
import json
import argparse
import logging
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("profile_agent")

# Import the agent
from bitebase_ai.agent import create_agent
from bitebase_ai.core.aiq_integration import AIQProfiler, AIQEvaluator

def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Profile the agent using AIQToolkit",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument(
        "--location",
        type=str,
        default="Bangkok, Thailand",
        help="Location for market research"
    )
    parser.add_argument(
        "--cuisine",
        type=str,
        default="Thai",
        help="Cuisine type for market research"
    )
    parser.add_argument(
        "--output",
        type=str,
        default="metrics/profile_results.json",
        help="Output file for profiling results"
    )
    return parser.parse_args()

def profile_agent():
    """Profile the agent using AIQToolkit."""
    args = parse_args()
    
    # Check if AIQToolkit is available
    try:
        from aiq.profiler.profile_runner import ProfileRunner
        AIQ_AVAILABLE = True
    except ImportError:
        AIQ_AVAILABLE = False
        logger.warning("AIQToolkit not available. Install with 'pip install aiqtoolkit'")
        return
    
    logger.info("Creating agent with AIQToolkit integration")
    
    # Create agent with AIQToolkit profiling enabled
    config = {
        "use_aiq": True,
        "aiq_profiler": {
            "enabled": True,
            "save_results": True,
            "results_dir": "metrics/aiq"
        },
        "aiq_evaluator": {
            "enabled": True,
            "criteria": ["accuracy", "relevance", "helpfulness"]
        }
    }
    
    # Initialize AIQ Profiler
    profiler = AIQProfiler(
        agent_name="RestaurantResearchAgent",
        config=config.get("aiq_profiler", {})
    )
    
    # Start profiling
    profiler.start_profiling()
    logger.info(f"Started profiling agent with query about {args.cuisine} restaurants in {args.location}")
    
    # Create and invoke the agent
    agent = create_agent(config=config)
    
    # Prepare the initial state
    state = {
        "messages": [
            {
                "type": "human", 
                "content": f"I'm looking to open a {args.cuisine} restaurant in {args.location}. Can you help me analyze the market potential?"
            }
        ],
        "research_projects": [],
        "establishments": [],
        "insights": [],
        "selected_project_id": None,
        "search_progress": [],
        "research_data": {},
        "timestamp": datetime.now().isoformat()
    }
    
    # Invoke the agent
    logger.info("Invoking agent...")
    try:
        result = agent.invoke(state)
        
        # Extract the AI response
        ai_messages = [msg for msg in result.get("messages", []) if msg.get("type") == "ai"]
        response = ai_messages[-1].get("content") if ai_messages else "No response"
        
        logger.info("Agent response received")
        logger.info(f"Response length: {len(response)} characters")
        
        # Initialize AIQ Evaluator
        evaluator = AIQEvaluator(config=config.get("aiq_evaluator", {}))
        
        # Evaluate the response
        query = f"I'm looking to open a {args.cuisine} restaurant in {args.location}. Can you help me analyze the market potential?"
        eval_results = evaluator.evaluate_response(query=query, response=response)
        logger.info(f"Evaluation results: {eval_results}")
        
        # End profiling
        metrics = profiler.end_profiling()
        logger.info(f"Profiling metrics: {metrics}")
        
        # Combine results
        profile_results = {
            "query": query,
            "response_summary": {
                "length": len(response),
                "contains_tool_calls": "tool_calls" in str(ai_messages[-1])
            },
            "evaluation": eval_results,
            "profiling": metrics,
            "timestamp": datetime.now().isoformat()
        }
        
        # Save results
        os.makedirs(os.path.dirname(args.output), exist_ok=True)
        with open(args.output, 'w') as f:
            json.dump(profile_results, f, indent=2)
        logger.info(f"Saved profiling results to {args.output}")
        
    except Exception as e:
        logger.error(f"Error invoking agent: {str(e)}")
        # End profiling
        metrics = profiler.end_profiling()
        logger.info(f"Profiling metrics: {metrics}")

if __name__ == "__main__":
    profile_agent() 