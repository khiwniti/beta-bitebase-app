"""
Restaurant Research Agent - Advanced agent for comprehensive restaurant market research.

This agent combines data collection, analysis, and insights to provide
comprehensive market research for restaurants, with support for streaming responses.
"""

import os
import json
import logging
import asyncio
from typing import Dict, List, Any, Optional, Union, AsyncGenerator, Callable

from ..core.agent_framework import BaseAgent, AgentMetrics
from ..core.streaming import StreamingManager
from ..core.llm_client import LLMClient
from ..agents.restaurant_data_agent import RestaurantDataAgent
from ..agents.restaurant_analysis_agent import RestaurantAnalysisAgent

logger = logging.getLogger("RestaurantResearchAgent")

class RestaurantResearchAgent(BaseAgent):
    """
    Advanced agent for comprehensive restaurant market research with streaming support.
    """

    def __init__(self, config_path: Optional[str] = None):
        """
        Initialize the agent.

        Args:
            config_path: Path to configuration file
        """
        super().__init__(config_path, "RestaurantResearchAgent")

        # Initialize component agents
        self.data_agent = RestaurantDataAgent(config_path)
        self.analysis_agent = RestaurantAnalysisAgent(config_path)
        
        # Initialize streaming manager
        self.streaming_manager = StreamingManager()
        
        # Initialize LLM client
        self.llm_client = LLMClient(
            provider=self.config.get("llm.provider", "openai"),
            model=self.config.get("llm.model", "gpt-4-turbo"),
            temperature=self.config.get("llm.temperature", 0.0),
            max_tokens=self.config.get("llm.max_tokens", 4096),
            api_key=self.config.get(f"api_keys.{self.config.get('llm.provider', 'openai')}")
        )

    def run(self,
           latitude: float,
           longitude: float,
           radius_km: float,
           platforms: Optional[List[str]] = None,
           match: bool = False,
           analyze: bool = True) -> Dict[str, Any]:
        """
        Run the agent to search for and analyze restaurants.

        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Search radius in kilometers
            platforms: List of platforms to search (default: all available)
            match: Whether to match restaurants across platforms
            analyze: Whether to analyze the restaurant data

        Returns:
            Dictionary of restaurant data and analysis
        """
        # Collect restaurant data
        self.logger.info(f"Collecting restaurant data at {latitude}, {longitude} with radius {radius_km}km")
        restaurant_data = self.data_agent.execute(
            latitude=latitude,
            longitude=longitude,
            radius_km=radius_km,
            platforms=platforms,
            match=match
        )
        
        # Analyze restaurant data if requested
        if analyze and restaurant_data:
            self.logger.info("Analyzing restaurant data")
            analysis_results = self.analysis_agent.execute(restaurant_data=restaurant_data)
            
            # Combine results
            return {
                "restaurant_data": restaurant_data,
                "analysis": analysis_results
            }
        
        return {
            "restaurant_data": restaurant_data,
            "analysis": None
        }

    async def run_async(self,
                      latitude: float,
                      longitude: float,
                      radius_km: float,
                      platforms: Optional[List[str]] = None,
                      match: bool = False,
                      analyze: bool = True,
                      stream_callback: Optional[Callable[[str], None]] = None) -> Dict[str, Any]:
        """
        Run the agent asynchronously with streaming support.

        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Search radius in kilometers
            platforms: List of platforms to search (default: all available)
            match: Whether to match restaurants across platforms
            analyze: Whether to analyze the restaurant data
            stream_callback: Callback function for streaming updates

        Returns:
            Dictionary of restaurant data and analysis
        """
        # Start metrics
        self.metrics.start()
        
        try:
            # Stream initial message
            if stream_callback:
                stream_callback("Starting restaurant research...\n")
            
            # Collect restaurant data
            if stream_callback:
                stream_callback(f"Searching for restaurants at {latitude}, {longitude} with radius {radius_km}km...\n")
            
            # Run data collection (this would ideally be async in a real implementation)
            restaurant_data = self.data_agent.execute(
                latitude=latitude,
                longitude=longitude,
                radius_km=radius_km,
                platforms=platforms,
                match=match
            )
            
            if stream_callback:
                stream_callback(f"Found {len(restaurant_data.get('restaurants', []))} restaurants.\n")
            
            # Analyze restaurant data if requested
            analysis_results = None
            if analyze and restaurant_data:
                if stream_callback:
                    stream_callback("Analyzing restaurant data...\n")
                
                # Run analysis (this would ideally be async in a real implementation)
                analysis_results = self.analysis_agent.execute(restaurant_data=restaurant_data)
                
                if stream_callback:
                    stream_callback("Analysis complete.\n")
            
            # Combine results
            result = {
                "restaurant_data": restaurant_data,
                "analysis": analysis_results
            }
            
            # Stop metrics
            self.metrics.stop(success=True)
            
            return result
        except Exception as e:
            # Stop metrics with error
            self.metrics.stop(success=False, error=str(e))
            
            # Stream error message
            if stream_callback:
                stream_callback(f"Error: {str(e)}\n")
            
            self.logger.error(f"Error in RestaurantResearchAgent: {str(e)}")
            raise

    async def generate_insights(self, restaurant_data: Dict[str, Any]) -> AsyncGenerator[str, None]:
        """
        Generate insights from restaurant data with streaming support.

        Args:
            restaurant_data: Restaurant data to analyze

        Yields:
            Insight chunks
        """
        # Prepare the prompt for the LLM
        prompt = self._create_insights_prompt(restaurant_data)
        
        # Stream the response from the LLM
        async for chunk in self.llm_client.stream_completion(prompt):
            yield chunk

    def _create_insights_prompt(self, restaurant_data: Dict[str, Any]) -> str:
        """
        Create a prompt for generating insights from restaurant data.

        Args:
            restaurant_data: Restaurant data to analyze

        Returns:
            Prompt for the LLM
        """
        # Extract relevant information from restaurant data
        restaurants = restaurant_data.get("restaurants", [])
        restaurant_count = len(restaurants)
        platforms = set(r.get("source", "unknown") for r in restaurants)
        
        # Create a summary of the restaurant data
        data_summary = f"""
        Restaurant Data Summary:
        - Total restaurants: {restaurant_count}
        - Platforms: {', '.join(platforms)}
        - Location: {restaurants[0].get('latitude', 'N/A')}, {restaurants[0].get('longitude', 'N/A')} (approx.)
        """
        
        # Create the prompt
        prompt = f"""
        You are a restaurant market research expert. Based on the following restaurant data, provide insights on:
        
        1. Market saturation and competition
        2. Cuisine distribution and trends
        3. Price point analysis
        4. Location advantages and disadvantages
        5. Recommendations for new restaurant concepts
        
        {data_summary}
        
        Detailed restaurant data:
        {json.dumps(restaurants[:10], indent=2)}  # Limiting to 10 restaurants for brevity
        
        Provide your analysis in a clear, structured format with headings and bullet points.
        """
        
        return prompt
