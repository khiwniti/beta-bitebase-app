"""
Market Analysis schemas for BiteBase FastAPI Backend
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, validator
from datetime import datetime
from app.models.market_analysis import AnalysisStatus, CompetitionLevel, MarketSize

# Base schemas
class MarketAnalysisBase(BaseModel):
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius: Optional[float] = 5.0  # km
    analysis_type: str

class MarketAnalysisCreate(MarketAnalysisBase):
    pass

class MarketAnalysisUpdate(BaseModel):
    status: Optional[AnalysisStatus] = None
    results: Optional[str] = None
    opportunity_score: Optional[float] = None
    competition_level: Optional[CompetitionLevel] = None
    market_size: Optional[MarketSize] = None
    total_restaurants: Optional[int] = None
    avg_rating: Optional[float] = None
    price_distribution: Optional[str] = None
    cuisine_distribution: Optional[str] = None
    recommendations: Optional[str] = None
    risk_factors: Optional[str] = None

class MarketAnalysis(MarketAnalysisBase):
    id: int
    user_id: str
    status: AnalysisStatus
    results: Optional[str] = None
    opportunity_score: Optional[float] = None
    competition_level: Optional[CompetitionLevel] = None
    market_size: Optional[MarketSize] = None
    total_restaurants: Optional[int] = None
    avg_rating: Optional[float] = None
    price_distribution: Optional[str] = None
    cuisine_distribution: Optional[str] = None
    recommendations: Optional[str] = None
    risk_factors: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# AI Analysis schemas
class AIMarketResearchRequest(BaseModel):
    location: str
    business_type: str
    target_audience: str
    budget_range: str

class AIMarketAnalysisRequest(BaseModel):
    location: str
    cuisine_type: str
    radius_km: float = 5.0

class AIAnalysisResult(BaseModel):
    market_size: str
    competition_level: str
    target_demographics: str
    recommended_strategies: List[str]
    risk_factors: List[str]
    success_probability: str

class AIMarketResearchResponse(BaseModel):
    research_id: str
    location: str
    business_type: str
    analysis: AIAnalysisResult
    recommendations: List[str]
    created_at: str

# Restaurant Analytics schemas
class RestaurantMetrics(BaseModel):
    total_visits: int
    avg_rating: float
    revenue_estimate: float
    market_share: float

class RestaurantTrends(BaseModel):
    visits_trend: List[int]
    rating_trend: List[float]

class RestaurantAnalytics(BaseModel):
    restaurant_id: str
    metrics: RestaurantMetrics
    trends: RestaurantTrends
    recommendations: List[str]

# AI Chat schemas
class AIChatMessage(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class AIChatResponse(BaseModel):
    response: str
    suggestions: Optional[List[str]] = None
    context: Optional[Dict[str, Any]] = None

# Cache schemas
class AICacheCreate(BaseModel):
    cache_key: str
    response: str
    expires_at: datetime

class AICache(BaseModel):
    id: int
    cache_key: str
    response: str
    expires_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

# Real data fetching schemas
class RealDataFetchRequest(BaseModel):
    latitude: float
    longitude: float
    radius: Optional[float] = 5.0
    platforms: Optional[List[str]] = ["wongnai", "google"]

class RealDataFetchResponse(BaseModel):
    status: str
    location: Dict[str, float]
    platforms_searched: List[str]
    restaurants_found: Dict[str, int]
    all_restaurants: List[Dict[str, Any]]
    sample_restaurants: List[Dict[str, Any]]
    message: str