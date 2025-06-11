"""
Market Analysis model for BiteBase FastAPI Backend
"""

from sqlalchemy import Column, Integer, String, DateTime, Float, Text, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.database import Base

class AnalysisStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class CompetitionLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class MarketSize(str, enum.Enum):
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"

class MarketAnalysis(Base):
    __tablename__ = "market_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), ForeignKey("users.uid"), nullable=False)
    location = Column(String(255), nullable=False)
    latitude = Column(Float, index=True)
    longitude = Column(Float, index=True)
    radius = Column(Float)  # in kilometers
    analysis_type = Column(String(100), nullable=False)
    status = Column(Enum(AnalysisStatus), default=AnalysisStatus.PENDING)
    results = Column(Text)  # JSON string
    opportunity_score = Column(Float)  # 0-10 scale
    competition_level = Column(Enum(CompetitionLevel))
    market_size = Column(Enum(MarketSize))
    
    # Additional analysis fields
    total_restaurants = Column(Integer)
    avg_rating = Column(Float)
    price_distribution = Column(Text)  # JSON string
    cuisine_distribution = Column(Text)  # JSON string
    recommendations = Column(Text)  # JSON string
    risk_factors = Column(Text)  # JSON string
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="market_analyses")

class AICache(Base):
    __tablename__ = "ai_cache"

    id = Column(Integer, primary_key=True, index=True)
    cache_key = Column(String(255), unique=True, nullable=False, index=True)
    response = Column(Text, nullable=False)  # JSON string
    expires_at = Column(DateTime(timezone=True), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())