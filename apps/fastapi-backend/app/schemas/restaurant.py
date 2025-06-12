"""
Restaurant schemas for BiteBase FastAPI Backend
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, validator, field_validator
from datetime import datetime
import json
from app.models.restaurant import PriceRange

# Base schemas
class RestaurantBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    address: Optional[str] = None
    cuisine: Optional[str] = None
    price_range: Optional[PriceRange] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    hours: Optional[Any] = None  # Can be string or dict
    features: Optional[Any] = None  # Can be string or list
    images: Optional[Any] = None  # Can be string or list
    description: Optional[str] = None
    menu_url: Optional[str] = None
    delivery_available: Optional[str] = None
    takeout_available: Optional[str] = None
    reservations_available: Optional[str] = None

class RestaurantCreate(RestaurantBase):
    platform: Optional[str] = None
    platform_id: Optional[str] = None

class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    cuisine: Optional[str] = None
    price_range: Optional[PriceRange] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    hours: Optional[str] = None
    features: Optional[str] = None
    images: Optional[str] = None
    description: Optional[str] = None
    menu_url: Optional[str] = None
    delivery_available: Optional[str] = None
    takeout_available: Optional[str] = None
    reservations_available: Optional[str] = None

class Restaurant(RestaurantBase):
    id: int
    rating: Optional[float] = None
    review_count: int = 0
    platform: Optional[str] = None
    platform_id: Optional[str] = None
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    @field_validator('features', mode='before')
    @classmethod
    def parse_features(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return v
        return v
    
    @field_validator('images', mode='before')
    @classmethod
    def parse_images(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return v
        return v
    
    @field_validator('hours', mode='before')
    @classmethod
    def parse_hours(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return v
        return v
    
    class Config:
        from_attributes = True

# Search schemas
class RestaurantSearch(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius: Optional[float] = 5.0  # km
    cuisine: Optional[str] = None
    price_range: Optional[PriceRange] = None
    rating_min: Optional[float] = None
    query: Optional[str] = None
    limit: Optional[int] = 50
    offset: Optional[int] = 0

class RestaurantSearchResponse(BaseModel):
    restaurants: List[Restaurant]
    total: int
    limit: int
    offset: int

# Review schemas
class ReviewBase(BaseModel):
    rating: float
    comment: Optional[str] = None
    
    @validator('rating')
    def validate_rating(cls, v):
        if not 1 <= v <= 5:
            raise ValueError('Rating must be between 1 and 5')
        return v

class ReviewCreate(ReviewBase):
    restaurant_id: int

class ReviewUpdate(BaseModel):
    rating: Optional[float] = None
    comment: Optional[str] = None
    
    @validator('rating')
    def validate_rating(cls, v):
        if v is not None and not 1 <= v <= 5:
            raise ValueError('Rating must be between 1 and 5')
        return v

class Review(ReviewBase):
    id: int
    user_id: str
    restaurant_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Menu Item schemas
class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    is_available: Optional[str] = "yes"

class MenuItemCreate(MenuItemBase):
    restaurant_id: int

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    is_available: Optional[str] = None

class MenuItem(MenuItemBase):
    id: int
    restaurant_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Restaurant with related data
class RestaurantDetail(Restaurant):
    reviews: List[Review] = []
    menu_items: List[MenuItem] = []
    avg_rating: Optional[float] = None

# External API schemas
class WongnaiSearchParams(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    query: Optional[str] = None
    cuisine: Optional[str] = None
    limit: Optional[int] = 20

class ExternalRestaurantData(BaseModel):
    platform: str
    platform_id: str
    name: str
    latitude: float
    longitude: float
    address: Optional[str] = None
    cuisine: Optional[str] = None
    rating: Optional[float] = None
    price_range: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    hours: Optional[str] = None
    features: Optional[List[str]] = None
    images: Optional[List[str]] = None

class BatchMenuRequest(BaseModel):
    publicIds: List[str]

class MenuCategory(BaseModel):
    id: str
    name: str
    items: List[Dict[str, Any]]

class RestaurantMenu(BaseModel):
    publicId: str
    restaurant_name: str
    menu_categories: List[MenuCategory]
    delivery_info: Dict[str, Any]
    last_updated: str

class BatchMenuResponse(BaseModel):
    status: str
    total_requested: int
    successful_count: int
    failed_count: int
    menus: List[RestaurantMenu]
    errors: List[str]

class RealDataFetchRequest(BaseModel):
    location: str
    cuisine_type: Optional[str] = None
    radius_km: float = 5.0
    limit: int = 20

class RealDataFetchResponse(BaseModel):
    status: str
    total_found: int
    restaurants: List[Restaurant]
    source: str
    timestamp: str