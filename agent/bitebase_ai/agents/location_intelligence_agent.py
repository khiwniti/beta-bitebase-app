"""
Location Intelligence Agent - Specialized agent for geospatial analysis and location-based insights.

This agent provides geospatial analysis capabilities, including:
- Demographic analysis
- Foot traffic analysis
- Competitor proximity analysis
- Location optimization
- Expansion planning
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional, Tuple
import requests
import pandas as pd
import numpy as np
from datetime import datetime
from ..core.llm_client import LLMClient

# Import geodesic distance calculation if available
GEODESIC_AVAILABLE = False
try:
    from geopy.distance import geodesic
    GEODESIC_AVAILABLE = True
except ImportError:
    logger = logging.getLogger("LocationIntelligenceAgent")
    logger.warning("geopy package not available. Install with 'pip install geopy'")
    logger.warning("Distance calculations will use approximation instead of geodesic")

# Import AIQToolkit components if available
try:
    from aiq.profiler.profile_runner import ProfileRunner
    from aiq.eval.evaluator import Evaluator
    from ..core.aiq_integration import AIQProfiler, AIQEvaluator
    AIQ_AVAILABLE = True
except ImportError:
    AIQ_AVAILABLE = False

logger = logging.getLogger("LocationIntelligenceAgent")

# Fallback distance calculation function if geopy is not available
def calculate_distance(coord1, coord2):
    """
    Calculate approximate distance between two coordinates in kilometers.
    This is a fallback when geopy is not available.
    
    Args:
        coord1: (latitude, longitude) tuple for first point
        coord2: (latitude, longitude) tuple for second point
        
    Returns:
        Approximate distance in kilometers
    """
    if GEODESIC_AVAILABLE:
        return geodesic(coord1, coord2).kilometers
    
    # Simple approximation using the Haversine formula
    import math
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    
    # Convert latitude and longitude from degrees to radians
    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)
    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)
    
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    r = 6371  # Radius of Earth in kilometers
    
    return c * r

class LocationIntelligenceAgent:
    """Agent for geospatial analysis and location-based insights."""

    def __init__(self, config: Dict[str, Any] = None):
        """
        Initialize the Location Intelligence Agent.

        Args:
            config: Configuration dictionary
        """
        self.config = config or {}
        self.google_maps_api_key = self.config.get("google_maps_api_key", os.environ.get("GOOGLE_MAPS_API_KEY", ""))
        self.llm_client = LLMClient()
        
        # Initialize AIQToolkit components if available
        self.use_aiq = self.config.get("use_aiq", AIQ_AVAILABLE)
        if self.use_aiq and AIQ_AVAILABLE:
            try:
                self.aiq_profiler = AIQProfiler(
                    agent_name="LocationIntelligenceAgent",
                    config=self.config.get("aiq_profiler", {
                        "enabled": True,
                        "save_results": True,
                        "results_dir": "metrics/aiq/location_intelligence"
                    })
                )
                self.aiq_evaluator = AIQEvaluator(
                    config=self.config.get("aiq_evaluator", {
                        "enabled": True,
                        "criteria": ["accuracy", "relevance", "helpfulness"]
                    })
                )
                logger.info("AIQToolkit integration enabled for LocationIntelligenceAgent")
            except Exception as e:
                logger.error(f"Error initializing AIQToolkit components: {str(e)}")
                self.aiq_profiler = None
                self.aiq_evaluator = None
                self.use_aiq = False
        else:
            self.aiq_profiler = None
            self.aiq_evaluator = None
            if self.use_aiq:
                logger.warning("AIQToolkit requested but not available. Install with 'pip install aiqtoolkit'")
        
        # Initialize any required resources
        self._validate_config()

    def _validate_config(self):
        """Validate the configuration."""
        if not self.google_maps_api_key:
            logger.warning("Google Maps API key not provided. Some functionality may be limited.")

    def execute(self, 
                latitude: float, 
                longitude: float, 
                radius_km: float, 
                analysis_type: str = "comprehensive",
                restaurant_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Execute the location intelligence analysis.

        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Analysis radius in kilometers
            analysis_type: Type of analysis to perform
            restaurant_data: Optional restaurant data to analyze

        Returns:
            Analysis results
        """
        # Start profiling if AIQToolkit is available
        if self.use_aiq and self.aiq_profiler:
            self.aiq_profiler.start_profiling()
            start_time = datetime.now()
            
        try:
            # Gather location data
            location_data = self._gather_location_data(latitude, longitude, radius_km)
            
            # Perform demographic analysis
            demographics = self._analyze_demographics(latitude, longitude, radius_km)
            
            # Analyze foot traffic
            foot_traffic = self._analyze_foot_traffic(latitude, longitude, radius_km)
            
            # Analyze competition
            competition = self._analyze_competition(latitude, longitude, radius_km, restaurant_data)
            
            # Generate location insights
            insights = self._generate_location_insights(
                location_data, 
                demographics, 
                foot_traffic, 
                competition,
                analysis_type
            )
            
            # Evaluate insights if AIQToolkit is available
            evaluation_results = None
            if self.use_aiq and self.aiq_evaluator and insights:
                try:
                    evaluation_query = f"Provide location intelligence insights for a restaurant at coordinates {latitude}, {longitude} with a {radius_km} km radius."
                    evaluation_results = self.aiq_evaluator.evaluate_response(
                        query=evaluation_query,
                        response=insights
                    )
                    logger.info(f"Insight evaluation results: {evaluation_results}")
                except Exception as e:
                    logger.error(f"Error evaluating insights: {str(e)}")
            
            result = {
                "location_data": location_data,
                "demographics": demographics,
                "foot_traffic": foot_traffic,
                "competition": competition,
                "insights": insights,
                "metadata": {
                    "timestamp": datetime.now().isoformat(),
                    "coordinates": {"latitude": latitude, "longitude": longitude},
                    "radius_km": radius_km,
                    "analysis_type": analysis_type
                }
            }
            
            # Add evaluation results if available
            if evaluation_results:
                result["evaluation"] = evaluation_results
                
            # End profiling if AIQToolkit is available
            if self.use_aiq and self.aiq_profiler:
                metrics = self.aiq_profiler.end_profiling()
                # Add profiling metrics to result metadata
                result["metadata"]["aiq_metrics"] = {
                    "execution_time": metrics.get("execution_time", 0),
                    "calls_count": metrics.get("calls_count", 0),
                    "average_latency": metrics.get("average_latency", 0)
                }
                
                # Save profiling results to file
                try:
                    results_dir = self.config.get("aiq_profiler", {}).get("results_dir", "metrics/aiq/location_intelligence")
                    os.makedirs(results_dir, exist_ok=True)
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    filepath = os.path.join(results_dir, f"location_analysis_{timestamp}.json")
                    with open(filepath, 'w') as f:
                        json.dump(metrics, f, indent=2)
                    logger.info(f"Saved profiling results to {filepath}")
                except Exception as e:
                    logger.error(f"Error saving profiling results: {str(e)}")
            
            return result
        except Exception as e:
            # End profiling if AIQToolkit is available
            if self.use_aiq and self.aiq_profiler:
                self.aiq_profiler.end_profiling()
                
            logger.error(f"Error in location intelligence analysis: {str(e)}")
            raise

    def _gather_location_data(self, latitude: float, longitude: float, radius_km: float) -> Dict[str, Any]:
        """
        Gather location data for the specified coordinates.

        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Analysis radius in kilometers

        Returns:
            Location data
        """
        try:
            # Get place details from Google Maps API
            if self.google_maps_api_key:
                place_data = self._get_place_data(latitude, longitude)
            else:
                place_data = self._generate_mock_place_data(latitude, longitude)
                
            # Get nearby points of interest
            poi_data = self._get_points_of_interest(latitude, longitude, radius_km)
            
            return {
                "coordinates": {
                    "latitude": latitude,
                    "longitude": longitude
                },
                "radius_km": radius_km,
                "place_data": place_data,
                "points_of_interest": poi_data
            }
        except Exception as e:
            logger.error(f"Error gathering location data: {str(e)}")
            return {
                "coordinates": {
                    "latitude": latitude,
                    "longitude": longitude
                },
                "radius_km": radius_km,
                "place_data": {},
                "points_of_interest": []
            }

    def _analyze_demographics(self, latitude: float, longitude: float, radius_km: float) -> Dict[str, Any]:
        """
        Analyze demographics for the specified location.

        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Analysis radius in kilometers

        Returns:
            Demographic analysis
        """
        # In a real implementation, this would call a demographics API
        # For now, we'll generate mock data
        
        # Generate mock demographic data based on the coordinates
        # This creates deterministic but varied data for different locations
        seed = int(abs(latitude * 100) + abs(longitude * 100))
        np.random.seed(seed)
        
        total_population = int(np.random.normal(50000, 10000))
        
        age_distribution = {
            "0-17": round(np.random.uniform(0.15, 0.25), 2),
            "18-24": round(np.random.uniform(0.10, 0.15), 2),
            "25-34": round(np.random.uniform(0.15, 0.25), 2),
            "35-44": round(np.random.uniform(0.15, 0.20), 2),
            "45-54": round(np.random.uniform(0.10, 0.15), 2),
            "55-64": round(np.random.uniform(0.05, 0.10), 2),
            "65+": round(np.random.uniform(0.05, 0.15), 2)
        }
        
        # Normalize to ensure sum is 1.0
        total = sum(age_distribution.values())
        age_distribution = {k: round(v/total, 2) for k, v in age_distribution.items()}
        
        income_distribution = {
            "Under $25K": round(np.random.uniform(0.10, 0.20), 2),
            "$25K-$50K": round(np.random.uniform(0.15, 0.25), 2),
            "$50K-$75K": round(np.random.uniform(0.20, 0.30), 2),
            "$75K-$100K": round(np.random.uniform(0.15, 0.25), 2),
            "$100K-$150K": round(np.random.uniform(0.10, 0.20), 2),
            "$150K+": round(np.random.uniform(0.05, 0.15), 2)
        }
        
        # Normalize to ensure sum is 1.0
        total = sum(income_distribution.values())
        income_distribution = {k: round(v/total, 2) for k, v in income_distribution.items()}
        
        return {
            "total_population": total_population,
            "population_density": round(total_population / (np.pi * radius_km * radius_km), 2),
            "age_distribution": age_distribution,
            "income_distribution": income_distribution,
            "median_household_income": int(np.random.normal(60000, 15000)),
            "education_level": {
                "high_school": round(np.random.uniform(0.20, 0.30), 2),
                "some_college": round(np.random.uniform(0.20, 0.30), 2),
                "bachelors": round(np.random.uniform(0.20, 0.30), 2),
                "graduate": round(np.random.uniform(0.10, 0.20), 2)
            }
        }

    def _analyze_foot_traffic(self, latitude: float, longitude: float, radius_km: float) -> Dict[str, Any]:
        """
        Analyze foot traffic for the specified location.

        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Analysis radius in kilometers

        Returns:
            Foot traffic analysis
        """
        # In a real implementation, this would call a foot traffic API
        # For now, we'll generate mock data
        
        # Generate mock foot traffic data based on the coordinates
        seed = int(abs(latitude * 100) + abs(longitude * 100))
        np.random.seed(seed)
        
        # Generate hourly foot traffic patterns
        hourly_pattern = {}
        for hour in range(24):
            if 0 <= hour < 6:
                # Late night/early morning (low traffic)
                hourly_pattern[str(hour)] = int(np.random.normal(20, 10))
            elif 6 <= hour < 11:
                # Morning (medium traffic)
                hourly_pattern[str(hour)] = int(np.random.normal(100, 30))
            elif 11 <= hour < 14:
                # Lunch (high traffic)
                hourly_pattern[str(hour)] = int(np.random.normal(200, 50))
            elif 14 <= hour < 17:
                # Afternoon (medium traffic)
                hourly_pattern[str(hour)] = int(np.random.normal(120, 30))
            elif 17 <= hour < 21:
                # Dinner (high traffic)
                hourly_pattern[str(hour)] = int(np.random.normal(250, 60))
            else:
                # Late evening (medium-low traffic)
                hourly_pattern[str(hour)] = int(np.random.normal(80, 30))
        
        # Ensure no negative values
        hourly_pattern = {k: max(0, v) for k, v in hourly_pattern.items()}
        
        # Generate daily foot traffic patterns
        daily_pattern = {
            "Monday": int(np.random.normal(800, 200)),
            "Tuesday": int(np.random.normal(750, 180)),
            "Wednesday": int(np.random.normal(800, 200)),
            "Thursday": int(np.random.normal(900, 220)),
            "Friday": int(np.random.normal(1200, 300)),
            "Saturday": int(np.random.normal(1500, 400)),
            "Sunday": int(np.random.normal(1100, 300))
        }
        
        return {
            "average_daily_traffic": int(np.mean(list(daily_pattern.values()))),
            "hourly_pattern": hourly_pattern,
            "daily_pattern": daily_pattern,
            "peak_hours": ["12", "13", "18", "19", "20"],
            "peak_days": ["Friday", "Saturday"],
            "traffic_trend": np.random.choice(["increasing", "stable", "decreasing"], p=[0.4, 0.4, 0.2])
        }

    def _analyze_competition(self, 
                           latitude: float, 
                           longitude: float, 
                           radius_km: float,
                           restaurant_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Analyze competition for the specified location.

        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Analysis radius in kilometers
            restaurant_data: Optional restaurant data to analyze

        Returns:
            Competition analysis
        """
        # Use provided restaurant data if available, otherwise generate mock data
        if restaurant_data and "restaurants" in restaurant_data:
            competitors = restaurant_data["restaurants"]
        else:
            # Generate mock competitor data
            competitors = self._generate_mock_competitors(latitude, longitude, radius_km)
        
        # Calculate distances to each competitor
        for competitor in competitors:
            if "latitude" in competitor and "longitude" in competitor:
                competitor_coords = (competitor["latitude"], competitor["longitude"])
                center_coords = (latitude, longitude)
                competitor["distance_km"] = round(calculate_distance(center_coords, competitor_coords), 2)
            else:
                competitor["distance_km"] = None
        
        # Count competitors by cuisine type
        cuisine_counts = {}
        for competitor in competitors:
            cuisine = competitor.get("cuisine", "Unknown")
            cuisine_counts[cuisine] = cuisine_counts.get(cuisine, 0) + 1
        
        # Count competitors by price level
        price_counts = {}
        for competitor in competitors:
            price_level = competitor.get("price_level", 0)
            price_counts[price_level] = price_counts.get(price_level, 0) + 1
        
        return {
            "total_competitors": len(competitors),
            "competitors_within_1km": sum(1 for c in competitors if c.get("distance_km") and c["distance_km"] <= 1),
            "cuisine_distribution": cuisine_counts,
            "price_distribution": price_counts,
            "competitors": competitors
        }

    def _generate_location_insights(self,
                                  location_data: Dict[str, Any],
                                  demographics: Dict[str, Any],
                                  foot_traffic: Dict[str, Any],
                                  competition: Dict[str, Any],
                                  analysis_type: str) -> str:
        """
        Generate location insights based on the analysis.

        Args:
            location_data: Location data
            demographics: Demographic analysis
            foot_traffic: Foot traffic analysis
            competition: Competition analysis
            analysis_type: Type of analysis to perform

        Returns:
            Location insights
        """
        # Create a prompt for the LLM
        prompt = f"""
        You are a location intelligence expert for restaurants. Based on the following data, provide insights on the location at coordinates {location_data['coordinates']['latitude']}, {location_data['coordinates']['longitude']} with a {location_data['radius_km']} km radius:

        DEMOGRAPHIC DATA:
        {json.dumps(demographics, indent=2)}

        FOOT TRAFFIC DATA:
        {json.dumps(foot_traffic, indent=2)}

        COMPETITION DATA:
        Total competitors: {competition['total_competitors']}
        Competitors within 1km: {competition['competitors_within_1km']}
        Cuisine distribution: {json.dumps(competition['cuisine_distribution'], indent=2)}
        Price distribution: {json.dumps(competition['price_distribution'], indent=2)}

        Please provide a {analysis_type} analysis with the following sections:
        1. Location Overview
        2. Demographic Insights
        3. Foot Traffic Analysis
        4. Competitive Landscape
        5. Recommendations

        Format your response with markdown headings and bullet points for readability.
        """

        # Create messages for the chat completion
        messages = [
            {"role": "system", "content": "You are a location intelligence expert for restaurants."},
            {"role": "user", "content": prompt}
        ]

        # Get the completion
        try:
            response = self.llm_client.chat_completion(messages)
            insights = self.llm_client.extract_response_text(response)
        except Exception as e:
            logger.error(f"Error generating location insights: {str(e)}")
            insights = "Error generating location insights. Please try again later."

        return insights

    def _get_place_data(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """
        Get place data from Google Maps API.

        Args:
            latitude: Latitude
            longitude: Longitude

        Returns:
            Place data
        """
        if not self.google_maps_api_key:
            return self._generate_mock_place_data(latitude, longitude)
            
        try:
            url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={latitude},{longitude}&key={self.google_maps_api_key}"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get("status") == "OK" and data.get("results"):
                result = data["results"][0]
                return {
                    "formatted_address": result.get("formatted_address", ""),
                    "place_id": result.get("place_id", ""),
                    "types": result.get("types", []),
                    "address_components": result.get("address_components", [])
                }
            else:
                logger.warning(f"No place data found for coordinates: {latitude}, {longitude}")
                return self._generate_mock_place_data(latitude, longitude)
        except Exception as e:
            logger.error(f"Error getting place data: {str(e)}")
            return self._generate_mock_place_data(latitude, longitude)

    def _get_points_of_interest(self, latitude: float, longitude: float, radius_km: float) -> List[Dict[str, Any]]:
        """
        Get points of interest near the specified coordinates.

        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Search radius in kilometers

        Returns:
            List of points of interest
        """
        if not self.google_maps_api_key:
            return self._generate_mock_points_of_interest(latitude, longitude, radius_km)
            
        try:
            # Convert km to meters for the API
            radius_meters = int(radius_km * 1000)
            
            url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={latitude},{longitude}&radius={radius_meters}&key={self.google_maps_api_key}"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get("status") == "OK" and data.get("results"):
                poi_list = []
                for result in data["results"]:
                    poi = {
                        "name": result.get("name", ""),
                        "place_id": result.get("place_id", ""),
                        "types": result.get("types", []),
                        "vicinity": result.get("vicinity", ""),
                        "latitude": result.get("geometry", {}).get("location", {}).get("lat"),
                        "longitude": result.get("geometry", {}).get("location", {}).get("lng")
                    }
                    poi_list.append(poi)
                return poi_list
            else:
                logger.warning(f"No points of interest found for coordinates: {latitude}, {longitude}")
                return self._generate_mock_points_of_interest(latitude, longitude, radius_km)
        except Exception as e:
            logger.error(f"Error getting points of interest: {str(e)}")
            return self._generate_mock_points_of_interest(latitude, longitude, radius_km)

    def _generate_mock_place_data(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """
        Generate mock place data for the specified coordinates.

        Args:
            latitude: Latitude
            longitude: Longitude

        Returns:
            Mock place data
        """
        return {
            "formatted_address": f"{latitude}, {longitude}",
            "place_id": f"mock_place_{abs(int(latitude * 1000))}_{abs(int(longitude * 1000))}",
            "types": ["point_of_interest", "establishment"],
            "address_components": [
                {
                    "long_name": "Mock City",
                    "short_name": "MC",
                    "types": ["locality", "political"]
                },
                {
                    "long_name": "Mock County",
                    "short_name": "MC",
                    "types": ["administrative_area_level_2", "political"]
                },
                {
                    "long_name": "Mock State",
                    "short_name": "MS",
                    "types": ["administrative_area_level_1", "political"]
                },
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"]
                }
            ]
        }

    def _generate_mock_points_of_interest(self, latitude: float, longitude: float, radius_km: float) -> List[Dict[str, Any]]:
        """
        Generate mock points of interest near the specified coordinates.

        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Search radius in kilometers

        Returns:
            List of mock points of interest
        """
        # Set seed for reproducibility based on coordinates
        seed = int(abs(latitude * 100) + abs(longitude * 100))
        np.random.seed(seed)
        
        # Generate a random number of POIs
        num_pois = np.random.randint(10, 30)
        
        poi_types = [
            ["restaurant", "food"],
            ["cafe", "food"],
            ["bar", "food"],
            ["shopping_mall", "store"],
            ["grocery_or_supermarket", "store"],
            ["bank", "finance"],
            ["school", "education"],
            ["hospital", "health"],
            ["park", "leisure"],
            ["gym", "health"]
        ]
        
        poi_list = []
        for i in range(num_pois):
            # Generate a random point within the radius
            # Convert radius to degrees (approximate)
            radius_deg = radius_km / 111.32  # 1 degree is approximately 111.32 km
            
            # Generate random angle and distance
            angle = np.random.uniform(0, 2 * np.pi)
            distance = np.random.uniform(0, radius_deg)
            
            # Calculate new coordinates
            new_lat = latitude + distance * np.cos(angle)
            new_lng = longitude + distance * np.sin(angle)
            
            # Select random POI type
            poi_type = poi_types[np.random.randint(0, len(poi_types))]
            
            poi = {
                "name": f"Mock {poi_type[0].title()} {i+1}",
                "place_id": f"mock_poi_{i}_{abs(int(latitude * 1000))}_{abs(int(longitude * 1000))}",
                "types": poi_type,
                "vicinity": f"Mock Address {i+1}, Mock City",
                "latitude": new_lat,
                "longitude": new_lng
            }
            
            poi_list.append(poi)
            
        return poi_list

    def _generate_mock_competitors(self, latitude: float, longitude: float, radius_km: float) -> List[Dict[str, Any]]:
        """
        Generate mock competitor data for the specified location.

        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Analysis radius in kilometers

        Returns:
            List of mock competitors
        """
        # Set seed for reproducibility based on coordinates
        seed = int(abs(latitude * 100) + abs(longitude * 100))
        np.random.seed(seed)
        
        # Generate a random number of competitors
        num_competitors = np.random.randint(5, 20)
        
        cuisines = [
            "Italian", "Chinese", "Japanese", "Mexican", "Thai", 
            "Indian", "American", "French", "Greek", "Korean",
            "Vietnamese", "Mediterranean", "Steakhouse", "Seafood", "Vegetarian"
        ]
        
        competitors = []
        for i in range(num_competitors):
            # Generate a random point within the radius
            # Convert radius to degrees (approximate)
            radius_deg = radius_km / 111.32  # 1 degree is approximately 111.32 km
            
            # Generate random angle and distance
            angle = np.random.uniform(0, 2 * np.pi)
            distance = np.random.uniform(0, radius_deg)
            
            # Calculate new coordinates
            new_lat = latitude + distance * np.cos(angle)
            new_lng = longitude + distance * np.sin(angle)
            
            # Select random cuisine and price level
            cuisine = np.random.choice(cuisines)
            price_level = np.random.randint(1, 5)
            
            competitor = {
                "name": f"Mock {cuisine} Restaurant {i+1}",
                "cuisine": cuisine,
                "price_level": price_level,
                "rating": round(np.random.uniform(2.5, 5.0), 1),
                "review_count": np.random.randint(10, 500),
                "latitude": new_lat,
                "longitude": new_lng
            }
            
            competitors.append(competitor)
            
        return competitors
