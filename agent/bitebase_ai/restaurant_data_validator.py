#!/usr/bin/env python3
"""
Restaurant Data Validator - A tool for validating restaurant data completeness and accuracy
by comparing results from multiple sources against Google Maps as a baseline.
"""

import os
import json
import math
import logging
import argparse
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from restaurant_data_agent import RestaurantDataAgent

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("RestaurantDataValidator")

class RestaurantDataValidator:
    """
    Validator for restaurant data completeness and accuracy.
    """
    
    def __init__(self, agent: RestaurantDataAgent = None):
        """
        Initialize the validator.
        
        Args:
            agent: RestaurantDataAgent instance (will create one if not provided)
        """
        self.agent = agent or RestaurantDataAgent()
    
    def validate_data_completeness(self, 
                                  latitude: float, 
                                  longitude: float, 
                                  radius_km: float,
                                  platforms: List[str] = None) -> Dict[str, Any]:
        """
        Validate data completeness by comparing results from different platforms.
        
        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Search radius in kilometers
            platforms: List of platforms to validate (default: all available)
            
        Returns:
            Validation report
        """
        if platforms is None:
            platforms = ["foodpanda", "wongnai", "robinhood", "google_maps"]
        
        # Ensure Google Maps is included for baseline comparison
        if "google_maps" not in platforms:
            platforms.append("google_maps")
        
        # Get restaurant data from all platforms
        results = self.agent.search_restaurants(
            latitude=latitude,
            longitude=longitude,
            radius_km=radius_km,
            platforms=platforms
        )
        
        # Match restaurants across platforms
        matched_results = self.agent.match_restaurants(results)
        
        # Generate completeness report
        report = {
            "timestamp": datetime.now().isoformat(),
            "location": {
                "latitude": latitude,
                "longitude": longitude,
                "radius_km": radius_km
            },
            "platforms": {},
            "coverage": {},
            "field_completeness": {},
            "summary": {}
        }
        
        # Platform-specific metrics
        for platform in platforms:
            platform_data = results.get(platform, [])
            report["platforms"][platform] = {
                "total_restaurants": len(platform_data),
                "avg_fields_per_restaurant": self._calculate_avg_fields(platform_data),
                "fields_coverage": self._calculate_fields_coverage(platform_data)
            }
        
        # Cross-platform coverage
        total_unique_restaurants = len(matched_results)
        report["coverage"]["total_unique_restaurants"] = total_unique_restaurants
        
        for platform in platforms:
            # Calculate how many restaurants from this platform were matched with others
            matched_count = sum(1 for r in matched_results if platform in r.get("matches", {}))
            
            # Calculate coverage percentage
            platform_total = len(results.get(platform, []))
            coverage_pct = (matched_count / platform_total * 100) if platform_total > 0 else 0
            
            report["coverage"][platform] = {
                "matched_restaurants": matched_count,
                "coverage_percentage": coverage_pct
            }
        
        # Field completeness across platforms
        important_fields = ["name", "address", "latitude", "longitude", "rating", 
                           "reviews_count", "price_level", "cuisine_types", "phone", 
                           "website", "opening_hours"]
        
        for field in important_fields:
            field_presence = {}
            for platform in platforms:
                platform_data = results.get(platform, [])
                if not platform_data:
                    field_presence[platform] = 0
                    continue
                
                # Count restaurants with non-empty field values
                field_count = sum(1 for r in platform_data if r.get(field))
                field_presence[platform] = field_count / len(platform_data) * 100
            
            report["field_completeness"][field] = field_presence
        
        # Summary statistics
        google_maps_count = len(results.get("google_maps", []))
        
        # Calculate platform coverage relative to Google Maps
        platform_coverage = {}
        for platform in platforms:
            if platform == "google_maps":
                continue
            
            platform_count = len(results.get(platform, []))
            relative_coverage = (platform_count / google_maps_count * 100) if google_maps_count > 0 else 0
            platform_coverage[platform] = relative_coverage
        
        report["summary"] = {
            "google_maps_baseline_count": google_maps_count,
            "platform_coverage_vs_google": platform_coverage,
            "cross_platform_match_rate": self._calculate_cross_platform_match_rate(matched_results),
            "data_quality_score": self._calculate_data_quality_score(results, matched_results)
        }
        
        return report
    
    def validate_data_accuracy(self, 
                              latitude: float, 
                              longitude: float, 
                              radius_km: float,
                              platforms: List[str] = None) -> Dict[str, Any]:
        """
        Validate data accuracy by comparing results against Google Maps as a baseline.
        
        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Search radius in kilometers
            platforms: List of platforms to validate (default: all available)
            
        Returns:
            Accuracy validation report
        """
        if platforms is None:
            platforms = ["foodpanda", "wongnai", "robinhood"]
        
        # Ensure Google Maps is included for baseline comparison
        if "google_maps" not in platforms:
            platforms.append("google_maps")
        
        # Get restaurant data from all platforms
        results = self.agent.search_restaurants(
            latitude=latitude,
            longitude=longitude,
            radius_km=radius_km,
            platforms=platforms
        )
        
        # Match restaurants across platforms
        matched_results = self.agent.match_restaurants(results)
        
        # Generate accuracy report
        report = {
            "timestamp": datetime.now().isoformat(),
            "location": {
                "latitude": latitude,
                "longitude": longitude,
                "radius_km": radius_km
            },
            "accuracy_metrics": {},
            "field_accuracy": {},
            "summary": {}
        }
        
        # Calculate accuracy metrics for each platform compared to Google Maps
        google_maps_data = results.get("google_maps", [])
        
        for platform in platforms:
            if platform == "google_maps":
                continue
                
            platform_data = results.get(platform, [])
            
            # Find matches between this platform and Google Maps
            google_matches = []
            for restaurant in matched_results:
                if "google_maps" in restaurant.get("matches", {}) and platform in restaurant.get("matches", {}):
                    google_data = restaurant["matches"]["google_maps"]["data"]
                    platform_data_item = restaurant["matches"][platform]["data"]
                    confidence = restaurant["matches"]["google_maps"]["confidence"]
                    
                    google_matches.append({
                        "google_data": google_data,
                        "platform_data": platform_data_item,
                        "confidence": confidence
                    })
            
            # Calculate accuracy metrics
            name_similarity = self._calculate_field_similarity(google_matches, "name")
            address_similarity = self._calculate_field_similarity(google_matches, "address")
            rating_similarity = self._calculate_field_similarity(google_matches, "rating")
            price_similarity = self._calculate_field_similarity(google_matches, "price_level")
            
            # Calculate location accuracy
            location_accuracy = self._calculate_location_accuracy(google_matches)
            
            report["accuracy_metrics"][platform] = {
                "matched_with_google": len(google_matches),
                "name_similarity": name_similarity,
                "address_similarity": address_similarity,
                "rating_similarity": rating_similarity,
                "price_level_similarity": price_similarity,
                "location_accuracy": location_accuracy,
                "overall_accuracy": (name_similarity + address_similarity + rating_similarity + 
                                    price_similarity + location_accuracy) / 5
            }
            
            # Calculate field-specific accuracy
            report["field_accuracy"][platform] = self._calculate_field_accuracy(google_matches)
        
        # Summary statistics
        platform_accuracy = {p: report["accuracy_metrics"][p]["overall_accuracy"] 
                            for p in platforms if p != "google_maps"}
        
        report["summary"] = {
            "most_accurate_platform": max(platform_accuracy.items(), key=lambda x: x[1])[0] if platform_accuracy else None,
            "least_accurate_platform": min(platform_accuracy.items(), key=lambda x: x[1])[0] if platform_accuracy else None,
            "average_accuracy": sum(platform_accuracy.values()) / len(platform_accuracy) if platform_accuracy else 0,
            "platform_rankings": sorted(platform_accuracy.items(), key=lambda x: x[1], reverse=True)
        }
        
        return report
    
    def generate_comprehensive_report(self,
                                     latitude: float, 
                                     longitude: float, 
                                     radius_km: float,
                                     platforms: List[str] = None) -> Dict[str, Any]:
        """
        Generate a comprehensive validation report including both completeness and accuracy.
        
        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Search radius in kilometers
            platforms: List of platforms to validate (default: all available)
            
        Returns:
            Comprehensive validation report
        """
        completeness_report = self.validate_data_completeness(
            latitude=latitude,
            longitude=longitude,
            radius_km=radius_km,
            platforms=platforms
        )
        
        accuracy_report = self.validate_data_accuracy(
            latitude=latitude,
            longitude=longitude,
            radius_km=radius_km,
            platforms=platforms
        )
        
        # Combine reports
        report = {
            "timestamp": datetime.now().isoformat(),
            "location": {
                "latitude": latitude,
                "longitude": longitude,
                "radius_km": radius_km
            },
            "completeness": completeness_report,
            "accuracy": accuracy_report,
            "recommendations": self._generate_recommendations(completeness_report, accuracy_report)
        }
        
        return report
    
    def _calculate_avg_fields(self, restaurants: List[Dict]) -> float:
        """
        Calculate the average number of non-empty fields per restaurant.
        
        Args:
            restaurants: List of restaurant data
            
        Returns:
            Average number of non-empty fields
        """
        if not restaurants:
            return 0
        
        total_fields = 0
        for restaurant in restaurants:
            # Count non-empty fields (excluding raw_data)
            field_count = sum(1 for k, v in restaurant.items() if k != "raw_data" and v)
            total_fields += field_count
        
        return total_fields / len(restaurants)
    
    def _calculate_fields_coverage(self, restaurants: List[Dict]) -> Dict[str, float]:
        """
        Calculate the percentage of restaurants with each field populated.
        
        Args:
            restaurants: List of restaurant data
            
        Returns:
            Dictionary of field coverage percentages
        """
        if not restaurants:
            return {}
        
        # Get all fields except raw_data
        all_fields = set()
        for restaurant in restaurants:
            all_fields.update(k for k in restaurant.keys() if k != "raw_data")
        
        coverage = {}
        for field in all_fields:
            field_count = sum(1 for r in restaurants if r.get(field))
            coverage[field] = field_count / len(restaurants) * 100
        
        return coverage
    
    def _calculate_cross_platform_match_rate(self, matched_results: List[Dict]) -> Dict[str, float]:
        """
        Calculate the rate at which restaurants are matched across different platforms.
        
        Args:
            matched_results: List of matched restaurant data
            
        Returns:
            Dictionary of match rates by platform pair
        """
        if not matched_results:
            return {}
        
        # Get all platforms
        all_platforms = set()
        for result in matched_results:
            all_platforms.add(result["base_platform"])
            all_platforms.update(result.get("matches", {}).keys())
        
        # Calculate match rates for each platform pair
        match_rates = {}
        for platform1 in all_platforms:
            for platform2 in all_platforms:
                if platform1 >= platform2:  # Skip duplicate pairs and self-pairs
                    continue
                
                # Count matches between these platforms
                match_count = sum(1 for r in matched_results 
                                if (r["base_platform"] == platform1 and platform2 in r.get("matches", {})) or
                                   (r["base_platform"] == platform2 and platform1 in r.get("matches", {})))
                
                # Calculate match rate
                pair_key = f"{platform1}-{platform2}"
                match_rates[pair_key] = match_count / len(matched_results) * 100
        
        return match_rates
    
    def _calculate_data_quality_score(self, results: Dict[str, List[Dict]], matched_results: List[Dict]) -> float:
        """
        Calculate an overall data quality score based on completeness and match rates.
        
        Args:
            results: Dictionary of restaurant lists by platform
            matched_results: List of matched restaurant data
            
        Returns:
            Data quality score (0-100)
        """
        # Calculate completeness score
        completeness_scores = []
        important_fields = ["name", "address", "latitude", "longitude", "rating", "price_level"]
        
        for platform, restaurants in results.items():
            if not restaurants:
                continue
                
            platform_score = 0
            for field in important_fields:
                field_count = sum(1 for r in restaurants if r.get(field))
                field_score = field_count / len(restaurants) * 100
                platform_score += field_score
            
            platform_score /= len(important_fields)
            completeness_scores.append(platform_score)
        
        completeness_score = sum(completeness_scores) / len(completeness_scores) if completeness_scores else 0
        
        # Calculate match rate score
        total_restaurants = sum(len(restaurants) for restaurants in results.values())
        match_score = len(matched_results) / total_restaurants * 100 if total_restaurants > 0 else 0
        
        # Calculate overall score (weighted average)
        overall_score = 0.7 * completeness_score + 0.3 * match_score
        
        return overall_score
    
    def _calculate_field_similarity(self, matches: List[Dict], field: str) -> float:
        """
        Calculate the average similarity for a specific field between Google Maps and another platform.
        
        Args:
            matches: List of matched restaurant data
            field: Field to compare
            
        Returns:
            Average similarity (0-100)
        """
        if not matches:
            return 0
        
        total_similarity = 0
        valid_matches = 0
        
        for match in matches:
            google_value = match["google_data"].get(field)
            platform_value = match["platform_data"].get(field)
            
            # Skip if either value is missing
            if google_value is None or platform_value is None:
                continue
                
            valid_matches += 1
            
            # Calculate similarity based on field type
            if isinstance(google_value, (int, float)) and isinstance(platform_value, (int, float)):
                # For numeric fields, calculate relative difference
                max_value = max(abs(google_value), abs(platform_value))
                if max_value == 0:
                    similarity = 100  # Both values are 0
                else:
                    diff = abs(google_value - platform_value)
                    similarity = max(0, 100 - (diff / max_value * 100))
            else:
                # For string fields, use match confidence
                similarity = match["confidence"] * 100
            
            total_similarity += similarity
        
        return total_similarity / valid_matches if valid_matches > 0 else 0
    
    def _calculate_location_accuracy(self, matches: List[Dict]) -> float:
        """
        Calculate the average location accuracy between Google Maps and another platform.
        
        Args:
            matches: List of matched restaurant data
            
        Returns:
            Average location accuracy (0-100)
        """
        if not matches:
            return 0
        
        total_accuracy = 0
        valid_matches = 0
        
        for match in matches:
            google_lat = match["google_data"].get("latitude")
            google_lon = match["google_data"].get("longitude")
            platform_lat = match["platform_data"].get("latitude")
            platform_lon = match["platform_data"].get("longitude")
            
            # Skip if any coordinate is missing
            if not all([google_lat, google_lon, platform_lat, platform_lon]):
                continue
                
            valid_matches += 1
            
            # Calculate distance between points
            distance = self._haversine_distance(google_lat, google_lon, platform_lat, platform_lon)
            
            # Convert distance to accuracy score
            # 0m = 100%, 100m = 50%, 200m or more = 0%
            accuracy = max(0, 100 - (distance * 1000 / 2))
            
            total_accuracy += accuracy
        
        return total_accuracy / valid_matches if valid_matches > 0 else 0
    
    def _calculate_field_accuracy(self, matches: List[Dict]) -> Dict[str, float]:
        """
        Calculate accuracy for each field compared to Google Maps.
        
        Args:
            matches: List of matched restaurant data
            
        Returns:
            Dictionary of field accuracy scores
        """
        important_fields = ["name", "address", "rating", "price_level", "reviews_count"]
        accuracy = {}
        
        for field in important_fields:
            accuracy[field] = self._calculate_field_similarity(matches, field)
        
        return accuracy
    
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
    
    def _generate_recommendations(self, completeness_report: Dict, accuracy_report: Dict) -> List[str]:
        """
        Generate recommendations based on validation results.
        
        Args:
            completeness_report: Data completeness report
            accuracy_report: Data accuracy report
            
        Returns:
            List of recommendations
        """
        recommendations = []
        
        # Analyze completeness
        if "summary" in completeness_report:
            quality_score = completeness_report["summary"].get("data_quality_score", 0)
            
            if quality_score < 50:
                recommendations.append(
                    "Data quality is low. Consider using Google Maps as the primary data source and "
                    "supplement with other platforms for additional details."
                )
            
            # Check platform coverage
            platform_coverage = completeness_report["summary"].get("platform_coverage_vs_google", {})
            low_coverage_platforms = [p for p, coverage in platform_coverage.items() if coverage < 50]
            
            if low_coverage_platforms:
                platforms_str = ", ".join(low_coverage_platforms)
                recommendations.append(
                    f"The following platforms have low coverage compared to Google Maps: {platforms_str}. "
                    "Consider adjusting your data collection strategy to focus on higher-coverage platforms."
                )
        
        # Analyze accuracy
        if "summary" in accuracy_report:
            avg_accuracy = accuracy_report["summary"].get("average_accuracy", 0)
            
            if avg_accuracy < 70:
                recommendations.append(
                    "Overall data accuracy is below optimal levels. Implement more aggressive matching "
                    "algorithms and consider manual verification for critical data points."
                )
            
            # Check platform rankings
            platform_rankings = accuracy_report["summary"].get("platform_rankings", [])
            
            if platform_rankings:
                best_platform, best_score = platform_rankings[0]
                recommendations.append(
                    f"{best_platform} provides the most accurate data (score: {best_score:.1f}). "
                    "Consider prioritizing this platform for critical data fields."
                )
        
        # Field-specific recommendations
        if "field_completeness" in completeness_report:
            field_completeness = completeness_report["field_completeness"]
            
            # Check for fields with low completeness
            for field, values in field_completeness.items():
                low_platforms = [p for p, v in values.items() if v < 50]
                
                if len(low_platforms) > len(values) / 2:
                    recommendations.append(
                        f"The '{field}' field has low completeness across multiple platforms. "
                        "Consider supplementing this data from additional sources or implementing "
                        "data enrichment techniques."
                    )
        
        # Add general recommendations
        recommendations.append(
            "Implement a hybrid data collection strategy that leverages the strengths of each platform: "
            "use Google Maps for basic restaurant information and location data, "
            "Foodpanda for menu and pricing details, "
            "Wongnai for Thai-specific information and reviews, "
            "and Robinhood for delivery-specific data."
        )
        
        recommendations.append(
            "Consider implementing a user feedback mechanism to improve data accuracy over time, "
            "especially for restaurant matching across platforms."
        )
        
        return recommendations

def main():
    """
    Main function for command-line usage.
    """
    parser = argparse.ArgumentParser(description="Restaurant Data Validator")
    parser.add_argument("--latitude", type=float, required=True, help="Center point latitude")
    parser.add_argument("--longitude", type=float, required=True, help="Center point longitude")
    parser.add_argument("--radius", type=float, required=True, help="Search radius in kilometers")
    parser.add_argument("--platforms", type=str, default="all", help="Comma-separated list of platforms to validate")
    parser.add_argument("--output", type=str, help="Path to output file (JSON)")
    parser.add_argument("--mode", type=str, default="comprehensive", 
                       choices=["completeness", "accuracy", "comprehensive"],
                       help="Validation mode")
    
    args = parser.parse_args()
    
    # Initialize agent and validator
    agent = RestaurantDataAgent()
    validator = RestaurantDataValidator(agent)
    
    # Determine platforms to validate
    platforms = None
    if args.platforms.lower() != "all":
        platforms = [p.strip() for p in args.platforms.split(",")]
    
    # Run validation
    if args.mode == "completeness":
        report = validator.validate_data_completeness(
            latitude=args.latitude,
            longitude=args.longitude,
            radius_km=args.radius,
            platforms=platforms
        )
    elif args.mode == "accuracy":
        report = validator.validate_data_accuracy(
            latitude=args.latitude,
            longitude=args.longitude,
            radius_km=args.radius,
            platforms=platforms
        )
    else:  # comprehensive
        report = validator.generate_comprehensive_report(
            latitude=args.latitude,
            longitude=args.longitude,
            radius_km=args.radius,
            platforms=platforms
        )
    
    # Output results
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        print(f"Validation report saved to {args.output}")
    else:
        print(json.dumps(report, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
