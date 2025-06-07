"""
Mapbox API service for BiteBase AI Agent
Replaces Google Maps functionality with Mapbox services
"""

import os
import requests
import logging
from typing import List, Dict, Any, Optional, Tuple
from langchain.tools import tool

logger = logging.getLogger(__name__)

class MapboxService:
    """Service for interacting with Mapbox APIs"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("MAPBOX_API_KEY")
        if not self.api_key:
            logger.warning("Mapbox API key not provided")
        
        self.base_url = "https://api.mapbox.com"
        self.session = requests.Session()
    
    def geocode_address(self, address: str) -> Optional[Dict[str, Any]]:
        """
        Geocode an address using Mapbox Geocoding API
        
        Args:
            address: Address to geocode
            
        Returns:
            Dictionary with geocoding results or None if failed
        """
        if not self.api_key:
            return None
            
        try:
            url = f"{self.base_url}/geocoding/v5/mapbox.places/{requests.utils.quote(address)}.json"
            params = {
                "access_token": self.api_key,
                "limit": 1
            }
            
            response = self.session.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("features"):
                feature = data["features"][0]
                longitude, latitude = feature["center"]
                
                # Extract additional info from context
                city = ""
                country = ""
                postal_code = ""
                
                if feature.get("context"):
                    for ctx in feature["context"]:
                        if ctx["id"].startswith("place."):
                            city = ctx["text"]
                        elif ctx["id"].startswith("country."):
                            country = ctx["text"]
                        elif ctx["id"].startswith("postcode."):
                            postal_code = ctx["text"]
                
                return {
                    "latitude": latitude,
                    "longitude": longitude,
                    "formatted_address": feature["place_name"],
                    "place_id": feature["id"],
                    "city": city,
                    "country": country,
                    "postal_code": postal_code
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Geocoding error: {str(e)}")
            return None
    
    def reverse_geocode(self, latitude: float, longitude: float) -> Optional[Dict[str, Any]]:
        """
        Reverse geocode coordinates to get address
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            
        Returns:
            Dictionary with address information or None if failed
        """
        if not self.api_key:
            return None
            
        try:
            url = f"{self.base_url}/geocoding/v5/mapbox.places/{longitude},{latitude}.json"
            params = {
                "access_token": self.api_key,
                "limit": 1
            }
            
            response = self.session.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("features"):
                feature = data["features"][0]
                
                return {
                    "latitude": latitude,
                    "longitude": longitude,
                    "formatted_address": feature["place_name"],
                    "place_id": feature["id"]
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Reverse geocoding error: {str(e)}")
            return None
    
    def search_nearby_places(
        self, 
        latitude: float, 
        longitude: float, 
        query: str = "restaurant",
        radius: int = 1000,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """
        Search for places near a location
        
        Args:
            latitude: Center latitude
            longitude: Center longitude
            query: Search query (e.g., "restaurant", "cafe")
            radius: Search radius in meters
            limit: Maximum number of results
            
        Returns:
            List of place dictionaries
        """
        if not self.api_key:
            return []
            
        try:
            url = f"{self.base_url}/geocoding/v5/mapbox.places/{requests.utils.quote(query)}.json"
            params = {
                "access_token": self.api_key,
                "proximity": f"{longitude},{latitude}",
                "limit": limit,
                "types": "poi"
            }
            
            response = self.session.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            places = []
            
            if data.get("features"):
                for feature in data["features"]:
                    place_lng, place_lat = feature["center"]
                    
                    # Calculate distance and filter by radius
                    distance = self._calculate_distance(latitude, longitude, place_lat, place_lng)
                    if distance <= radius:
                        place_info = {
                            "id": feature["id"],
                            "name": feature["place_name"].split(",")[0],
                            "address": feature["place_name"],
                            "latitude": place_lat,
                            "longitude": place_lng,
                            "distance": distance,
                            "category": feature.get("properties", {}).get("category", "restaurant")
                        }
                        
                        # Add additional properties if available
                        properties = feature.get("properties", {})
                        if properties.get("tel"):
                            place_info["phone"] = properties["tel"]
                        if properties.get("website"):
                            place_info["website"] = properties["website"]
                        
                        places.append(place_info)
            
            # Sort by distance
            places.sort(key=lambda x: x["distance"])
            return places
            
        except Exception as e:
            logger.error(f"Place search error: {str(e)}")
            return []
    
    def _calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two coordinates in meters"""
        import math
        
        R = 6371000  # Earth's radius in meters
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)
        
        a = (math.sin(delta_phi / 2) ** 2 + 
             math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        
        return R * c

# Initialize global service instance
mapbox_service = MapboxService()

@tool
def search_for_establishments_mapbox(
    queries: List[str], 
    location: str = "Bangkok, Thailand",
    radius: int = 2000,
    filters: Optional[Dict[str, Any]] = None
) -> List[Dict[str, Any]]:
    """
    Search for restaurants and cafes using Mapbox API.
    
    Args:
        queries: List of search queries (e.g., "coffee shops", "Italian restaurants")
        location: Location to search around (address or place name)
        radius: Search radius in meters (default: 2000)
        filters: Optional dictionary of filters
        
    Returns:
        List of establishment data including name, address, coordinates, and business details
    """
    try:
        # First geocode the location
        location_data = mapbox_service.geocode_address(location)
        if not location_data:
            logger.error(f"Could not geocode location: {location}")
            return []
        
        latitude = location_data["latitude"]
        longitude = location_data["longitude"]
        
        all_establishments = []
        
        for query in queries:
            # Search for places
            places = mapbox_service.search_nearby_places(
                latitude, longitude, query, radius, 20
            )
            
            # Convert to standard format
            for place in places:
                establishment = {
                    "name": place["name"],
                    "address": place["address"],
                    "latitude": place["latitude"],
                    "longitude": place["longitude"],
                    "place_id": place["id"],
                    "category": place["category"],
                    "distance_meters": place["distance"],
                    "source": "mapbox"
                }
                
                # Add optional fields
                if place.get("phone"):
                    establishment["phone"] = place["phone"]
                if place.get("website"):
                    establishment["website"] = place["website"]
                
                all_establishments.append(establishment)
        
        # Remove duplicates based on place_id
        seen_ids = set()
        unique_establishments = []
        for est in all_establishments:
            if est["place_id"] not in seen_ids:
                seen_ids.add(est["place_id"])
                unique_establishments.append(est)
        
        # Sort by distance
        unique_establishments.sort(key=lambda x: x["distance_meters"])
        
        return unique_establishments
        
    except Exception as e:
        logger.error(f"Error searching establishments with Mapbox: {str(e)}")
        return []

@tool
def geocode_address_mapbox(address: str) -> Dict[str, Any]:
    """
    Geocode an address using Mapbox Geocoding API.
    
    Args:
        address: Address to geocode
        
    Returns:
        Dictionary with geocoding results
    """
    result = mapbox_service.geocode_address(address)
    if result:
        return result
    else:
        return {"error": "Geocoding failed", "address": address}
