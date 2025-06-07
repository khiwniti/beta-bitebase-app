# AIQToolkit Integration Tests

This directory contains tests for verifying the AIQToolkit integration with the Bitebase AI system. These tests ensure that the AIQToolkit components are properly integrated and functioning as expected.

## Requirements

Before running the tests, make sure you have the following prerequisites:

1. Python 3.7+ installed
2. All project dependencies installed (`pip install -e .` from the agent directory)
3. NVIDIA AIQToolkit installed (`pip install aiqtoolkit`)
4. Valid API keys set in the environment variables or `.env` file:
   - `GOOGLE_MAPS_API_KEY` - Required for fetching restaurant data
   - `OPENAI_API_KEY` - Required for LLM-based analyses

## Available Tests

The test suite includes:

1. **Agent Integration Tests** - Tests the integration of AIQToolkit with agent components:
   - RestaurantDataAgent with data quality analysis
   - RestaurantAnalysisAgent with inference optimization and benchmarking
   - LocationIntelligenceAgent with profiling and evaluation

2. **API Integration Tests** - Tests the integration of AIQToolkit with API endpoints:
   - Health endpoint with AIQ status information
   - Restaurant search endpoint with AIQ metrics
   - Restaurant analysis endpoint with AIQ metrics and benchmarks
   - Location analysis endpoint with AIQ metrics
   - Insights endpoint with AIQ evaluation

## Running the Tests

You can run all tests using the main script:

```bash
python examples/run_aiq_tests.py
```

Or run it directly if you made it executable:

```bash
./examples/run_aiq_tests.py
```

### Command-Line Options

The main test script supports the following options:

- `--agent-only` - Run only the agent integration tests
- `--api-only` - Run only the API integration tests
- `--verbose` or `-v` - Increase output verbosity

Examples:

```bash
# Run only agent tests
python examples/run_aiq_tests.py --agent-only

# Run only API tests with verbose output
python examples/run_aiq_tests.py --api-only -v
```

## Individual Test Scripts

You can also run the individual test scripts directly:

```bash
# Run agent integration tests
python examples/test_aiq_integration.py

# Run API integration tests
python examples/test_api_aiq_integration.py
```

## Test Results

Test results are saved in the `test_results` directory with timestamps. These include:

- Restaurant data from the search endpoints
- Analysis results with AIQ metrics
- Location intelligence results with AIQ metrics

## Troubleshooting

If the tests fail, check the following:

1. Make sure AIQToolkit is properly installed: `pip show aiqtoolkit`
2. Verify that all API keys are set correctly in the environment
3. Check that the dependencies are correctly installed
4. Check the logs for specific error messages

## Missing AIQToolkit

If AIQToolkit is not installed, the tests will still run but will skip the AIQToolkit-specific features. You'll see warnings in the logs indicating that AIQToolkit is not available.

To install AIQToolkit:

```bash
pip install aiqtoolkit
```

## More Information

For more information about AIQToolkit:
- GitHub: https://github.com/NVIDIA/AIQToolkit
- Documentation: https://nvidia.github.io/AIQToolkit/ 