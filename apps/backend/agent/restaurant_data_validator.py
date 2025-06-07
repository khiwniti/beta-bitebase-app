#!/usr/bin/env python3
"""
Restaurant Data Validator CLI - Command-line interface for the restaurant data validator.

This script provides backward compatibility with the original restaurant_data_validator.py
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
from bitebase_ai.agents import RestaurantAnalysisAgent

def parse_args():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="Restaurant Data Validator")
    parser.add_argument("--latitude", type=float, required=True, help="Center point latitude")
    parser.add_argument("--longitude", type=float, required=True, help="Center point longitude")
    parser.add_argument("--radius", type=float, required=True, help="Search radius in kilometers")
    parser.add_argument("--platforms", type=str, help="Comma-separated list of platforms to search")
    parser.add_argument("--mode", type=str, default="comprehensive", 
                        choices=["basic", "market", "competitor", "location", "comprehensive"],
                        help="Analysis mode")
    parser.add_argument("--config", type=str, help="Path to configuration file")
    
    return parser.parse_args()

def main():
    """Run the restaurant data validator."""
    args = parse_args()
    
    # Parse platforms
    platforms = None
    if args.platforms:
        platforms = [p.strip() for p in args.platforms.split(",")]
    
    # Initialize the agent
    agent = RestaurantAnalysisAgent(config_path=args.config)
    
    # Run the agent
    try:
        result = agent.execute(
            latitude=args.latitude,
            longitude=args.longitude,
            radius_km=args.radius,
            platforms=platforms,
            analysis_type=args.mode
        )
        
        # Print the result as JSON
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
