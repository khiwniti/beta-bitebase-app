#!/usr/bin/env python3
"""
Restaurant Matcher - A tool for matching restaurants across different platforms
using fuzzy matching and location-based algorithms.
"""

import os
import json
import math
import logging
import argparse
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta

# Import fuzzy matching libraries
try:
    from fuzzywuzzy import fuzz
    from fuzzywuzzy import process
except ImportError:
    print("fuzzywuzzy not installed. Installing...")
    import subprocess
    subprocess.check_call(["pip", "install", "fuzzywuzzy", "python-Levenshtein"])
    from fuzzywuzzy import fuzz
    from fuzzywuzzy import process

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("RestaurantMatcher")

class RestaurantMatcher:
    """
    Tool for matching restaurants across different platforms.
    """
    
    def __init__(self, config_path: str = None):
        """
        Initialize the matcher with configuration.
        
        Args:
            config_path: Path to configuration file (JSON)
        """
        self.config = {
            "cache_dir": "cache",
            "cache_duration_hours": 24,
            "match_thresholds": {
                "name": 80,  # Minimum name similarity score (0-100)
                "address": 60,  # Minimum address similarity score (0-100)
                "location": 0.5,  # Maximum distance in km for location matching
                "overall": 0.7  # Minimum overall match confidence (0-1)
            },
            "match_weights": {
                "name": 0.5,  # Weight for name similarity
                "address": 0.3,  # Weight for address similarity
                "location": 0.2  # Weight for location proximity
            }
        }
        
        # Load config from file if provided
        if config_path and os.path.exists(config_path):
            with open(config_path, 'r') as f:
                user_config = json.load(f)
                self.config.update(user_config)
        
        # Create cache directory if it doesn't exist
        os.makedirs(self.config["cache_dir"], exist_ok=True)
    
    def match_restaurants(self, restaurant_lists: Dict[str, List[Dict]]) -> List[Dict]:
        """
        Match restaurants across different platforms.
        
        Args:
            restaurant_lists: Dictionary of lists of restaurants from different platforms
            
        Returns:
            List of matched restaurants with data from all available platforms
        """
        matched_restaurants = []
        
        # Skip if no data
        if not restaurant_lists or all(len(v) == 0 for v in restaurant_lists.values()):
            return []
        
        # Use the platform with the most restaurants as the base
        base_platform = max(restaurant_lists.items(), key=lambda x: len(x[1]))[0]
        base_restaurants = restaurant_lists[base_platform]
        
        logger.info(f"Using {base_platform} as base platform with {len(base_restaurants)} restaurants")
        
        # Process each base restaurant
        for base_restaurant in base_restaurants:
            matched_restaurant = {
                "base_platform": base_platform,
                "base_data": base_restaurant,
                "matches": {}
            }
            
            # Extract key matching fields
            base_name = self._normalize_name(base_restaurant.get("name", ""))
            base_address = self._normalize_address(base_restaurant.get("address", ""))
            base_lat = base_restaurant.get("latitude")
            base_lon = base_restaurant.get("longitude")
            
            # Try to match with restaurants from other platforms
            for platform, restaurants in restaurant_lists.items():
                if platform == base_platform:
                    continue
                    
                best_match = None
                best_score = 0
                
                for restaurant in restaurants:
                    # Calculate match score
                    match_score, match_details = self._calculate_match_score(
                        base_restaurant=base_restaurant,
                        candidate_restaurant=restaurant
                    )
                    
                    # Update best match if this is better
                    if match_score > best_score and match_score >= self.config["match_thresholds"]["overall"]:
                        best_match = {
                            "data": restaurant,
                            "confidence": match_score,
                            "match_details": match_details
                        }
                        best_score = match_score
                
                if best_match:
                    matched_restaurant["matches"][platform] = best_match
            
            # Only include restaurants with at least one match
            if matched_restaurant["matches"]:
                matched_restaurants.append(matched_restaurant)
        
        logger.info(f"Found {len(matched_restaurants)} matched restaurants across platforms")
        return matched_restaurants
    
    def _calculate_match_score(self, base_restaurant: Dict, candidate_restaurant: Dict) -> Tuple[float, Dict]:
        """
        Calculate match score between two restaurants.
        
        Args:
            base_restaurant: Restaurant from base platform
            candidate_restaurant: Restaurant from another platform
            
        Returns:
            Tuple of (overall_score, match_details)
        """
        # Extract and normalize fields
        base_name = self._normalize_name(base_restaurant.get("name", ""))
        candidate_name = self._normalize_name(candidate_restaurant.get("name", ""))
        
        base_address = self._normalize_address(base_restaurant.get("address", ""))
        candidate_address = self._normalize_address(candidate_restaurant.get("address", ""))
        
        base_lat = base_restaurant.get("latitude")
        base_lon = base_restaurant.get("longitude")
        candidate_lat = candidate_restaurant.get("latitude")
        candidate_lon = candidate_restaurant.get("longitude")
        
        # Calculate name similarity
        name_similarity = fuzz.ratio(base_name, candidate_name) / 100.0
        
        # Calculate address similarity
        address_similarity = fuzz.ratio(base_address, candidate_address) / 100.0
        
        # Calculate location proximity (if coordinates available)
        location_similarity = 0
        distance_km = None
        if all(x is not None for x in [base_lat, base_lon, candidate_lat, candidate_lon]):
            distance_km = self._haversine_distance(
                base_lat, base_lon, 
                candidate_lat, candidate_lon
            )
            # Convert distance to similarity score (closer = higher score)
            # 100m or less = 1.0, threshold km = 0.0
            location_threshold = self.config["match_thresholds"]["location"]
            location_similarity = max(0, 1 - (distance_km / location_threshold))
        
        # Calculate overall match score with weights
        weights = self.config["match_weights"]
        overall_score = (
            weights["name"] * name_similarity + 
            weights["address"] * address_similarity + 
            weights["location"] * location_similarity
        )
        
        # Normalize to ensure score is between 0 and 1
        total_weight = sum(weights.values())
        if total_weight > 0:
            overall_score /= total_weight
        
        # Prepare match details
        match_details = {
            "name_similarity": name_similarity,
            "address_similarity": address_similarity,
            "location_similarity": location_similarity,
            "distance_km": distance_km
        }
        
        return overall_score, match_details
    
    def _normalize_name(self, name: str) -> str:
        """
        Normalize restaurant name for better matching.
        
        Args:
            name: Original restaurant name
            
        Returns:
            Normalized name
        """
        if not name:
            return ""
        
        # Convert to lowercase
        normalized = name.lower()
        
        # Remove common prefixes/suffixes
        prefixes_suffixes = [
            "restaurant", "cafe", "coffee", "bistro", "eatery", "kitchen",
            "grill", "bar", "pub", "diner", "bakery", "pizzeria", "sushi",
            "the", "thai", "bangkok", "official", "branch"
        ]
        
        for term in prefixes_suffixes:
            normalized = normalized.replace(f"{term} ", "")
            normalized = normalized.replace(f" {term}", "")
        
        # Remove punctuation
        import string
        normalized = normalized.translate(str.maketrans("", "", string.punctuation))
        
        # Remove extra whitespace
        normalized = " ".join(normalized.split())
        
        return normalized
    
    def _normalize_address(self, address: str) -> str:
        """
        Normalize address for better matching.
        
        Args:
            address: Original address
            
        Returns:
            Normalized address
        """
        if not address:
            return ""
        
        # Convert to lowercase
        normalized = address.lower()
        
        # Remove common address terms
        address_terms = [
            "road", "street", "avenue", "lane", "boulevard", "drive", "way",
            "rd", "st", "ave", "ln", "blvd", "dr", "building", "floor", "unit",
            "suite", "room", "no.", "number", "#", "bangkok", "thailand"
        ]
        
        for term in address_terms:
            normalized = normalized.replace(f"{term} ", " ")
            normalized = normalized.replace(f" {term}", " ")
        
        # Remove punctuation
        import string
        normalized = normalized.translate(str.maketrans("", "", string.punctuation))
        
        # Remove extra whitespace
        normalized = " ".join(normalized.split())
        
        return normalized
    
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
    parser = argparse.ArgumentParser(description="Restaurant Matcher")
    parser.add_argument("--input", type=str, required=True, help="Path to input file with restaurant data (JSON)")
    parser.add_argument("--output", type=str, help="Path to output file (JSON)")
    parser.add_argument("--config", type=str, help="Path to configuration file")
    
    args = parser.parse_args()
    
    # Initialize matcher
    matcher = RestaurantMatcher(config_path=args.config)
    
    try:
        # Load input data
        with open(args.input, "r", encoding="utf-8") as f:
            restaurant_lists = json.load(f)
        
        # Match restaurants
        matched_restaurants = matcher.match_restaurants(restaurant_lists)
        
        # Output results
        output_data = {
            "matched_restaurants": matched_restaurants,
            "raw_data": restaurant_lists
        }
        
        if args.output:
            with open(args.output, "w", encoding="utf-8") as f:
                json.dump(output_data, f, ensure_ascii=False, indent=2)
            print(f"Results saved to {args.output}")
        else:
            print(json.dumps(output_data, ensure_ascii=False, indent=2))
    
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise

if __name__ == "__main__":
    main()
