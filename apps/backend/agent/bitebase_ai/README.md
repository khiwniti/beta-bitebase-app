# Bitebase AI - Advanced Restaurant Market Research Agent System

This package provides a comprehensive set of tools and agents for restaurant market research, data collection, analysis, and visualization.

## Architecture

The Bitebase AI system is built with a modular, extensible architecture:

```
bitebase_ai/
├── core/                  # Core components
│   ├── agent_framework.py # Base agent classes
│   ├── api_client.py      # API client with caching and rate limiting
│   ├── data_processor.py  # Data processing utilities
│   └── web_scraper.py     # Web scraping utilities
├── agents/                # Specialized agents
│   ├── restaurant_data_agent.py     # Data collection agent
│   ├── restaurant_analysis_agent.py # Analysis agent
│   ├── restaurant_matcher.py        # Restaurant matching agent
│   └── restaurant_data_validator.py # Data validation agent
├── legacy/                # Legacy components (for backward compatibility)
│   └── __init__.py        # Legacy API exports
└── restaurant_research.py # Legacy research agent
```

## Core Components

### BaseAgent

The `BaseAgent` class provides a foundation for all agents with:

- Configuration management
- Error handling
- Metrics collection
- Logging
- LLM integration (OpenAI and DeepSeek)

### APIClient

The `APIClient` class provides a unified interface for making API requests with:

- Rate limiting
- Automatic retries
- Caching
- Error handling

### LLMClient

The `LLMClient` class provides a unified interface for interacting with language models:

- Support for multiple providers (OpenAI, DeepSeek)
- Standardized API for chat completions and embeddings
- Error handling and retries
- Configuration management

### Data Processor

The data processing utilities include:

- `RestaurantDataCleaner` for cleaning and normalizing restaurant data
- `RestaurantMatcher` for matching restaurants across different platforms

## Specialized Agents

### RestaurantDataAgent

The `RestaurantDataAgent` collects restaurant data from multiple platforms:

- Foodpanda
- Wongnai
- Robinhood
- Google Maps

It standardizes the data format and can match restaurants across platforms.

### RestaurantAnalysisAgent

The `RestaurantAnalysisAgent` provides comprehensive analysis of restaurant data:

- Basic analysis (counts, averages, etc.)
- Market analysis (price distribution, cuisine distribution, etc.)
- Competitor analysis (top-rated restaurants, cross-platform presence, etc.)
- Location analysis (distance distribution, restaurant clusters, etc.)

## Usage Examples

### Collecting Restaurant Data

```python
from bitebase_ai.agents import RestaurantDataAgent

# Initialize the agent
agent = RestaurantDataAgent()

# Search for restaurants
result = agent.execute(
    latitude=13.7563,
    longitude=100.5018,
    radius_km=1.0,
    platforms=["foodpanda", "wongnai", "robinhood"],
    match=True
)

# Access the results
platforms_data = result["platforms"]
matched_restaurants = result["matched_restaurants"]
```

### Analyzing Restaurant Data

```python
from bitebase_ai.agents import RestaurantAnalysisAgent

# Initialize the agent
agent = RestaurantAnalysisAgent()

# Analyze restaurants
result = agent.execute(
    latitude=13.7563,
    longitude=100.5018,
    radius_km=1.0,
    platforms=["foodpanda", "wongnai", "robinhood"],
    analysis_type="comprehensive"
)

# Access the analysis results
basic_analysis = result["basic_analysis"]
market_analysis = result["market_analysis"]
competitor_analysis = result["competitor_analysis"]
location_analysis = result["location_analysis"]
```

## API Reference

### RestaurantDataAgent

#### Methods

- `execute(latitude, longitude, radius_km, platforms=None, match=False)`: Search for restaurants

#### Parameters

- `latitude`: Center point latitude
- `longitude`: Center point longitude
- `radius_km`: Search radius in kilometers
- `platforms`: List of platforms to search (default: all available)
- `match`: Whether to match restaurants across platforms

#### Return Value

- Dictionary with `platforms` and optionally `matched_restaurants`

### RestaurantAnalysisAgent

#### Methods

- `execute(latitude, longitude, radius_km, platforms=None, analysis_type="comprehensive")`: Analyze restaurants

#### Parameters

- `latitude`: Center point latitude
- `longitude`: Center point longitude
- `radius_km`: Search radius in kilometers
- `platforms`: List of platforms to search (default: all available)
- `analysis_type`: Type of analysis to perform (basic, market, competitor, location, comprehensive)

#### Return Value

- Dictionary with analysis results based on the requested analysis type

## Legacy Components

For backward compatibility, the original components are still available:

- `OriginalRestaurantDataAgent`: The original restaurant data agent
- `OriginalRestaurantMatcher`: The original restaurant matcher
- `OriginalRestaurantDataValidator`: The original restaurant data validator
- `create_research_agent`: The original research agent creator
- `graph`: The original research agent graph

These components are maintained for backward compatibility but new code should use the new architecture.

## Command-Line Interface

For backward compatibility, the original command-line interfaces are still available:

```bash
# Search for restaurants
python restaurant_data_agent.py --latitude 13.7563 --longitude 100.5018 --radius 1.0

# Match restaurants across platforms
python restaurant_data_agent.py --latitude 13.7563 --longitude 100.5018 --radius 1.0 --match

# Validate restaurant data
python restaurant_data_validator.py --latitude 13.7563 --longitude 100.5018 --radius 1.0
```

## Dependencies

- Python 3.7+
- requests
- fuzzywuzzy (optional, for better restaurant matching)
- pandas, numpy, scikit-learn (optional, for advanced analysis)
- langgraph (for the research agent)

## Installation

```bash
pip install -r requirements.txt
```

## Configuration

The agents can be configured via environment variables or a configuration file:

- `BITEBASE_API_KEYS_GOOGLE_MAPS`: Google Maps API key
- `BITEBASE_API_KEYS_FOODPANDA`: Foodpanda API key
- `BITEBASE_API_KEYS_DEEPSEEK`: DeepSeek API key
- `BITEBASE_API_KEYS_OPENAI`: OpenAI API key
- `BITEBASE_CACHE_DIR`: Directory for caching API responses
- `BITEBASE_CACHE_DURATION_HOURS`: Cache duration in hours
- `LLM_PROVIDER`: LLM provider to use (openai, deepseek)
- `LLM_MODEL`: LLM model to use
- `LLM_TEMPERATURE`: Temperature for LLM generation
- `LLM_MAX_TOKENS`: Maximum tokens for LLM generation

## Using DeepSeek API

To use the DeepSeek API, you need to set the DeepSeek API key in the environment:

```bash
# Set the DeepSeek API key
python set_api_key.py --provider deepseek --key YOUR_DEEPSEEK_API_KEY --test

# Set the LLM provider to DeepSeek
export LLM_PROVIDER=deepseek
```

You can also set the DeepSeek API key in your configuration file:

```json
{
  "api_keys": {
    "deepseek": "YOUR_DEEPSEEK_API_KEY"
  },
  "llm": {
    "provider": "deepseek",
    "model": "deepseek-chat",
    "temperature": 0.0,
    "max_tokens": 4096
  }
}
```
