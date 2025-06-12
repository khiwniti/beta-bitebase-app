"""
Restaurant service for BiteBase FastAPI Backend
"""

from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
import structlog
import json

from app.core.exceptions import ValidationError, NotFoundError, AuthorizationError
from app.models.restaurant import Restaurant, Review, MenuItem
from app.models.user import User
from app.schemas.restaurant import (
    RestaurantCreate, RestaurantUpdate, RestaurantSearch, RestaurantDetail,
    ReviewCreate, MenuItemCreate
)

logger = structlog.get_logger()

class RestaurantService:
    def __init__(self, db: Session):
        self.db = db

    def get_restaurant_by_id(self, restaurant_id: int) -> Optional[Restaurant]:
        """Get restaurant by ID"""
        return self.db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()

    def search_restaurants(self, search_params: RestaurantSearch) -> Tuple[List[Restaurant], int]:
        """Search restaurants with filters"""
        try:
            query = self.db.query(Restaurant)
            
            # Apply filters
            if search_params.latitude and search_params.longitude:
                # Calculate distance using Haversine formula
                lat_rad = func.radians(search_params.latitude)
                lon_rad = func.radians(search_params.longitude)
                
                distance = (
                    6371 * func.acos(
                        func.cos(lat_rad) * func.cos(func.radians(Restaurant.latitude)) *
                        func.cos(func.radians(Restaurant.longitude) - lon_rad) +
                        func.sin(lat_rad) * func.sin(func.radians(Restaurant.latitude))
                    )
                )
                
                query = query.filter(distance <= search_params.radius)
                query = query.order_by(distance)
            
            if search_params.cuisine:
                query = query.filter(Restaurant.cuisine.ilike(f"%{search_params.cuisine}%"))
            
            if search_params.price_range:
                query = query.filter(Restaurant.price_range == search_params.price_range)
            
            if search_params.rating_min:
                query = query.filter(Restaurant.rating >= search_params.rating_min)
            
            if search_params.query:
                search_term = f"%{search_params.query}%"
                query = query.filter(
                    or_(
                        Restaurant.name.ilike(search_term),
                        Restaurant.address.ilike(search_term),
                        Restaurant.cuisine.ilike(search_term)
                    )
                )
            
            # Get total count
            total = query.count()
            
            # Apply pagination
            restaurants = query.offset(search_params.offset).limit(search_params.limit).all()
            
            return restaurants, total
            
        except Exception as e:
            logger.error("Restaurant search failed", error=str(e))
            raise ValidationError("Search failed")

    def get_restaurant_detail(self, restaurant_id: int) -> Optional[RestaurantDetail]:
        """Get restaurant with reviews and menu items"""
        try:
            restaurant = self.get_restaurant_by_id(restaurant_id)
            if not restaurant:
                return None
            
            # Get reviews
            reviews = self.db.query(Review).filter(
                Review.restaurant_id == restaurant_id
            ).order_by(Review.created_at.desc()).limit(10).all()
            
            # Get menu items
            menu_items = self.db.query(MenuItem).filter(
                MenuItem.restaurant_id == restaurant_id
            ).all()
            
            # Calculate average rating
            avg_rating = self.db.query(func.avg(Review.rating)).filter(
                Review.restaurant_id == restaurant_id
            ).scalar()
            
            # Create detail object
            restaurant_dict = {
                **restaurant.__dict__,
                "reviews": reviews,
                "menu_items": menu_items,
                "avg_rating": float(avg_rating) if avg_rating else None
            }
            
            return RestaurantDetail(**restaurant_dict)
            
        except Exception as e:
            logger.error("Failed to get restaurant detail", error=str(e))
            raise ValidationError("Failed to get restaurant details")

    def create_restaurant(self, restaurant_data: RestaurantCreate, user_id: str) -> Restaurant:
        """Create a new restaurant"""
        try:
            db_restaurant = Restaurant(
                **restaurant_data.dict(),
                user_id=user_id
            )
            
            self.db.add(db_restaurant)
            self.db.commit()
            self.db.refresh(db_restaurant)
            
            logger.info("Restaurant created", restaurant_id=db_restaurant.id, user_id=user_id)
            return db_restaurant
            
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to create restaurant", error=str(e))
            raise ValidationError("Failed to create restaurant")

    def update_restaurant(self, restaurant_id: int, restaurant_data: RestaurantUpdate, user_id: str) -> Optional[Restaurant]:
        """Update restaurant (owner only)"""
        try:
            db_restaurant = self.get_restaurant_by_id(restaurant_id)
            if not db_restaurant:
                return None
            
            # Check ownership
            if db_restaurant.user_id != user_id:
                raise AuthorizationError("Access denied")
            
            # Update fields
            for field, value in restaurant_data.dict(exclude_unset=True).items():
                setattr(db_restaurant, field, value)
            
            self.db.commit()
            self.db.refresh(db_restaurant)
            
            logger.info("Restaurant updated", restaurant_id=restaurant_id, user_id=user_id)
            return db_restaurant
            
        except AuthorizationError:
            raise
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to update restaurant", error=str(e))
            raise ValidationError("Failed to update restaurant")

    def delete_restaurant(self, restaurant_id: int, user_id: str) -> bool:
        """Delete restaurant (owner only)"""
        try:
            db_restaurant = self.get_restaurant_by_id(restaurant_id)
            if not db_restaurant:
                return False
            
            # Check ownership
            if db_restaurant.user_id != user_id:
                raise AuthorizationError("Access denied")
            
            self.db.delete(db_restaurant)
            self.db.commit()
            
            logger.info("Restaurant deleted", restaurant_id=restaurant_id, user_id=user_id)
            return True
            
        except AuthorizationError:
            raise
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to delete restaurant", error=str(e))
            return False

    def create_review(self, review_data: ReviewCreate, user_id: str) -> Review:
        """Create a review for a restaurant"""
        try:
            # Check if restaurant exists
            restaurant = self.get_restaurant_by_id(review_data.restaurant_id)
            if not restaurant:
                raise NotFoundError("Restaurant not found")
            
            # Check if user already reviewed this restaurant
            existing_review = self.db.query(Review).filter(
                and_(Review.user_id == user_id, Review.restaurant_id == review_data.restaurant_id)
            ).first()
            
            if existing_review:
                raise ValidationError("You have already reviewed this restaurant")
            
            db_review = Review(
                **review_data.dict(),
                user_id=user_id
            )
            
            self.db.add(db_review)
            
            # Update restaurant rating and review count
            self._update_restaurant_rating(review_data.restaurant_id)
            
            self.db.commit()
            self.db.refresh(db_review)
            
            logger.info("Review created", restaurant_id=review_data.restaurant_id, user_id=user_id)
            return db_review
            
        except (NotFoundError, ValidationError):
            raise
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to create review", error=str(e))
            raise ValidationError("Failed to create review")

    def get_restaurant_reviews(self, restaurant_id: int, limit: int = 20, offset: int = 0) -> List[Review]:
        """Get reviews for a restaurant"""
        try:
            reviews = self.db.query(Review).filter(
                Review.restaurant_id == restaurant_id
            ).order_by(Review.created_at.desc()).offset(offset).limit(limit).all()
            
            return reviews
            
        except Exception as e:
            logger.error("Failed to get restaurant reviews", error=str(e))
            raise ValidationError("Failed to get reviews")

    def create_menu_item(self, menu_item_data: MenuItemCreate, user_id: str) -> MenuItem:
        """Create a menu item for a restaurant"""
        try:
            # Check if restaurant exists and user owns it
            restaurant = self.get_restaurant_by_id(menu_item_data.restaurant_id)
            if not restaurant:
                raise NotFoundError("Restaurant not found")
            
            if restaurant.user_id != user_id:
                raise AuthorizationError("Access denied")
            
            db_menu_item = MenuItem(**menu_item_data.dict())
            
            self.db.add(db_menu_item)
            self.db.commit()
            self.db.refresh(db_menu_item)
            
            logger.info("Menu item created", restaurant_id=menu_item_data.restaurant_id, user_id=user_id)
            return db_menu_item
            
        except (NotFoundError, AuthorizationError):
            raise
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to create menu item", error=str(e))
            raise ValidationError("Failed to create menu item")

    def get_restaurant_menu_items(self, restaurant_id: int) -> List[MenuItem]:
        """Get menu items for a restaurant"""
        try:
            menu_items = self.db.query(MenuItem).filter(
                MenuItem.restaurant_id == restaurant_id
            ).order_by(MenuItem.category, MenuItem.name).all()
            
            return menu_items
            
        except Exception as e:
            logger.error("Failed to get menu items", error=str(e))
            raise ValidationError("Failed to get menu items")

    def create_or_update_external_restaurant(self, restaurant_data: Dict[str, Any]) -> Restaurant:
        """Create or update restaurant from external API data"""
        try:
            # Check if restaurant already exists by platform_id
            existing_restaurant = None
            if restaurant_data.get("platform_id"):
                existing_restaurant = self.db.query(Restaurant).filter(
                    and_(
                        Restaurant.platform == restaurant_data.get("platform"),
                        Restaurant.platform_id == restaurant_data.get("platform_id")
                    )
                ).first()
            
            if existing_restaurant:
                # Update existing restaurant
                for field, value in restaurant_data.items():
                    if hasattr(existing_restaurant, field) and value is not None:
                        setattr(existing_restaurant, field, value)
                
                self.db.commit()
                self.db.refresh(existing_restaurant)
                return existing_restaurant
            else:
                # Create new restaurant
                db_restaurant = Restaurant(**restaurant_data)
                self.db.add(db_restaurant)
                self.db.commit()
                self.db.refresh(db_restaurant)
                return db_restaurant
                
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to create/update external restaurant", error=str(e))
            raise ValidationError("Failed to process external restaurant data")

    def get_restaurant_analytics(self, restaurant_id: int, user_id: str) -> Optional[Dict[str, Any]]:
        """Get analytics for a restaurant"""
        try:
            restaurant = self.get_restaurant_by_id(restaurant_id)
            if not restaurant:
                return None
            
            # Check ownership for detailed analytics
            if restaurant.user_id != user_id:
                raise AuthorizationError("Access denied")
            
            # Calculate metrics
            review_count = self.db.query(func.count(Review.id)).filter(
                Review.restaurant_id == restaurant_id
            ).scalar() or 0
            
            avg_rating = self.db.query(func.avg(Review.rating)).filter(
                Review.restaurant_id == restaurant_id
            ).scalar() or 0.0
            
            # Mock additional metrics (in a real system, these would come from actual data)
            analytics = {
                "restaurant_id": str(restaurant_id),
                "metrics": {
                    "total_visits": review_count * 10,  # Mock calculation
                    "avg_rating": float(avg_rating),
                    "revenue_estimate": review_count * 500.0,  # Mock calculation
                    "market_share": min(avg_rating * 20, 100)  # Mock calculation
                },
                "trends": {
                    "visits_trend": [100, 120, 110, 130, 125, 140, 135],  # Mock data
                    "rating_trend": [4.0, 4.1, 4.0, 4.2, 4.1, 4.3, 4.2]  # Mock data
                },
                "recommendations": [
                    "Consider expanding menu variety",
                    "Focus on improving service speed",
                    "Enhance online presence"
                ]
            }
            
            return analytics
            
        except AuthorizationError:
            raise
        except Exception as e:
            logger.error("Failed to get restaurant analytics", error=str(e))
            raise ValidationError("Failed to get analytics")

    def _update_restaurant_rating(self, restaurant_id: int):
        """Update restaurant's average rating and review count"""
        try:
            # Calculate new average rating
            avg_rating = self.db.query(func.avg(Review.rating)).filter(
                Review.restaurant_id == restaurant_id
            ).scalar()
            
            # Count reviews
            review_count = self.db.query(func.count(Review.id)).filter(
                Review.restaurant_id == restaurant_id
            ).scalar()
            
            # Update restaurant
            self.db.query(Restaurant).filter(Restaurant.id == restaurant_id).update({
                Restaurant.rating: avg_rating,
                Restaurant.review_count: review_count
            })
            
        except Exception as e:
            logger.error("Failed to update restaurant rating", error=str(e))

    def get_total_restaurant_count(self) -> int:
        """Get total number of restaurants in the database"""
        try:
            return self.db.query(func.count(Restaurant.id)).scalar() or 0
        except Exception as e:
            logger.error("Failed to get total restaurant count", error=str(e))
            return 0

    def get_restaurant_counts_by_cuisine(self) -> Dict[str, int]:
        """Get restaurant counts grouped by cuisine type"""
        try:
            results = self.db.query(
                Restaurant.cuisine,
                func.count(Restaurant.id).label('count')
            ).group_by(Restaurant.cuisine).all()
            
            return {cuisine: count for cuisine, count in results}
        except Exception as e:
            logger.error("Failed to get cuisine counts", error=str(e))
            return {}

    def get_rating_statistics(self) -> Dict[str, Any]:
        """Get rating statistics for all restaurants"""
        try:
            stats = self.db.query(
                func.avg(Restaurant.rating).label('average_rating'),
                func.min(Restaurant.rating).label('min_rating'),
                func.max(Restaurant.rating).label('max_rating'),
                func.count(Restaurant.id).filter(Restaurant.rating.isnot(None)).label('rated_count')
            ).first()
            
            return {
                "average_rating": float(stats.average_rating) if stats.average_rating else 0.0,
                "min_rating": float(stats.min_rating) if stats.min_rating else 0.0,
                "max_rating": float(stats.max_rating) if stats.max_rating else 0.0,
                "rated_restaurants": stats.rated_count or 0
            }
        except Exception as e:
            logger.error("Failed to get rating statistics", error=str(e))
            return {
                "average_rating": 0.0,
                "min_rating": 0.0,
                "max_rating": 0.0,
                "rated_restaurants": 0
            }