"""
User endpoints for BiteBase FastAPI Backend
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
import structlog

from app.core.security import get_current_user_id
from app.core.exceptions import NotFoundError, ValidationError
from app.db.database import get_db
from app.schemas.user import User, UserUpdate, UserProfile, UserProfileCreate, UserProfileUpdate
from app.services.user_service import UserService

logger = structlog.get_logger()
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/me", response_model=User)
async def get_current_user(
    request: Request,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get current user information"""
    try:
        user_service = UserService(db)
        user = user_service.get_user_by_uid(current_user_id)
        
        if not user:
            raise NotFoundError("User not found")
        
        return user
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("Failed to get current user", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to get user information")

@router.put("/me", response_model=User)
async def update_current_user(
    request: Request,
    user_data: UserUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Update current user information"""
    try:
        user_service = UserService(db)
        user = user_service.update_user(current_user_id, user_data)
        
        if not user:
            raise NotFoundError("User not found")
        
        logger.info("User updated", user_id=current_user_id)
        return user
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Failed to update user", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to update user")

@router.delete("/me")
async def deactivate_current_user(
    request: Request,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Deactivate current user account"""
    try:
        user_service = UserService(db)
        success = user_service.deactivate_user(current_user_id)
        
        if not success:
            raise NotFoundError("User not found")
        
        logger.info("User deactivated", user_id=current_user_id)
        return {"message": "Account deactivated successfully"}
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("Failed to deactivate user", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to deactivate account")

@router.get("/me/profile", response_model=UserProfile)
async def get_user_profile(
    request: Request,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get user profile"""
    try:
        user_service = UserService(db)
        profile = user_service.get_user_profile(current_user_id)
        
        if not profile:
            raise NotFoundError("User profile not found")
        
        return profile
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("Failed to get user profile", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to get user profile")

@router.post("/me/profile", response_model=UserProfile)
async def create_user_profile(
    request: Request,
    profile_data: UserProfileCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Create user profile"""
    try:
        user_service = UserService(db)
        profile = user_service.create_user_profile(current_user_id, profile_data)
        
        logger.info("User profile created", user_id=current_user_id)
        return profile
        
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Failed to create user profile", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to create user profile")

@router.put("/me/profile", response_model=UserProfile)
async def update_user_profile(
    request: Request,
    profile_data: UserProfileUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    try:
        user_service = UserService(db)
        profile = user_service.update_user_profile(current_user_id, profile_data)
        
        if not profile:
            raise NotFoundError("User profile not found")
        
        logger.info("User profile updated", user_id=current_user_id)
        return profile
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Failed to update user profile", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to update user profile")

@router.get("/me/stats")
async def get_user_stats(
    request: Request,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get user statistics"""
    try:
        user_service = UserService(db)
        stats = user_service.get_user_stats(current_user_id)
        
        return stats
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("Failed to get user stats", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to get user statistics")

@router.post("/me/verify-email")
async def verify_email(
    request: Request,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Verify user email (mock implementation)"""
    try:
        user_service = UserService(db)
        success = user_service.verify_user_email(current_user_id)
        
        if not success:
            raise NotFoundError("User not found")
        
        logger.info("User email verified", user_id=current_user_id)
        return {"message": "Email verified successfully"}
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("Failed to verify email", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to verify email")