"""
Admin endpoints for BiteBase FastAPI Backend
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
import structlog

from app.core.security import get_current_user_id
from app.core.exceptions import NotFoundError, ValidationError, AuthorizationError
from app.db.database import get_db
from app.schemas.user import User
from app.schemas.restaurant import Restaurant
from app.schemas.market_analysis import MarketAnalysis
from app.services.admin_service import AdminService

logger = structlog.get_logger()
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

async def verify_admin_access(
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Verify that the current user has admin access"""
    admin_service = AdminService(db)
    if not admin_service.is_admin(current_user_id):
        raise AuthorizationError("Admin access required")
    return current_user_id

@router.get("/dashboard")
async def get_admin_dashboard(
    request: Request,
    admin_user_id: str = Depends(verify_admin_access),
    db: Session = Depends(get_db)
):
    """Get admin dashboard statistics"""
    try:
        admin_service = AdminService(db)
        dashboard_data = admin_service.get_dashboard_stats()
        
        return dashboard_data
        
    except Exception as e:
        logger.error("Failed to get admin dashboard", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve dashboard data")

@router.get("/users", response_model=List[User])
async def get_all_users(
    request: Request,
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    search: Optional[str] = None,
    account_type: Optional[str] = None,
    is_active: Optional[bool] = None,
    admin_user_id: str = Depends(verify_admin_access),
    db: Session = Depends(get_db)
):
    """Get all users with filtering options"""
    try:
        admin_service = AdminService(db)
        users, total = admin_service.get_users(
            limit=limit,
            offset=offset,
            search=search,
            account_type=account_type,
            is_active=is_active
        )
        
        return {
            "users": users,
            "total": total,
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        logger.error("Failed to get users", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve users")

@router.get("/users/{user_id}", response_model=User)
async def get_user_by_id(
    user_id: str,
    admin_user_id: str = Depends(verify_admin_access),
    db: Session = Depends(get_db)
):
    """Get user by ID"""
    try:
        admin_service = AdminService(db)
        user = admin_service.get_user_by_id(user_id)
        
        if not user:
            raise NotFoundError("User not found")
        
        return user
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("Failed to get user", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve user")

@router.put("/users/{user_id}/activate")
async def activate_user(
    user_id: str,
    admin_user_id: str = Depends(verify_admin_access),
    db: Session = Depends(get_db)
):
    """Activate user account"""
    try:
        admin_service = AdminService(db)
        success = admin_service.activate_user(user_id)
        
        if not success:
            raise NotFoundError("User not found")
        
        logger.info("User activated by admin", user_id=user_id, admin_id=admin_user_id)
        return {"message": "User activated successfully"}
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("Failed to activate user", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to activate user")

@router.put("/users/{user_id}/deactivate")
async def deactivate_user(
    user_id: str,
    admin_user_id: str = Depends(verify_admin_access),
    db: Session = Depends(get_db)
):
    """Deactivate user account"""
    try:
        admin_service = AdminService(db)
        success = admin_service.deactivate_user(user_id)
        
        if not success:
            raise NotFoundError("User not found")
        
        logger.info("User deactivated by admin", user_id=user_id, admin_id=admin_user_id)
        return {"message": "User deactivated successfully"}
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("Failed to deactivate user", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to deactivate user")

@router.get("/restaurants", response_model=List[Restaurant])
async def get_all_restaurants(
    request: Request,
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    search: Optional[str] = None,
    cuisine: Optional[str] = None,
    admin_user_id: str = Depends(verify_admin_access),
    db: Session = Depends(get_db)
):
    """Get all restaurants with filtering options"""
    try:
        admin_service = AdminService(db)
        restaurants, total = admin_service.get_restaurants(
            limit=limit,
            offset=offset,
            search=search,
            cuisine=cuisine
        )
        
        return {
            "restaurants": restaurants,
            "total": total,
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        logger.error("Failed to get restaurants", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve restaurants")

@router.delete("/restaurants/{restaurant_id}")
async def delete_restaurant_admin(
    restaurant_id: int,
    admin_user_id: str = Depends(verify_admin_access),
    db: Session = Depends(get_db)
):
    """Delete restaurant (admin only)"""
    try:
        admin_service = AdminService(db)
        success = admin_service.delete_restaurant(restaurant_id)
        
        if not success:
            raise NotFoundError("Restaurant not found")
        
        logger.info("Restaurant deleted by admin", restaurant_id=restaurant_id, admin_id=admin_user_id)
        return {"message": "Restaurant deleted successfully"}
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("Failed to delete restaurant", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to delete restaurant")

@router.get("/analytics")
async def get_system_analytics(
    request: Request,
    days: int = Query(30, ge=1, le=365),
    admin_user_id: str = Depends(verify_admin_access),
    db: Session = Depends(get_db)
):
    """Get system-wide analytics"""
    try:
        admin_service = AdminService(db)
        analytics = admin_service.get_system_analytics(days)
        
        return analytics
        
    except Exception as e:
        logger.error("Failed to get system analytics", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve analytics")

@router.get("/market-analyses", response_model=List[MarketAnalysis])
async def get_all_market_analyses(
    request: Request,
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    admin_user_id: str = Depends(verify_admin_access),
    db: Session = Depends(get_db)
):
    """Get all market analyses"""
    try:
        admin_service = AdminService(db)
        analyses, total = admin_service.get_market_analyses(limit=limit, offset=offset)
        
        return {
            "analyses": analyses,
            "total": total,
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        logger.error("Failed to get market analyses", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve market analyses")

@router.post("/system/maintenance")
async def system_maintenance(
    request: Request,
    action: str,
    admin_user_id: str = Depends(verify_admin_access),
    db: Session = Depends(get_db)
):
    """Perform system maintenance tasks"""
    try:
        admin_service = AdminService(db)
        result = admin_service.perform_maintenance(action)
        
        logger.info("System maintenance performed", action=action, admin_id=admin_user_id)
        return result
        
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("System maintenance failed", error=str(e))
        raise HTTPException(status_code=500, detail="Maintenance task failed")

@router.get("/logs")
async def get_system_logs(
    request: Request,
    level: str = Query("INFO"),
    limit: int = Query(100, le=1000),
    admin_user_id: str = Depends(verify_admin_access),
    db: Session = Depends(get_db)
):
    """Get system logs"""
    try:
        admin_service = AdminService(db)
        logs = admin_service.get_system_logs(level=level, limit=limit)
        
        return {
            "logs": logs,
            "total": len(logs),
            "level": level
        }
        
    except Exception as e:
        logger.error("Failed to get system logs", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve logs")

@router.post("/backup")
async def create_backup(
    request: Request,
    backup_type: str = "full",
    admin_user_id: str = Depends(verify_admin_access),
    db: Session = Depends(get_db)
):
    """Create system backup"""
    try:
        admin_service = AdminService(db)
        backup_info = admin_service.create_backup(backup_type)
        
        logger.info("Backup created", backup_type=backup_type, admin_id=admin_user_id)
        return backup_info
        
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Backup creation failed", error=str(e))
        raise HTTPException(status_code=500, detail="Backup creation failed")