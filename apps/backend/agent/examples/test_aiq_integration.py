#!/usr/bin/env python3
"""
Test AIQToolkit Integration with Real Data

This script tests the AIQToolkit integration with real restaurant data for a specific location.
It runs data collection, analysis, and generates insights with the enhanced AIQToolkit components.
"""

import os
import json
import logging
import time
import argparse
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("test_aiq_integration")

# Load environment variables
load_dotenv()

# Import necessary components
from bitebase_ai.agents.restaurant_data_agent import RestaurantDataAgent
from bitebase_ai.agents.restaurant_analysis_agent import RestaurantAnalysisAgent

# Try to import the LocationIntelligenceAgent which depends on geopy
LOCATION_AGENT_AVAILABLE = False
try:
    from bitebase_ai.agents.location_intelligence_agent import LocationIntelligenceAgent
    LOCATION_AGENT_AVAILABLE = True
except ImportError as e:
    logger.warning(f"LocationIntelligenceAgent not available: {str(e)}")
    logger.warning("Skipping location intelligence tests")

from bitebase_ai.core.aiq_integration import AIQProfiler

# Check if AIQToolkit is available
try:
    import aiq
    AIQ_AVAILABLE = True
    logger.info("AIQToolkit is available")
except ImportError:
    AIQ_AVAILABLE = False
    logger.warning("AIQToolkit is not available. Install with: pip install aiqtoolkit")

def run_restaurant_data_test(latitude, longitude, radius_km, platforms=None):
    """Run the RestaurantDataAgent test with AIQToolkit integration."""
    logger.info(f"Testing RestaurantDataAgent with AIQToolkit at {latitude}, {longitude} with radius {radius_km}km")
    
    # Initialize the agent
    agent = RestaurantDataAgent()
    
    # Check if AIQToolkit is available and integrated
    if hasattr(agent, 'data_quality_analyzer') and agent.data_quality_analyzer:
        logger.info("RestaurantDataAgent has AIQToolkit data quality analyzer")
    else:
        logger.warning("RestaurantDataAgent does not have AIQToolkit data quality analyzer")
        
    # Execute the agent
    start_time = time.time()
    result = agent.execute(
        latitude=latitude,
        longitude=longitude,
        radius_km=radius_km,
        platforms=platforms,
        match=True
    )
    execution_time = time.time() - start_time
    
    # Log results
    platform_results = result.get("platforms", {})
    total_restaurants = sum(len(restaurants) for restaurants in platform_results.values())
    matched_restaurants = len(result.get("matched_restaurants", []))
    
    logger.info(f"Found {total_restaurants} restaurants across {len(platform_results)} platforms")
    logger.info(f"Matched {matched_restaurants} restaurants across platforms")
    logger.info(f"Execution time: {execution_time:.2f} seconds")
    
    # Check for data quality metrics
    metadata = result.get("metadata", {})
    data_quality = metadata.get("data_quality", {})
    if data_quality:
        logger.info(f"Data quality score: {data_quality.get('overall_quality', 'N/A')}")
        logger.info(f"Data quality status: {data_quality.get('quality_status', 'N/A')}")
        logger.info(f"Completeness score: {data_quality.get('completeness_score', 'N/A')}")
    
    return result

def run_restaurant_analysis_test(restaurant_data, latitude, longitude, radius_km):
    """Run the RestaurantAnalysisAgent test with AIQToolkit integration."""
    logger.info(f"Testing RestaurantAnalysisAgent with AIQToolkit")
    
    # Initialize the agent
    agent = RestaurantAnalysisAgent()
    
    # Check if AIQToolkit is available and integrated
    if hasattr(agent, 'inference_optimizer') and agent.inference_optimizer:
        logger.info("RestaurantAnalysisAgent has AIQToolkit inference optimizer")
    else:
        logger.warning("RestaurantAnalysisAgent does not have AIQToolkit inference optimizer")
        
    if hasattr(agent, 'benchmark_runner') and agent.benchmark_runner:
        logger.info("RestaurantAnalysisAgent has AIQToolkit benchmark runner")
    else:
        logger.warning("RestaurantAnalysisAgent does not have AIQToolkit benchmark runner")
    
    # Execute the agent
    start_time = time.time()
    result = agent.execute(
        latitude=latitude,
        longitude=longitude,
        radius_km=radius_km,
        analysis_type="comprehensive",
        restaurant_data=restaurant_data
    )
    execution_time = time.time() - start_time
    
    # Log results
    logger.info(f"Analysis completed in {execution_time:.2f} seconds")
    
    # Check for benchmark metrics
    metadata = result.get("metadata", {})
    benchmark = metadata.get("benchmark", {})
    if benchmark:
        logger.info(f"Benchmark latency: {benchmark.get('latency_ms', 'N/A')} ms")
        logger.info(f"Benchmark throughput: {benchmark.get('throughput', 'N/A')}")
        logger.info(f"Benchmark memory: {benchmark.get('memory_mb', 'N/A')} MB")
    
    # Check for evaluation results
    evaluation = metadata.get("evaluation", {})
    if evaluation:
        logger.info("Evaluation results:")
        for analysis_type, scores in evaluation.items():
            logger.info(f"  {analysis_type}: overall={scores.get('overall', 'N/A')}")
    
    return result

def run_location_intelligence_test(latitude, longitude, radius_km, restaurant_data=None):
    """Run the LocationIntelligenceAgent test with AIQToolkit integration."""
    logger.info(f"Testing LocationIntelligenceAgent with AIQToolkit at {latitude}, {longitude} with radius {radius_km}km")
    
    # Initialize the agent
    agent = LocationIntelligenceAgent()
    
    # Check if AIQToolkit is available and integrated
    if hasattr(agent, 'aiq_profiler') and agent.aiq_profiler:
        logger.info("LocationIntelligenceAgent has AIQToolkit profiler")
    else:
        logger.warning("LocationIntelligenceAgent does not have AIQToolkit profiler")
        
    if hasattr(agent, 'aiq_evaluator') and agent.aiq_evaluator:
        logger.info("LocationIntelligenceAgent has AIQToolkit evaluator")
    else:
        logger.warning("LocationIntelligenceAgent does not have AIQToolkit evaluator")
    
    # Execute the agent
    start_time = time.time()
    result = agent.execute(
        latitude=latitude,
        longitude=longitude,
        radius_km=radius_km,
        analysis_type="comprehensive",
        restaurant_data=restaurant_data
    )
    execution_time = time.time() - start_time
    
    # Log results
    logger.info(f"Location intelligence analysis completed in {execution_time:.2f} seconds")
    
    # Check for AIQ metrics
    metadata = result.get("metadata", {})
    aiq_metrics = metadata.get("aiq_metrics", {})
    if aiq_metrics:
        logger.info(f"AIQ execution time: {aiq_metrics.get('execution_time', 'N/A')} seconds")
        logger.info(f"AIQ calls count: {aiq_metrics.get('calls_count', 'N/A')}")
    
    # Check for evaluation results
    evaluation = result.get("evaluation", {})
    if evaluation:
        logger.info("Evaluation results:")
        for criterion, score in evaluation.items():
            logger.info(f"  {criterion}: {score}")
    
    return result

def save_test_results(results, output_dir="test_results"):
    """Save test results to files."""
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save each result
    for name, result in results.items():
        filename = f"{name}_{timestamp}.json"
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w') as f:
            json.dump(result, f, indent=2)
            
        logger.info(f"Saved {name} results to {filepath}")

def parse_args():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="Test AIQToolkit integration with real data")
    
    parser.add_argument(
        "--latitude",
        type=float,
        default=13.7466,
        help="Latitude for the test location"
    )
    
    parser.add_argument(
        "--longitude",
        type=float,
        default=100.5393,
        help="Longitude for the test location"
    )
    
    parser.add_argument(
        "--radius",
        type=float,
        default=1.0,
        help="Search radius in kilometers"
    )
    
    parser.add_argument(
        "--platforms",
        nargs="+",
        default=["google_maps"],
        help="Platforms to search for restaurant data"
    )
    
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Increase output verbosity"
    )
    
    return parser.parse_args()

def main():
    """Run all tests."""
    # Parse command-line arguments
    args = parse_args()
    
    # Set up logging level
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Define test location
    latitude = args.latitude
    longitude = args.longitude
    radius_km = args.radius
    
    # Define platforms to search
    platforms = args.platforms
    
    # Run all tests in sequence
    try:
        # Step 1: Run restaurant data test
        logger.info("=== STARTING RESTAURANT DATA TEST ===")
        restaurant_data = run_restaurant_data_test(latitude, longitude, radius_km, platforms)
        logger.info("=== COMPLETED RESTAURANT DATA TEST ===\n")
        
        # Step 2: Run restaurant analysis test
        logger.info("=== STARTING RESTAURANT ANALYSIS TEST ===")
        analysis_results = run_restaurant_analysis_test(restaurant_data, latitude, longitude, radius_km)
        logger.info("=== COMPLETED RESTAURANT ANALYSIS TEST ===\n")
        
        # Step 3: Run location intelligence test (if available)
        location_results = {}
        if LOCATION_AGENT_AVAILABLE:
            logger.info("=== STARTING LOCATION INTELLIGENCE TEST ===")
            location_results = run_location_intelligence_test(latitude, longitude, radius_km, restaurant_data)
            logger.info("=== COMPLETED LOCATION INTELLIGENCE TEST ===\n")
        else:
            logger.warning("=== SKIPPING LOCATION INTELLIGENCE TEST - DEPENDENCY MISSING ===\n")
        
        # Save all results
        results_to_save = {
            "restaurant_data": restaurant_data,
            "analysis_results": analysis_results
        }
        
        # Only include location results if the test ran
        if location_results:
            results_to_save["location_results"] = location_results
            
        save_test_results(results_to_save)
        
        logger.info("All tests completed successfully!")
        return True
        
    except Exception as e:
        logger.error(f"Error running tests: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return False

if __name__ == "__main__":
    main() 