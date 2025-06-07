"""
Restaurant Analysis Agent - Advanced analysis of restaurant data.

This agent provides comprehensive analysis of restaurant data, including
market analysis, competitor analysis, location analysis, and more.
"""

import os
import json
import logging
import math
from typing import Dict, List, Any, Optional, Union, Tuple
from datetime import datetime

from ..core.agent_framework import BaseAgent, AgentMetrics
from ..core.data_processor import RestaurantDataCleaner, RestaurantMatcher
from .restaurant_data_agent import RestaurantDataAgent

# Import AIQToolkit components if available
try:
    from aiq.profiler.profile_runner import ProfileRunner
    from aiq.eval.evaluator import Evaluator
    from aiq.profiler.inference_optimization import InferenceOptimizer
    from aiq.benchmarking.benchmark_runner import BenchmarkRunner
    from ..core.aiq_integration import AIQProfiler, AIQEvaluator
    AIQ_AVAILABLE = True
except ImportError:
    AIQ_AVAILABLE = False

logger = logging.getLogger("RestaurantAnalysisAgent")

try:
    import pandas as pd
    import numpy as np
    from sklearn.cluster import DBSCAN
    ADVANCED_ANALYSIS_AVAILABLE = True
except ImportError:
    logger.warning("pandas, numpy, or sklearn not installed. Advanced analysis will be limited.")
    logger.warning("Install with: pip install pandas numpy scikit-learn")
    ADVANCED_ANALYSIS_AVAILABLE = False


class RestaurantAnalysisAgent(BaseAgent):
    """
    Agent for analyzing restaurant data and providing insights.
    """

    def __init__(self, config_path: Optional[str] = None):
        """
        Initialize the agent.

        Args:
            config_path: Path to configuration file
        """
        super().__init__(config_path, "RestaurantAnalysisAgent")

        # Initialize data agent for fetching restaurant data
        self.data_agent = RestaurantDataAgent(config_path)

        # Initialize data processor components
        self.cleaner = RestaurantDataCleaner()
        
        # Initialize AIQToolkit components if available
        if AIQ_AVAILABLE and self.config.get("use_aiq", True):
            try:
                # Initialize inference optimizer for analysis models
                self.inference_optimizer = InferenceOptimizer(
                    name="RestaurantAnalysisOptimizer",
                    config={
                        "optimization_target": "latency",
                        "metric_collection": True,
                        "enable_caching": True
                    }
                )
                
                # Initialize benchmark runner for tracking model performance
                self.benchmark_runner = BenchmarkRunner(
                    name="RestaurantAnalysisBenchmarks",
                    config={
                        "track_metrics": ["latency", "throughput", "memory"],
                        "compare_with_baseline": True
                    }
                )
                
                logger.info("AIQToolkit components initialized for RestaurantAnalysisAgent")
            except Exception as e:
                logger.error(f"Error initializing AIQToolkit components: {str(e)}")
                self.inference_optimizer = None
                self.benchmark_runner = None
        else:
            self.inference_optimizer = None
            self.benchmark_runner = None

    def _get_default_config(self) -> Dict[str, Any]:
        """Get default configuration values."""
        config = super()._get_default_config()
        config.update({
            "analysis": {
                "cluster_distance": 0.2,  # km
                "min_cluster_size": 3,
                "price_ranges": {
                    "1": "Budget",
                    "2": "Moderate",
                    "3": "Upscale",
                    "4": "Fine Dining"
                },
                "rating_ranges": {
                    "0-2.5": "Poor",
                    "2.5-3.5": "Average",
                    "3.5-4.5": "Good",
                    "4.5-5": "Excellent"
                }
            },
            "aiq": {
                "enabled": True,
                "optimize_analysis": True,
                "benchmark_performance": True,
                "results_dir": "metrics/aiq/restaurant_analysis",
                "evaluation_criteria": ["accuracy", "relevance", "insight_quality"]
            }
        })
        return config

    def run(self,
           latitude: float,
           longitude: float,
           radius_km: float,
           platforms: Optional[List[str]] = None,
           analysis_type: str = "comprehensive",
           restaurant_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Run the agent to analyze restaurants in the area.

        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Search radius in kilometers
            platforms: List of platforms to search (default: all available)
            analysis_type: Type of analysis to perform (basic, market, competitor, location, comprehensive)
            restaurant_data: Optional pre-fetched restaurant data

        Returns:
            Dictionary of analysis results
        """
        self.logger.info(f"Analyzing restaurants at {latitude}, {longitude} with radius {radius_km}km")
        self.logger.info(f"Analysis type: {analysis_type}")
        
        # Start AIQ benchmark if available and enabled
        benchmark_results = None
        if AIQ_AVAILABLE and self.benchmark_runner and self.config.get("aiq.benchmark_performance", True):
            self.benchmark_runner.start_benchmark()
            
        # Get restaurant data if not provided
        if restaurant_data is None:
            self.metrics.increment_step()
            restaurant_data = self.data_agent.execute(
                latitude=latitude,
                longitude=longitude,
                radius_km=radius_km,
                platforms=platforms,
                match=True
            )

        # Extract restaurant lists
        platform_data = restaurant_data.get("platforms", {})
        matched_restaurants = restaurant_data.get("matched_restaurants", [])

        # Flatten all restaurants into a single list
        all_restaurants = []
        for platform, restaurants in platform_data.items():
            for restaurant in restaurants:
                all_restaurants.append(restaurant)

        self.logger.info(f"Found {len(all_restaurants)} restaurants across all platforms")
        self.metrics.add_processed_data(len(all_restaurants))

        # Initialize results structure
        results = {
            "metadata": {
                "latitude": latitude,
                "longitude": longitude,
                "radius_km": radius_km,
                "platforms": platforms,
                "restaurant_count": len(all_restaurants),
                "timestamp": datetime.now().isoformat()
            }
        }
        
        # Use AIQ inference optimization if available and enabled
        use_optimization = AIQ_AVAILABLE and self.inference_optimizer and self.config.get("aiq.optimize_analysis", True)
        
        # Perform the requested analysis with optional optimization
        if analysis_type in ["basic", "comprehensive"]:
            self.metrics.increment_step()
            if use_optimization:
                # Run basic analysis with optimization
                with self.inference_optimizer.optimize() as optimized_context:
                    results["basic_analysis"] = self._perform_basic_analysis(all_restaurants)
                    # Record optimization metrics
                    optimization_metrics = optimized_context.get_metrics()
                    self.metrics.add_custom_metric("basic_analysis_optimization", optimization_metrics)
            else:
                results["basic_analysis"] = self._perform_basic_analysis(all_restaurants)

        if analysis_type in ["market", "comprehensive"]:
            self.metrics.increment_step()
            if use_optimization:
                # Run market analysis with optimization
                with self.inference_optimizer.optimize() as optimized_context:
                    results["market_analysis"] = self._perform_market_analysis(all_restaurants)
                    # Record optimization metrics
                    optimization_metrics = optimized_context.get_metrics()
                    self.metrics.add_custom_metric("market_analysis_optimization", optimization_metrics)
            else:
                results["market_analysis"] = self._perform_market_analysis(all_restaurants)

        if analysis_type in ["competitor", "comprehensive"]:
            self.metrics.increment_step()
            if use_optimization:
                # Run competitor analysis with optimization
                with self.inference_optimizer.optimize() as optimized_context:
                    results["competitor_analysis"] = self._perform_competitor_analysis(all_restaurants, matched_restaurants)
                    # Record optimization metrics
                    optimization_metrics = optimized_context.get_metrics()
                    self.metrics.add_custom_metric("competitor_analysis_optimization", optimization_metrics)
            else:
                results["competitor_analysis"] = self._perform_competitor_analysis(all_restaurants, matched_restaurants)

        if analysis_type in ["location", "comprehensive"]:
            self.metrics.increment_step()
            if use_optimization:
                # Run location analysis with optimization
                with self.inference_optimizer.optimize() as optimized_context:
                    results["location_analysis"] = self._perform_location_analysis(all_restaurants, latitude, longitude)
                    # Record optimization metrics
                    optimization_metrics = optimized_context.get_metrics()
                    self.metrics.add_custom_metric("location_analysis_optimization", optimization_metrics)
            else:
                results["location_analysis"] = self._perform_location_analysis(all_restaurants, latitude, longitude)
                
        # Evaluate analysis results if AIQToolkit and evaluator are available
        if AIQ_AVAILABLE and self.aiq_evaluator and self.config.get("aiq.enabled", True):
            try:
                evaluation_results = {}
                
                # Evaluate each analysis type
                for analysis_key in results.keys():
                    if analysis_key != "metadata" and isinstance(results[analysis_key], dict):
                        # Create a simplified evaluation query
                        query = f"Analyze restaurants at {latitude}, {longitude} with {radius_km}km radius for {analysis_key.replace('_', ' ')}"
                        
                        # Convert analysis result to string representation for evaluation
                        response = json.dumps(results[analysis_key], indent=2)
                        
                        # Evaluate using AIQToolkit
                        eval_result = self.aiq_evaluator.evaluate_response(
                            query=query,
                            response=response,
                            criteria=self.config.get("aiq.evaluation_criteria", ["accuracy", "relevance", "insight_quality"])
                        )
                        
                        evaluation_results[analysis_key] = eval_result
                        
                # Add evaluation results to metadata
                results["metadata"]["evaluation"] = evaluation_results
                self.logger.info(f"Analysis evaluation results: {json.dumps(evaluation_results)}")
                        
            except Exception as e:
                self.logger.error(f"Error evaluating analysis results: {str(e)}")
                
        # End AIQ benchmark if it was started
        if AIQ_AVAILABLE and self.benchmark_runner and self.config.get("aiq.benchmark_performance", True):
            benchmark_results = self.benchmark_runner.end_benchmark()
            
            # Add benchmark results to metadata
            if benchmark_results:
                results["metadata"]["benchmark"] = {
                    "latency_ms": benchmark_results.get("latency_ms", 0),
                    "throughput": benchmark_results.get("throughput", 0),
                    "memory_mb": benchmark_results.get("memory_mb", 0)
                }
                
                # Save benchmark results to file if configured
                try:
                    results_dir = self.config.get("aiq.results_dir", "metrics/aiq/restaurant_analysis")
                    os.makedirs(results_dir, exist_ok=True)
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    filepath = os.path.join(results_dir, f"analysis_benchmark_{timestamp}.json")
                    with open(filepath, 'w') as f:
                        json.dump(benchmark_results, f, indent=2)
                    self.logger.info(f"Saved benchmark results to {filepath}")
                except Exception as e:
                    self.logger.error(f"Error saving benchmark results: {str(e)}")
            
        return results

    def _perform_basic_analysis(self, restaurants: List[Dict]) -> Dict[str, Any]:
        """
        Perform basic analysis of restaurant data.

        Args:
            restaurants: List of restaurant data

        Returns:
            Basic analysis results
        """
        self.logger.info("Performing basic analysis")

        # Count restaurants by platform
        platform_counts = {}
        for restaurant in restaurants:
            platform = restaurant.get("source", "unknown")
            platform_counts[platform] = platform_counts.get(platform, 0) + 1

        # Calculate average rating
        ratings = [r.get("rating", 0) for r in restaurants if r.get("rating", 0) > 0]
        avg_rating = sum(ratings) / len(ratings) if ratings else 0

        # Count restaurants by price level
        price_counts = {1: 0, 2: 0, 3: 0, 4: 0}
        for restaurant in restaurants:
            price_level = restaurant.get("price_level", 0)
            if price_level in price_counts:
                price_counts[price_level] += 1

        # Count restaurants by cuisine type
        cuisine_counts = {}
        for restaurant in restaurants:
            for cuisine in restaurant.get("cuisine_types", []):
                cuisine = cuisine.lower()
                cuisine_counts[cuisine] = cuisine_counts.get(cuisine, 0) + 1

        # Sort cuisines by count
        top_cuisines = sorted(cuisine_counts.items(), key=lambda x: x[1], reverse=True)[:10]

        return {
            "restaurant_count": len(restaurants),
            "platform_distribution": platform_counts,
            "average_rating": round(avg_rating, 2),
            "price_level_distribution": price_counts,
            "top_cuisines": dict(top_cuisines)
        }

    def _perform_market_analysis(self, restaurants: List[Dict]) -> Dict[str, Any]:
        """
        Perform market analysis of restaurant data.

        Args:
            restaurants: List of restaurant data

        Returns:
            Market analysis results
        """
        self.logger.info("Performing market analysis")

        # Analyze ratings distribution
        rating_ranges = {
            "0-2.5": 0,
            "2.5-3.5": 0,
            "3.5-4.5": 0,
            "4.5-5": 0
        }

        for restaurant in restaurants:
            rating = restaurant.get("rating", 0)
            if rating <= 2.5:
                rating_ranges["0-2.5"] += 1
            elif rating <= 3.5:
                rating_ranges["2.5-3.5"] += 1
            elif rating <= 4.5:
                rating_ranges["3.5-4.5"] += 1
            else:
                rating_ranges["4.5-5"] += 1

        # Analyze price level distribution
        price_ranges = {
            "1": 0,  # Budget
            "2": 0,  # Moderate
            "3": 0,  # Upscale
            "4": 0   # Fine Dining
        }

        for restaurant in restaurants:
            price_level = str(restaurant.get("price_level", 0))
            if price_level in price_ranges:
                price_ranges[price_level] += 1

        # Analyze cuisine types
        cuisine_counts = {}
        for restaurant in restaurants:
            for cuisine in restaurant.get("cuisine_types", []):
                cuisine = cuisine.lower()
                cuisine_counts[cuisine] = cuisine_counts.get(cuisine, 0) + 1

        # Calculate market saturation (restaurants per sq km)
        area = math.pi * (self.config.get("metadata.radius_km", 1) ** 2)
        saturation = len(restaurants) / area if area > 0 else 0

        return {
            "rating_distribution": rating_ranges,
            "price_distribution": price_ranges,
            "cuisine_distribution": cuisine_counts,
            "market_saturation": round(saturation, 2),
            "total_restaurants": len(restaurants)
        }

    def _perform_competitor_analysis(self, restaurants: List[Dict], matched_restaurants: List[Dict]) -> Dict[str, Any]:
        """
        Perform competitor analysis of restaurant data.

        Args:
            restaurants: List of restaurant data
            matched_restaurants: List of matched restaurants across platforms

        Returns:
            Competitor analysis results
        """
        self.logger.info("Performing competitor analysis")

        # Identify top-rated restaurants
        sorted_by_rating = sorted(
            [r for r in restaurants if r.get("rating", 0) > 0],
            key=lambda x: (x.get("rating", 0), x.get("reviews_count", 0)),
            reverse=True
        )
        top_rated = sorted_by_rating[:10] if len(sorted_by_rating) >= 10 else sorted_by_rating

        # Identify most reviewed restaurants
        sorted_by_reviews = sorted(
            restaurants,
            key=lambda x: x.get("reviews_count", 0),
            reverse=True
        )
        most_reviewed = sorted_by_reviews[:10] if len(sorted_by_reviews) >= 10 else sorted_by_reviews

        # Analyze cross-platform presence
        platform_presence = {}
        for matched in matched_restaurants:
            match_count = len(matched.get("matches", {})) + 1  # +1 for base platform
            platform_presence[match_count] = platform_presence.get(match_count, 0) + 1

        # Analyze price vs. rating correlation
        price_rating_data = []
        for restaurant in restaurants:
            price = restaurant.get("price_level", 0)
            rating = restaurant.get("rating", 0)
            if price > 0 and rating > 0:
                price_rating_data.append((price, rating))

        # Calculate average rating by price level
        price_rating_avg = {}
        for price in range(1, 5):
            ratings = [r[1] for r in price_rating_data if r[0] == price]
            if ratings:
                price_rating_avg[price] = sum(ratings) / len(ratings)

        return {
            "top_rated_restaurants": [
                {
                    "name": r.get("name", ""),
                    "rating": r.get("rating", 0),
                    "reviews_count": r.get("reviews_count", 0),
                    "price_level": r.get("price_level", 0),
                    "source": r.get("source", "")
                } for r in top_rated
            ],
            "most_reviewed_restaurants": [
                {
                    "name": r.get("name", ""),
                    "rating": r.get("rating", 0),
                    "reviews_count": r.get("reviews_count", 0),
                    "price_level": r.get("price_level", 0),
                    "source": r.get("source", "")
                } for r in most_reviewed
            ],
            "cross_platform_presence": platform_presence,
            "price_rating_correlation": {
                str(k): round(v, 2) for k, v in price_rating_avg.items()
            }
        }

    def _perform_location_analysis(self, restaurants: List[Dict], center_lat: float, center_lon: float) -> Dict[str, Any]:
        """
        Perform location analysis of restaurant data.

        Args:
            restaurants: List of restaurant data
            center_lat: Center point latitude
            center_lon: Center point longitude

        Returns:
            Location analysis results
        """
        self.logger.info("Performing location analysis")

        # Calculate distance from center for each restaurant
        for restaurant in restaurants:
            lat = restaurant.get("latitude")
            lon = restaurant.get("longitude")
            if lat is not None and lon is not None:
                distance = self._haversine_distance(center_lat, center_lon, lat, lon)
                restaurant["distance_from_center"] = distance

        # Group restaurants by distance bands
        distance_bands = {
            "0-0.5km": 0,
            "0.5-1km": 0,
            "1-2km": 0,
            "2-3km": 0,
            "3km+": 0
        }

        for restaurant in restaurants:
            distance = restaurant.get("distance_from_center", 0)
            if distance <= 0.5:
                distance_bands["0-0.5km"] += 1
            elif distance <= 1:
                distance_bands["0.5-1km"] += 1
            elif distance <= 2:
                distance_bands["1-2km"] += 1
            elif distance <= 3:
                distance_bands["2-3km"] += 1
            else:
                distance_bands["3km+"] += 1

        # Identify restaurant clusters
        clusters = self._identify_restaurant_clusters(restaurants)

        # Calculate average rating by distance band
        rating_by_distance = {
            "0-0.5km": [],
            "0.5-1km": [],
            "1-2km": [],
            "2-3km": [],
            "3km+": []
        }

        for restaurant in restaurants:
            distance = restaurant.get("distance_from_center", 0)
            rating = restaurant.get("rating", 0)

            if rating > 0:
                if distance <= 0.5:
                    rating_by_distance["0-0.5km"].append(rating)
                elif distance <= 1:
                    rating_by_distance["0.5-1km"].append(rating)
                elif distance <= 2:
                    rating_by_distance["1-2km"].append(rating)
                elif distance <= 3:
                    rating_by_distance["2-3km"].append(rating)
                else:
                    rating_by_distance["3km+"].append(rating)

        avg_rating_by_distance = {}
        for band, ratings in rating_by_distance.items():
            if ratings:
                avg_rating_by_distance[band] = sum(ratings) / len(ratings)
            else:
                avg_rating_by_distance[band] = 0

        # Find nearest competitors for each cuisine type
        cuisine_competitors = {}
        for restaurant in restaurants:
            for cuisine in restaurant.get("cuisine_types", []):
                cuisine = cuisine.lower()
                if cuisine not in cuisine_competitors:
                    # Find all restaurants with this cuisine
                    competitors = [
                        r for r in restaurants
                        if cuisine in [c.lower() for c in r.get("cuisine_types", [])]
                        and r.get("id") != restaurant.get("id")
                    ]

                    # Sort by distance from center
                    competitors.sort(key=lambda x: x.get("distance_from_center", float('inf')))

                    # Take top 5
                    top_competitors = competitors[:5]

                    cuisine_competitors[cuisine] = [
                        {
                            "name": r.get("name", ""),
                            "rating": r.get("rating", 0),
                            "distance_from_center": r.get("distance_from_center", 0),
                            "price_level": r.get("price_level", 0)
                        } for r in top_competitors
                    ]

        return {
            "distance_distribution": distance_bands,
            "average_rating_by_distance": {
                k: round(v, 2) for k, v in avg_rating_by_distance.items()
            },
            "restaurant_clusters": clusters,
            "cuisine_competitors": cuisine_competitors
        }

    def _identify_restaurant_clusters(self, restaurants: List[Dict]) -> List[Dict]:
        """
        Identify clusters of restaurants using DBSCAN algorithm.

        Args:
            restaurants: List of restaurant data

        Returns:
            List of cluster information
        """
        if not ADVANCED_ANALYSIS_AVAILABLE:
            self.logger.warning("Advanced analysis not available. Skipping clustering.")
            return []

        # Extract coordinates
        coordinates = []
        valid_restaurants = []

        for restaurant in restaurants:
            lat = restaurant.get("latitude")
            lon = restaurant.get("longitude")
            if lat is not None and lon is not None:
                coordinates.append([lat, lon])
                valid_restaurants.append(restaurant)

        if not coordinates:
            return []

        # Convert to numpy array
        coordinates = np.array(coordinates)

        # Calculate distance matrix
        cluster_distance = self.config.get("analysis.cluster_distance", 0.2)  # km
        min_cluster_size = self.config.get("analysis.min_cluster_size", 3)

        # Run DBSCAN
        db = DBSCAN(
            eps=cluster_distance / 111.32,  # Convert km to degrees (approximate)
            min_samples=min_cluster_size,
            algorithm='ball_tree',
            metric='haversine'
        ).fit(np.radians(coordinates))

        # Get cluster labels
        labels = db.labels_

        # Count number of clusters (excluding noise points with label -1)
        n_clusters = len(set(labels)) - (1 if -1 in labels else 0)

        # Group restaurants by cluster
        clusters = []
        for i in range(n_clusters):
            cluster_indices = np.where(labels == i)[0]
            cluster_restaurants = [valid_restaurants[idx] for idx in cluster_indices]

            # Calculate cluster center
            cluster_lats = [r.get("latitude") for r in cluster_restaurants]
            cluster_lons = [r.get("longitude") for r in cluster_restaurants]
            center_lat = sum(cluster_lats) / len(cluster_lats)
            center_lon = sum(cluster_lons) / len(cluster_lons)

            # Calculate average rating
            ratings = [r.get("rating", 0) for r in cluster_restaurants if r.get("rating", 0) > 0]
            avg_rating = sum(ratings) / len(ratings) if ratings else 0

            # Count cuisines
            cuisine_counts = {}
            for restaurant in cluster_restaurants:
                for cuisine in restaurant.get("cuisine_types", []):
                    cuisine = cuisine.lower()
                    cuisine_counts[cuisine] = cuisine_counts.get(cuisine, 0) + 1

            # Get top cuisines
            top_cuisines = sorted(cuisine_counts.items(), key=lambda x: x[1], reverse=True)[:3]

            clusters.append({
                "id": i,
                "center": {
                    "latitude": center_lat,
                    "longitude": center_lon
                },
                "restaurant_count": len(cluster_restaurants),
                "average_rating": round(avg_rating, 2),
                "top_cuisines": dict(top_cuisines),
                "restaurants": [
                    {
                        "name": r.get("name", ""),
                        "rating": r.get("rating", 0),
                        "price_level": r.get("price_level", 0)
                    } for r in cluster_restaurants
                ]
            })

        return clusters

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
