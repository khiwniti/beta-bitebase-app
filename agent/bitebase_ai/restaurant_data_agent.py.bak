#!/usr/bin/env python3
"""
Restaurant Data Agent - A tool for extracting restaurant data from multiple sources
within an adjustable buffer radius.

This agent can extract data from Wongnai, Foodpanda, and Robinhood, handling
anti-bot protections and providing cross-platform restaurant matching.
"""

import os
import json
import math
import time
import logging
import requests
import argparse
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple, Union
from pathlib import Path

# Optional imports - will be imported when needed
try:
    from fuzzywuzzy import fuzz
except ImportError:
    fuzz = None

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("RestaurantDataAgent")

class RestaurantDataAgent:
    """
    Agent for extracting restaurant data from multiple sources within a buffer radius.
    """
    
    def __init__(self, config_path: str = None):
        """
        Initialize the agent with configuration.
        
        Args:
            config_path: Path to configuration file (JSON)
        """
        self.config = {
            "api_keys": {
                "google_maps": os.environ.get("GOOGLE_MAPS_API_KEY", ""),
                "foodpanda": os.environ.get("FOODPANDA_API_KEY", ""),
            },
            "cache_dir": "cache",
            "cache_duration_hours": 24,
            "user_agents": {
                "wongnai": "Wongnai/10.0 Android/10",
                "foodpanda": "FoodpandaPartnerAPI/1.0",
                "robinhood": "Robinhood/2.0 iOS/15.0",
                "default": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        }
        
        # Load config from file if provided
        if config_path and os.path.exists(config_path):
            with open(config_path, 'r') as f:
                user_config = json.load(f)
                self.config.update(user_config)
        
        # Create cache directory if it doesn't exist
        os.makedirs(self.config["cache_dir"], exist_ok=True)
        
        # Check for required dependencies
        if fuzz is None:
            logger.warning("fuzzywuzzy not installed. Restaurant matching will be limited.")
            logger.warning("Install with: pip install fuzzywuzzy python-Levenshtein")
    
    def search_restaurants(self, 
                          latitude: float, 
                          longitude: float, 
                          radius_km: float,
                          platforms: List[str] = None) -> Dict[str, List[Dict]]:
        """
        Search for restaurants within the specified radius across multiple platforms.
        
        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Search radius in kilometers
            platforms: List of platforms to search (default: all available)
            
        Returns:
            Dictionary of restaurant lists by platform
        """
        if platforms is None:
            platforms = ["foodpanda", "wongnai", "robinhood", "google_maps"]
        
        # Check cache first
        cache_key = f"{latitude}_{longitude}_{radius_km}_{'-'.join(sorted(platforms))}"
        cached_data = self._get_cached_data(cache_key)
        if cached_data:
            logger.info(f"Using cached data for {latitude}, {longitude} with radius {radius_km}km")
            return cached_data
        
        # Create bounding box for initial filtering
        bbox = self._create_bounding_box(latitude, longitude, radius_km)
        
        # Initialize results dictionary
        results = {}
        
        # Search on each platform
        for platform in platforms:
            try:
                if platform == "foodpanda":
                    results[platform] = self._get_foodpanda_restaurants(latitude, longitude, radius_km)
                elif platform == "wongnai":
                    results[platform] = self._get_wongnai_restaurants(latitude, longitude, radius_km)
                elif platform == "robinhood":
                    results[platform] = self._get_robinhood_restaurants(latitude, longitude, radius_km)
                elif platform == "google_maps":
                    results[platform] = self._get_google_maps_restaurants(latitude, longitude, radius_km)
                else:
                    logger.warning(f"Unknown platform: {platform}")
                    continue
                
                logger.info(f"Found {len(results[platform])} restaurants on {platform}")
                
                # Filter results by exact radius
                results[platform] = [
                    r for r in results[platform] 
                    if self._is_within_radius(
                        latitude, longitude, 
                        r.get("latitude"), r.get("longitude"), 
                        radius_km
                    )
                ]
                
                logger.info(f"After radius filtering: {len(results[platform])} restaurants on {platform}")
                
            except Exception as e:
                logger.error(f"Error searching {platform}: {str(e)}")
                results[platform] = []
        
        # Cache the results
        self._cache_data(cache_key, results)
        
        return results
    
    def match_restaurants(self, restaurant_lists: Dict[str, List[Dict]]) -> List[Dict]:
        """
        Match restaurants across different platforms.
        
        Args:
            restaurant_lists: Dictionary of lists of restaurants from different platforms
            
        Returns:
            List of matched restaurants with data from all available platforms
        """
        if not fuzz:
            logger.warning("fuzzywuzzy not installed. Using basic matching algorithm.")
            return self._basic_match_restaurants(restaurant_lists)
        
        matched_restaurants = []
        
        # Skip if no data
        if not restaurant_lists or all(len(v) == 0 for v in restaurant_lists.values()):
            return []
        
        # Use the platform with the most restaurants as the base
        base_platform = max(restaurant_lists.items(), key=lambda x: len(x[1]))[0]
        base_restaurants = restaurant_lists[base_platform]
        
        for base_restaurant in base_restaurants:
            matched_restaurant = {
                "base_platform": base_platform,
                "base_data": base_restaurant,
                "matches": {}
            }
            
            # Extract key matching fields
            base_name = base_restaurant.get("name", "").lower()
            base_address = base_restaurant.get("address", "").lower()
            base_lat = base_restaurant.get("latitude")
            base_lon = base_restaurant.get("longitude")
            
            # Try to match with restaurants from other platforms
            for platform, restaurants in restaurant_lists.items():
                if platform == base_platform:
                    continue
                    
                best_match = None
                best_score = 0
                
                for restaurant in restaurants:
                    # Calculate name similarity
                    name = restaurant.get("name", "").lower()
                    name_similarity = fuzz.ratio(base_name, name) / 100.0
                    
                    # Calculate address similarity
                    address = restaurant.get("address", "").lower()
                    address_similarity = fuzz.ratio(base_address, address) / 100.0
                    
                    # Calculate location proximity (if coordinates available)
                    location_similarity = 0
                    if base_lat and base_lon and restaurant.get("latitude") and restaurant.get("longitude"):
                        distance = self._haversine_distance(
                            base_lat, base_lon, 
                            restaurant.get("latitude"), restaurant.get("longitude")
                        )
                        # Convert distance to similarity score (closer = higher score)
                        # 100m or less = 1.0, 1km = 0.5, 2km or more = 0.0
                        location_similarity = max(0, 1 - (distance / 2.0))
                    
                    # Calculate overall match score with weights
                    score = (
                        0.5 * name_similarity + 
                        0.3 * address_similarity + 
                        0.2 * location_similarity
                    )
                    
                    # Update best match if this is better
                    if score > best_score and score > 0.7:  # Threshold for considering a match
                        best_match = restaurant
                        best_score = score
                
                if best_match:
                    matched_restaurant["matches"][platform] = {
                        "data": best_match,
                        "confidence": best_score
                    }
            
            matched_restaurants.append(matched_restaurant)
        
        return matched_restaurants
    
    def _basic_match_restaurants(self, restaurant_lists: Dict[str, List[Dict]]) -> List[Dict]:
        """
        Basic matching algorithm when fuzzywuzzy is not available.
        
        Args:
            restaurant_lists: Dictionary of lists of restaurants from different platforms
            
        Returns:
            List of matched restaurants
        """
        matched_restaurants = []
        
        # Skip if no data
        if not restaurant_lists or all(len(v) == 0 for v in restaurant_lists.values()):
            return []
        
        # Use the platform with the most restaurants as the base
        base_platform = max(restaurant_lists.items(), key=lambda x: len(x[1]))[0]
        base_restaurants = restaurant_lists[base_platform]
        
        for base_restaurant in base_restaurants:
            matched_restaurant = {
                "base_platform": base_platform,
                "base_data": base_restaurant,
                "matches": {}
            }
            
            # Extract key matching fields
            base_name = base_restaurant.get("name", "").lower()
            base_lat = base_restaurant.get("latitude")
            base_lon = base_restaurant.get("longitude")
            
            # Try to match with restaurants from other platforms
            for platform, restaurants in restaurant_lists.items():
                if platform == base_platform:
                    continue
                
                for restaurant in restaurants:
                    name = restaurant.get("name", "").lower()
                    lat = restaurant.get("latitude")
                    lon = restaurant.get("longitude")
                    
                    # Simple name matching (at least 80% of words match)
                    base_words = set(base_name.split())
                    rest_words = set(name.split())
                    
                    if not base_words or not rest_words:
                        continue
                    
                    common_words = base_words.intersection(rest_words)
                    name_match = len(common_words) / max(len(base_words), len(rest_words)) >= 0.8
                    
                    # Location match if available (within 200m)
                    location_match = False
                    if base_lat and base_lon and lat and lon:
                        distance = self._haversine_distance(base_lat, base_lon, lat, lon)
                        location_match = distance <= 0.2  # 200m
                    
                    # Consider it a match if name matches or location is very close
                    if name_match or location_match:
                        matched_restaurant["matches"][platform] = {
                            "data": restaurant,
                            "confidence": 0.8 if name_match and location_match else 0.6
                        }
                        break
            
            matched_restaurants.append(matched_restaurant)
        
        return matched_restaurants
    
    def _get_foodpanda_restaurants(self, latitude: float, longitude: float, radius_km: float) -> List[Dict]:
        """
        Get restaurants from Foodpanda within the specified radius.
        
        Args:
            latitude, longitude: Center coordinates
            radius_km: Search radius in kilometers
            
        Returns:
            List of restaurant data
        """
        api_key = self.config["api_keys"].get("foodpanda")
        if not api_key:
            logger.warning("Foodpanda API key not provided")
            return self._get_foodpanda_restaurants_mobile(latitude, longitude, radius_km)
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": self.config["user_agents"]["foodpanda"]
        }
        
        # Convert radius to meters for the API
        radius_m = int(radius_km * 1000)
        
        url = "https://th.fd-api.com/api/v5/vendors"
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "radius": radius_m
        }
        
        try:
            response = requests.get(url, headers=headers, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json().get("data", [])
                
                # Standardize the data format
                return [self._standardize_restaurant_data(r, "foodpanda") for r in data]
            else:
                logger.error(f"Foodpanda API error: {response.status_code}")
                # Fall back to mobile API
                return self._get_foodpanda_restaurants_mobile(latitude, longitude, radius_km)
        except Exception as e:
            logger.error(f"Error accessing Foodpanda API: {str(e)}")
            # Fall back to mobile API
            return self._get_foodpanda_restaurants_mobile(latitude, longitude, radius_km)
    
    def _get_foodpanda_restaurants_mobile(self, latitude: float, longitude: float, radius_km: float) -> List[Dict]:
        """
        Get restaurants from Foodpanda mobile API within the specified radius.
        
        Args:
            latitude, longitude: Center coordinates
            radius_km: Search radius in kilometers
            
        Returns:
            List of restaurant data
        """
        headers = {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.9,th;q=0.8",
            "X-FP-API-KEY": "volo"  # This may need to be updated
        }
        
        # Convert radius to meters for the API
        radius_m = int(radius_km * 1000)
        
        url = "https://th.fd-api.com/api/v5/vendors"
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
            response = requests.get(url, headers=headers, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                vendors = data.get("data", {}).get("items", [])
                
                # Standardize the data format
                return [self._standardize_restaurant_data(v, "foodpanda") for v in vendors]
            else:
                logger.error(f"Foodpanda mobile API error: {response.status_code}")
                return []
        except Exception as e:
            logger.error(f"Error accessing Foodpanda mobile API: {str(e)}")
            return []
    
    def _get_wongnai_restaurants(self, latitude: float, longitude: float, radius_km: float) -> List[Dict]:
        """
        Get restaurants from Wongnai within the specified radius.
        
        Args:
            latitude, longitude: Center coordinates
            radius_km: Search radius in kilometers
            
        Returns:
            List of restaurant data
        """
        headers = {
            "User-Agent": self.config["user_agents"]["wongnai"],
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.9,th;q=0.8"
        }
        
        # Convert radius to meters for the API
        radius_m = int(radius_km * 1000)
        
        url = "https://api.wongnai.com/restaurants/search"
        params = {
            "lat": latitude,
            "lng": longitude,
            "radius": radius_m,
            "limit": 100
        }
        
        try:
            response = requests.get(url, headers=headers, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json().get("data", [])
                
                # Standardize the data format
                return [self._standardize_restaurant_data(r, "wongnai") for r in data]
            else:
                logger.error(f"Wongnai API error: {response.status_code}")
                return []
        except Exception as e:
            logger.error(f"Error accessing Wongnai API: {str(e)}")
            return []
    
    def _get_robinhood_restaurants(self, latitude: float, longitude: float, radius_km: float) -> List[Dict]:
        """
        Get restaurants from Robinhood within the specified radius.
        
        Args:
            latitude, longitude: Center coordinates
            radius_km: Search radius in kilometers
            
        Returns:
            List of restaurant data
        """
        headers = {
            "User-Agent": self.config["user_agents"]["robinhood"],
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.9,th;q=0.8"
        }
        
        # Convert radius to meters for the API
        radius_m = int(radius_km * 1000)
        
        url = "https://api.robinhood.in.th/restaurants"
        params = {
            "lat": latitude,
            "lng": longitude,
            "distance": radius_m,
            "limit": 100
        }
        
        try:
            response = requests.get(url, headers=headers, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json().get("data", [])
                
                # Standardize the data format
                return [self._standardize_restaurant_data(r, "robinhood") for r in data]
            else:
                logger.error(f"Robinhood API error: {response.status_code}")
                return []
        except Exception as e:
            logger.error(f"Error accessing Robinhood API: {str(e)}")
            return []
    
    def _get_google_maps_restaurants(self, latitude: float, longitude: float, radius_km: float) -> List[Dict]:
        """
        Get restaurants from Google Maps API within the specified radius.
        
        Args:
            latitude, longitude: Center coordinates
            radius_km: Search radius in kilometers
            
        Returns:
            List of restaurant data
        """
        api_key = self.config["api_keys"].get("google_maps")
        if not api_key:
            logger.warning("Google Maps API key not provided")
            return []
        
        # Convert radius to meters for the API
        radius_m = int(radius_km * 1000)
        
        url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        params = {
            "location": f"{latitude},{longitude}",
            "radius": radius_m,
            "type": "restaurant",
            "key": api_key
        }
        
        restaurants = []
        next_page_token = None
        
        try:
            # Handle pagination
            while True:
                if next_page_token:
                    params["pagetoken"] = next_page_token
                    
                response = requests.get(url, params=params, timeout=10)
                
                if response.status_code == 200:
                    result = response.json()
                    places = result.get("results", [])
                    
                    # Standardize and add to results
                    for place in places:
                        restaurants.append(self._standardize_restaurant_data(place, "google_maps"))
                    
                    next_page_token = result.get("next_page_token")
                    if not next_page_token:
                        break
                        
                    # Google requires a delay between page token requests
                    time.sleep(2)
                else:
                    logger.error(f"Google Maps API error: {response.status_code}")
                    break
                    
            return restaurants
        except Exception as e:
            logger.error(f"Error accessing Google Maps API: {str(e)}")
            return []
    
    def _standardize_restaurant_data(self, data: Dict, source: str) -> Dict:
        """
        Standardize restaurant data from different sources into a common format.
        
        Args:
            data: Raw restaurant data
            source: Source platform name
            
        Returns:
            Standardized restaurant data
        """
        if source == "foodpanda":
            return {
                "id": data.get("id", ""),
                "name": data.get("name", ""),
                "address": data.get("address", {}).get("street", ""),
                "latitude": float(data.get("latitude", 0)),
                "longitude": float(data.get("longitude", 0)),
                "rating": float(data.get("rating", {}).get("average_rating", 0)),
                "reviews_count": int(data.get("rating", {}).get("total_ratings", 0)),
                "price_level": len(data.get("price_range", "")),
                "cuisine_types": [c.get("name", "") for c in data.get("cuisines", [])],
                "phone": data.get("phone", ""),
                "website": "",
                "opening_hours": data.get("opening_hours", {}),
                "source": "foodpanda",
                "source_url": f"https://www.foodpanda.co.th/restaurant/{data.get('id', '')}",
                "raw_data": data
            }
        elif source == "wongnai":
            return {
                "id": data.get("id", ""),
                "name": data.get("name", ""),
                "address": data.get("address", {}).get("full", ""),
                "latitude": float(data.get("location", {}).get("latitude", 0)),
                "longitude": float(data.get("location", {}).get("longitude", 0)),
                "rating": float(data.get("rating", {}).get("average", 0)),
                "reviews_count": int(data.get("rating", {}).get("count", 0)),
                "price_level": len(data.get("priceRange", "")),
                "cuisine_types": [c.get("name", "") for c in data.get("cuisines", [])],
                "phone": data.get("phone", ""),
                "website": data.get("website", ""),
                "opening_hours": data.get("openingHours", {}),
                "source": "wongnai",
                "source_url": f"https://www.wongnai.com/restaurants/{data.get('id', '')}",
                "raw_data": data
            }
        elif source == "robinhood":
            return {
                "id": data.get("id", ""),
                "name": data.get("name", ""),
                "address": data.get("address", ""),
                "latitude": float(data.get("latitude", 0)),
                "longitude": float(data.get("longitude", 0)),
                "rating": float(data.get("rating", 0)),
                "reviews_count": int(data.get("reviewCount", 0)),
                "price_level": data.get("priceLevel", 1),
                "cuisine_types": data.get("cuisines", []),
                "phone": data.get("phone", ""),
                "website": "",
                "opening_hours": data.get("openingHours", {}),
                "source": "robinhood",
                "source_url": f"https://robinhood.in.th/restaurants/{data.get('id', '')}",
                "raw_data": data
            }
        elif source == "google_maps":
            return {
                "id": data.get("place_id", ""),
                "name": data.get("name", ""),
                "address": data.get("vicinity", ""),
                "latitude": data.get("geometry", {}).get("location", {}).get("lat", 0),
                "longitude": data.get("geometry", {}).get("location", {}).get("lng", 0),
                "rating": float(data.get("rating", 0)),
                "reviews_count": int(data.get("user_ratings_total", 0)),
                "price_level": int(data.get("price_level", 0)),
                "cuisine_types": data.get("types", []),
                "phone": "",
                "website": "",
                "opening_hours": {"open_now": data.get("opening_hours", {}).get("open_now", False)},
                "source": "google_maps",
                "source_url": f"https://www.google.com/maps/place/?q=place_id:{data.get('place_id', '')}",
                "raw_data": data
            }
        else:
            return {
                "id": str(data.get("id", "")),
                "name": str(data.get("name", "")),
                "address": str(data.get("address", "")),
                "latitude": float(data.get("latitude", 0)),
                "longitude": float(data.get("longitude", 0)),
                "rating": float(data.get("rating", 0)),
                "reviews_count": int(data.get("reviews_count", 0)),
                "price_level": int(data.get("price_level", 0)),
                "cuisine_types": data.get("cuisine_types", []),
                "phone": str(data.get("phone", "")),
                "website": str(data.get("website", "")),
                "opening_hours": data.get("opening_hours", {}),
                "source": source,
                "source_url": str(data.get("source_url", "")),
                "raw_data": data
            }
    
    def _create_bounding_box(self, latitude: float, longitude: float, radius_km: float) -> Dict[str, float]:
        """
        Create a bounding box around a point for initial geographic filtering.
        
        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Radius in kilometers
            
        Returns:
            Dictionary with min/max latitude and longitude values
        """
        # Earth's radius in kilometers
        earth_radius = 6371.0
        
        # Angular distance in radians
        angular_distance = radius_km / earth_radius
        
        # Calculate min/max latitudes and longitudes
        min_lat = latitude - math.degrees(angular_distance)
        max_lat = latitude + math.degrees(angular_distance)
        
        # Adjust for longitude based on latitude
        delta_lon = math.asin(math.sin(angular_distance) / math.cos(math.radians(latitude)))
        min_lon = longitude - math.degrees(delta_lon)
        max_lon = longitude + math.degrees(delta_lon)
        
        return {
            "min_lat": min_lat,
            "max_lat": max_lat,
            "min_lon": min_lon,
            "max_lon": max_lon
        }
    
    def _is_within_radius(self, lat1: float, lon1: float, lat2: float, lon2: float, radius_km: float) -> bool:
        """
        Check if a point is within the specified radius of another point.
        
        Args:
            lat1, lon1: Coordinates of the center point
            lat2, lon2: Coordinates of the point to check
            radius_km: Radius in kilometers
            
        Returns:
            Boolean indicating if the point is within the radius
        """
        # Handle None values
        if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
            return False
        
        distance = self._haversine_distance(lat1, lon1, lat2, lon2)
        return distance <= radius_km
    
    def _haversine_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculate the Haversine distance between two points.
        
        Args:
            lat1, lon1: Coordinates of the first point
            lat2, lon2: Coordinates of the second point
            
        Returns:
            Distance in kilometers
        """
        # Earth's radius in kilometers
        earth_radius = 6371.0
        
        # Convert latitude and longitude from degrees to radians
        lat1_rad = math.radians(lat1)
        lon1_rad = math.radians(lon1)
        lat2_rad = math.radians(lat2)
        lon2_rad = math.radians(lon2)
        
        # Haversine formula
        dlon = lon2_rad - lon1_rad
        dlat = lat2_rad - lat1_rad
        a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        distance = earth_radius * c
        
        return distance
    
    def _cache_data(self, cache_key: str, data: Any) -> None:
        """
        Cache data to disk.
        
        Args:
            cache_key: Unique identifier for the cached data
            data: Data to cache
        """
        cache_path = os.path.join(self.config["cache_dir"], f"{cache_key}.json")
        
        cache_data = {
            "data": data,
            "timestamp": datetime.now().isoformat(),
            "expiry": (datetime.now() + timedelta(hours=self.config["cache_duration_hours"])).isoformat()
        }
        
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(cache_data, f, ensure_ascii=False, indent=2)
    
    def _get_cached_data(self, cache_key: str) -> Optional[Any]:
        """
        Get cached data if available and not expired.
        
        Args:
            cache_key: Unique identifier for the cached data
            
        Returns:
            Cached data or None if not available or expired
        """
        cache_path = os.path.join(self.config["cache_dir"], f"{cache_key}.json")
        
        if not os.path.exists(cache_path):
            return None
        
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                cache_data = json.load(f)
            
            expiry = datetime.fromisoformat(cache_data["expiry"])
            
            if datetime.now() > expiry:
                logger.info(f"Cache expired for {cache_key}")
                return None
            
            return cache_data["data"]
        except Exception as e:
            logger.error(f"Error reading cache: {str(e)}")
            return None

def main():
    """
    Main function for command-line usage.
    """
    parser = argparse.ArgumentParser(description="Restaurant Data Agent")
    parser.add_argument("--latitude", type=float, required=True, help="Center point latitude")
    parser.add_argument("--longitude", type=float, required=True, help="Center point longitude")
    parser.add_argument("--radius", type=float, required=True, help="Search radius in kilometers")
    parser.add_argument("--platforms", type=str, default="all", help="Comma-separated list of platforms to search (foodpanda,wongnai,robinhood,google_maps)")
    parser.add_argument("--config", type=str, help="Path to configuration file")
    parser.add_argument("--output", type=str, help="Path to output file (JSON)")
    parser.add_argument("--match", action="store_true", help="Match restaurants across platforms")
    
    args = parser.parse_args()
    
    # Initialize agent
    agent = RestaurantDataAgent(config_path=args.config)
    
    # Determine platforms to search
    platforms = None
    if args.platforms.lower() != "all":
        platforms = [p.strip() for p in args.platforms.split(",")]
    
    # Search for restaurants
    results = agent.search_restaurants(
        latitude=args.latitude,
        longitude=args.longitude,
        radius_km=args.radius,
        platforms=platforms
    )
    
    # Match restaurants if requested
    if args.match:
        matched_results = agent.match_restaurants(results)
        output_data = {
            "matched_restaurants": matched_results,
            "raw_results": results
        }
    else:
        output_data = results
    
    # Output results
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)
        print(f"Results saved to {args.output}")
    else:
        print(json.dumps(output_data, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
