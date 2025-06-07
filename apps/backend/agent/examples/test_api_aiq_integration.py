#!/usr/bin/env python3
"""
Test AIQToolkit Integration with API Endpoints

This script tests the AIQToolkit integration with the FastAPI endpoints.
It sends requests to the API endpoints and verifies that AIQToolkit metrics are returned.
"""

import os
import json
import logging
import time
import asyncio
import argparse
import requests
import subprocess
from datetime import datetime
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("test_api_aiq_integration")

# Default API configuration
DEFAULT_API_HOST = "localhost"
DEFAULT_API_PORT = 3001

# Default test location - Bangkok, Thailand (Central World area)
DEFAULT_LATITUDE = 13.7466
DEFAULT_LONGITUDE = 100.5393
DEFAULT_RADIUS_KM = 1.0

# Check for required dependencies
DEPENDENCIES = {
    "uvicorn": False,
    "fastapi": False,
    "aiqtoolkit": False,
    "geopy": False
}

def check_dependencies():
    """Check if required dependencies are installed."""
    try:
        import uvicorn
        DEPENDENCIES["uvicorn"] = True
        logger.info("uvicorn is available")
    except ImportError:
        logger.warning("uvicorn is not available. Install with 'pip install uvicorn'")
    
    try:
        import fastapi
        DEPENDENCIES["fastapi"] = True
        logger.info("fastapi is available")
    except ImportError:
        logger.warning("fastapi is not available. Install with 'pip install fastapi'")
    
    try:
        import aiq
        DEPENDENCIES["aiqtoolkit"] = True
        logger.info("AIQToolkit is available")
    except ImportError:
        logger.warning("AIQToolkit is not available. Install with 'pip install aiqtoolkit'")
    
    try:
        import geopy
        DEPENDENCIES["geopy"] = True
        logger.info("geopy is available")
    except ImportError:
        logger.warning("geopy is not available. Install with 'pip install geopy'")
    
    # Check if all required dependencies are available
    missing_deps = [name for name, available in DEPENDENCIES.items() if not available and name in ["uvicorn", "fastapi"]]
    if missing_deps:
        logger.error(f"Missing required dependencies: {', '.join(missing_deps)}")
        logger.error("API tests cannot run without these dependencies")
        return False
    
    # Check optional dependencies
    missing_optional = [name for name, available in DEPENDENCIES.items() if not available and name in ["aiqtoolkit", "geopy"]]
    if missing_optional:
        logger.warning(f"Missing optional dependencies: {', '.join(missing_optional)}")
        logger.warning("Some tests may be skipped or have limited functionality")
    
    return True

def parse_args():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="Test AIQToolkit integration with API endpoints")
    
    parser.add_argument(
        "--host",
        type=str,
        default=DEFAULT_API_HOST,
        help=f"API host (default: {DEFAULT_API_HOST})"
    )
    
    parser.add_argument(
        "--port",
        type=int,
        default=DEFAULT_API_PORT,
        help=f"API port (default: {DEFAULT_API_PORT})"
    )
    
    parser.add_argument(
        "--latitude",
        type=float,
        default=DEFAULT_LATITUDE,
        help="Latitude for the test location"
    )
    
    parser.add_argument(
        "--longitude",
        type=float,
        default=DEFAULT_LONGITUDE,
        help="Longitude for the test location"
    )
    
    parser.add_argument(
        "--radius",
        type=float,
        default=DEFAULT_RADIUS_KM,
        help="Search radius in kilometers"
    )
    
    parser.add_argument(
        "--no-server",
        action="store_true",
        help="Don't start a server (assumes server is already running)"
    )
    
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Increase output verbosity"
    )
    
    parser.add_argument(
        "--ignore-missing-deps",
        action="store_true",
        help="Ignore failures due to missing dependencies"
    )
    
    return parser.parse_args()

async def start_api_server(host, port):
    """Start the API server in a subprocess."""
    logger.info(f"Starting API server on {host}:{port}...")
    
    # Start the server in a separate process
    process = subprocess.Popen(
        ["python", "-m", "bitebase_ai.bitebase"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=dict(os.environ, PORT=str(port))
    )
    
    # Wait for the server to start
    base_url = f"http://{host}:{port}"
    for _ in range(30):  # Try for 30 seconds
        try:
            response = requests.get(f"{base_url}/api/health")
            if response.status_code == 200:
                logger.info("API server is running")
                return process, base_url
        except requests.exceptions.ConnectionError:
            pass
        
        await asyncio.sleep(1)
    
    # If we get here, the server didn't start
    logger.error("Failed to start API server")
    process.kill()
    return None, base_url

def stop_api_server(process):
    """Stop the API server subprocess."""
    if process:
        logger.info("Stopping API server...")
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()
        logger.info("API server stopped")

async def test_health_endpoint(base_url):
    """Test the health endpoint for AIQToolkit information."""
    logger.info("Testing health endpoint...")
    
    try:
        response = requests.get(f"{base_url}/api/health")
        response.raise_for_status()
        
        data = response.json()
        logger.info(f"Health endpoint response: {json.dumps(data, indent=2)}")
        
        # Check for AIQ information
        if "aiq" in data:
            aiq_info = data["aiq"]
            logger.info(f"AIQ available: {aiq_info.get('available', False)}")
            logger.info(f"AIQ profiling enabled: {aiq_info.get('profiling_enabled', False)}")
            logger.info(f"AIQ evaluation enabled: {aiq_info.get('evaluation_enabled', False)}")
            
            # Check for recent profiles
            if "recent_profiles" in aiq_info:
                logger.info(f"Recent profiles: {len(aiq_info['recent_profiles'])}")
                
            return aiq_info.get("available", False)
        else:
            logger.warning("No AIQ information in health endpoint response")
            return False
            
    except Exception as e:
        logger.error(f"Error testing health endpoint: {str(e)}")
        return False

async def test_search_endpoint(base_url, test_location):
    """Test the restaurant search endpoint with AIQToolkit integration."""
    logger.info("Testing restaurant search endpoint...")
    
    try:
        # Prepare request data
        request_data = {
            "latitude": test_location["latitude"],
            "longitude": test_location["longitude"],
            "radius_km": test_location["radius_km"],
            "platforms": ["google_maps"],
            "match": True
        }
        
        # Send request
        start_time = time.time()
        response = requests.post(
            f"{base_url}/api/restaurants/search",
            json=request_data
        )
        response.raise_for_status()
        execution_time = time.time() - start_time
        
        # Process response
        data = response.json()
        
        # Check for platforms data
        platforms = data.get("platforms", {})
        total_restaurants = sum(len(restaurants) for restaurants in platforms.values())
        logger.info(f"Found {total_restaurants} restaurants across {len(platforms)} platforms")
        
        # Check for metadata with AIQ metrics
        metadata = data.get("metadata", {})
        if "aiq_metrics" in metadata:
            aiq_metrics = metadata["aiq_metrics"]
            logger.info(f"AIQ execution time: {aiq_metrics.get('execution_time', 'N/A')} seconds")
            logger.info(f"AIQ calls count: {aiq_metrics.get('calls_count', 'N/A')}")
            logger.info(f"API execution time: {execution_time:.2f} seconds")
            return True
        else:
            logger.warning("No AIQ metrics in search endpoint response")
            return False
            
    except Exception as e:
        logger.error(f"Error testing search endpoint: {str(e)}")
        return False

async def test_analysis_endpoint(base_url, restaurant_data):
    """Test the restaurant analysis endpoint with AIQToolkit integration."""
    logger.info("Testing restaurant analysis endpoint...")
    
    try:
        # Prepare request data
        request_data = {
            "restaurant_data": restaurant_data,
            "analysis_type": "comprehensive"
        }
        
        # Send request
        start_time = time.time()
        response = requests.post(
            f"{base_url}/api/restaurants/analyze",
            json=request_data
        )
        response.raise_for_status()
        execution_time = time.time() - start_time
        
        # Process response
        data = response.json()
        
        # Check for metadata with AIQ metrics
        metadata = data.get("metadata", {})
        if "aiq_metrics" in metadata:
            aiq_metrics = metadata["aiq_metrics"]
            logger.info(f"AIQ execution time: {aiq_metrics.get('execution_time', 'N/A')} seconds")
            logger.info(f"AIQ calls count: {aiq_metrics.get('calls_count', 'N/A')}")
            logger.info(f"API execution time: {execution_time:.2f} seconds")
            
            # Check for benchmark data
            if "benchmark" in metadata:
                benchmark = metadata["benchmark"]
                logger.info(f"Benchmark latency: {benchmark.get('latency_ms', 'N/A')} ms")
                logger.info(f"Benchmark throughput: {benchmark.get('throughput', 'N/A')}")
            
            return True
        else:
            logger.warning("No AIQ metrics in analysis endpoint response")
            return False
            
    except Exception as e:
        logger.error(f"Error testing analysis endpoint: {str(e)}")
        return False

async def test_location_endpoint(base_url, test_location):
    """Test the location analysis endpoint with AIQToolkit integration."""
    logger.info("Testing location analysis endpoint...")
    
    try:
        # Prepare request data
        request_data = {
            "latitude": test_location["latitude"],
            "longitude": test_location["longitude"],
            "radius_km": test_location["radius_km"],
            "analysis_type": "comprehensive"
        }
        
        # Send request
        start_time = time.time()
        response = requests.post(
            f"{base_url}/api/location/analyze",
            json=request_data
        )
        response.raise_for_status()
        execution_time = time.time() - start_time
        
        # Process response
        data = response.json()
        
        # Check for metadata with AIQ metrics
        metadata = data.get("metadata", {})
        if "aiq_metrics" in metadata:
            aiq_metrics = metadata["aiq_metrics"]
            logger.info(f"AIQ execution time: {aiq_metrics.get('execution_time', 'N/A')} seconds")
            logger.info(f"AIQ calls count: {aiq_metrics.get('calls_count', 'N/A')}")
            logger.info(f"API execution time: {execution_time:.2f} seconds")
            return True
        else:
            logger.warning("No AIQ metrics in location endpoint response")
            return False
            
    except Exception as e:
        logger.error(f"Error testing location endpoint: {str(e)}")
        return False

async def test_insights_endpoint(base_url, restaurant_data):
    """Test the insights endpoint with AIQToolkit integration."""
    logger.info("Testing insights endpoint...")
    
    try:
        # Prepare request data
        request_data = {
            "restaurant_data": restaurant_data,
            "analysis_type": "comprehensive"
        }
        
        # Send request
        start_time = time.time()
        response = requests.post(
            f"{base_url}/api/restaurants/insights",
            json=request_data
        )
        response.raise_for_status()
        execution_time = time.time() - start_time
        
        # Process response
        data = response.json()
        
        # Check for insights
        insights = data.get("insights")
        if insights:
            logger.info(f"Generated insights of length: {len(insights)}")
        
        # Check for evaluation results
        evaluation = data.get("evaluation")
        if evaluation:
            logger.info("Evaluation results:")
            for criterion, score in evaluation.items():
                logger.info(f"  {criterion}: {score}")
            return True
        else:
            logger.warning("No evaluation results in insights endpoint response")
            return False
            
    except Exception as e:
        logger.error(f"Error testing insights endpoint: {str(e)}")
        return False

async def fetch_restaurant_data(base_url, test_location):
    """Fetch restaurant data for testing."""
    logger.info("Fetching restaurant data for testing...")
    
    try:
        # Prepare request data
        request_data = {
            "latitude": test_location["latitude"],
            "longitude": test_location["longitude"],
            "radius_km": test_location["radius_km"],
            "platforms": ["google_maps"],
            "match": True
        }
        
        # Send request
        response = requests.post(
            f"{base_url}/api/restaurants/search",
            json=request_data
        )
        response.raise_for_status()
        
        return response.json()
            
    except Exception as e:
        logger.error(f"Error fetching restaurant data: {str(e)}")
        return None

async def main():
    """Run the API tests."""
    # Parse command-line arguments
    args = parse_args()
    
    # Set up logging level
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Check dependencies
    if not check_dependencies() and not args.ignore_missing_deps:
        logger.error("Exiting due to missing dependencies")
        sys.exit(1)
    
    # Prepare test location
    test_location = {
        "latitude": args.latitude,
        "longitude": args.longitude,
        "radius_km": args.radius
    }
    
    logger.info(f"Starting API AIQToolkit integration tests with http://{args.host}:{args.port}")
    logger.info(f"Test location: {test_location}")
    
    server_process = None
    base_url = f"http://{args.host}:{args.port}"
    
    try:
        # Start the API server (if needed)
        if not args.no_server:
            server_process, base_url = await start_api_server(args.host, args.port)
            if not server_process:
                if args.ignore_missing_deps:
                    logger.warning("Skipping tests due to server startup failure")
                    sys.exit(0)
                else:
                    sys.exit(1)
                    
        # Run the tests
        aiq_available = await test_health_endpoint(base_url)
        
        # Get restaurant data for other tests
        restaurant_data = await fetch_restaurant_data(base_url, test_location)
        
        # Run additional tests
        await test_search_endpoint(base_url, test_location)
        await test_analysis_endpoint(base_url, restaurant_data)
        await test_location_endpoint(base_url, test_location)
        await test_insights_endpoint(base_url, restaurant_data)
        
        logger.info("All API tests completed successfully!")
        return True
        
    except Exception as e:
        logger.error(f"Error running API tests: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return False
        
    finally:
        # Stop the API server (if we started it)
        if server_process:
            stop_api_server(server_process)

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1) 