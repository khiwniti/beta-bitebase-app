"""
Restaurant endpoints for BiteBase FastAPI Backend
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
import structlog

from app.core.security import get_current_user_id
from app.core.exceptions import NotFoundError, ValidationError
from app.db.database import get_db
from app.schemas.restaurant import (
    Restaurant, RestaurantCreate, RestaurantUpdate, RestaurantSearch,
    RestaurantSearchResponse, RestaurantDetail, Review, ReviewCreate,
    MenuItem, MenuItemCreate, WongnaiSearchParams, BatchMenuRequest,
    BatchMenuResponse, RealDataFetchRequest, RealDataFetchResponse
)
from app.services.restaurant_service import RestaurantService
from app.services.external_api_service import ExternalAPIService

logger = structlog.get_logger()
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/", response_model=RestaurantSearchResponse)
async def get_restaurants(
    request: Request,
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    cuisine: Optional[str] = None,
    price_range: Optional[str] = None,
    rating_min: Optional[float] = None,
    db: Session = Depends(get_db)
):
    """Get all restaurants with optional filtering"""
    try:
        restaurant_service = RestaurantService(db)
        
        search_params = RestaurantSearch(
            cuisine=cuisine,
            price_range=price_range,
            rating_min=rating_min,
            limit=limit,
            offset=offset
        )
        
        restaurants, total = restaurant_service.search_restaurants(search_params)
        
        return RestaurantSearchResponse(
            restaurants=restaurants,
            total=total,
            limit=limit,
            offset=offset
        )
        
    except Exception as e:
        logger.error("Failed to get restaurants", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve restaurants")

@router.get("/search", response_model=RestaurantSearchResponse)
async def search_restaurants(
    request: Request,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius: float = Query(5.0, ge=0.1, le=50),
    cuisine: Optional[str] = None,
    price_range: Optional[str] = None,
    rating_min: Optional[float] = None,
    query: Optional[str] = None,
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Search restaurants by location and other criteria"""
    try:
        restaurant_service = RestaurantService(db)
        
        search_params = RestaurantSearch(
            latitude=latitude,
            longitude=longitude,
            radius=radius,
            cuisine=cuisine,
            price_range=price_range,
            rating_min=rating_min,
            query=query,
            limit=limit,
            offset=offset
        )
        
        restaurants, total = restaurant_service.search_restaurants(search_params)
        
        return RestaurantSearchResponse(
            restaurants=restaurants,
            total=total,
            limit=limit,
            offset=offset
        )
        
    except Exception as e:
        logger.error("Restaurant search failed", error=str(e))
        raise HTTPException(status_code=500, detail="Search failed")

@router.get("/{restaurant_id}", response_model=RestaurantDetail)
async def get_restaurant(
    restaurant_id: int,
    db: Session = Depends(get_db)
):
    """Get restaurant by ID with reviews and menu items"""
    try:
        restaurant_service = RestaurantService(db)
        restaurant = restaurant_service.get_restaurant_detail(restaurant_id)
        
        if not restaurant:
            raise NotFoundError("Restaurant not found")
        
        return restaurant
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("Failed to get restaurant", restaurant_id=restaurant_id, error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve restaurant")

@router.post("/", response_model=Restaurant)
async def create_restaurant(
    request: Request,
    restaurant_data: RestaurantCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Create a new restaurant"""
    try:
        restaurant_service = RestaurantService(db)
        restaurant = restaurant_service.create_restaurant(restaurant_data, current_user_id)
        
        logger.info("Restaurant created", restaurant_id=restaurant.id, user_id=current_user_id)
        return restaurant
        
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Failed to create restaurant", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to create restaurant")

@router.put("/{restaurant_id}", response_model=Restaurant)
async def update_restaurant(
    restaurant_id: int,
    restaurant_data: RestaurantUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Update restaurant (owner only)"""
    try:
        restaurant_service = RestaurantService(db)
        restaurant = restaurant_service.update_restaurant(restaurant_id, restaurant_data, current_user_id)
        
        if not restaurant:
            raise NotFoundError("Restaurant not found or access denied")
        
        logger.info("Restaurant updated", restaurant_id=restaurant_id, user_id=current_user_id)
        return restaurant
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Failed to update restaurant", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to update restaurant")

@router.delete("/{restaurant_id}")
async def delete_restaurant(
    restaurant_id: int,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Delete restaurant (owner only)"""
    try:
        restaurant_service = RestaurantService(db)
        success = restaurant_service.delete_restaurant(restaurant_id, current_user_id)
        
        if not success:
            raise NotFoundError("Restaurant not found or access denied")
        
        logger.info("Restaurant deleted", restaurant_id=restaurant_id, user_id=current_user_id)
        return {"message": "Restaurant deleted successfully"}
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("Failed to delete restaurant", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to delete restaurant")

# Review endpoints
@router.post("/{restaurant_id}/reviews", response_model=Review)
async def create_review(
    restaurant_id: int,
    review_data: ReviewCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Create a review for a restaurant"""
    try:
        restaurant_service = RestaurantService(db)
        
        # Ensure restaurant_id matches
        review_data.restaurant_id = restaurant_id
        
        review = restaurant_service.create_review(review_data, current_user_id)
        
        logger.info("Review created", restaurant_id=restaurant_id, user_id=current_user_id)
        return review
        
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Failed to create review", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to create review")

@router.get("/{restaurant_id}/reviews", response_model=List[Review])
async def get_restaurant_reviews(
    restaurant_id: int,
    limit: int = Query(20, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Get reviews for a restaurant"""
    try:
        restaurant_service = RestaurantService(db)
        reviews = restaurant_service.get_restaurant_reviews(restaurant_id, limit, offset)
        
        return reviews
        
    except Exception as e:
        logger.error("Failed to get reviews", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve reviews")

# Menu endpoints
@router.post("/{restaurant_id}/menu-items", response_model=MenuItem)
async def create_menu_item(
    restaurant_id: int,
    menu_item_data: MenuItemCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Create a menu item for a restaurant"""
    try:
        restaurant_service = RestaurantService(db)
        
        # Ensure restaurant_id matches
        menu_item_data.restaurant_id = restaurant_id
        
        menu_item = restaurant_service.create_menu_item(menu_item_data, current_user_id)
        
        logger.info("Menu item created", restaurant_id=restaurant_id, user_id=current_user_id)
        return menu_item
        
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Failed to create menu item", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to create menu item")

@router.get("/{restaurant_id}/menu-items", response_model=List[MenuItem])
async def get_restaurant_menu(
    restaurant_id: int,
    db: Session = Depends(get_db)
):
    """Get menu items for a restaurant"""
    try:
        restaurant_service = RestaurantService(db)
        menu_items = restaurant_service.get_restaurant_menu_items(restaurant_id)
        
        return menu_items
        
    except Exception as e:
        logger.error("Failed to get menu items", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve menu items")

# External API endpoints
@router.post("/wongnai/search")
async def search_wongnai_restaurants(
    request: Request,
    search_params: WongnaiSearchParams,
    db: Session = Depends(get_db)
):
    """Search restaurants from Wongnai API"""
    try:
        external_service = ExternalAPIService()
        results = await external_service.search_wongnai_restaurants(search_params)
        
        return {
            "restaurants": results,
            "total": len(results)
        }
        
    except Exception as e:
        logger.error("Wongnai search failed", error=str(e))
        raise HTTPException(status_code=500, detail="External API search failed")

@router.post("/menus/batch", response_model=BatchMenuResponse)
async def get_batch_menus(
    request: Request,
    batch_request: BatchMenuRequest,
    db: Session = Depends(get_db)
):
    """Get menus for multiple restaurants"""
    try:
        external_service = ExternalAPIService()
        results = await external_service.get_batch_menus(batch_request.publicIds)
        
        return results
        
    except Exception as e:
        logger.error("Batch menu fetch failed", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to fetch menus")

@router.post("/fetch-real-data", response_model=RealDataFetchResponse)
async def fetch_real_restaurant_data(
    request: Request,
    fetch_request: RealDataFetchRequest,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Fetch real restaurant data from external APIs"""
    try:
        external_service = ExternalAPIService()
        restaurant_service = RestaurantService(db)
        
        # Fetch data from external APIs
        external_data = await external_service.fetch_real_restaurant_data(fetch_request)
        
        # Store in database
        stored_restaurants = []
        for restaurant_data in external_data.get("all_restaurants", []):
            try:
                stored_restaurant = restaurant_service.create_or_update_external_restaurant(restaurant_data)
                stored_restaurants.append(stored_restaurant)
            except Exception as e:
                logger.warning("Failed to store restaurant", error=str(e))
        
        return RealDataFetchResponse(
            status="success",
            location={
                "latitude": fetch_request.latitude,
                "longitude": fetch_request.longitude,
                "radius": fetch_request.radius
            },
            platforms_searched=fetch_request.platforms,
            restaurants_found={"total": len(stored_restaurants)},
            all_restaurants=external_data.get("all_restaurants", []),
            sample_restaurants=external_data.get("sample_restaurants", []),
            message=f"Successfully fetched and stored {len(stored_restaurants)} restaurants"
        )
        
    except Exception as e:
        logger.error("Real data fetch failed", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to fetch real restaurant data")

@router.get("/{restaurant_id}/analytics")
async def get_restaurant_analytics(
    restaurant_id: int,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get analytics for a restaurant"""
    try:
        restaurant_service = RestaurantService(db)
        analytics = restaurant_service.get_restaurant_analytics(restaurant_id, current_user_id)
        
        if not analytics:
            raise NotFoundError("Restaurant not found or access denied")
        
        return analytics
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("Failed to get restaurant analytics", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve analytics")