"""
User model for BiteBase FastAPI Backend
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.database import Base

class AccountType(str, enum.Enum):
    RESTAURANT = "restaurant"
    FRANCHISE = "franchise"
    ENTERPRISE = "enterprise"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    uid = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    display_name = Column(String(255))
    account_type = Column(Enum(AccountType), default=AccountType.RESTAURANT)
    company_name = Column(String(255))
    phone = Column(String(50))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    avatar_url = Column(String(500))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Relationships (using string references to avoid circular imports)
    restaurants = relationship("Restaurant", back_populates="owner", lazy="dynamic")
    market_analyses = relationship("MarketAnalysis", back_populates="user", lazy="dynamic")
    reviews = relationship("Review", back_populates="user", lazy="dynamic")
    subscriptions = relationship("Subscription", back_populates="user", lazy="dynamic")
    user_profile = relationship("UserProfile", back_populates="user", uselist=False)

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), ForeignKey("users.uid"), nullable=False, index=True)
    business_goals = Column(Text)  # JSON string
    target_demographics = Column(Text)  # JSON string
    budget_range = Column(String(100))
    timeline = Column(String(100))
    experience_level = Column(String(50))
    preferences = Column(Text)  # JSON string
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="user_profile")