"""
State definitions for restaurant market research agent.
"""
from typing import List, Dict, Any, Optional, TypedDict

class Establishment(TypedDict, total=False):
    """A restaurant or cafe establishment."""
    id: str
    name: str
    address: str
    latitude: float
    longitude: float
    business_type: str  # "restaurant", "cafe", "bakery", etc.
    rating: float
    price_level: int
    reviews_count: int
    operating_hours: Dict[str, Any]
    photos: List[str]
    website: str
    phone: str

class ResearchProject(TypedDict, total=False):
    """A market research project for restaurant/cafe industry."""
    id: str
    name: str
    description: str
    target_area: Dict[str, Any]  # Geographic boundaries
    created_at: str
    last_updated: str
    tags: List[str]

class MarketInsight(TypedDict, total=False):
    """Analysis results for a specific area or establishment."""
    id: str
    project_id: str
    insight_type: str  # "competition", "demographic", "trend"
    data: Dict[str, Any]
    generated_at: str
    summary: str

class AgentState(TypedDict, total=False):
    """The state of the agent."""
    messages: List[Dict[str, Any]]
    research_projects: List[ResearchProject]
    establishments: List[Establishment]
    insights: List[MarketInsight]
    selected_project_id: Optional[str]
    search_progress: List[Dict[str, Any]]
    research_data: Dict[str, Any]
