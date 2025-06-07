#!/usr/bin/env python3
"""
Restaurant Data Agent CLI - Command-line interface for the restaurant data agent.

This script provides backward compatibility with the original restaurant_data_agent.py
by wrapping the new agent architecture.
"""

import os
import sys
import json
import argparse
from typing import Dict, List, Any, Optional

# Add the parent directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the new agent
from bitebase_ai.agents import RestaurantDataAgent

def parse_args():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="Restaurant Data Agent")
    parser.add_argument("--latitude", type=float, required=True, help="Center point latitude")
    parser.add_argument("--longitude", type=float, required=True, help="Center point longitude")
    parser.add_argument("--radius", type=float, required=True, help="Search radius in kilometers")
    parser.add_argument("--platforms", type=str, help="Comma-separated list of platforms to search")
    parser.add_argument("--match", action="store_true", help="Match restaurants across platforms")
    parser.add_argument("--config", type=str, help="Path to configuration file")
    
    return parser.parse_args()

def main():
    """Run the restaurant data agent."""
    args = parse_args()
    
    # Parse platforms
    platforms = None
    if args.platforms:
        platforms = [p.strip() for p in args.platforms.split(",")]
    
    # Initialize the agent
    agent = RestaurantDataAgent(config_path=args.config)
    
    # Run the agent
    try:
        result = agent.execute(
            latitude=args.latitude,
            longitude=args.longitude,
            radius_km=args.radius,
            platforms=platforms,
            match=args.match
        )
        
        # Print the result as JSON
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
