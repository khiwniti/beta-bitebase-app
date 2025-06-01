# Bitebase Geospatial Agent

This is the agent component of Bitebase Geospatial SaaS.

## Features

- Restaurant data extraction from multiple platforms
- Restaurant market analysis
- Location intelligence for restaurant businesses
- LLM-powered analysis and recommendations
- AIQToolkit integration for model profiling and evaluation

## Setup

### Prerequisites

- Python 3.7+
- Poetry (for dependency management)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd bitebase-geospatial-saas/agent
poetry install
```

### Configuration

Create a `.env` file in the root directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## AIQToolkit Integration

This project integrates with NVIDIA's AIQToolkit for profiling, evaluating, and optimizing the AI components.

### Installing AIQToolkit

To install AIQToolkit:

```bash
pip install aiqtoolkit
```

### AIQToolkit Features

The integration provides:

1. **Performance Profiling**: Track LLM call latency, throughput, and memory usage
2. **Quality Evaluation**: Evaluate LLM response quality based on accuracy, relevance, and helpfulness
3. **Inference Optimization**: Optimize inference with caching and batching
4. **Benchmarking**: Compare performance across different configurations
5. **Data Quality Analysis**: Analyze restaurant data quality and completeness

### Using AIQToolkit Integration

The AIQToolkit integration is automatically enabled when AIQToolkit is installed. To use the features:

1. **Basic Agent Profiling**:
   ```bash
   poetry run profile
   ```

2. **Restaurant Analysis with AIQToolkit**:
   ```bash
   poetry run aiq-analyze --latitude 13.7466 --longitude 100.5393 --radius 1.0
   ```

3. **Running Tests**:
   ```bash
   # Run all AIQToolkit integration tests
   poetry run test-aiq
   
   # Run only agent tests
   poetry run test-aiq-agent
   
   # Run only API tests
   poetry run test-aiq-api
   ```

## Usage

### Starting the API Server

```bash
poetry run bitebase
```

This starts the API server on port 3001 (default).

### Example Requests

#### Search for Restaurants

```bash
curl -X POST http://localhost:3001/api/restaurants/search \
  -H "Content-Type: application/json" \
  -d '{"latitude": 13.7466, "longitude": 100.5393, "radius_km": 1.0, "platforms": ["google_maps"], "match": true}'
```

#### Analyze Restaurants

```bash
curl -X POST http://localhost:3001/api/restaurants/analyze \
  -H "Content-Type: application/json" \
  -d '{"restaurant_data": {"restaurants": [...]} }'
```

#### Generate Location Insights

```bash
curl -X POST http://localhost:3001/api/location/analyze \
  -H "Content-Type: application/json" \
  -d '{"latitude": 13.7466, "longitude": 100.5393, "radius_km": 1.0}'
```

## Testing

Run tests using pytest:

```bash
pytest
```

Run AIQToolkit integration tests:

```bash
# Run all tests
poetry run test-aiq

# Run with verbose output
poetry run test-aiq -v

# Run only agent tests
poetry run test-aiq --agent-only

# Run only API tests
poetry run test-aiq --api-only
```

See [AIQToolkit Test README](examples/README_AIQ_TESTS.md) for more details.

## License

This project is licensed under the MIT License.
