"""
Authentication endpoints for BiteBase FastAPI Backend
"""

from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
import structlog

from app.core.config import settings
from app.core.security import (
    verify_password, 
    get_password_hash, 
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
    get_current_user_id
)
from app.core.exceptions import AuthenticationError, ValidationError
from app.db.database import get_db
from app.schemas.user import UserCreate, UserLogin, Token, RefreshToken, User
from app.services.user_service import UserService

logger = structlog.get_logger()
router = APIRouter()
security = HTTPBearer()
limiter = Limiter(key_func=get_remote_address)

@router.post("/register", response_model=dict)
async def register(
    request: Request,
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    try:
        user_service = UserService(db)
        
        # Check if user already exists
        existing_user = user_service.get_user_by_email(user_data.email)
        if existing_user:
            raise ValidationError("Email already registered")
        
        # Create new user
        user = user_service.create_user(user_data)
        
        # Generate tokens
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.uid}, expires_delta=access_token_expires
        )
        refresh_token = create_refresh_token(user.uid)
        
        logger.info("User registered successfully", user_id=user.uid, email=user.email)
        
        return {
            "message": "User registered successfully",
            "user": {
                "id": user.uid,
                "email": user.email,
                "display_name": user.display_name,
                "account_type": user.account_type
            },
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
        
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Registration failed", error=str(e))
        raise HTTPException(status_code=500, detail="Registration failed")

@router.post("/login", response_model=dict)
async def login(
    request: Request,
    user_credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """Authenticate user and return tokens"""
    try:
        user_service = UserService(db)
        
        # Get user by email
        user = user_service.get_user_by_email(user_credentials.email)
        if not user:
            raise AuthenticationError("Invalid credentials")
        
        # Verify password
        if not verify_password(user_credentials.password, user.hashed_password):
            raise AuthenticationError("Invalid credentials")
        
        # Check if user is active
        if not user.is_active:
            raise AuthenticationError("Account is disabled")
        
        # Generate tokens
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.uid}, expires_delta=access_token_expires
        )
        refresh_token = create_refresh_token(user.uid)
        
        # Update last login
        user_service.update_last_login(user.uid)
        
        logger.info("User logged in successfully", user_id=user.uid, email=user.email)
        
        return {
            "message": "Login successful",
            "user": {
                "id": user.uid,
                "email": user.email,
                "display_name": user.display_name,
                "account_type": user.account_type,
                "is_verified": user.is_verified
            },
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }
        
    except AuthenticationError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        logger.error("Login failed", error=str(e))
        raise HTTPException(status_code=500, detail="Login failed")

@router.post("/refresh", response_model=dict)
async def refresh_token(
    request: Request,
    refresh_data: RefreshToken,
    db: Session = Depends(get_db)
):
    """Refresh access token using refresh token"""
    try:
        # Verify refresh token
        user_id = verify_refresh_token(refresh_data.refresh_token)
        
        # Check if user still exists and is active
        user_service = UserService(db)
        user = user_service.get_user_by_uid(user_id)
        if not user or not user.is_active:
            raise AuthenticationError("Invalid refresh token")
        
        # Generate new access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.uid}, expires_delta=access_token_expires
        )
        
        logger.info("Token refreshed successfully", user_id=user.uid)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }
        
    except AuthenticationError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        logger.error("Token refresh failed", error=str(e))
        raise HTTPException(status_code=500, detail="Token refresh failed")

@router.post("/logout")
async def logout(
    request: Request,
    current_user_id: str = Depends(get_current_user_id)
):
    """Logout user (invalidate tokens)"""
    try:
        # In a production system, you would add the token to a blacklist
        # For now, we'll just log the logout
        logger.info("User logged out", user_id=current_user_id)
        
        return {"message": "Logged out successfully"}
        
    except Exception as e:
        logger.error("Logout failed", error=str(e))
        raise HTTPException(status_code=500, detail="Logout failed")

@router.post("/google")
async def google_auth(
    request: Request,
    google_data: dict,
    db: Session = Depends(get_db)
):
    """Google OAuth authentication"""
    try:
        token = google_data.get("token")
        if not token:
            raise HTTPException(status_code=400, detail="Google token required")
        
        # For demo purposes, create a user with Google token info
        # In production, you would verify the Google token
        import time
        email = f"google.user.{int(time.time())}@gmail.com"
        
        user_service = UserService(db)
        
        # Check if user exists
        existing_user = user_service.get_user_by_email(email)
        if existing_user:
            # Generate JWT token
            access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": existing_user.uid}, expires_delta=access_token_expires
            )
            return {
                "token": access_token,
                "user": {
                    "id": existing_user.id,
                    "email": existing_user.email,
                    "name": f"{existing_user.first_name} {existing_user.last_name}",
                    "role": existing_user.role
                },
                "isNewUser": False
            }
        else:
            # Create new user
            user_data = UserCreate(
                email=email,
                password="google_oauth_user",  # Placeholder password
                first_name="Google",
                last_name="User",
                phone=""
            )
            new_user = user_service.create_user(user_data)
            
            # Generate JWT token
            access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": new_user.uid}, expires_delta=access_token_expires
            )
            return {
                "token": access_token,
                "user": {
                    "id": new_user.id,
                    "email": new_user.email,
                    "name": f"{new_user.first_name} {new_user.last_name}",
                    "role": new_user.role
                },
                "isNewUser": True
            }
            
    except Exception as e:
        logger.error("Google authentication failed", error=str(e))
        raise HTTPException(status_code=500, detail="Google authentication failed")

@router.get("/me", response_model=User)
async def get_current_user(
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get current user information"""
    try:
        user_service = UserService(db)
        user = user_service.get_user_by_uid(current_user_id)
        
        if not user:
            raise AuthenticationError("User not found")
        
        return user
        
    except AuthenticationError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        logger.error("Failed to get current user", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to get user information")

