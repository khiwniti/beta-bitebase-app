#!/usr/bin/env python3
"""
AIQToolkit Restaurant Analysis Example

This script demonstrates how to use AIQToolkit with real restaurant data.
It fetches restaurant data, runs analysis with AIQToolkit profiling, and displays the results.
"""

import os
import json
import logging
import argparse
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("aiq_analyze_restaurants")

# Import necessary components
from bitebase_ai.agents.restaurant_data_agent import RestaurantDataAgent
from bitebase_ai.agents.restaurant_analysis_agent import RestaurantAnalysisAgent

# Check if AIQToolkit is available
try:
    from aiq.profiler.profile_runner import ProfileRunner
    from aiq.eval.evaluator import Evaluator
    from aiq.benchmarking.benchmark_runner import BenchmarkRunner
    AIQ_AVAILABLE = True
    logger.info("AIQToolkit is available")
except ImportError:
    AIQ_AVAILABLE = False
    logger.warning("AIQToolkit not available. Install with: pip install aiqtoolkit")

def parse_args():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="AIQToolkit Restaurant Analysis Example")
    
    parser.add_argument(
        "--latitude",
        type=float,
        default=13.7466,  # Bangkok, Thailand (Central World)
        help="Latitude for the search location"
    )
    
    parser.add_argument(
        "--longitude",
        type=float,
        default=100.5393,  # Bangkok, Thailand (Central World)
        help="Longitude for the search location"
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
        "--analysis-type",
        choices=["basic", "market", "competitor", "location", "comprehensive"],
        default="comprehensive",
        help="Type of analysis to perform"
    )
    
    parser.add_argument(
        "--output",
        type=str,
        default="restaurant_analysis_results.json",
        help="Output file to save results"
    )
    
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Increase output verbosity"
    )
    
    return parser.parse_args()

def setup_aiq_profiling():
    """Set up AIQToolkit profiling if available."""
    if not AIQ_AVAILABLE:
        return None
        
    try:
        # Create a profile runner
        profile_runner = ProfileRunner(
            name="RestaurantAnalysis",
            config={
                "output_dir": "metrics/aiq/examples",
                "save_results": True,
                "track_memory": True,
                "track_latency": True
            }
        )
        
        # Create a benchmark runner
        benchmark_runner = BenchmarkRunner(
            name="RestaurantAnalysisBenchmark",
            config={
                "track_metrics": ["latency", "throughput", "memory"],
                "compare_with_baseline": True
            }
        )
        
        return {
            "profile_runner": profile_runner,
            "benchmark_runner": benchmark_runner
        }
    except Exception as e:
        logger.error(f"Error setting up AIQToolkit profiling: {str(e)}")
        return None

def setup_aiq_evaluation():
    """Set up AIQToolkit evaluation if available."""
    if not AIQ_AVAILABLE:
        return None
        
    try:
        # Create an evaluator
        evaluator = Evaluator(
            config={
                "criteria": ["accuracy", "relevance", "helpfulness"],
                "output_dir": "metrics/aiq/examples/eval"
            }
        )
        
        return evaluator
    except Exception as e:
        logger.error(f"Error setting up AIQToolkit evaluation: {str(e)}")
        return None

def main():
    """Run the example."""
    # Parse command-line arguments
    args = parse_args()
    
    # Set up logging level
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    logger.info("Starting AIQToolkit Restaurant Analysis Example")
    
    # Set up AIQToolkit components
    aiq_profiling = setup_aiq_profiling()
    aiq_evaluation = setup_aiq_evaluation()
    
    # Start benchmark if available
    if aiq_profiling and aiq_profiling.get("benchmark_runner"):
        benchmark_runner = aiq_profiling["benchmark_runner"]
        benchmark_runner.start_benchmark()
        logger.info("Started AIQToolkit benchmark")
    
    # Step 1: Fetch restaurant data
    logger.info(f"Fetching restaurant data at {args.latitude}, {args.longitude} with radius {args.radius}km")
    
    # Start profiling if available
    if aiq_profiling and aiq_profiling.get("profile_runner"):
        profile_runner = aiq_profiling["profile_runner"]
        profile_runner.start_profiling("fetch_data")
    
    data_agent = RestaurantDataAgent()
    restaurant_data = data_agent.execute(
        latitude=args.latitude,
        longitude=args.longitude,
        radius_km=args.radius,
        platforms=args.platforms,
        match=True
    )
    
    # End profiling if available
    if aiq_profiling and aiq_profiling.get("profile_runner"):
        profile_metrics = profile_runner.end_profiling()
        logger.info(f"Data fetch profiling metrics: {profile_metrics}")
    
    # Log data results
    platform_results = restaurant_data.get("platforms", {})
    total_restaurants = sum(len(restaurants) for restaurants in platform_results.values())
    matched_restaurants = len(restaurant_data.get("matched_restaurants", []))
    
    logger.info(f"Found {total_restaurants} restaurants across {len(platform_results)} platforms")
    logger.info(f"Matched {matched_restaurants} restaurants across platforms")
    
    # Step 2: Analyze restaurant data
    logger.info(f"Analyzing restaurant data with analysis type: {args.analysis_type}")
    
    # Start profiling if available
    if aiq_profiling and aiq_profiling.get("profile_runner"):
        profile_runner.start_profiling("analyze_data")
    
    analysis_agent = RestaurantAnalysisAgent()
    analysis_results = analysis_agent.execute(
        latitude=args.latitude,
        longitude=args.longitude,
        radius_km=args.radius,
        analysis_type=args.analysis_type,
        restaurant_data=restaurant_data
    )
    
    # End profiling if available
    if aiq_profiling and aiq_profiling.get("profile_runner"):
        profile_metrics = profile_runner.end_profiling()
        logger.info(f"Analysis profiling metrics: {profile_metrics}")
    
    # Step 3: Evaluate results if evaluator is available
    if aiq_evaluation:
        logger.info("Evaluating analysis results")
        
        # Convert analysis results to string representation for evaluation
        results_str = json.dumps(analysis_results, indent=2)
        
        # Create evaluation query
        query = f"Analyze restaurants at {args.latitude}, {args.longitude} with {args.radius}km radius for {args.analysis_type} analysis"
        
        # Evaluate results
        evaluation_results = aiq_evaluation.evaluate_response(
            query=query,
            response=results_str
        )
        
        logger.info(f"Evaluation results: {evaluation_results}")
        
        # Add evaluation results to analysis results
        analysis_results["evaluation"] = evaluation_results
    
    # Step 4: End benchmark if available
    if aiq_profiling and aiq_profiling.get("benchmark_runner"):
        benchmark_results = benchmark_runner.end_benchmark()
        logger.info(f"Benchmark results: {benchmark_results}")
        
        # Add benchmark results to analysis results
        analysis_results["benchmark"] = benchmark_results
    
    # Step 5: Save results to file
    results = {
        "metadata": {
            "timestamp": datetime.now().isoformat(),
            "location": {
                "latitude": args.latitude,
                "longitude": args.longitude,
                "radius_km": args.radius
            },
            "platforms": args.platforms,
            "analysis_type": args.analysis_type,
            "aiq_available": AIQ_AVAILABLE
        },
        "restaurant_data": restaurant_data,
        "analysis_results": analysis_results
    }
    
    # Save to file
    with open(args.output, 'w') as f:
        json.dump(results, f, indent=2)
    
    logger.info(f"Results saved to {args.output}")
    
    # Print summary
    print("\n=== RESTAURANT ANALYSIS SUMMARY ===")
    print(f"Location: {args.latitude}, {args.longitude} with radius {args.radius}km")
    print(f"Platforms: {', '.join(args.platforms)}")
    print(f"Total restaurants: {total_restaurants}")
    
    if "basic_analysis" in analysis_results:
        basic = analysis_results["basic_analysis"]
        print("\nBasic Analysis:")
        print(f"  Average rating: {basic.get('average_rating')}")
        
        # Print top 3 cuisines
        top_cuisines = basic.get("top_cuisines", {})
        if top_cuisines:
            print("  Top cuisines:")
            for cuisine, count in list(top_cuisines.items())[:3]:
                print(f"    - {cuisine}: {count}")
    
    if "market_analysis" in analysis_results:
        market = analysis_results["market_analysis"]
        print("\nMarket Analysis:")
        print(f"  Market saturation: {market.get('market_saturation')} restaurants per sq km")
    
    if "competitor_analysis" in analysis_results:
        competitor = analysis_results["competitor_analysis"]
        print("\nCompetitor Analysis:")
        top_rated = competitor.get("top_rated_restaurants", [])
        if top_rated:
            print("  Top rated restaurant:")
            restaurant = top_rated[0]
            print(f"    - {restaurant.get('name')} ({restaurant.get('rating')}★, {restaurant.get('reviews_count')} reviews)")
    
    if "evaluation" in analysis_results:
        print("\nAIQ Evaluation:")
        for criterion, score in analysis_results["evaluation"].items():
            print(f"  {criterion}: {score}")
    
    if "benchmark" in analysis_results:
        print("\nAIQ Benchmark:")
        benchmark = analysis_results["benchmark"]
        print(f"  Latency: {benchmark.get('latency_ms')} ms")
        print(f"  Throughput: {benchmark.get('throughput')}")
        print(f"  Memory: {benchmark.get('memory_mb')} MB")
    
    print("\nFull results saved to:", args.output)

if __name__ == "__main__":
    main() 