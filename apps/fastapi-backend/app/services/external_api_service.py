"""
External API service for BiteBase FastAPI Backend
"""

from typing import List, Dict, Any, Optional
import httpx
import asyncio
import structlog
from datetime import datetime

from app.core.config import settings
from app.core.exceptions import ExternalServiceError
from app.schemas.restaurant import WongnaiSearchParams, BatchMenuResponse, RealDataFetchRequest

logger = structlog.get_logger()

class ExternalAPIService:
    def __init__(self):
        self.timeout = httpx.Timeout(30.0)

    async def search_wongnai_restaurants(self, search_params: WongnaiSearchParams) -> List[Dict[str, Any]]:
        """Search restaurants from Wongnai API"""
        try:
            # Mock Wongnai API response since we don't have actual API access
            mock_restaurants = [
                {
                    "platform": "wongnai",
                    "platform_id": "wongnai_001",
                    "name": "Som Tam Nua",
                    "latitude": search_params.latitude or 13.7563,
                    "longitude": search_params.longitude or 100.5018,
                    "address": "392/14 Siam Square Soi 5, Pathum Wan, Bangkok",
                    "cuisine": search_params.cuisine or "Thai",
                    "rating": 4.3,
                    "price_range": "budget",
                    "phone": "+66 2 251 4880",
                    "website": "https://www.wongnai.com/restaurants/som-tam-nua",
                    "hours": "11:00-22:00",
                    "features": ["Delivery", "Takeout", "Outdoor Seating"],
                    "images": ["https://example.com/image1.jpg"]
                },
                {
                    "platform": "wongnai",
                    "platform_id": "wongnai_002",
                    "name": "Gaggan Anand",
                    "latitude": search_params.latitude or 13.7563,
                    "longitude": search_params.longitude or 100.5018,
                    "address": "68/1 Soi Langsuan, Ploenchit Rd, Lumpini, Pathum Wan, Bangkok",
                    "cuisine": "Indian",
                    "rating": 4.8,
                    "price_range": "luxury",
                    "phone": "+66 2 652 1700",
                    "website": "https://www.gaggan.com",
                    "hours": "18:00-24:00",
                    "features": ["Fine Dining", "Reservations Required"],
                    "images": ["https://example.com/image2.jpg"]
                }
            ]
            
            # Filter by query if provided
            if search_params.query:
                query_lower = search_params.query.lower()
                mock_restaurants = [
                    r for r in mock_restaurants 
                    if query_lower in r["name"].lower() or query_lower in r["cuisine"].lower()
                ]
            
            # Limit results
            limit = search_params.limit or 20
            return mock_restaurants[:limit]
            
        except Exception as e:
            logger.error("Wongnai API search failed", error=str(e))
            raise ExternalServiceError("Wongnai API service unavailable")

    async def get_batch_menus(self, public_ids: List[str]) -> BatchMenuResponse:
        """Get menus for multiple restaurants"""
        try:
            successful_menus = []
            failed_ids = []
            
            for public_id in public_ids:
                try:
                    # Mock menu data
                    menu = {
                        "publicId": public_id,
                        "restaurant_name": f"Restaurant {public_id}",
                        "menu_categories": [
                            {
                                "id": "appetizers",
                                "name": "Appetizers",
                                "items": [
                                    {
                                        "id": "app_001",
                                        "name": "Spring Rolls",
                                        "description": "Fresh vegetables wrapped in rice paper",
                                        "price": 120,
                                        "image": "https://example.com/spring-rolls.jpg",
                                        "isAvailable": True
                                    }
                                ]
                            },
                            {
                                "id": "mains",
                                "name": "Main Courses",
                                "items": [
                                    {
                                        "id": "main_001",
                                        "name": "Pad Thai",
                                        "description": "Traditional Thai stir-fried noodles",
                                        "price": 180,
                                        "image": "https://example.com/pad-thai.jpg",
                                        "isAvailable": True
                                    }
                                ]
                            }
                        ],
                        "delivery_info": {
                            "isAvailable": True,
                            "minimumOrder": 200,
                            "deliveryFee": 30,
                            "estimatedTime": "30-45 minutes"
                        },
                        "last_updated": datetime.utcnow().isoformat()
                    }
                    successful_menus.append(menu)
                    
                except Exception as e:
                    logger.warning(f"Failed to get menu for {public_id}", error=str(e))
                    failed_ids.append(public_id)
            
            return BatchMenuResponse(
                status="completed",
                total_requested=len(public_ids),
                successful_count=len(successful_menus),
                failed_count=len(failed_ids),
                menus=successful_menus,
                errors=[f"Failed to fetch menu for {pid}" for pid in failed_ids]
            )
            
        except Exception as e:
            logger.error("Batch menu fetch failed", error=str(e))
            raise ExternalServiceError("Menu service unavailable")

    async def fetch_real_restaurant_data(self, fetch_request: RealDataFetchRequest) -> Dict[str, Any]:
        """Fetch real restaurant data from external APIs"""
        try:
            all_restaurants = []
            platforms_searched = fetch_request.platforms or ["wongnai", "google"]
            
            # Fetch from each platform
            for platform in platforms_searched:
                try:
                    if platform == "wongnai":
                        restaurants = await self._fetch_wongnai_data(fetch_request)
                    elif platform == "google":
                        restaurants = await self._fetch_google_places_data(fetch_request)
                    elif platform == "yelp":
                        restaurants = await self._fetch_yelp_data(fetch_request)
                    else:
                        logger.warning(f"Unknown platform: {platform}")
                        continue
                    
                    all_restaurants.extend(restaurants)
                    
                except Exception as e:
                    logger.warning(f"Failed to fetch from {platform}", error=str(e))
            
            # Remove duplicates based on name and location
            unique_restaurants = self._deduplicate_restaurants(all_restaurants)
            
            # Select sample restaurants for preview
            sample_restaurants = unique_restaurants[:5]
            
            return {
                "status": "success",
                "location": {
                    "latitude": fetch_request.latitude,
                    "longitude": fetch_request.longitude,
                    "radius": fetch_request.radius
                },
                "platforms_searched": platforms_searched,
                "restaurants_found": {platform: len([r for r in unique_restaurants if r.get("platform") == platform]) for platform in platforms_searched},
                "all_restaurants": unique_restaurants,
                "sample_restaurants": sample_restaurants,
                "message": f"Successfully fetched {len(unique_restaurants)} unique restaurants"
            }
            
        except Exception as e:
            logger.error("Real data fetch failed", error=str(e))
            raise ExternalServiceError("External data fetch service unavailable")

    async def _fetch_wongnai_data(self, fetch_request: RealDataFetchRequest) -> List[Dict[str, Any]]:
        """Fetch data from Wongnai API (mock implementation)"""
        # Mock Wongnai data
        return [
            {
                "platform": "wongnai",
                "platform_id": f"wongnai_{i:03d}",
                "name": f"Thai Restaurant {i}",
                "latitude": fetch_request.latitude + (i * 0.001),
                "longitude": fetch_request.longitude + (i * 0.001),
                "address": f"Address {i}, Bangkok, Thailand",
                "cuisine": "Thai",
                "rating": 4.0 + (i % 10) * 0.1,
                "price_range": ["budget", "moderate", "upscale"][i % 3],
                "phone": f"+66 2 123 {i:04d}",
                "hours": "10:00-22:00",
                "features": ["Delivery", "Takeout"],
                "images": [f"https://example.com/wongnai_{i}.jpg"]
            }
            for i in range(1, 11)  # Generate 10 mock restaurants
        ]

    async def _fetch_google_places_data(self, fetch_request: RealDataFetchRequest) -> List[Dict[str, Any]]:
        """Fetch data from Google Places API (mock implementation)"""
        # Mock Google Places data
        return [
            {
                "platform": "google",
                "platform_id": f"google_{i:03d}",
                "name": f"International Restaurant {i}",
                "latitude": fetch_request.latitude + (i * 0.002),
                "longitude": fetch_request.longitude + (i * 0.002),
                "address": f"Street {i}, City, Country",
                "cuisine": ["Italian", "Chinese", "Mexican", "Japanese"][i % 4],
                "rating": 3.5 + (i % 15) * 0.1,
                "price_range": ["moderate", "upscale"][i % 2],
                "phone": f"+1 555 {i:03d} {i:04d}",
                "hours": "11:00-23:00",
                "features": ["Dine-in", "Takeout", "Delivery"],
                "images": [f"https://example.com/google_{i}.jpg"]
            }
            for i in range(1, 8)  # Generate 7 mock restaurants
        ]

    async def _fetch_yelp_data(self, fetch_request: RealDataFetchRequest) -> List[Dict[str, Any]]:
        """Fetch data from Yelp API (mock implementation)"""
        # Mock Yelp data
        return [
            {
                "platform": "yelp",
                "platform_id": f"yelp_{i:03d}",
                "name": f"Local Eatery {i}",
                "latitude": fetch_request.latitude + (i * 0.0015),
                "longitude": fetch_request.longitude + (i * 0.0015),
                "address": f"Local Street {i}, Neighborhood",
                "cuisine": ["American", "Fusion", "Vegetarian"][i % 3],
                "rating": 3.8 + (i % 12) * 0.1,
                "price_range": ["budget", "moderate"][i % 2],
                "phone": f"+1 555 YEL {i:04d}",
                "hours": "12:00-21:00",
                "features": ["Outdoor Seating", "WiFi", "Pet Friendly"],
                "images": [f"https://example.com/yelp_{i}.jpg"]
            }
            for i in range(1, 6)  # Generate 5 mock restaurants
        ]

    def _deduplicate_restaurants(self, restaurants: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate restaurants based on name and location"""
        seen = set()
        unique_restaurants = []
        
        for restaurant in restaurants:
            # Create a key based on name and approximate location
            name_key = restaurant.get("name", "").lower().strip()
            lat_key = round(restaurant.get("latitude", 0), 3)  # Round to ~100m precision
            lon_key = round(restaurant.get("longitude", 0), 3)
            
            key = (name_key, lat_key, lon_key)
            
            if key not in seen:
                seen.add(key)
                unique_restaurants.append(restaurant)
        
        return unique_restaurants

    async def get_restaurant_details(self, platform: str, platform_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed information for a specific restaurant"""
        try:
            if platform == "wongnai":
                return await self._get_wongnai_details(platform_id)
            elif platform == "google":
                return await self._get_google_details(platform_id)
            elif platform == "yelp":
                return await self._get_yelp_details(platform_id)
            else:
                logger.warning(f"Unknown platform for details: {platform}")
                return None
                
        except Exception as e:
            logger.error(f"Failed to get {platform} details", platform_id=platform_id, error=str(e))
            return None

    async def _get_wongnai_details(self, platform_id: str) -> Dict[str, Any]:
        """Get detailed Wongnai restaurant information"""
        # Mock detailed data
        return {
            "platform": "wongnai",
            "platform_id": platform_id,
            "detailed_info": {
                "opening_hours": {
                    "monday": "10:00-22:00",
                    "tuesday": "10:00-22:00",
                    "wednesday": "10:00-22:00",
                    "thursday": "10:00-22:00",
                    "friday": "10:00-23:00",
                    "saturday": "10:00-23:00",
                    "sunday": "10:00-22:00"
                },
                "amenities": ["WiFi", "Air Conditioning", "Parking"],
                "payment_methods": ["Cash", "Credit Card", "Mobile Payment"],
                "reviews_summary": {
                    "total_reviews": 245,
                    "average_rating": 4.3,
                    "rating_distribution": {
                        "5": 120,
                        "4": 85,
                        "3": 30,
                        "2": 8,
                        "1": 2
                    }
                }
            }
        }

    async def _get_google_details(self, platform_id: str) -> Dict[str, Any]:
        """Get detailed Google Places restaurant information"""
        # Mock detailed data
        return {
            "platform": "google",
            "platform_id": platform_id,
            "detailed_info": {
                "place_id": platform_id,
                "business_status": "OPERATIONAL",
                "types": ["restaurant", "food", "establishment"],
                "website": f"https://restaurant-{platform_id}.com",
                "international_phone_number": "+1 555-123-4567",
                "reviews": [
                    {
                        "author_name": "John D.",
                        "rating": 5,
                        "text": "Great food and service!",
                        "time": 1640995200
                    }
                ]
            }
        }

    async def _get_yelp_details(self, platform_id: str) -> Dict[str, Any]:
        """Get detailed Yelp restaurant information"""
        # Mock detailed data
        return {
            "platform": "yelp",
            "platform_id": platform_id,
            "detailed_info": {
                "yelp_id": platform_id,
                "categories": [
                    {"alias": "restaurants", "title": "Restaurants"},
                    {"alias": "american", "title": "American (Traditional)"}
                ],
                "transactions": ["delivery", "pickup"],
                "price": "$$",
                "hours": [
                    {
                        "open": [
                            {"is_overnight": False, "start": "1100", "end": "2100", "day": 0}
                        ],
                        "hours_type": "REGULAR",
                        "is_open_now": True
                    }
                ]
            }
        }