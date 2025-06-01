"""
Bitebase AI - Advanced Restaurant Market Research Agent System

This package provides a comprehensive set of tools and agents for
restaurant market research, data collection, analysis, and visualization.
"""

# Import core components
from .core.agent_framework import BaseAgent, AgentMetrics, AgentConfig
from .core.api_client import APIClient
from .core.data_processor import RestaurantDataCleaner, RestaurantMatcher

# Import agents
from .agents.restaurant_data_agent import RestaurantDataAgent
from .agents.restaurant_analysis_agent import RestaurantAnalysisAgent

# Import legacy components for backward compatibility
from .restaurant_research import create_research_agent
from .legacy import OriginalRestaurantDataAgent, OriginalRestaurantMatcher, OriginalRestaurantDataValidator

__all__ = [
    # Core components
    "BaseAgent",
    "AgentMetrics",
    "AgentConfig",
    "APIClient",
    "RestaurantDataCleaner",
    "RestaurantMatcher",

    # Agents
    "RestaurantDataAgent",
    "RestaurantAnalysisAgent",

    # Legacy components
    "create_research_agent",
    "OriginalRestaurantDataAgent",
    "OriginalRestaurantMatcher",
    "OriginalRestaurantDataValidator"
]