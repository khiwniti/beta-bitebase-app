"""
Legacy module for backward compatibility with older code.

This module re-exports the old API to maintain compatibility with existing code.
"""

import sys
import os
import importlib.util
from pathlib import Path

# Get the path to the original files
agent_dir = Path(__file__).parent.parent.parent

# Add the agent directory to the Python path
if str(agent_dir) not in sys.path:
    sys.path.insert(0, str(agent_dir))

# Import the original modules
from ..restaurant_research import create_research_agent
from ..agents.restaurant_data_agent import RestaurantDataAgent as OriginalRestaurantDataAgent

# Define empty classes for backward compatibility
class OriginalRestaurantMatcher:
    """Placeholder for backward compatibility."""
    def __init__(self, *args, **kwargs):
        pass

class OriginalRestaurantDataValidator:
    """Placeholder for backward compatibility."""
    def __init__(self, *args, **kwargs):
        pass

# Re-export the original API
__all__ = [
    "create_research_agent",
    "OriginalRestaurantDataAgent",
    "OriginalRestaurantMatcher",
    "OriginalRestaurantDataValidator"
]
