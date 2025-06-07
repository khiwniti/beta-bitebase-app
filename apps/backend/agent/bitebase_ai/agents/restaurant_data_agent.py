"""
Restaurant Data Agent - Enhanced agent for extracting and analyzing restaurant data.

This agent can extract data from multiple platforms, match restaurants across platforms,
and provide comprehensive analysis of the restaurant market in a specified area.
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional, Union, Tuple
from datetime import datetime

from ..core.agent_framework import BaseAgent, AgentMetrics
from ..core.api_client import APIClient
from ..core.data_processor import RestaurantDataCleaner, RestaurantMatcher

# Import AIQToolkit components if available
try:
    from aiq.profiler.profile_runner import ProfileRunner
    from aiq.eval.evaluator import Evaluator
    from aiq.profiler.inference_optimization import InferenceOptimizer
    from ..core.aiq_integration import AIQProfiler, AIQEvaluator
    AIQ_AVAILABLE = True
except ImportError:
    AIQ_AVAILABLE = False

logger = logging.getLogger("RestaurantDataAgent")

class RestaurantDataAgent(BaseAgent):
    """
    Enhanced agent for extracting and analyzing restaurant data from multiple sources.
    """

    def __init__(self, config_path: Optional[str] = None):
        """
        Initialize the agent.

        Args:
            config_path: Path to configuration file
        """
        super().__init__(config_path, "RestaurantDataAgent")

        # Initialize API clients for each platform
        self.api_clients = {
            "foodpanda": self._create_foodpanda_client(),
            "wongnai": self._create_wongnai_client(),
            "robinhood": self._create_robinhood_client(),
            "google_maps": self._create_google_maps_client()
        }

        # Initialize data processor components
        self.cleaner = RestaurantDataCleaner()
        self.matcher = RestaurantMatcher()
        
        # Initialize AIQToolkit components if available
        if AIQ_AVAILABLE and self.config.get("use_aiq", True):
            try:
                # Initialize data quality analyzer for restaurant data
                self.data_quality_analyzer = InferenceOptimizer(
                    name="RestaurantDataQuality",
                    config={
                        "optimization_target": "quality",
                        "metric_collection": True
                    }
                )
                logger.info("AIQToolkit data quality analyzer initialized")
            except Exception as e:
                logger.error(f"Error initializing AIQToolkit data quality analyzer: {str(e)}")
                self.data_quality_analyzer = None
        else:
            self.data_quality_analyzer = None

    def _get_default_config(self) -> Dict[str, Any]:
        """Get default configuration values."""
        config = super()._get_default_config()
        config.update({
            "api_keys": {
                "google_maps": os.environ.get("GOOGLE_MAPS_API_KEY", ""),
                "foodpanda": os.environ.get("FOODPANDA_API_KEY", ""),
            },
            "user_agents": {
                "wongnai": "Wongnai/10.0 Android/10",
                "foodpanda": "FoodpandaPartnerAPI/1.0",
                "robinhood": "Robinhood/2.0 iOS/15.0",
                "default": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            },
            "matching": {
                "threshold": 0.7,
                "name_weight": 0.5,
                "address_weight": 0.3,
                "location_weight": 0.2
            },
            "data_quality": {
                "enabled": True,
                "minimum_completeness_score": 0.7,
                "validate_coordinates": True,
                "validate_names": True
            }
        })
        return config

    def _create_foodpanda_client(self) -> APIClient:
        """Create API client for Foodpanda."""
        headers = {
            "User-Agent": self.config.get("user_agents.foodpanda"),
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.9,th;q=0.8"
        }

        api_key = self.config.get("api_keys.foodpanda")
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"

        return APIClient(
            base_url="https://th.fd-api.com/api/v5",
            headers=headers,
            cache_dir=self.config.get("cache_dir"),
            cache_duration_hours=self.config.get("cache_duration_hours"),
            requests_per_minute=30,  # Foodpanda has stricter rate limits
            timeout=self.config.get("timeout"),
            max_retries=self.config.get("max_retries"),
            retry_delay=self.config.get("retry_delay")
        )

    def _create_wongnai_client(self) -> APIClient:
        """Create API client for Wongnai."""
        headers = {
            "User-Agent": self.config.get("user_agents.wongnai"),
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.9,th;q=0.8"
        }

        return APIClient(
            base_url="https://api.wongnai.com",
            headers=headers,
            cache_dir=self.config.get("cache_dir"),
            cache_duration_hours=self.config.get("cache_duration_hours"),
            requests_per_minute=60,
            timeout=self.config.get("timeout"),
            max_retries=self.config.get("max_retries"),
            retry_delay=self.config.get("retry_delay")
        )

    def _create_robinhood_client(self) -> APIClient:
        """Create API client for Robinhood."""
        headers = {
            "User-Agent": self.config.get("user_agents.robinhood"),
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.9,th;q=0.8"
        }

        return APIClient(
            base_url="https://api.robinhood.in.th",
            headers=headers,
            cache_dir=self.config.get("cache_dir"),
            cache_duration_hours=self.config.get("cache_duration_hours"),
            requests_per_minute=60,
            timeout=self.config.get("timeout"),
            max_retries=self.config.get("max_retries"),
            retry_delay=self.config.get("retry_delay")
        )

    def _create_google_maps_client(self) -> APIClient:
        """Create API client for Google Maps."""
        api_key = self.config.get("api_keys.google_maps")

        return APIClient(
            base_url="https://maps.googleapis.com/maps/api",
            headers={
                "User-Agent": self.config.get("user_agents.default"),
                "Accept": "application/json"
            },
            cache_dir=self.config.get("cache_dir"),
            cache_duration_hours=self.config.get("cache_duration_hours"),
            requests_per_minute=60,
            timeout=self.config.get("timeout"),
            max_retries=self.config.get("max_retries"),
            retry_delay=self.config.get("retry_delay")
        )

    def run(self,
           latitude: float,
           longitude: float,
           radius_km: float,
           platforms: Optional[List[str]] = None,
           match: bool = False,
           use_real_data: bool = True) -> Dict[str, Any]:
        """
        Run the agent to search for restaurants.

        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Search radius in kilometers
            platforms: List of platforms to search (default: all available)
            match: Whether to match restaurants across platforms
            use_real_data: Whether to prioritize real data sources over mock data

        Returns:
            Dictionary of restaurant data
        """
        if platforms is None:
            if use_real_data and "google_maps" in self.api_clients and self.config.get("api_keys.google_maps"):
                # Prioritize Google Maps if we want real data and have an API key
                platforms = ["google_maps"]
                self.logger.info("Using Google Maps as the primary real data source")
            else:
                platforms = list(self.api_clients.keys())

        # Validate inputs
        if not all(isinstance(x, (int, float)) for x in [latitude, longitude, radius_km]):
            raise ValueError("Latitude, longitude, and radius must be numbers")

        if not all(p in self.api_clients for p in platforms):
            invalid_platforms = [p for p in platforms if p not in self.api_clients]
            raise ValueError(f"Invalid platforms: {invalid_platforms}")

        self.logger.info(f"Searching for restaurants at {latitude}, {longitude} with radius {radius_km}km")
        self.logger.info(f"Platforms: {platforms}, Use real data: {use_real_data}")

        # Search on each platform
        results = {}
        real_data_found = False
        
        for platform in platforms:
            try:
                self.logger.info(f"Searching on {platform}...")
                self.metrics.increment_step()

                restaurants = self._search_platform(platform, latitude, longitude, radius_km)
                
                # Check if we got real data
                if platform == "google_maps" and restaurants and len(restaurants) > 0:
                    real_data_found = True
                    self.logger.info(f"Found {len(restaurants)} real restaurants from Google Maps")
                
                results[platform] = restaurants

                self.logger.info(f"Found {len(restaurants)} restaurants on {platform}")
                self.metrics.add_processed_data(len(restaurants))
                self.metrics.add_custom_metric(f"{platform}_count", len(restaurants))
            except Exception as e:
                self.logger.error(f"Error searching {platform}: {str(e)}")
                results[platform] = []

        # Analyze data quality if AIQToolkit is available
        if self.data_quality_analyzer and self.config.get("data_quality.enabled", True):
            try:
                all_restaurants = []
                for platform_restaurants in results.values():
                    all_restaurants.extend(platform_restaurants)
                    
                quality_metrics = self._analyze_data_quality(all_restaurants)
                self.metrics.add_custom_metric("data_quality", quality_metrics)
                
                # Log metrics 
                self.logger.info(f"Data quality metrics: {json.dumps(quality_metrics)}")
            except Exception as e:
                self.logger.error(f"Error analyzing data quality: {str(e)}")

        # Match restaurants if requested
        if match and len(platforms) > 1:
            self.logger.info("Matching restaurants across platforms...")
            self.metrics.increment_step()

            threshold = self.config.get("matching.threshold", 0.7)
            matched_restaurants = self.matcher.match_restaurants(results, threshold)

            self.logger.info(f"Found {len(matched_restaurants)} matched restaurants")
            self.metrics.add_custom_metric("matched_count", len(matched_restaurants))

            return {
                "platforms": results,
                "matched_restaurants": matched_restaurants,
                "metadata": {
                    "timestamp": datetime.now().isoformat(),
                    "location": {"latitude": latitude, "longitude": longitude},
                    "radius_km": radius_km,
                    "platforms": platforms,
                    "data_source": "real" if real_data_found else "simulated",
                    "real_data_found": real_data_found,
                    "data_quality": self.metrics.custom_metrics.get("data_quality", {})
                }
            }

        return {
            "platforms": results,
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "location": {"latitude": latitude, "longitude": longitude},
                "radius_km": radius_km,
                "platforms": platforms,
                "data_source": "real" if real_data_found else "simulated",
                "real_data_found": real_data_found,
                "data_quality": self.metrics.custom_metrics.get("data_quality", {})
            }
        }

    def _search_platform(self, platform: str, latitude: float, longitude: float, radius_km: float) -> List[Dict]:
        """
        Search for restaurants on a specific platform.

        Args:
            platform: Platform name
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Search radius in kilometers

        Returns:
            List of restaurant data
        """
        if platform == "foodpanda":
            return self._get_foodpanda_restaurants(latitude, longitude, radius_km)
        elif platform == "wongnai":
            return self._get_wongnai_restaurants(latitude, longitude, radius_km)
        elif platform == "robinhood":
            return self._get_robinhood_restaurants(latitude, longitude, radius_km)
        elif platform == "google_maps":
            return self._get_google_maps_restaurants(latitude, longitude, radius_km)
        else:
            raise ValueError(f"Unknown platform: {platform}")

    def _get_foodpanda_restaurants(self, latitude: float, longitude: float, radius_km: float) -> List[Dict]:
        """Get restaurants from Foodpanda."""
        # Convert radius to meters for the API
        radius_m = int(radius_km * 1000)

        params = {
            "latitude": latitude,
            "longitude": longitude,
            "radius": radius_m,
            "include": "characteristics,cuisines,food_characteristics,delivery_fee_details",
            "language_id": "1",
            "dynamic_pricing": "0",
            "configuration": "Variant1",
            "country_code": "TH",
            "use_free_delivery_label": "false"
        }

        try:
            response = self.api_clients["foodpanda"].get("/vendors", params=params)

            vendors = response.get("data", {}).get("items", [])
            return [self._standardize_foodpanda_data(v) for v in vendors]
        except Exception as e:
            self.logger.error(f"Error getting Foodpanda restaurants: {str(e)}")
            return []

    def _get_wongnai_restaurants(self, latitude: float, longitude: float, radius_km: float) -> List[Dict]:
        """Get restaurants from Wongnai."""
        # Convert radius to meters for the API
        radius_m = int(radius_km * 1000)

        params = {
            "lat": latitude,
            "lng": longitude,
            "radius": radius_m,
            "limit": 100
        }

        try:
            response = self.api_clients["wongnai"].get("/restaurants/search", params=params)

            restaurants = response.get("data", [])
            return [self._standardize_wongnai_data(r) for r in restaurants]
        except Exception as e:
            self.logger.error(f"Error getting Wongnai restaurants: {str(e)}")
            return []

    def _get_robinhood_restaurants(self, latitude: float, longitude: float, radius_km: float) -> List[Dict]:
        """Get restaurants from Robinhood."""
        # Convert radius to meters for the API
        radius_m = int(radius_km * 1000)

        params = {
            "lat": latitude,
            "lng": longitude,
            "distance": radius_m,
            "limit": 100
        }

        try:
            response = self.api_clients["robinhood"].get("/restaurants", params=params)

            restaurants = response.get("data", [])
            return [self._standardize_robinhood_data(r) for r in restaurants]
        except Exception as e:
            self.logger.error(f"Error getting Robinhood restaurants: {str(e)}")
            return []

    def _get_google_maps_restaurants(self, latitude: float, longitude: float, radius_km: float) -> List[Dict]:
        """Get restaurants from Google Maps."""
        api_key = self.config.get("api_keys.google_maps")
        if not api_key:
            self.logger.warning("Google Maps API key not provided")
            return []

        # Convert radius to meters for the API
        radius_m = int(radius_km * 1000)

        params = {
            "location": f"{latitude},{longitude}",
            "radius": radius_m,
            "type": "restaurant",
            "key": api_key,
            "rankby": "prominence",
            "language": "en"  # Ensure English results for consistent parsing
        }

        try:
            self.logger.info(f"Fetching restaurants from Google Maps Places API: {latitude}, {longitude}, {radius_km}km")
            response = self.api_clients["google_maps"].get("/place/nearbysearch/json", params=params)
            
            if response.get("status") != "OK":
                self.logger.error(f"Google Maps API error: {response.get('status')}: {response.get('error_message', 'No error message')}")
                return []

            places = response.get("results", [])
            self.logger.info(f"Found {len(places)} restaurants in Google Maps")
            
            # For each place, get additional details to enrich the data
            detailed_places = []
            for place in places[:20]:  # Limit to 20 to avoid too many API calls
                place_id = place.get("place_id")
                if place_id:
                    try:
                        detailed_place = self._get_place_details(place_id)
                        if detailed_place:
                            # Merge the detailed data with the original place data
                            # Let the detailed data take precedence
                            merged_place = {**place, **detailed_place}
                            detailed_places.append(merged_place)
                        else:
                            detailed_places.append(place)
                    except Exception as e:
                        self.logger.warning(f"Error getting details for place {place_id}: {str(e)}")
                        detailed_places.append(place)
                else:
                    detailed_places.append(place)
            
            return [self._standardize_google_maps_data(p) for p in detailed_places]
        except Exception as e:
            self.logger.error(f"Error getting Google Maps restaurants: {str(e)}")
            return []
            
    def _get_place_details(self, place_id: str) -> Dict:
        """Get detailed information about a place from Google Maps."""
        api_key = self.config.get("api_keys.google_maps")
        if not api_key:
            return {}
            
        params = {
            "place_id": place_id,
            "fields": "name,formatted_address,formatted_phone_number,website,opening_hours,price_level,rating,user_ratings_total,reviews,photos,types",
            "key": api_key,
            "language": "en"
        }
        
        try:
            response = self.api_clients["google_maps"].get("/place/details/json", params=params)
            
            if response.get("status") != "OK":
                self.logger.warning(f"Google Maps API error for place details: {response.get('status')}")
                return {}
                
            return response.get("result", {})
        except Exception as e:
            self.logger.warning(f"Error getting place details: {str(e)}")
            return {}

    def _standardize_foodpanda_data(self, data: Dict) -> Dict:
        """
        Standardize Foodpanda restaurant data.

        Args:
            data: Raw Foodpanda restaurant data

        Returns:
            Standardized restaurant data
        """
        try:
            # Extract basic information
            restaurant_id = data.get("id", "")
            name = data.get("name", "")

            # Extract location information
            latitude = data.get("latitude")
            longitude = data.get("longitude")
            address = data.get("address", {}).get("description", "")

            # Extract rating information
            rating = data.get("rating", {}).get("average_rating", 0)
            reviews_count = data.get("rating", {}).get("total_ratings", 0)

            # Extract cuisine information
            cuisines = []
            for cuisine in data.get("cuisines", []):
                cuisines.append(cuisine.get("name", ""))

            # Extract price information
            price_level = 0
            if "characteristics" in data:
                for char in data.get("characteristics", []):
                    if char.get("id") == "price_range":
                        price_level = len(char.get("value", ""))

            # Extract contact information
            phone = data.get("phones", [{}])[0].get("number", "") if data.get("phones") else ""

            # Extract URL
            url = f"https://www.foodpanda.co.th/restaurant/{restaurant_id}"

            return {
                "id": restaurant_id,
                "name": name,
                "latitude": latitude,
                "longitude": longitude,
                "address": address,
                "rating": rating,
                "reviews_count": reviews_count,
                "cuisine_types": cuisines,
                "price_level": price_level,
                "phone": phone,
                "source": "foodpanda",
                "source_url": url
            }
        except Exception as e:
            self.logger.warning(f"Error standardizing Foodpanda data: {str(e)}")
            return {
                "id": data.get("id", ""),
                "name": data.get("name", ""),
                "source": "foodpanda"
            }

    def _standardize_wongnai_data(self, data: Dict) -> Dict:
        """
        Standardize Wongnai restaurant data.

        Args:
            data: Raw Wongnai restaurant data

        Returns:
            Standardized restaurant data
        """
        try:
            # Extract basic information
            restaurant_id = data.get("id", "")
            name = data.get("name", "")

            # Extract location information
            latitude = data.get("latitude")
            longitude = data.get("longitude")
            address = data.get("address", "")

            # Extract rating information
            rating = data.get("rating", {}).get("overall", 0)
            reviews_count = data.get("reviewCount", 0)

            # Extract cuisine information
            cuisines = []
            for cuisine in data.get("cuisines", []):
                cuisines.append(cuisine.get("name", ""))

            # Extract price information
            price_level = data.get("priceRange", 0)

            # Extract contact information
            phone = data.get("phoneNumber", "")

            # Extract URL
            url = f"https://www.wongnai.com/restaurants/{restaurant_id}"

            return {
                "id": restaurant_id,
                "name": name,
                "latitude": latitude,
                "longitude": longitude,
                "address": address,
                "rating": rating,
                "reviews_count": reviews_count,
                "cuisine_types": cuisines,
                "price_level": price_level,
                "phone": phone,
                "source": "wongnai",
                "source_url": url
            }
        except Exception as e:
            self.logger.warning(f"Error standardizing Wongnai data: {str(e)}")
            return {
                "id": data.get("id", ""),
                "name": data.get("name", ""),
                "source": "wongnai"
            }

    def _standardize_robinhood_data(self, data: Dict) -> Dict:
        """
        Standardize Robinhood restaurant data.

        Args:
            data: Raw Robinhood restaurant data

        Returns:
            Standardized restaurant data
        """
        try:
            # Extract basic information
            restaurant_id = data.get("id", "")
            name = data.get("name", "")

            # Extract location information
            latitude = data.get("latitude")
            longitude = data.get("longitude")
            address = data.get("address", "")

            # Extract rating information
            rating = data.get("rating", 0)
            reviews_count = data.get("reviewCount", 0)

            # Extract cuisine information
            cuisines = []
            for cuisine in data.get("cuisines", []):
                cuisines.append(cuisine.get("name", ""))

            # Extract price information
            price_level = data.get("priceRange", 0)

            # Extract contact information
            phone = data.get("phoneNumber", "")

            # Extract URL
            url = f"https://robinhood.in.th/restaurants/{restaurant_id}"

            return {
                "id": restaurant_id,
                "name": name,
                "latitude": latitude,
                "longitude": longitude,
                "address": address,
                "rating": rating,
                "reviews_count": reviews_count,
                "cuisine_types": cuisines,
                "price_level": price_level,
                "phone": phone,
                "source": "robinhood",
                "source_url": url
            }
        except Exception as e:
            self.logger.warning(f"Error standardizing Robinhood data: {str(e)}")
            return {
                "id": data.get("id", ""),
                "name": data.get("name", ""),
                "source": "robinhood"
            }

    def _standardize_google_maps_data(self, data: Dict) -> Dict:
        """
        Standardize Google Maps restaurant data.

        Args:
            data: Raw Google Maps restaurant data

        Returns:
            Standardized restaurant data
        """
        try:
            # Extract basic information
            restaurant_id = data.get("place_id", "")
            name = data.get("name", "")

            # Extract location information
            latitude = data.get("geometry", {}).get("location", {}).get("lat")
            longitude = data.get("geometry", {}).get("location", {}).get("lng")
            
            # Prefer formatted_address if available (from place details)
            address = data.get("formatted_address", data.get("vicinity", ""))

            # Extract rating information
            rating = data.get("rating", 0)
            reviews_count = data.get("user_ratings_total", 0)

            # Extract cuisine information from types and establish a more accurate cuisine list
            types = data.get("types", [])
            
            # Filter out generic types
            excluded_types = ["restaurant", "food", "point_of_interest", "establishment", 
                             "store", "business", "place_of_interest"]
            
            cuisines = []
            for type_name in types:
                if type_name not in excluded_types:
                    # Clean up the type name for better readability
                    cuisine = type_name.replace("_", " ").title()
                    cuisines.append(cuisine)
            
            # Extract price information
            price_level = data.get("price_level", 0)
            
            # Extract contact information (from place details)
            phone = data.get("formatted_phone_number", "")
            website = data.get("website", "")
            
            # Extract opening hours if available
            opening_hours = {}
            if "opening_hours" in data:
                if "weekday_text" in data["opening_hours"]:
                    opening_hours = {
                        "periods": data["opening_hours"].get("periods", []),
                        "weekday_text": data["opening_hours"].get("weekday_text", []),
                        "open_now": data["opening_hours"].get("open_now", False)
                    }
                else:
                    opening_hours = {
                        "open_now": data["opening_hours"].get("open_now", False)
                    }
            
            # Extract photos if available
            photos = []
            if "photos" in data:
                for photo in data["photos"][:5]:  # Limit to first 5 photos
                    photo_ref = photo.get("photo_reference")
                    if photo_ref:
                        photos.append({
                            "reference": photo_ref,
                            "width": photo.get("width"),
                            "height": photo.get("height"),
                            "url": f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_ref}&key=YOUR_API_KEY_PLACEHOLDER"
                        })
            
            # Extract reviews if available
            reviews = []
            if "reviews" in data:
                for review in data["reviews"][:3]:  # Limit to first 3 reviews
                    reviews.append({
                        "author": review.get("author_name", ""),
                        "rating": review.get("rating", 0),
                        "time": review.get("time", 0),
                        "text": review.get("text", "")[:100] + "..." if len(review.get("text", "")) > 100 else review.get("text", "")
                    })
            
            # Extract URL
            url = f"https://www.google.com/maps/place/?q=place_id:{restaurant_id}"

            return {
                "id": restaurant_id,
                "name": name,
                "latitude": latitude,
                "longitude": longitude,
                "address": address,
                "rating": rating,
                "reviews_count": reviews_count,
                "cuisine_types": cuisines,
                "price_level": price_level,
                "phone": phone,
                "website": website,
                "opening_hours": opening_hours,
                "photos": photos,
                "reviews": reviews,
                "source": "google_maps",
                "source_url": url,
                "is_real_data": True  # Flag indicating this is real data, not mock
            }
        except Exception as e:
            self.logger.warning(f"Error standardizing Google Maps data: {str(e)}")
            return {
                "id": data.get("place_id", ""),
                "name": data.get("name", ""),
                "source": "google_maps",
                "is_real_data": True  # Still mark as real data even if incomplete
            }

    def _analyze_data_quality(self, restaurants: List[Dict]) -> Dict[str, Any]:
        """
        Analyze data quality using AIQToolkit.
        
        Args:
            restaurants: List of restaurant data
            
        Returns:
            Data quality metrics
        """
        if not restaurants:
            return {"score": 0, "message": "No restaurant data to analyze"}
            
        # Calculate completeness
        required_fields = ["name", "latitude", "longitude", "address"]
        optional_fields = ["rating", "reviews_count", "cuisine_types", "price_level", "phone"]
        
        total_fields = len(required_fields) + len(optional_fields)
        field_scores = {}
        
        # Count field presence
        for field in required_fields + optional_fields:
            present_count = sum(1 for r in restaurants if field in r and r[field])
            field_scores[field] = present_count / len(restaurants)
        
        # Calculate weighted completeness score
        required_weight = 0.7
        optional_weight = 0.3
        
        required_score = sum(field_scores[f] for f in required_fields) / len(required_fields)
        optional_score = sum(field_scores[f] for f in optional_fields) / len(optional_fields)
        
        completeness_score = required_weight * required_score + optional_weight * optional_score
        
        # Calculate coordinates validity
        if self.config.get("data_quality.validate_coordinates", True):
            valid_coords = sum(1 for r in restaurants 
                              if "latitude" in r and "longitude" in r 
                              and isinstance(r["latitude"], (int, float))
                              and isinstance(r["longitude"], (int, float))
                              and -90 <= r["latitude"] <= 90
                              and -180 <= r["longitude"] <= 180)
            coord_validity = valid_coords / len(restaurants)
        else:
            coord_validity = 1.0
            
        # Calculate name validity
        if self.config.get("data_quality.validate_names", True):
            valid_names = sum(1 for r in restaurants 
                             if "name" in r and r["name"] 
                             and isinstance(r["name"], str)
                             and len(r["name"]) >= 2)
            name_validity = valid_names / len(restaurants)
        else:
            name_validity = 1.0
            
        # Calculate overall quality score
        quality_score = (completeness_score * 0.6) + (coord_validity * 0.2) + (name_validity * 0.2)
        
        return {
            "timestamp": datetime.now().isoformat(),
            "restaurant_count": len(restaurants),
            "completeness_score": round(completeness_score, 3),
            "field_scores": {k: round(v, 3) for k, v in field_scores.items()},
            "coordinate_validity": round(coord_validity, 3),
            "name_validity": round(name_validity, 3),
            "overall_quality": round(quality_score, 3),
            "quality_status": "good" if quality_score >= 0.8 else "fair" if quality_score >= 0.6 else "poor"
        }
