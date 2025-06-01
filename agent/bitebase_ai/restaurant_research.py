"""
Restaurant market research functionality.
This module provides specialized analysis for restaurant market research.
"""

import os
import json
import time
import random
from typing import Dict, List, Any, Optional, cast
from langchain_core.messages import ToolMessage, AIMessage
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool
from .state import AgentState
from .core.llm_client import LLMClient

# Initialize the LLM client
llm_client = LLMClient()

# Add run_research function
def run_research(location: str, cuisine_type: str, additional_context: Optional[Dict] = None, use_real_data: bool = True) -> Dict[str, Any]:
    """
    Run comprehensive restaurant market research for a specific location and cuisine type.
    
    Args:
        location: Address or area to analyze
        cuisine_type: Type of cuisine
        additional_context: Optional additional context for the analysis
        use_real_data: Whether to use real data from Google Maps API when available
        
    Returns:
        Dictionary containing market data, competitor analysis, location data, 
        customer insights, and financial analysis
    """
    # Try to get geocoded coordinates for the location
    coordinates = None
    if use_real_data:
        try:
            import requests
            import os
            
            # Try to get Google Maps API key from environment
            api_key = os.environ.get("GOOGLE_MAPS_API_KEY", "")
            
            if api_key:
                # Geocode the location to get coordinates
                geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={location}&key={api_key}"
                response = requests.get(geocode_url)
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("status") == "OK" and data.get("results"):
                        geometry = data["results"][0]["geometry"]["location"]
                        coordinates = {"latitude": geometry["lat"], "longitude": geometry["lng"]}
        except Exception as e:
            print(f"Error geocoding location: {str(e)}")
    
    # If we have coordinates and want to use real data, try to get real restaurant data
    real_restaurant_data = None
    if coordinates and use_real_data:
        try:
            # Import the RestaurantDataAgent
            from .agents.restaurant_data_agent import RestaurantDataAgent
            
            # Create an instance of the agent
            restaurant_data_agent = RestaurantDataAgent()
            
            # Get real restaurant data
            radius_km = 1.0  # Default radius
            real_data_results = restaurant_data_agent.run(
                latitude=coordinates["latitude"],
                longitude=coordinates["longitude"],
                radius_km=radius_km,
                platforms=["google_maps"],
                match=False,
                use_real_data=True
            )
            
            # Check if we found real data
            if real_data_results.get("metadata", {}).get("real_data_found", False):
                print(f"Using real restaurant data for research at {location}")
                real_restaurant_data = real_data_results
        except Exception as e:
            print(f"Error getting real restaurant data: {str(e)}")
    
    # Get market analysis - use real data if available
    if real_restaurant_data and coordinates:
        # Use real data for market analysis
        market_data = {
            "location_analyzed": location,
            "coordinates": coordinates,
            "cuisine_type": cuisine_type,
            "real_data": True,
            "demographics": analyze_demographics(location),
            "competition": {
                "similar_restaurants_count": len(real_restaurant_data.get("platforms", {}).get("google_maps", [])),
                "average_rating": sum(r.get("rating", 0) for r in real_restaurant_data.get("platforms", {}).get("google_maps", [])) / 
                                 max(1, len(real_restaurant_data.get("platforms", {}).get("google_maps", []))),
                "restaurants": real_restaurant_data.get("platforms", {}).get("google_maps", [])
            },
            "market_potential": {
                "overall_score": calculate_market_potential_score(real_restaurant_data, coordinates, cuisine_type),
                "timestamp": time.time()
            }
        }
    else:
        # Fall back to simulated data
        market_data = analyze_market(location=location, cuisine_type=cuisine_type)
    
    # Get competitor analysis - use real data if available
    if real_restaurant_data and coordinates:
        # Use real data for competitor analysis
        competitor_data = {
            "location": location,
            "restaurant_type": cuisine_type,
            "real_data": True,
            "total_competitors": len(real_restaurant_data.get("platforms", {}).get("google_maps", [])),
            "competitors": real_restaurant_data.get("platforms", {}).get("google_maps", []),
            "timestamp": time.time()
        }
    else:
        # Fall back to simulated data
        competitor_data = analyze_competitors(location=location, restaurant_type=cuisine_type)
    
    # Get location analysis
    location_data = analyze_location(address=location)
    
    # Get demographic data
    demographic_data = analyze_demographics(location)
    
    # Calculate foot traffic
    foot_traffic = calculate_foot_traffic(location=location)
    
    # Generate customer insights
    customer_insights = {
        "target_demographics": _generate_target_demographics(demographic_data, cuisine_type),
        "dining_preferences": _generate_dining_preferences(cuisine_type),
        "price_sensitivity": _generate_price_sensitivity(demographic_data),
        "marketing_channels": _generate_marketing_channels(demographic_data),
        "loyalty_potential": _generate_loyalty_potential(cuisine_type)
    }
    
    # Generate financial analysis
    financial_analysis = {
        "estimated_startup_cost": _generate_startup_cost(location_data, cuisine_type),
        "estimated_monthly_revenue": _generate_monthly_revenue(market_data, competitor_data, foot_traffic),
        "estimated_monthly_expenses": _generate_monthly_expenses(location_data, cuisine_type),
        "estimated_profit_margin": _generate_profit_margin(cuisine_type),
        "breakeven_estimate": _generate_breakeven_estimate(cuisine_type),
        "roi_projection": _generate_roi_projection(cuisine_type)
    }
    
    return {
        "market_data": market_data,
        "competitor_analysis": competitor_data,
        "location_data": {**location_data, **foot_traffic, **demographic_data},
        "customer_insights": customer_insights,
        "financial_analysis": financial_analysis,
        "metadata": {
            "data_source": "real" if real_restaurant_data else "simulated",
            "timestamp": time.time(),
            "location": location,
            "cuisine_type": cuisine_type
        }
    }

# Helper function to calculate market potential score from real data
def calculate_market_potential_score(restaurant_data, coordinates, cuisine_type):
    """Calculate a market potential score based on real restaurant data"""
    restaurants = restaurant_data.get("platforms", {}).get("google_maps", [])
    
    if not restaurants:
        return 5.0  # Default neutral score
    
    # Count number of restaurants with the same cuisine type
    similar_cuisine_count = 0
    for restaurant in restaurants:
        cuisine_types = [c.lower() for c in restaurant.get("cuisine_types", [])]
        if any(cuisine_type.lower() in c for c in cuisine_types):
            similar_cuisine_count += 1
    
    # Calculate average rating
    avg_rating = sum(r.get("rating", 0) for r in restaurants) / len(restaurants)
    
    # Calculate competition saturation
    saturation = similar_cuisine_count / len(restaurants)
    
    # Calculate market score (higher ratings are good, but too much saturation is bad)
    market_score = (avg_rating * 1.5) - (saturation * 5) + 5
    
    # Cap the score between 1-10
    return max(1, min(10, market_score))

# Helper functions for customer insights
def _generate_target_demographics(demographic_data: Dict[str, Any], cuisine_type: str) -> Dict[str, Any]:
    # Generate target demographics based on cuisine type and demographic data
    age_groups = demographic_data.get("age_distribution", {})
    
    # Different cuisines appeal to different demographics
    cuisine_preferences = {
        "thai": {"primary": ["25-34", "35-44"], "secondary": ["18-24", "45-54"]},
        "italian": {"primary": ["35-44", "45-54"], "secondary": ["25-34", "55+"]},
        "japanese": {"primary": ["25-34", "35-44"], "secondary": ["18-24"]},
        "fast food": {"primary": ["18-24", "25-34"], "secondary": ["35-44"]},
        "indian": {"primary": ["25-34", "35-44"], "secondary": ["45-54"]},
        "chinese": {"primary": ["25-34", "35-44", "45-54"], "secondary": ["18-24"]},
        "mexican": {"primary": ["18-24", "25-34"], "secondary": ["35-44"]},
        "french": {"primary": ["35-44", "45-54", "55+"], "secondary": ["25-34"]},
        "middle eastern": {"primary": ["25-34", "35-44"], "secondary": ["18-24", "45-54"]},
    }
    
    # Default to a balanced demographic if cuisine not found
    target_demo = {"primary": ["25-34", "35-44"], "secondary": ["18-24", "45-54"]}
    
    # Find matching cuisine preferences
    for cuisine, demo in cuisine_preferences.items():
        if cuisine in cuisine_type.lower():
            target_demo = demo
            break
    
    return {
        "primary_age_groups": target_demo["primary"],
        "secondary_age_groups": target_demo["secondary"],
        "income_level": demographic_data.get("income_data", {}).get("median_household_income", "$50K"),
        "lifestyle": _generate_lifestyle_for_cuisine(cuisine_type),
        "dining_frequency": random.choice(["1-2 times per week", "2-3 times per week", "3-4 times per week"])
    }

def _generate_lifestyle_for_cuisine(cuisine_type: str) -> List[str]:
    # Generate lifestyle traits based on cuisine type
    lifestyle_traits = {
        "thai": ["health-conscious", "adventurous", "experience-seeking"],
        "italian": ["family-oriented", "traditional", "social"],
        "japanese": ["health-conscious", "quality-focused", "trend-aware"],
        "fast food": ["convenience-oriented", "budget-conscious", "time-limited"],
        "indian": ["flavor-seeking", "culturally-aware", "community-oriented"],
        "chinese": ["family-oriented", "value-conscious", "traditional"],
        "mexican": ["social", "casual", "experience-seeking"],
        "french": ["luxury-oriented", "quality-focused", "sophisticated"],
        "middle eastern": ["health-conscious", "culturally-aware", "community-oriented"]
    }
    
    # Default lifestyle traits
    traits = ["social", "food-oriented", "experience-seeking"]
    
    # Find matching cuisine lifestyle traits
    for cuisine, cuisine_traits in lifestyle_traits.items():
        if cuisine in cuisine_type.lower():
            traits = cuisine_traits
            break
    
    return traits

def _generate_dining_preferences(cuisine_type: str) -> Dict[str, Any]:
    # Generate dining preferences based on cuisine type
    return {
        "ambiance_preference": random.choice(["casual", "upscale casual", "fine dining", "trendy", "family-friendly"]),
        "average_dining_time": random.choice(["30-45 minutes", "45-60 minutes", "60-90 minutes", "90+ minutes"]),
        "group_size": random.choice(["mostly couples", "small groups (3-4)", "families", "mixed"]),
        "reservation_behavior": random.choice(["rarely books ahead", "sometimes books ahead", "frequently books ahead"]),
        "special_occasions": random.choice([True, False])
    }

def _generate_price_sensitivity(demographic_data: Dict[str, Any]) -> Dict[str, Any]:
    # Generate price sensitivity based on demographic data
    income_distribution = demographic_data.get("income_data", {}).get("income_distribution", {})
    
    # Calculate price sensitivity based on income distribution
    high_income = income_distribution.get("high_income", 0.2)
    
    if high_income > 0.4:
        sensitivity = "low"
        price_range = "$$$-$$$$"
    elif high_income > 0.25:
        sensitivity = "moderate"
        price_range = "$$-$$$"
    else:
        sensitivity = "high"
        price_range = "$-$$"
    
    return {
        "price_sensitivity": sensitivity,
        "optimal_price_range": price_range,
        "value_perception_factors": ["portion size", "quality", "service", "ambiance"],
        "discount_responsiveness": random.choice(["high", "moderate", "low"])
    }

def _generate_marketing_channels(demographic_data: Dict[str, Any]) -> List[str]:
    # Generate effective marketing channels based on demographic data
    age_distribution = demographic_data.get("age_distribution", {})
    
    channels = []
    
    # Add social media if younger demographic is significant
    if age_distribution.get("18-24", 0) > 0.15 or age_distribution.get("25-34", 0) > 0.2:
        channels.extend(["instagram", "tiktok", "social media ads"])
    
    # Add traditional channels if older demographic is significant
    if age_distribution.get("45-54", 0) > 0.2 or age_distribution.get("55+", 0) > 0.25:
        channels.extend(["local publications", "direct mail"])
    
    # Add general channels
    channels.extend(["google maps", "food delivery apps", "local partnerships"])
    
    return channels

def _generate_loyalty_potential(cuisine_type: str) -> Dict[str, Any]:
    # Generate loyalty potential based on cuisine type
    cuisine_loyalty = {
        "thai": 0.7,
        "italian": 0.8,
        "japanese": 0.75,
        "fast food": 0.5,
        "indian": 0.75,
        "chinese": 0.65,
        "mexican": 0.6,
        "french": 0.85,
        "middle eastern": 0.7
    }
    
    # Default loyalty score
    loyalty_score = 0.65
    
    # Find matching cuisine loyalty score
    for cuisine, score in cuisine_loyalty.items():
        if cuisine in cuisine_type.lower():
            loyalty_score = score
            break
    
    # Determine loyalty level
    if loyalty_score > 0.75:
        loyalty_level = "high"
    elif loyalty_score > 0.6:
        loyalty_level = "moderate"
    else:
        loyalty_level = "low"
    
    return {
        "loyalty_potential": loyalty_level,
        "repeat_visit_frequency": random.choice(["weekly", "bi-weekly", "monthly"]),
        "loyalty_program_effectiveness": random.choice(["high", "moderate", "low"]),
        "recommended_loyalty_strategies": _generate_loyalty_strategies(loyalty_level)
    }

def _generate_loyalty_strategies(loyalty_level: str) -> List[str]:
    # Generate loyalty strategies based on loyalty level
    base_strategies = ["personalized offers", "birthday rewards"]
    
    if loyalty_level == "high":
        return base_strategies + ["tiered membership program", "exclusive events", "chef's table experiences"]
    elif loyalty_level == "moderate":
        return base_strategies + ["points system", "referral bonuses", "free item after X purchases"]
    else:
        return base_strategies + ["discount-focused offers", "flash promotions", "combo deals"]

# Helper functions for financial analysis
def _generate_startup_cost(location_data: Dict[str, Any], cuisine_type: str) -> Dict[str, Any]:
    # Generate startup cost based on location and cuisine type
    base_cost = random.randint(150000, 350000)
    
    # Adjust for location factors
    location_score = location_data.get("location_score", 5)
    if location_score > 7:
        base_cost *= 1.3  # Premium location
    elif location_score < 4:
        base_cost *= 0.8  # Less expensive location
    
    # Adjust for cuisine type
    cuisine_cost_factors = {
        "fine dining": 1.5,
        "casual dining": 1.0,
        "fast casual": 0.8,
        "fast food": 0.7,
        "food truck": 0.3,
        "cafe": 0.6
    }
    
    cuisine_factor = 1.0
    for cuisine, factor in cuisine_cost_factors.items():
        if cuisine in cuisine_type.lower():
            cuisine_factor = factor
            break
    
    total_cost = int(base_cost * cuisine_factor)
    
    # Generate cost breakdown
    rent_deposit = int(total_cost * 0.1)
    equipment = int(total_cost * 0.25)
    renovation = int(total_cost * 0.3)
    licenses = int(total_cost * 0.05)
    initial_inventory = int(total_cost * 0.1)
    marketing = int(total_cost * 0.1)
    working_capital = total_cost - rent_deposit - equipment - renovation - licenses - initial_inventory - marketing
    
    return {
        "total_startup_cost": total_cost,
        "cost_breakdown": {
            "rent_deposit": rent_deposit,
            "equipment": equipment,
            "renovation": renovation,
            "licenses_and_permits": licenses,
            "initial_inventory": initial_inventory,
            "marketing": marketing,
            "working_capital": working_capital
        },
        "funding_options": ["SBA loans", "restaurant-specific lenders", "investors", "crowdfunding"]
    }

def _generate_monthly_revenue(market_data: Dict[str, Any], competitor_data: Dict[str, Any], foot_traffic: Dict[str, Any]) -> Dict[str, Any]:
    # Generate monthly revenue based on market data, competitor data, and foot traffic
    market_potential = market_data.get("market_potential", {})
    competition = market_data.get("competition", {})
    
    # Extract relevant metrics
    market_score = market_potential.get("overall_score", 5)
    competition_level = competition.get("saturation_level", "moderate")
    foot_traffic_level = foot_traffic.get("foot_traffic_level", "moderate")
    
    # Base revenue range based on market score
    if market_score > 7:
        base_min = 20000
        base_max = 40000
    elif market_score > 5:
        base_min = 15000
        base_max = 30000
    else:
        base_min = 10000
        base_max = 20000
    
    # Adjust for competition
    competition_factors = {
        "low": 1.2,
        "moderate": 1.0,
        "high": 0.8,
        "very high": 0.7
    }
    comp_factor = competition_factors.get(competition_level.lower(), 1.0)
    
    # Adjust for foot traffic
    traffic_factors = {
        "low": 0.8,
        "moderate": 1.0,
        "high": 1.2,
        "very high": 1.4
    }
    traffic_factor = traffic_factors.get(foot_traffic_level.lower(), 1.0)
    
    # Calculate revenue range
    min_revenue = int(base_min * comp_factor * traffic_factor)
    max_revenue = int(base_max * comp_factor * traffic_factor)
    
    # Calculate revenue sources
    dine_in_percent = random.uniform(0.5, 0.8)
    takeout_percent = random.uniform(0.1, 0.3)
    delivery_percent = 1 - dine_in_percent - takeout_percent
    
    return {
        "estimated_monthly_revenue": f"${min_revenue} - ${max_revenue}",
        "revenue_sources": {
            "dine_in": f"{int(dine_in_percent * 100)}%",
            "takeout": f"{int(takeout_percent * 100)}%",
            "delivery": f"{int(delivery_percent * 100)}%"
        },
        "seasonality_factors": ["holiday season +20%", "summer months +10%", "weekday lunch -15%"],
        "growth_potential": random.choice(["low", "moderate", "high"])
    }

def _generate_monthly_expenses(location_data: Dict[str, Any], cuisine_type: str) -> Dict[str, Any]:
    # Generate monthly expenses based on location and cuisine type
    location_score = location_data.get("location_score", 5)
    
    # Base rent based on location score
    if location_score > 7:
        base_rent = random.randint(4000, 8000)
    elif location_score > 5:
        base_rent = random.randint(3000, 6000)
    else:
        base_rent = random.randint(2000, 4000)
    
    # Staff costs based on cuisine type
    cuisine_staff_factors = {
        "fine dining": 1.5,
        "casual dining": 1.0,
        "fast casual": 0.8,
        "fast food": 0.7,
        "food truck": 0.3,
        "cafe": 0.6
    }
    
    staff_factor = 1.0
    for cuisine, factor in cuisine_staff_factors.items():
        if cuisine in cuisine_type.lower():
            staff_factor = factor
            break
    
    staff_cost = int(base_rent * staff_factor * random.uniform(1.5, 2.5))
    
    # Food costs based on cuisine type
    cuisine_food_factors = {
        "fine dining": 0.35,
        "casual dining": 0.3,
        "fast casual": 0.28,
        "fast food": 0.25,
        "food truck": 0.3,
        "cafe": 0.25
    }
    
    food_cost_percent = 0.3  # Default
    for cuisine, factor in cuisine_food_factors.items():
        if cuisine in cuisine_type.lower():
            food_cost_percent = factor
            break
    
    # Calculate other expenses
    utilities = int(base_rent * 0.2)
    marketing = int(base_rent * 0.15)
    insurance = int(base_rent * 0.1)
    maintenance = int(base_rent * 0.05)
    other = int(base_rent * 0.1)
    
    total_expenses = base_rent + staff_cost + utilities + marketing + insurance + maintenance + other
    
    return {
        "total_monthly_expenses": total_expenses,
        "expense_breakdown": {
            "rent": base_rent,
            "staff": staff_cost,
            "food_cost_percentage": f"{int(food_cost_percent * 100)}%",
            "utilities": utilities,
            "marketing": marketing,
            "insurance": insurance,
            "maintenance": maintenance,
            "other": other
        },
        "cost_saving_opportunities": ["energy-efficient equipment", "inventory management system", "staff scheduling optimization"]
    }

def _generate_profit_margin(cuisine_type: str) -> Dict[str, Any]:
    # Generate profit margin based on cuisine type
    cuisine_margins = {
        "fine dining": {"low": 10, "avg": 15, "high": 20},
        "casual dining": {"low": 8, "avg": 12, "high": 16},
        "fast casual": {"low": 6, "avg": 10, "high": 15},
        "fast food": {"low": 5, "avg": 8, "high": 12},
        "food truck": {"low": 7, "avg": 12, "high": 18},
        "cafe": {"low": 8, "avg": 13, "high": 18}
    }
    
    # Default margins
    margins = {"low": 6, "avg": 10, "high": 15}
    
    # Find matching cuisine margins
    for cuisine, margin_data in cuisine_margins.items():
        if cuisine in cuisine_type.lower():
            margins = margin_data
            break
    
    return {
        "industry_average": f"{margins['avg']}%",
        "projected_range": f"{margins['low']}% - {margins['high']}%",
        "factors_affecting_margin": [
            "food cost management",
            "labor efficiency",
            "pricing strategy",
            "menu engineering"
        ],
        "improvement_strategies": [
            "menu optimization",
            "portion control",
            "supplier negotiation",
            "reduced food waste"
        ]
    }

def _generate_breakeven_estimate(cuisine_type: str) -> Dict[str, Any]:
    # Generate breakeven estimate based on cuisine type
    cuisine_breakeven = {
        "fine dining": {"min": 12, "max": 18},
        "casual dining": {"min": 8, "max": 14},
        "fast casual": {"min": 6, "max": 12},
        "fast food": {"min": 4, "max": 10},
        "food truck": {"min": 3, "max": 8},
        "cafe": {"min": 5, "max": 10}
    }
    
    # Default breakeven
    breakeven = {"min": 6, "max": 12}
    
    # Find matching cuisine breakeven
    for cuisine, be_data in cuisine_breakeven.items():
        if cuisine in cuisine_type.lower():
            breakeven = be_data
            break
    
    return {
        "breakeven_time": f"{breakeven['min']}-{breakeven['max']} months",
        "breakeven_factors": [
            "initial investment amount",
            "monthly fixed costs",
            "average check size",
            "customer volume"
        ],
        "risk_assessment": random.choice(["low", "moderate", "high"]),
        "mitigation_strategies": [
            "phased opening approach",
            "pop-up events before full launch",
            "minimal initial menu"
        ]
    }

def _generate_roi_projection(cuisine_type: str) -> Dict[str, Any]:
    # Generate ROI projection based on cuisine type
    cuisine_roi = {
        "fine dining": {"year1": "5-10%", "year3": "15-25%"},
        "casual dining": {"year1": "8-15%", "year3": "20-30%"},
        "fast casual": {"year1": "10-18%", "year3": "25-35%"},
        "fast food": {"year1": "12-20%", "year3": "30-40%"},
        "food truck": {"year1": "15-25%", "year3": "35-50%"},
        "cafe": {"year1": "10-18%", "year3": "25-35%"}
    }
    
    # Default ROI
    roi = {"year1": "8-15%", "year3": "20-30%"}
    
    # Find matching cuisine ROI
    for cuisine, roi_data in cuisine_roi.items():
        if cuisine in cuisine_type.lower():
            roi = roi_data
            break
    
    return {
        "year_1_roi": roi["year1"],
        "year_3_roi": roi["year3"],
        "investment_recovery_time": f"{random.randint(2, 5)} years",
        "long_term_value_factors": [
            "brand development",
            "customer loyalty",
            "property appreciation",
            "franchise potential"
        ]
    }

# MARKET ANALYSIS TOOLS

@tool
def analyze_market(location: str, cuisine_type: str = "", radius_km: float = 1.0) -> Dict[str, Any]:
    """
    Analyze the market potential for a restaurant at a given location.
    
    Args:
        location: Address or area to analyze
        cuisine_type: Type of cuisine (optional)
        radius_km: Radius in kilometers to analyze
        
    Returns:
        Market analysis data including demographics, competition, and market potential
    """
    # This would normally call external data sources
    # For now, generate simulated data
    
    # Simulate processing time
    time.sleep(1)
    
    # Generate random market data
    market_score = random.uniform(5.5, 9.5)
    
    cuisine_modifier = 0
    if cuisine_type:
        cuisine_modifiers = {
            "thai": 0.8 if "bangkok" in location.lower() else -0.2,
            "italian": 0.5,
            "japanese": 0.7,
            "fast food": -0.3,
            "indian": 0.4,
            "chinese": 0.6,
            "mexican": 0.3,
            "french": 0.6,
            "middle eastern": 0.2,
        }
        
        for cuisine, modifier in cuisine_modifiers.items():
            if cuisine in cuisine_type.lower():
                cuisine_modifier = modifier
                break
    
    # Adjust market score based on location and cuisine
    market_score += cuisine_modifier
    
    # Cap the score between 1-10
    market_score = max(1, min(10, market_score))
    
    # Generate demographics
    demographics = {
        "age_distribution": {
            "18-24": random.uniform(0.05, 0.2),
            "25-34": random.uniform(0.15, 0.35),
            "35-44": random.uniform(0.15, 0.3),
            "45-54": random.uniform(0.1, 0.25),
            "55+": random.uniform(0.1, 0.3)
        },
        "income_level": random.choice(["low", "medium", "high", "mixed"]),
        "resident_to_tourist_ratio": random.uniform(0.2, 0.8),  # 0.2 = 20% residents, 80% tourists
        "office_workers_nearby": random.randint(0, 20000),
        "foot_traffic": random.choice(["low", "medium", "high", "very high"])
    }
    
    # Competition analysis
    competition = {
        "similar_restaurants_count": random.randint(2, 15),
        "average_rating": round(random.uniform(3.0, 4.7), 1),
        "saturation_level": random.choice(["low", "moderate", "high"]),
        "price_points": {
            "budget": random.uniform(0.1, 0.4),
            "mid-range": random.uniform(0.3, 0.6),
            "high-end": random.uniform(0.1, 0.3)
        }
    }
    
    # Calculate market potential
    potential = {
        "overall_score": round(market_score, 1),
        "growth_trend": random.choice(["declining", "stable", "growing", "rapidly growing"]),
        "estimated_revenue_range": f"${random.randint(300, 800)}K - ${random.randint(800, 1500)}K annually",
        "risk_assessment": random.choice(["low", "moderate", "high"]),
        "recommended_price_point": random.choice(["budget", "mid-range", "high-end"])
    }
    
    # Return comprehensive analysis
    return {
        "location_analyzed": location,
        "cuisine_type": cuisine_type or "general restaurant",
        "radius_km": radius_km,
        "demographics": demographics,
        "competition": competition,
        "market_potential": potential,
        "timestamp": time.time()
    }

@tool
def analyze_demographics(location: str) -> Dict[str, Any]:
    """
    Analyze demographic data for a specific location to understand customer base.
    
    Args:
        location: Address or area to analyze
        
    Returns:
        Demographic data including population, income, age groups, and spending patterns
    """
    # Simulate processing time
    time.sleep(0.8)
    
    # Generate simulated demographic data
    population_density = random.uniform(1000, 25000)
    
    # Adjust based on known location keywords
    if any(word in location.lower() for word in ["downtown", "city center", "central"]):
        population_density *= 1.5
    elif any(word in location.lower() for word in ["suburb", "residential", "neighborhood"]):
        population_density *= 0.7
    
    return {
        "location": location,
        "population_data": {
            "total_population_5km": int(population_density * random.uniform(5, 15)),
            "population_density": int(population_density),
            "growth_rate": round(random.uniform(-0.5, 3.5), 1),
        },
        "income_data": {
            "median_household_income": f"${random.randint(35, 120)}K",
            "income_distribution": {
                "low_income": round(random.uniform(0.1, 0.5), 2),
                "middle_income": round(random.uniform(0.3, 0.6), 2),
                "high_income": round(random.uniform(0.1, 0.4), 2)
            }
        },
        "age_distribution": {
            "under_18": round(random.uniform(0.1, 0.25), 2),
            "18-24": round(random.uniform(0.05, 0.2), 2),
            "25-34": round(random.uniform(0.15, 0.35), 2),
            "35-44": round(random.uniform(0.15, 0.3), 2),
            "45-54": round(random.uniform(0.1, 0.25), 2),
            "55+": round(random.uniform(0.1, 0.3), 2)
        },
        "dining_habits": {
            "dining_out_frequency": random.choice(["low", "moderate", "high"]),
            "average_spend_per_meal": f"${random.randint(15, 75)}",
            "preferred_cuisine_types": random.sample(
                ["American", "Italian", "Chinese", "Mexican", "Thai", "Japanese", 
                 "Indian", "Mediterranean", "French", "Fusion"],
                k=random.randint(3, 6)
            )
        },
        "timestamp": time.time()
    }

# COMPETITOR ANALYSIS TOOLS

@tool
def analyze_competitors(location: str, restaurant_type: str = "", radius_km: float = 1.0) -> Dict[str, Any]:
    """
    Analyze competitors in an area for a specific restaurant type.
    
    Args:
        location: Address or area to analyze
        restaurant_type: Type of restaurant or cuisine
        radius_km: Radius in kilometers to analyze
        
    Returns:
        Competitor analysis including nearby restaurants, ratings, and competitive advantage
    """
    # Simulate processing time
    time.sleep(1.2)
    
    # Generate number of competitors
    num_competitors = random.randint(3, 15)
    direct_competitors = random.randint(1, min(5, num_competitors))
    
    # Create simulated competitor list
    competitors = []
    restaurant_types = ["Fast food", "Casual dining", "Fine dining", "Café", "Bistro", "Food truck"]
    cuisine_types = ["American", "Italian", "Chinese", "Mexican", "Thai", "Japanese", "Indian", "Mediterranean"]
    
    for i in range(num_competitors):
        is_direct = i < direct_competitors
        
        if restaurant_type and is_direct:
            # For direct competitors, use the same restaurant type
            comp_type = restaurant_type
        else:
            # For indirect competitors, choose randomly
            comp_type = random.choice(cuisine_types) if random.random() > 0.5 else random.choice(restaurant_types)
        
        competitors.append({
            "name": f"{random.choice(['The', 'La', 'Golden', 'Royal', 'Blue', 'Green', 'Urban'])} {comp_type} {random.choice(['House', 'Kitchen', 'Restaurant', 'Place', 'Cafe', 'Eatery'])}",
            "distance_km": round(random.uniform(0.1, radius_km), 1),
            "rating": round(random.uniform(3.0, 4.9), 1),
            "price_level": random.randint(1, 4),
            "estimated_annual_revenue": f"${random.randint(200, 2000)}K",
            "years_in_business": random.randint(1, 20),
            "cuisine_type": comp_type,
            "key_offerings": random.sample(
                ["Dine-in", "Takeout", "Delivery", "Catering", "Bar", "Outdoor seating", "Private events"],
                k=random.randint(2, 5)
            ),
            "strengths": random.sample(
                ["Location", "Pricing", "Quality", "Service", "Ambiance", "Menu variety", "Specialty items", "Marketing"],
                k=random.randint(1, 3)
            ),
            "weaknesses": random.sample(
                ["Location", "Pricing", "Quality", "Service", "Ambiance", "Limited menu", "Outdated decor", "Poor marketing"],
                k=random.randint(1, 3)
            ),
            "is_direct_competitor": is_direct
        })
    
    # Sort by distance
    competitors.sort(key=lambda x: x["distance_km"])
    
    # Generate competitive analysis
    return {
        "location": location,
        "restaurant_type": restaurant_type or "general restaurant",
        "radius_km": radius_km,
        "total_competitors": num_competitors,
        "direct_competitors": direct_competitors,
        "competitors": competitors,
        "market_saturation": random.choice(["Low", "Moderate", "High", "Very High"]),
        "competitive_advantage_opportunities": random.sample(
            ["Unique menu offerings", "Better pricing strategy", "Higher service quality", "Modern ambiance", 
             "Specialty cuisine", "Delivery service", "Loyalty program", "Live entertainment", "Health-focused options"],
            k=random.randint(2, 5)
        ),
        "timestamp": time.time()
    }

@tool
def analyze_nearby_restaurants(location: str, radius_km: float = 1.0) -> Dict[str, Any]:
    """
    Get detailed information about existing restaurants near a location.
    
    Args:
        location: Address or area to analyze
        radius_km: Radius in kilometers to analyze
        
    Returns:
        List of nearby restaurants with details and ratings
    """
    # Simulate processing time
    time.sleep(0.9)
    
    # Generate number of restaurants
    num_restaurants = random.randint(5, 20)
    
    # Create simulated restaurant list
    restaurant_types = ["Fast food", "Casual dining", "Fine dining", "Café", "Bistro", "Food truck"]
    cuisine_types = ["American", "Italian", "Chinese", "Mexican", "Thai", "Japanese", "Indian", "Mediterranean"]
    
    restaurants = []
    for i in range(num_restaurants):
        cuisine = random.choice(cuisine_types)
        restaurant_type = random.choice(restaurant_types)
        
        # Generate realistic restaurant name
        if random.random() > 0.5:
            name = f"{random.choice(['The', 'La', 'Golden', 'Royal', 'Fresh', 'Urban'])} {cuisine} {random.choice(['House', 'Kitchen', 'Restaurant', 'Place', 'Cafe', 'Eatery'])}"
        else:
            name = f"{random.choice(['Taste of', 'Little', 'Authentic', 'Best', 'Original'])} {cuisine}"
        
        # Generate hours open
        open_hour = random.randint(7, 11)
        close_hour = random.randint(20, 24)
        
        restaurants.append({
            "name": name,
            "address": f"{random.randint(1, 999)} {random.choice(['Main', 'Oak', 'Maple', 'First', 'Park', 'Center'])} {random.choice(['Street', 'Avenue', 'Road', 'Boulevard'])}",
            "distance_km": round(random.uniform(0.1, radius_km), 1),
            "rating": round(random.uniform(2.5, 4.9), 1),
            "reviews_count": random.randint(10, 500),
            "price_level": random.randint(1, 4),
            "cuisine": cuisine,
            "restaurant_type": restaurant_type,
            "popular_times": {
                "weekday_lunch": random.choice(["Low", "Moderate", "High", "Very High"]),
                "weekday_dinner": random.choice(["Low", "Moderate", "High", "Very High"]),
                "weekend_lunch": random.choice(["Low", "Moderate", "High", "Very High"]),
                "weekend_dinner": random.choice(["Low", "Moderate", "High", "Very High"]),
            },
            "hours": {
                "open": f"{open_hour}:00",
                "close": f"{close_hour}:00",
            },
            "offerings": random.sample(
                ["Dine-in", "Takeout", "Delivery", "Catering", "Bar", "Outdoor seating", "Private events"],
                k=random.randint(2, 5)
            ),
            "payment_methods": random.sample(
                ["Cash", "Credit card", "Debit card", "Mobile payment", "Online payment"],
                k=random.randint(2, 5)
            )
        })
    
    # Sort by distance
    restaurants.sort(key=lambda x: x["distance_km"])
    
    # Return restaurant analysis
    return {
        "location": location,
        "radius_km": radius_km,
        "total_restaurants": num_restaurants,
        "restaurants": restaurants,
        "cuisines_distribution": {cuisine: round(random.uniform(0, 0.3), 2) for cuisine in cuisine_types},
        "price_distribution": {
            "budget": round(random.uniform(0.1, 0.4), 2),
            "mid-range": round(random.uniform(0.3, 0.6), 2),
            "high-end": round(random.uniform(0.1, 0.3), 2)
        },
        "timestamp": time.time()
    }

# LOCATION ANALYSIS TOOLS

@tool
def analyze_location(address: str) -> Dict[str, Any]:
    """
    Analyze a specific location for restaurant suitability.
    
    Args:
        address: Specific address to analyze
        
    Returns:
        Location analysis data including accessibility, visibility, and foot traffic
    """
    # Simulate processing time
    time.sleep(0.7)
    
    # Generate random location data
    location_score = random.uniform(5.0, 9.5)
    
    # Generate simulated location analysis
    return {
        "address": address,
        "coordinates": {
            "latitude": round(random.uniform(-90, 90), 6),
            "longitude": round(random.uniform(-180, 180), 6)
        },
        "accessibility": {
            "public_transit_score": round(random.uniform(1, 10), 1),
            "walkability_score": round(random.uniform(1, 10), 1),
            "parking_availability": random.choice(["Poor", "Limited", "Adequate", "Good", "Excellent"]),
            "nearest_transport": [
                {
                    "type": random.choice(["Bus stop", "Subway station", "Train station"]),
                    "distance_meters": random.randint(50, 1500)
                }
            ]
        },
        "visibility": {
            "street_visibility": random.choice(["Poor", "Average", "Good", "Excellent"]),
            "signage_potential": random.choice(["Limited", "Average", "Good", "Excellent"]),
            "storefront_appeal": round(random.uniform(1, 10), 1)
        },
        "foot_traffic": {
            "weekday_volume": random.choice(["Low", "Moderate", "High", "Very High"]),
            "weekend_volume": random.choice(["Low", "Moderate", "High", "Very High"]),
            "morning_traffic": random.choice(["Low", "Moderate", "High"]),
            "lunch_traffic": random.choice(["Low", "Moderate", "High", "Very High"]),
            "dinner_traffic": random.choice(["Low", "Moderate", "High", "Very High"]),
            "late_night_traffic": random.choice(["Low", "Moderate", "High"])
        },
        "nearby_venues": {
            "shopping": random.randint(0, 15),
            "offices": random.randint(0, 10),
            "entertainment": random.randint(0, 8),
            "hotels": random.randint(0, 5),
            "residential_buildings": random.randint(0, 20)
        },
        "zoning_info": {
            "zoned_for_restaurant": random.choice([True, True, True, False]),  # Weighted towards True
            "restrictions": random.sample(
                ["Alcohol service", "Outdoor seating", "Operating hours", "Music volume", "Ventilation requirements"],
                k=random.randint(0, 3)
            )
        },
        "overall_location_score": round(location_score, 1),
        "timestamp": time.time()
    }

@tool
def calculate_foot_traffic(location: str, day_of_week: str = "average") -> Dict[str, Any]:
    """
    Calculate estimated foot traffic for a location by time of day.
    
    Args:
        location: Address or area to analyze
        day_of_week: Specific day or "average" for weekly average
        
    Returns:
        Hourly foot traffic estimates
    """
    # Simulate processing time
    time.sleep(0.6)
    
    # Base foot traffic patterns
    base_patterns = {
        "residential": [5, 3, 2, 1, 2, 10, 25, 40, 30, 20, 15, 25, 40, 35, 30, 25, 30, 45, 50, 45, 35, 25, 15, 10],
        "business_district": [2, 1, 1, 1, 2, 10, 35, 70, 80, 75, 70, 90, 100, 90, 85, 80, 85, 70, 40, 25, 15, 10, 5, 3],
        "tourist_area": [5, 3, 2, 2, 3, 5, 10, 20, 35, 50, 65, 75, 70, 80, 85, 75, 80, 85, 75, 65, 55, 45, 25, 10],
        "shopping_district": [1, 1, 0, 0, 0, 1, 2, 5, 15, 30, 50, 70, 85, 80, 75, 80, 85, 90, 80, 60, 40, 25, 10, 5],
        "entertainment_zone": [10, 15, 20, 15, 5, 2, 1, 3, 5, 10, 15, 25, 30, 25, 30, 35, 45, 60, 80, 100, 95, 85, 60, 30]
    }
    
    # Determine area type based on location keywords
    area_types = list(base_patterns.keys())
    area_weights = [0.2] * len(area_types)
    
    location_lower = location.lower()
    if any(word in location_lower for word in ["downtown", "business", "office", "financial"]):
        area_types = ["business_district"] + random.sample([t for t in area_types if t != "business_district"], 1)
        area_weights = [0.7, 0.3]
    elif any(word in location_lower for word in ["residential", "suburb", "apartment", "housing"]):
        area_types = ["residential"] + random.sample([t for t in area_types if t != "residential"], 1)
        area_weights = [0.8, 0.2]
    elif any(word in location_lower for word in ["tourist", "attraction", "landmark", "monument"]):
        area_types = ["tourist_area"] + random.sample([t for t in area_types if t != "tourist_area"], 1) 
        area_weights = [0.75, 0.25]
    elif any(word in location_lower for word in ["mall", "shopping", "retail", "store"]):
        area_types = ["shopping_district"] + random.sample([t for t in area_types if t != "shopping_district"], 1)
        area_weights = [0.8, 0.2]
    elif any(word in location_lower for word in ["bar", "club", "theater", "cinema", "entertainment"]):
        area_types = ["entertainment_zone"] + random.sample([t for t in area_types if t != "entertainment_zone"], 1)
        area_weights = [0.7, 0.3]
    else:
        # If no specific keywords, choose random area types with balanced weights
        area_types = random.sample(area_types, 3)
        area_weights = [0.5, 0.3, 0.2]
    
    # Generate base hourly data
    hourly_data = []
    base_foot_traffic = random.randint(50, 500)  # Base number of people per hour
    
    for hour in range(24):
        # Calculate weighted traffic based on area types
        weighted_factor = 0
        for i, area_type in enumerate(area_types):
            weighted_factor += (base_patterns[area_type][hour] / 100) * area_weights[i]
        
        # Add some random variation (+/- 15%)
        variation = random.uniform(0.85, 1.15)
        
        # Calculate traffic for this hour
        traffic = int(base_foot_traffic * weighted_factor * variation)
        
        hourly_data.append({
            "hour": hour,
            "time": f"{hour:02d}:00",
            "foot_traffic": traffic,
            "peak_type": get_peak_description(weighted_factor)
        })
    
    # Day of week adjustments
    day_factors = {
        "monday": 0.9,
        "tuesday": 0.85,
        "wednesday": 0.9,
        "thursday": 1.0,
        "friday": 1.3,
        "saturday": 1.5,
        "sunday": 1.2,
        "average": 1.0
    }
    
    day = day_of_week.lower() if day_of_week.lower() in day_factors else "average"
    day_factor = day_factors[day]
    
    # Apply day of week factor
    for hour_data in hourly_data:
        hour_data["foot_traffic"] = int(hour_data["foot_traffic"] * day_factor)
    
    # Calculate daily total and peak hours
    total_traffic = sum(h["foot_traffic"] for h in hourly_data)
    peak_hours = sorted(hourly_data, key=lambda x: x["foot_traffic"], reverse=True)[:3]
    
    return {
        "location": location,
        "day_of_week": day_of_week,
        "total_daily_foot_traffic": total_traffic,
        "peak_hours": [h["time"] for h in peak_hours],
        "hourly_breakdown": hourly_data,
        "area_type": area_types[0],  # Primary area type
        "timestamp": time.time()
    }

def get_peak_description(factor):
    """Helper function to describe the traffic level"""
    if factor < 0.1:
        return "Very low"
    elif factor < 0.3:
        return "Low"
    elif factor < 0.5:
        return "Moderate"
    elif factor < 0.7:
        return "High"
    elif factor < 0.9:
        return "Very high"
    else:
        return "Peak"

@tool
def analyze_area(coordinates: Dict[str, float], radius_km: float = 1.0) -> Dict[str, Any]:
    """
    Analyze an area around given coordinates for restaurant suitability.
    
    Args:
        coordinates: Dictionary with latitude and longitude
        radius_km: Radius in kilometers to analyze
        
    Returns:
        Area analysis including points of interest, demographics, and recommendations
    """
    # Simulate processing time
    time.sleep(1.5)
    
    # Generate points of interest
    num_poi = random.randint(5, 30)
    poi_types = ["Shopping mall", "Office building", "Hotel", "Tourist attraction", 
                "Entertainment venue", "Residential complex", "Public transportation", 
                "Park", "School/University", "Hospital", "Government building"]
    
    points_of_interest = []
    for _ in range(num_poi):
        poi_type = random.choice(poi_types)
        distance = round(random.uniform(0.05, radius_km), 2)
        points_of_interest.append({
            "name": f"{random.choice(['North', 'South', 'East', 'West', 'Central', 'Downtown', 'Riverside'])} {poi_type}",
            "type": poi_type,
            "distance_km": distance,
            "estimated_traffic": random.choice(["Low", "Moderate", "High", "Very High"])
        })
    
    # Sort by distance
    points_of_interest.sort(key=lambda x: x["distance_km"])
    
    # Generate area characteristics
    area_characteristics = {
        "area_type": random.choice(["Residential", "Commercial", "Mixed", "Tourist", "Industrial", "Entertainment"]),
        "development_stage": random.choice(["Developing", "Established", "Gentrifying", "Declining", "Revitalizing"]),
        "affluence_level": random.choice(["Low", "Below average", "Average", "Above average", "High", "Very high"]),
        "traffic_patterns": {
            "morning_rush": random.choice(["Light", "Moderate", "Heavy"]),
            "lunch_rush": random.choice(["Light", "Moderate", "Heavy"]),
            "evening_rush": random.choice(["Light", "Moderate", "Heavy"]),
            "weekend_traffic": random.choice(["Light", "Moderate", "Heavy"])
        },
        "restaurant_density": random.choice(["Low", "Below average", "Average", "Above average", "High", "Saturated"])
    }
    
    # Generate restaurant recommendations
    restaurant_recommendations = {
        "suitable_concepts": random.sample(
            ["Fast casual", "Fine dining", "Family restaurant", "Cafe", "Bistro", "Food truck", 
             "Ghost kitchen", "Quick service", "Buffet", "Specialty restaurant"],
            k=random.randint(2, 4)
        ),
        "recommended_cuisines": random.sample(
            ["American", "Italian", "Chinese", "Mexican", "Thai", "Japanese", "Indian", 
             "Mediterranean", "French", "Korean", "Fusion", "Plant-based", "Seafood", "Steakhouse"],
            k=random.randint(2, 5)
        ),
        "price_point": random.choice(["Budget", "Mid-range", "High-end", "Mixed"]),
        "success_factors": random.sample(
            ["Unique menu", "Strong branding", "Outdoor seating", "Delivery service", "Late hours", 
             "Alcohol service", "Quick service", "Family-friendly", "Instagram-worthy decor", 
             "Local sourcing", "Loyalty program"],
            k=random.randint(3, 6)
        )
    }
    
    # Return the complete area analysis
    return {
        "coordinates": coordinates,
        "radius_km": radius_km,
        "points_of_interest": points_of_interest,
        "area_characteristics": area_characteristics,
        "restaurant_recommendations": restaurant_recommendations,
        "nearby_businesses_by_type": {
            "restaurants": random.randint(3, 20),
            "cafes": random.randint(1, 15),
            "retail_stores": random.randint(5, 30),
            "services": random.randint(3, 25),
            "entertainment": random.randint(0, 10)
        },
        "timestamp": time.time()
    }

# Define the node functions for the graph

async def market_analysis_node(state: AgentState, config: RunnableConfig):
    """Handle market analysis operations"""
    messages = state.get("messages", [])
    last_ai_message = next((msg for msg in reversed(messages) if isinstance(msg, AIMessage)), None)
    
    if not last_ai_message or not last_ai_message.tool_calls:
        return {"messages": messages}
    
    # Execute the tool call
    tool_call = last_ai_message.tool_calls[0]
    tool_name = tool_call["name"]
    tool_args = tool_call["args"]
    
    result = None
    if tool_name == "analyze_market":
        result = analyze_market(**tool_args)
    elif tool_name == "analyze_demographics":
        result = analyze_demographics(**tool_args)
        
    # Create a tool message with the result
    if result:
        tool_message = ToolMessage(
            tool_call_id=tool_call["id"],
            content=json.dumps(result, indent=2),
            name=tool_name
        )
        
        # Update research data in the state
        research_data = state.get("research_data", {})
        if "market_analysis" not in research_data:
            research_data["market_analysis"] = []
        
        research_data["market_analysis"].append(result)
        
        return {
            "messages": [*messages, tool_message],
            "research_data": research_data
        }
    
    return {"messages": messages}

async def competitor_analysis_node(state: AgentState, config: RunnableConfig):
    """Handle competitor analysis operations"""
    messages = state.get("messages", [])
    last_ai_message = next((msg for msg in reversed(messages) if isinstance(msg, AIMessage)), None)
    
    if not last_ai_message or not last_ai_message.tool_calls:
        return {"messages": messages}
    
    # Execute the tool call
    tool_call = last_ai_message.tool_calls[0]
    tool_name = tool_call["name"]
    tool_args = tool_call["args"]
    
    result = None
    if tool_name == "analyze_competitors":
        result = analyze_competitors(**tool_args)
    elif tool_name == "analyze_nearby_restaurants":
        result = analyze_nearby_restaurants(**tool_args)
        
    # Create a tool message with the result
    if result:
        tool_message = ToolMessage(
            tool_call_id=tool_call["id"],
            content=json.dumps(result, indent=2),
            name=tool_name
        )
        
        # Update research data in the state
        research_data = state.get("research_data", {})
        if "competitor_analysis" not in research_data:
            research_data["competitor_analysis"] = []
        
        research_data["competitor_analysis"].append(result)
        
        return {
            "messages": [*messages, tool_message],
            "research_data": research_data
        }
    
    return {"messages": messages}

async def location_analysis_node(state: AgentState, config: RunnableConfig):
    """Handle location analysis operations"""
    messages = state.get("messages", [])
    last_ai_message = next((msg for msg in reversed(messages) if isinstance(msg, AIMessage)), None)
    
    if not last_ai_message or not last_ai_message.tool_calls:
        return {"messages": messages}
    
    # Execute the tool call
    tool_call = last_ai_message.tool_calls[0]
    tool_name = tool_call["name"]
    tool_args = tool_call["args"]
    
    result = None
    if tool_name == "analyze_location":
        result = analyze_location(**tool_args)
    elif tool_name == "calculate_foot_traffic":
        result = calculate_foot_traffic(**tool_args)
    elif tool_name == "analyze_area":
        result = analyze_area(**tool_args)
        
    # Create a tool message with the result
    if result:
        tool_message = ToolMessage(
            tool_call_id=tool_call["id"],
            content=json.dumps(result, indent=2),
            name=tool_name
        )
        
        # Update research data in the state
        research_data = state.get("research_data", {})
        if "location_analysis" not in research_data:
            research_data["location_analysis"] = []
        
        research_data["location_analysis"].append(result)
        
        return {
            "messages": [*messages, tool_message],
            "research_data": research_data
        }
    
    return {"messages": messages}

def create_research_agent():
    """Create the restaurant market research agent"""
    try:
        from .agent import create_agent
        agent = create_agent()
        return agent
    except (ImportError, AttributeError) as e:
        # Create a simple fallback agent if the main agent creation fails
        from langchain_core.runnables import RunnableConfig
        import logging
        logger = logging.getLogger(__name__)
        logger.warning(f"Failed to create agent from agent.py: {str(e)}")
        logger.warning("Using fallback agent implementation")
        
        # Simple fallback implementation
        async def simple_agent(inputs, config: RunnableConfig = None):
            """Simple fallback agent that just returns a message saying the agent is unavailable"""
            return {
                "messages": [
                    {"role": "assistant", "content": "I'm sorry, but the restaurant research agent is currently unavailable. Please try again later or contact support."}
                ]
            }
        
        return simple_agent
