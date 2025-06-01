"""
Search functionality for restaurant market research agent.
"""

import json
import requests
import os
from typing import Dict, List, Any, Optional, cast
from langchain_core.messages import AIMessage, ToolMessage
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool
from .state import AgentState
from dotenv import load_dotenv

load_dotenv()

# Get Google Maps API key from environment variables
GOOGLE_MAPS_API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY", "")

@tool
def search_for_places(
    queries: List[str],
    location: str = "Bangkok, Thailand",
    filters: Optional[Dict[str, Any]] = None
) -> List[Dict[str, Any]]:
    """
    Search for places matching the queries in the specified location.

    Args:
        queries: List of search terms (e.g., ["Thai restaurant", "cafe"])
        location: Location to search around (address or city name)
        filters: Optional filters like price_level, open_now, etc.

    Returns:
        List of places matching the queries
    """
    if not GOOGLE_MAPS_API_KEY:
        # Return mock data if API key is not available
        return _mock_place_search(queries, location)
        
    try:
        # First geocode the location to get coordinates
        geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={location}&key={GOOGLE_MAPS_API_KEY}"
        geocode_response = requests.get(geocode_url, timeout=10)
        geocode_data = geocode_response.json()
        
        if geocode_data.get("status") != "OK":
            return _mock_place_search(queries, location)
            
        location_coords = geocode_data["results"][0]["geometry"]["location"]
        lat, lng = location_coords["lat"], location_coords["lng"]
        
        results = []
        # Search for each query
    for query in queries:
            # Use Nearby Search API
            nearby_url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius=5000&keyword={query}&key={GOOGLE_MAPS_API_KEY}"
            
            # Apply filters if provided
            if filters:
                if filters.get("price_level"):
                    nearby_url += f"&maxprice={filters['price_level']}"
                if filters.get("open_now"):
                    nearby_url += "&opennow=true"
            
            nearby_response = requests.get(nearby_url, timeout=10)
            nearby_data = nearby_response.json()
            
            if nearby_data.get("status") == "OK":
                for place in nearby_data.get("results", [])[:5]:  # Limit to top 5 results
                    place_result = {
                        "name": place.get("name", "Unknown"),
                        "place_id": place.get("place_id", ""),
                        "address": place.get("vicinity", ""),
                        "lat": place.get("geometry", {}).get("location", {}).get("lat"),
                        "lng": place.get("geometry", {}).get("location", {}).get("lng"),
                        "rating": place.get("rating", 0),
                        "user_ratings_total": place.get("user_ratings_total", 0),
                        "price_level": place.get("price_level", 0),
                        "types": place.get("types", []),
                        "query": query
                    }
                    
                    # Add formatted price level
                    price_level = place.get("price_level", 0)
                    if price_level == 1:
                        place_result["price"] = "$"
                    elif price_level == 2:
                        place_result["price"] = "$$"
                    elif price_level == 3:
                        place_result["price"] = "$$$"
                    elif price_level == 4:
                        place_result["price"] = "$$$$"
                    else:
                        place_result["price"] = "Unknown"
                        
                    results.append(place_result)
        
        return results
    except Exception as e:
        print(f"Error searching for places: {e}")
        return _mock_place_search(queries, location)

def _mock_place_search(queries: List[str], location: str) -> List[Dict[str, Any]]:
    """Generate mock place search results when API is unavailable"""
    results = []
    price_levels = ["$", "$$", "$$$", "$$$$"]
    types_mapping = {
        "restaurant": ["restaurant", "food"],
        "cafe": ["cafe", "food", "point_of_interest"],
        "thai": ["restaurant", "thai"],
        "italian": ["restaurant", "italian"],
        "bakery": ["bakery", "food", "store"],
        "bar": ["bar", "point_of_interest"],
        "sushi": ["restaurant", "japanese"]
    }
    
    # Generate mock data for each query
    for i, query in enumerate(queries):
        key_terms = query.lower().split()
        
        # Find relevant types based on the query
        types = ["restaurant", "food"]
        for term in key_terms:
            if term in types_mapping:
                types = types_mapping[term]
                break
        
        # Generate 3 mock results per query
        for j in range(3):
            place_id = f"mock_place_{i}_{j}"
            price_index = min(i % 4, 3)
            
            result = {
                "name": f"{query.title()} Place {j+1}",
                "place_id": place_id,
                "address": f"{123 + j} Main St, {location}",
                "lat": 13.7563 + (i * 0.01) + (j * 0.001),
                "lng": 100.5018 + (i * 0.01) + (j * 0.001),
                "rating": min(4 + (j * 0.2), 5),
                "user_ratings_total": 50 + (j * 10),
                "price_level": price_index,
                "price": price_levels[price_index],
                "types": types,
                "query": query
            }
            results.append(result)
    
    return results

@tool
def get_place_details(place_id: str) -> Dict[str, Any]:
    """
    Get detailed information about a place using its place_id.

    Args:
        place_id: The Google Maps place ID

    Returns:
        Detailed information about the place
    """
    if not GOOGLE_MAPS_API_KEY or place_id.startswith("mock_"):
        return _mock_place_details(place_id)
        
    try:
        url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=name,formatted_address,geometry,rating,formatted_phone_number,website,price_level,opening_hours,review,type&key={GOOGLE_MAPS_API_KEY}"
        response = requests.get(url, timeout=10)
        data = response.json()
        
        if data.get("status") == "OK" and data.get("result"):
            result = data["result"]
            
            place_details = {
                "name": result.get("name", "Unknown"),
                "address": result.get("formatted_address", ""),
                "lat": result.get("geometry", {}).get("location", {}).get("lat"),
                "lng": result.get("geometry", {}).get("location", {}).get("lng"),
                "phone": result.get("formatted_phone_number", ""),
                "website": result.get("website", ""),
                "rating": result.get("rating", 0),
                "price_level": result.get("price_level", 0),
                "types": result.get("types", [])
            }
            
            # Add opening hours if available
            if "opening_hours" in result:
                place_details["opening_hours"] = {
                    "weekday_text": result["opening_hours"].get("weekday_text", []),
                    "open_now": result["opening_hours"].get("open_now", False)
                }
                
            # Add reviews if available
            if "reviews" in result:
                place_details["reviews"] = [
                    {
                        "author_name": review.get("author_name", ""),
                        "rating": review.get("rating", 0),
                        "text": review.get("text", ""),
                        "time": review.get("time", 0)
                    } for review in result["reviews"][:3]  # Limit to 3 reviews
                ]
                
            return place_details
        else:
            return _mock_place_details(place_id)
    except Exception as e:
        print(f"Error getting place details: {e}")
        return _mock_place_details(place_id)

def _mock_place_details(place_id: str) -> Dict[str, Any]:
    """Generate mock place details when API is unavailable"""
    # Parse information from the mock place_id
    parts = place_id.split("_")
    
    if len(parts) >= 3:
        query_index = int(parts[2])
        result_index = int(parts[3]) if len(parts) >= 4 else 0
    else:
        query_index = 0
        result_index = 0
    
    price_level = min(result_index + 1, 4)
    price_symbols = "$" * price_level
    
    return {
        "name": f"Mock Restaurant {query_index}-{result_index}",
        "address": f"{100 + result_index} Main Street, Bangkok, Thailand",
        "lat": 13.7563 + (query_index * 0.01) + (result_index * 0.001),
        "lng": 100.5018 + (query_index * 0.01) + (result_index * 0.001),
        "phone": f"+66 2 123 456{result_index}",
        "website": f"https://example.com/restaurant-{query_index}-{result_index}",
        "rating": min(4 + (result_index * 0.2), 5),
        "price_level": price_level,
        "price": price_symbols,
        "types": ["restaurant", "food", "point_of_interest"],
        "opening_hours": {
            "weekday_text": [
                "Monday: 10:00 AM – 10:00 PM",
                "Tuesday: 10:00 AM – 10:00 PM",
                "Wednesday: 10:00 AM – 10:00 PM",
                "Thursday: 10:00 AM – 10:00 PM",
                "Friday: 10:00 AM – 11:00 PM",
                "Saturday: 10:00 AM – 11:00 PM",
                "Sunday: 10:00 AM – 10:00 PM"
            ],
            "open_now": True
        },
        "reviews": [
            {
                "author_name": "John Doe",
                "rating": 4,
                "text": "Great food and service! Highly recommended.",
                "time": 1600000000
            },
            {
                "author_name": "Jane Smith",
                "rating": 5,
                "text": "Amazing place with authentic cuisine.",
                "time": 1600100000
            }
        ]
    }

async def search_node(state: AgentState, config: RunnableConfig):
    """Handle search operations"""
    # Extract the last AI message with tool calls
    messages = state.get("messages", [])
    last_ai_message = next((msg for msg in reversed(messages) if isinstance(msg, AIMessage)), None)
    
    if not last_ai_message or not last_ai_message.tool_calls:
        return {"messages": messages}
    
    # Execute the tool call
    tool_call = last_ai_message.tool_calls[0]
    tool_name = tool_call["name"]
    tool_args = tool_call["args"]
    
    result = None
    if tool_name == "search_for_places":
        result = search_for_places(**tool_args)
    elif tool_name == "get_place_details":
        result = get_place_details(**tool_args)
    
    # Create a tool message with the result
    if result:
        tool_message = ToolMessage(
            tool_call_id=tool_call["id"],
            content=json.dumps(result, indent=2),
            name=tool_name
        )
        
        # Update search progress in the state
        search_progress = state.get("search_progress", [])
        search_progress.append({
            "timestamp": import time; time.time(),
            "query": tool_args.get("queries", []) if tool_name == "search_for_places" else tool_args.get("place_id", ""),
            "result_count": len(result) if isinstance(result, list) else 1
        })
        
        return {
            "messages": [*messages, tool_message],
            "search_progress": search_progress
        }
    
    return {"messages": messages}
