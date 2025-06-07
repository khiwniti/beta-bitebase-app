"""
Data Processor - Tools for processing and analyzing restaurant data.

This module provides utilities for data cleaning, normalization, 
matching, and analysis of restaurant data from multiple sources.
"""

import re
import math
import logging
import numpy as np
from typing import Dict, List, Any, Optional, Union, Tuple
from datetime import datetime

logger = logging.getLogger("DataProcessor")

try:
    from fuzzywuzzy import fuzz
    from fuzzywuzzy import process as fuzz_process
    FUZZY_MATCHING_AVAILABLE = True
except ImportError:
    logger.warning("fuzzywuzzy not installed. Advanced matching will be limited.")
    logger.warning("Install with: pip install fuzzywuzzy python-Levenshtein")
    FUZZY_MATCHING_AVAILABLE = False

try:
    import pandas as pd
    PANDAS_AVAILABLE = True
except ImportError:
    logger.warning("pandas not installed. Advanced data analysis will be limited.")
    logger.warning("Install with: pip install pandas")
    PANDAS_AVAILABLE = False


class RestaurantDataCleaner:
    """Tools for cleaning and normalizing restaurant data."""
    
    @staticmethod
    def clean_name(name: str) -> str:
        """
        Clean and normalize a restaurant name.
        
        Args:
            name: Restaurant name
            
        Returns:
            Cleaned name
        """
        if not name:
            return ""
        
        # Convert to lowercase
        name = name.lower()
        
        # Remove common suffixes
        suffixes = [
            "restaurant", "cafe", "coffee", "bistro", "kitchen", 
            "grill", "bar", "pub", "eatery", "diner", "pizzeria"
        ]
        for suffix in suffixes:
            name = re.sub(rf"\s+{suffix}(\s+|$)", " ", name)
        
        # Remove special characters
        name = re.sub(r"[^\w\s]", "", name)
        
        # Remove extra whitespace
        name = re.sub(r"\s+", " ", name).strip()
        
        return name
    
    @staticmethod
    def clean_address(address: str) -> str:
        """
        Clean and normalize an address.
        
        Args:
            address: Restaurant address
            
        Returns:
            Cleaned address
        """
        if not address:
            return ""
        
        # Convert to lowercase
        address = address.lower()
        
        # Standardize common abbreviations
        address = re.sub(r"\bst\b", "street", address)
        address = re.sub(r"\brd\b", "road", address)
        address = re.sub(r"\bave\b", "avenue", address)
        address = re.sub(r"\bblvd\b", "boulevard", address)
        
        # Remove apartment/unit numbers
        address = re.sub(r"#\s*\d+", "", address)
        address = re.sub(r"apt\s*\d+", "", address)
        address = re.sub(r"unit\s*\d+", "", address)
        
        # Remove extra whitespace
        address = re.sub(r"\s+", " ", address).strip()
        
        return address
    
    @staticmethod
    def normalize_cuisine_types(cuisine_types: List[str]) -> List[str]:
        """
        Normalize cuisine types.
        
        Args:
            cuisine_types: List of cuisine types
            
        Returns:
            Normalized list of cuisine types
        """
        if not cuisine_types:
            return []
        
        # Mapping of common variations to standard names
        cuisine_mapping = {
            "thai": "thai",
            "italian": "italian",
            "pizza": "italian",
            "pasta": "italian",
            "japanese": "japanese",
            "sushi": "japanese",
            "chinese": "chinese",
            "dimsum": "chinese",
            "american": "american",
            "burger": "american",
            "indian": "indian",
            "mexican": "mexican",
            "taco": "mexican",
            "korean": "korean",
            "vietnamese": "vietnamese",
            "pho": "vietnamese",
            "french": "french",
            "seafood": "seafood",
            "steak": "steakhouse",
            "steakhouse": "steakhouse",
            "vegetarian": "vegetarian",
            "vegan": "vegetarian",
            "dessert": "dessert",
            "bakery": "bakery",
            "cafe": "cafe",
            "coffee": "cafe",
            "breakfast": "breakfast",
            "brunch": "breakfast",
            "fast food": "fast food",
            "street food": "street food",
            "fusion": "fusion"
        }
        
        normalized = []
        for cuisine in cuisine_types:
            cuisine = cuisine.lower().strip()
            if cuisine in cuisine_mapping:
                normalized.append(cuisine_mapping[cuisine])
            else:
                normalized.append(cuisine)
        
        # Remove duplicates while preserving order
        seen = set()
        return [x for x in normalized if not (x in seen or seen.add(x))]
    
    @staticmethod
    def extract_price_level(price_info: Any) -> int:
        """
        Extract a standardized price level (1-4) from various price information.
        
        Args:
            price_info: Price information (string, number, or dict)
            
        Returns:
            Price level from 1 (inexpensive) to 4 (very expensive)
        """
        if not price_info:
            return 0
        
        # If it's already a number between 1-4, return it
        if isinstance(price_info, (int, float)) and 1 <= price_info <= 4:
            return int(price_info)
        
        # If it's a string of $ symbols, count them
        if isinstance(price_info, str) and all(c == '$' for c in price_info.strip()):
            return len(price_info.strip())
        
        # If it's a string with a price range
        if isinstance(price_info, str):
            # Try to extract a price range like "฿100-200" or "$10-20"
            match = re.search(r'[฿$](\d+)\s*-\s*[฿$]?(\d+)', price_info)
            if match:
                min_price = int(match.group(1))
                max_price = int(match.group(2))
                avg_price = (min_price + max_price) / 2
                
                # Convert to price level based on average price
                # This is a simplified approach and might need adjustment
                if avg_price < 100:
                    return 1
                elif avg_price < 300:
                    return 2
                elif avg_price < 600:
                    return 3
                else:
                    return 4
        
        # Default to middle price level if we can't determine
        return 2


class RestaurantMatcher:
    """Tools for matching restaurants across different platforms."""
    
    def __init__(self):
        """Initialize the matcher."""
        self.cleaner = RestaurantDataCleaner()
    
    def match_restaurants(self, 
                         restaurant_lists: Dict[str, List[Dict]], 
                         threshold: float = 0.7) -> List[Dict]:
        """
        Match restaurants across different platforms.
        
        Args:
            restaurant_lists: Dictionary of lists of restaurants from different platforms
            threshold: Minimum similarity score to consider a match
            
        Returns:
            List of matched restaurants with data from all available platforms
        """
        if FUZZY_MATCHING_AVAILABLE:
            return self._fuzzy_match_restaurants(restaurant_lists, threshold)
        else:
            return self._basic_match_restaurants(restaurant_lists, threshold)
    
    def _fuzzy_match_restaurants(self, 
                               restaurant_lists: Dict[str, List[Dict]], 
                               threshold: float = 0.7) -> List[Dict]:
        """
        Match restaurants using fuzzy string matching.
        
        Args:
            restaurant_lists: Dictionary of lists of restaurants from different platforms
            threshold: Minimum similarity score to consider a match
            
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
            base_name = self.cleaner.clean_name(base_restaurant.get("name", ""))
            base_address = self.cleaner.clean_address(base_restaurant.get("address", ""))
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
                    name = self.cleaner.clean_name(restaurant.get("name", ""))
                    name_similarity = fuzz.ratio(base_name, name) / 100.0
                    
                    # Calculate address similarity
                    address = self.cleaner.clean_address(restaurant.get("address", ""))
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
                    if score > best_score and score > threshold:
                        best_match = restaurant
                        best_score = score
                
                if best_match:
                    matched_restaurant["matches"][platform] = {
                        "data": best_match,
                        "confidence": best_score
                    }
            
            matched_restaurants.append(matched_restaurant)
        
        return matched_restaurants
    
    def _basic_match_restaurants(self, 
                               restaurant_lists: Dict[str, List[Dict]], 
                               threshold: float = 0.7) -> List[Dict]:
        """
        Basic matching algorithm when fuzzywuzzy is not available.
        
        Args:
            restaurant_lists: Dictionary of lists of restaurants from different platforms
            threshold: Minimum similarity score to consider a match
            
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
            base_name = self.cleaner.clean_name(base_restaurant.get("name", ""))
            base_lat = base_restaurant.get("latitude")
            base_lon = base_restaurant.get("longitude")
            
            # Try to match with restaurants from other platforms
            for platform, restaurants in restaurant_lists.items():
                if platform == base_platform:
                    continue
                
                for restaurant in restaurants:
                    name = self.cleaner.clean_name(restaurant.get("name", ""))
                    lat = restaurant.get("latitude")
                    lon = restaurant.get("longitude")
                    
                    # Simple name matching (at least 80% of words match)
                    base_words = set(base_name.split())
                    rest_words = set(name.split())
                    
                    if not base_words or not rest_words:
                        continue
                    
                    common_words = base_words.intersection(rest_words)
                    name_match_score = len(common_words) / max(len(base_words), len(rest_words))
                    
                    # Location match if available (within 200m)
                    location_match_score = 0
                    if base_lat and base_lon and lat and lon:
                        distance = self._haversine_distance(base_lat, base_lon, lat, lon)
                        # Convert distance to score (closer = higher score)
                        location_match_score = max(0, 1 - (distance / 0.5))  # 500m scale
                    
                    # Calculate overall score
                    score = 0.7 * name_match_score + 0.3 * location_match_score
                    
                    # Consider it a match if score exceeds threshold
                    if score >= threshold:
                        matched_restaurant["matches"][platform] = {
                            "data": restaurant,
                            "confidence": score
                        }
                        break
            
            matched_restaurants.append(matched_restaurant)
        
        return matched_restaurants
    
    @staticmethod
    def _haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculate the great circle distance between two points on the earth.
        
        Args:
            lat1, lon1: Coordinates of first point
            lat2, lon2: Coordinates of second point
            
        Returns:
            Distance in kilometers
        """
        # Convert decimal degrees to radians
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        
        # Haversine formula
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        r = 6371  # Radius of earth in kilometers
        
        return c * r
