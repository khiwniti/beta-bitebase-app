"""
Restaurant model for BiteBase FastAPI Backend
"""

from sqlalchemy import Column, Integer, String, DateTime, Float, Text, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.database import Base

class PriceRange(str, enum.Enum):
    BUDGET = "budget"
    MODERATE = "moderate"
    UPSCALE = "upscale"
    LUXURY = "luxury"

class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    address = Column(Text)
    cuisine = Column(String(100), index=True)
    price_range = Column(Enum(PriceRange))
    rating = Column(Float)
    review_count = Column(Integer, default=0)
    phone = Column(String(50))
    website = Column(String(500))
    hours = Column(Text)  # JSON string
    features = Column(Text)  # JSON string
    images = Column(Text)  # JSON string
    platform = Column(String(50))  # google, yelp, wongnai, etc.
    platform_id = Column(String(255))
    user_id = Column(String(255), ForeignKey("users.uid"))
    
    # Additional fields for enhanced functionality
    description = Column(Text)
    menu_url = Column(String(500))
    delivery_available = Column(String(10))  # yes/no/unknown
    takeout_available = Column(String(10))  # yes/no/unknown
    reservations_available = Column(String(10))  # yes/no/unknown
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="restaurants")
    reviews = relationship("Review", back_populates="restaurant")
    menu_items = relationship("MenuItem", back_populates="restaurant")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), ForeignKey("users.uid"), nullable=False)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="reviews")
    restaurant = relationship("Restaurant", back_populates="reviews")

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Float)
    category = Column(String(100))
    image_url = Column(String(500))
    is_available = Column(String(10), default="yes")  # yes/no/unknown
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    restaurant = relationship("Restaurant", back_populates="menu_items")