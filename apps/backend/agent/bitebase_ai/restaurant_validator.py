#!/usr/bin/env python3
"""
Restaurant Data Validator - A tool for validating the completeness and accuracy
of restaurant data extracted from various platforms against Google Maps as a baseline.
"""

import os
import json
import math
import logging
import argparse
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("RestaurantValidator")

class RestaurantValidator:
    """
    Tool for validating restaurant data completeness and accuracy.
    """
    
    def __init__(self, config_path: str = None):
        """
        Initialize the validator with configuration.
        
        Args:
            config_path: Path to configuration file (JSON)
        """
        self.config = {
            "cache_dir": "cache",
            "cache_duration_hours": 24,
            "completeness_weights": {
                "name": 1.0,
                "address": 0.8,
                "coordinates": 0.9,
                "rating": 0.7,
                "reviews_count": 0.6,
                "price_level": 0.5,
                "cuisine_types": 0.7,
                "phone": 0.4,
                "website": 0.3
            },
            "accuracy_thresholds": {
                "name_similarity": 0.8,
                "address_similarity": 0.7,
                "location_distance_km": 0.2,
                "rating_difference": 0.5,
                "price_level_difference": 1
            }
        }
        
        # Load config from file if provided
        if config_path and os.path.exists(config_path):
            with open(config_path, 'r') as f:
                user_config = json.load(f)
                self.config.update(user_config)
        
        # Create cache directory if it doesn't exist
        os.makedirs(self.config["cache_dir"], exist_ok=True)
    
    def validate_data(self, 
                     restaurant_lists: Dict[str, List[Dict]], 
                     matched_restaurants: Optional[List[Dict]] = None,
                     mode: str = "basic") -> Dict:
        """
        Validate restaurant data completeness and accuracy.
        
        Args:
            restaurant_lists: Dictionary of lists of restaurants from different platforms
            matched_restaurants: List of matched restaurants across platforms (optional)
            mode: Validation mode ("basic", "comprehensive", or "detailed")
            
        Returns:
            Validation report
        """
        # Skip if no data
        if not restaurant_lists or all(len(v) == 0 for v in restaurant_lists.values()):
            return {
                "error": "No restaurant data to validate",
                "timestamp": datetime.now().isoformat()
            }
        
        # Check if Google Maps data is available for accuracy validation
        has_google_maps = "google_maps" in restaurant_lists and len(restaurant_lists["google_maps"]) > 0
        
        # Prepare validation report
        report = {
            "timestamp": datetime.now().isoformat(),
            "mode": mode,
            "platforms": list(restaurant_lists.keys()),
            "restaurant_counts": {platform: len(restaurants) for platform, restaurants in restaurant_lists.items()},
            "completeness": {},
            "recommendations": []
        }
        
        # Add location info if matched restaurants are provided
        if matched_restaurants and len(matched_restaurants) > 0:
            # Get location from first matched restaurant
            base_data = matched_restaurants[0]["base_data"]
            if "latitude" in base_data and "longitude" in base_data:
                report["location"] = {
                    "latitude": base_data["latitude"],
                    "longitude": base_data["longitude"],
                    "radius_km": None  # Would be set from search parameters
                }
        
        # Validate data completeness for each platform
        for platform, restaurants in restaurant_lists.items():
            platform_completeness = self._validate_completeness(restaurants)
            report["completeness"][platform] = platform_completeness
            
            # Add recommendations based on completeness
            if platform_completeness["overall_score"] < 0.7:
                missing_fields = [field for field, score in platform_completeness["field_scores"].items() if score < 0.5]
                if missing_fields:
                    report["recommendations"].append(
                        f"Improve data completeness for {platform} by collecting more {', '.join(missing_fields)} information."
                    )
        
        # Validate data accuracy against Google Maps if available
        if has_google_maps and mode in ["comprehensive", "detailed"]:
            accuracy_report = self._validate_accuracy(restaurant_lists)
            report["accuracy"] = accuracy_report
            
            # Add recommendations based on accuracy
            for platform, accuracy in accuracy_report.items():
                if platform != "google_maps" and accuracy["overall_score"] < 0.8:
                    report["recommendations"].append(
                        f"Data from {platform} shows significant differences from Google Maps data. Consider manual verification."
                    )
        
        # Validate matched restaurants if provided and in detailed mode
        if matched_restaurants and mode == "detailed":
            match_quality = self._validate_matches(matched_restaurants)
            report["match_quality"] = match_quality
            
            # Add recommendations based on match quality
            if match_quality["overall_score"] < 0.8:
                report["recommendations"].append(
                    "Restaurant matching across platforms has low confidence. Consider adjusting matching parameters or manual verification."
                )
        
        # Add general recommendations
        if len(report["platforms"]) < 3:
            report["recommendations"].append(
                "Add more data sources to improve coverage and cross-validation capabilities."
            )
        
        return report
    
    def _validate_completeness(self, restaurants: List[Dict]) -> Dict:
        """
        Validate the completeness of restaurant data.
        
        Args:
            restaurants: List of restaurant data dictionaries
            
        Returns:
            Completeness report
        """
        if not restaurants:
            return {
                "overall_score": 0,
                "field_scores": {},
                "sample_size": 0
            }
        
        # Fields to check for completeness
        fields = {
            "name": lambda r: bool(r.get("name")),
            "address": lambda r: bool(r.get("address")),
            "coordinates": lambda r: r.get("latitude") is not None and r.get("longitude") is not None,
            "rating": lambda r: r.get("rating") is not None,
            "reviews_count": lambda r: r.get("reviews_count") is not None,
            "price_level": lambda r: r.get("price_level") is not None,
            "cuisine_types": lambda r: bool(r.get("cuisine_types")),
            "phone": lambda r: bool(r.get("phone")),
            "website": lambda r: bool(r.get("website"))
        }
        
        # Calculate completeness scores
        field_scores = {}
        for field, check_func in fields.items():
            present_count = sum(1 for r in restaurants if check_func(r))
            field_scores[field] = present_count / len(restaurants)
        
        # Calculate overall completeness score with weights
        weights = self.config["completeness_weights"]
        overall_score = sum(
            field_scores.get(field, 0) * weights.get(field, 1.0)
            for field in fields.keys()
        ) / sum(weights.values())
        
        return {
            "overall_score": overall_score,
            "field_scores": field_scores,
            "sample_size": len(restaurants)
        }
    
    def _validate_accuracy(self, restaurant_lists: Dict[str, List[Dict]]) -> Dict:
        """
        Validate the accuracy of restaurant data against Google Maps.
        
        Args:
            restaurant_lists: Dictionary of lists of restaurants from different platforms
            
        Returns:
            Accuracy report
        """
        if "google_maps" not in restaurant_lists or not restaurant_lists["google_maps"]:
            return {
                "error": "No Google Maps data available for accuracy validation"
            }
        
        google_maps_data = restaurant_lists["google_maps"]
        accuracy_report = {}
        
        # For each platform (except Google Maps), compare with Google Maps data
        for platform, restaurants in restaurant_lists.items():
            if platform == "google_maps" or not restaurants:
                continue
            
            platform_accuracy = self._compare_with_google_maps(restaurants, google_maps_data)
            accuracy_report[platform] = platform_accuracy
        
        return accuracy_report
    
    def _compare_with_google_maps(self, platform_restaurants: List[Dict], google_maps_restaurants: List[Dict]) -> Dict:
        """
        Compare restaurant data from a platform with Google Maps data.
        
        Args:
            platform_restaurants: List of restaurants from the platform
            google_maps_restaurants: List of restaurants from Google Maps
            
        Returns:
            Comparison report
        """
        try:
            from fuzzywuzzy import fuzz
        except ImportError:
            logger.warning("fuzzywuzzy not installed. Installing...")
            import subprocess
            subprocess.check_call(["pip", "install", "fuzzywuzzy", "python-Levenshtein"])
            from fuzzywuzzy import fuzz
        
        # Metrics to compare
        metrics = {
            "name_similarity": [],
            "address_similarity": [],
            "location_distance": [],
            "rating_difference": [],
            "price_level_difference": []
        }
        
        # For each platform restaurant, find the best matching Google Maps restaurant
        matched_count = 0
        for p_rest in platform_restaurants:
            best_match = None
            best_score = 0
            
            for g_rest in google_maps_restaurants:
                # Calculate name similarity
                p_name = p_rest.get("name", "").lower()
                g_name = g_rest.get("name", "").lower()
                name_similarity = fuzz.ratio(p_name, g_name) / 100.0
                
                # Calculate address similarity
                p_address = p_rest.get("address", "").lower()
                g_address = g_rest.get("address", "").lower()
                address_similarity = fuzz.ratio(p_address, g_address) / 100.0
                
                # Calculate location proximity
                location_distance = None
                if all(x is not None for x in [
                    p_rest.get("latitude"), p_rest.get("longitude"),
                    g_rest.get("latitude"), g_rest.get("longitude")
                ]):
                    location_distance = self._haversine_distance(
                        p_rest["latitude"], p_rest["longitude"],
                        g_rest["latitude"], g_rest["longitude"]
                    )
                
                # Calculate overall match score
                match_score = name_similarity * 0.6 + address_similarity * 0.4
                if location_distance is not None:
                    # Adjust score based on distance (closer = better)
                    distance_factor = max(0, 1 - location_distance)
                    match_score = match_score * 0.7 + distance_factor * 0.3
                
                # Update best match
                if match_score > best_score and match_score > 0.7:
                    best_match = g_rest
                    best_score = match_score
            
            # If a match was found, compare the data
            if best_match:
                matched_count += 1
                
                # Name similarity
                name_similarity = fuzz.ratio(
                    p_rest.get("name", "").lower(),
                    best_match.get("name", "").lower()
                ) / 100.0
                metrics["name_similarity"].append(name_similarity)
                
                # Address similarity
                address_similarity = fuzz.ratio(
                    p_rest.get("address", "").lower(),
                    best_match.get("address", "").lower()
                ) / 100.0
                metrics["address_similarity"].append(address_similarity)
                
                # Location distance
                if all(x is not None for x in [
                    p_rest.get("latitude"), p_rest.get("longitude"),
                    best_match.get("latitude"), best_match.get("longitude")
                ]):
                    distance = self._haversine_distance(
                        p_rest["latitude"], p_rest["longitude"],
                        best_match["latitude"], best_match["longitude"]
                    )
                    metrics["location_distance"].append(distance)
                
                # Rating difference
                if p_rest.get("rating") is not None and best_match.get("rating") is not None:
                    rating_diff = abs(p_rest["rating"] - best_match["rating"])
                    metrics["rating_difference"].append(rating_diff)
                
                # Price level difference
                if p_rest.get("price_level") is not None and best_match.get("price_level") is not None:
                    price_diff = abs(p_rest["price_level"] - best_match["price_level"])
                    metrics["price_level_difference"].append(price_diff)
        
        # Calculate average metrics
        avg_metrics = {}
        for metric, values in metrics.items():
            if values:
                avg_metrics[metric] = sum(values) / len(values)
            else:
                avg_metrics[metric] = None
        
        # Calculate overall accuracy score
        accuracy_score = 0
        count = 0
        
        # Name similarity (higher is better)
        if avg_metrics["name_similarity"] is not None:
            accuracy_score += avg_metrics["name_similarity"]
            count += 1
        
        # Address similarity (higher is better)
        if avg_metrics["address_similarity"] is not None:
            accuracy_score += avg_metrics["address_similarity"]
            count += 1
        
        # Location distance (lower is better, convert to similarity)
        if avg_metrics["location_distance"] is not None:
            threshold = self.config["accuracy_thresholds"]["location_distance_km"]
            location_similarity = max(0, 1 - (avg_metrics["location_distance"] / threshold))
            accuracy_score += location_similarity
            count += 1
        
        # Rating difference (lower is better, convert to similarity)
        if avg_metrics["rating_difference"] is not None:
            threshold = self.config["accuracy_thresholds"]["rating_difference"]
            rating_similarity = max(0, 1 - (avg_metrics["rating_difference"] / threshold))
            accuracy_score += rating_similarity
            count += 1
        
        # Price level difference (lower is better, convert to similarity)
        if avg_metrics["price_level_difference"] is not None:
            threshold = self.config["accuracy_thresholds"]["price_level_difference"]
            price_similarity = max(0, 1 - (avg_metrics["price_level_difference"] / threshold))
            accuracy_score += price_similarity
            count += 1
        
        # Calculate final score
        overall_score = accuracy_score / count if count > 0 else 0
        
        return {
            "overall_score": overall_score,
            "metrics": avg_metrics,
            "matched_count": matched_count,
            "total_count": len(platform_restaurants),
            "match_rate": matched_count / len(platform_restaurants) if platform_restaurants else 0
        }
    
    def _validate_matches(self, matched_restaurants: List[Dict]) -> Dict:
        """
        Validate the quality of restaurant matches across platforms.
        
        Args:
            matched_restaurants: List of matched restaurants
            
        Returns:
            Match quality report
        """
        if not matched_restaurants:
            return {
                "overall_score": 0,
                "match_counts": {},
                "confidence_scores": {}
            }
        
        # Count matches by platform
        platforms = set()
        for match in matched_restaurants:
            platforms.add(match["base_platform"])
            for platform in match["matches"].keys():
                platforms.add(platform)
        
        match_counts = {platform: 0 for platform in platforms}
        confidence_scores = {platform: [] for platform in platforms}
        
        # Calculate match statistics
        for match in matched_restaurants:
            base_platform = match["base_platform"]
            
            for platform, match_data in match["matches"].items():
                match_counts[platform] += 1
                confidence_scores[platform].append(match_data["confidence"])
        
        # Calculate average confidence scores
        avg_confidence = {}
        for platform, scores in confidence_scores.items():
            if scores:
                avg_confidence[platform] = sum(scores) / len(scores)
            else:
                avg_confidence[platform] = 0
        
        # Calculate overall match quality score
        overall_score = sum(avg_confidence.values()) / len(avg_confidence) if avg_confidence else 0
        
        return {
            "overall_score": overall_score,
            "match_counts": match_counts,
            "confidence_scores": avg_confidence,
            "total_matches": len(matched_restaurants)
        }
    
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

def main():
    """
    Main function for command-line usage.
    """
    parser = argparse.ArgumentParser(description="Restaurant Data Validator")
    parser.add_argument("--input", type=str, required=True, help="Path to input file with restaurant data (JSON)")
    parser.add_argument("--matched", type=str, help="Path to file with matched restaurant data (JSON)")
    parser.add_argument("--output", type=str, help="Path to output file (JSON)")
    parser.add_argument("--config", type=str, help="Path to configuration file")
    parser.add_argument("--mode", type=str, default="basic", choices=["basic", "comprehensive", "detailed"],
                       help="Validation mode (basic, comprehensive, or detailed)")
    
    args = parser.parse_args()
    
    # Initialize validator
    validator = RestaurantValidator(config_path=args.config)
    
    try:
        # Load input data
        with open(args.input, "r", encoding="utf-8") as f:
            restaurant_lists = json.load(f)
        
        # Load matched data if provided
        matched_restaurants = None
        if args.matched:
            with open(args.matched, "r", encoding="utf-8") as f:
                matched_data = json.load(f)
                matched_restaurants = matched_data.get("matched_restaurants")
        
        # Validate data
        report = validator.validate_data(
            restaurant_lists=restaurant_lists,
            matched_restaurants=matched_restaurants,
            mode=args.mode
        )
        
        # Output results
        if args.output:
            with open(args.output, "w", encoding="utf-8") as f:
                json.dump(report, f, ensure_ascii=False, indent=2)
            print(f"Validation report saved to {args.output}")
        else:
            print(json.dumps(report, ensure_ascii=False, indent=2))
    
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise

if __name__ == "__main__":
    main()
