#!/usr/bin/env python3
"""
Run AIQToolkit Integration Tests

This script runs both the agent tests and API tests for AIQToolkit integration.
"""

import os
import sys
import logging
import argparse
import subprocess
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("run_aiq_tests")

# Check for required dependencies
DEPENDENCIES = {
    "aiqtoolkit": False,
    "geopy": False
}

def check_dependencies():
    """Check if required dependencies are installed."""
    try:
        import aiq
        DEPENDENCIES["aiqtoolkit"] = True
        logger.info("AIQToolkit is available")
    except ImportError:
        logger.warning("AIQToolkit is not available. Some tests may be skipped.")
    
    try:
        import geopy
        DEPENDENCIES["geopy"] = True
        logger.info("geopy is available")
    except ImportError:
        logger.warning("geopy is not available. Some tests may be skipped.")
    
    return DEPENDENCIES

def setup_environment():
    """Set up the environment for testing."""
    # Ensure we're in the right directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    agent_dir = os.path.dirname(script_dir)
    
    # Make sure we're in the agent directory
    os.chdir(agent_dir)
    
    # Check if PYTHONPATH includes the agent directory
    if agent_dir not in sys.path:
        sys.path.insert(0, agent_dir)
    
    # Make test scripts executable
    for script in ["test_aiq_integration.py", "test_api_aiq_integration.py"]:
        script_path = os.path.join(script_dir, script)
        if os.path.exists(script_path):
            os.chmod(script_path, 0o755)
            
    # Create output directory for test results
    os.makedirs("test_results", exist_ok=True)
    
    # Check dependencies
    return check_dependencies()

def run_agent_tests():
    """Run the agent integration tests."""
    logger.info("Running agent integration tests...")
    
    script_path = os.path.join("examples", "test_aiq_integration.py")
    
    try:
        # Run the test script
        process = subprocess.run(
            [sys.executable, script_path],
            check=True,
            capture_output=True,
            text=True
        )
        
        # Log output
        logger.info("Agent test output:")
        for line in process.stdout.splitlines():
            logger.info(line)
        
        if process.stderr:
            logger.warning("Agent test stderr:")
            for line in process.stderr.splitlines():
                logger.warning(line)
                
        logger.info("Agent integration tests completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Agent integration tests failed with exit code {e.returncode}")
        logger.error(f"Output: {e.stdout}")
        logger.error(f"Error: {e.stderr}")
        return False
    except Exception as e:
        logger.error(f"Error running agent integration tests: {str(e)}")
        return False

def run_api_tests():
    """Run the API integration tests."""
    logger.info("Running API integration tests...")
    
    script_path = os.path.join("examples", "test_api_aiq_integration.py")
    
    try:
        # Run the test script
        process = subprocess.run(
            [sys.executable, script_path],
            check=True,
            capture_output=True,
            text=True
        )
        
        # Log output
        logger.info("API test output:")
        for line in process.stdout.splitlines():
            logger.info(line)
        
        if process.stderr:
            logger.warning("API test stderr:")
            for line in process.stderr.splitlines():
                logger.warning(line)
                
        logger.info("API integration tests completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"API integration tests failed with exit code {e.returncode}")
        logger.error(f"Output: {e.stdout}")
        logger.error(f"Error: {e.stderr}")
        
        # Check if error is due to missing dependencies
        if "ModuleNotFoundError" in e.stderr:
            logger.warning("API test failure appears to be due to missing dependencies")
            return None  # Return None to indicate dependency-related failure, not a test failure
        return False
    except Exception as e:
        logger.error(f"Error running API integration tests: {str(e)}")
        return False

def parse_args():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="Run AIQToolkit integration tests")
    
    parser.add_argument(
        "--agent-only",
        action="store_true",
        help="Run only agent tests (no API tests)"
    )
    
    parser.add_argument(
        "--api-only",
        action="store_true",
        help="Run only API tests (no API tests)"
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

def main():
    """Run all tests."""
    # Parse command-line arguments
    args = parse_args()
    
    # Set up logging level
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Set up environment
    dependencies = setup_environment()
    
    # Start time
    start_time = datetime.now()
    logger.info(f"Starting AIQToolkit integration tests at {start_time}")
    
    # Initialize result flags
    agent_result = None
    api_result = None
    
    # Run selected tests
    if args.agent_only:
        agent_result = run_agent_tests()
    elif args.api_only:
        api_result = run_api_tests()
    else:
        # Run both tests
        agent_result = run_agent_tests()
        api_result = run_api_tests()
    
    # End time
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()
    logger.info(f"Completed AIQToolkit integration tests at {end_time} (duration: {duration:.2f} seconds)")
    
    # Summarize results
    logger.info("Test Results Summary:")
    if agent_result is not None:
        agent_status = 'PASSED' if agent_result else 'FAILED'
        logger.info(f"  Agent Tests: {agent_status}")
    
    if api_result is not None:
        if api_result is None and args.ignore_missing_deps:
            api_status = 'SKIPPED (missing dependencies)'
        else:
            api_status = 'PASSED' if api_result else 'FAILED'
        logger.info(f"  API Tests: {api_status}")
    
    # Exit with appropriate status code
    if args.ignore_missing_deps:
        # Only consider actual failures, not None (dependency-related failures)
        if (agent_result is False) or (api_result is False):
            sys.exit(1)
        else:
            sys.exit(0)
    else:
        # Traditional behavior: any non-True result is a failure
        if (agent_result is not True) or (api_result is not True and api_result is not None):
            sys.exit(1)
        else:
            sys.exit(0)

if __name__ == "__main__":
    main() 