"""
User service for BiteBase FastAPI Backend
"""

from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
import uuid
import structlog

from app.core.security import get_password_hash
from app.core.exceptions import ValidationError, NotFoundError
from app.models.user import User, UserProfile
from app.schemas.user import UserCreate, UserUpdate, UserProfileCreate, UserProfileUpdate

logger = structlog.get_logger()

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_uid(self, uid: str) -> Optional[User]:
        """Get user by UID"""
        return self.db.query(User).filter(User.uid == uid).first()

    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user"""
        try:
            # Generate unique UID
            uid = str(uuid.uuid4())
            
            # Hash password
            hashed_password = get_password_hash(user_data.password)
            
            # Create user
            db_user = User(
                uid=uid,
                email=user_data.email,
                hashed_password=hashed_password,
                display_name=user_data.display_name,
                account_type=user_data.account_type,
                company_name=user_data.company_name,
                phone=user_data.phone,
                is_active=True,
                is_verified=False
            )
            
            self.db.add(db_user)
            self.db.commit()
            self.db.refresh(db_user)
            
            logger.info("User created successfully", user_id=uid, email=user_data.email)
            return db_user
            
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to create user", error=str(e))
            raise ValidationError("Failed to create user")

    def update_user(self, uid: str, user_data: UserUpdate) -> Optional[User]:
        """Update user information"""
        try:
            db_user = self.get_user_by_uid(uid)
            if not db_user:
                return None
            
            # Update fields
            for field, value in user_data.dict(exclude_unset=True).items():
                setattr(db_user, field, value)
            
            self.db.commit()
            self.db.refresh(db_user)
            
            logger.info("User updated successfully", user_id=uid)
            return db_user
            
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to update user", error=str(e))
            raise ValidationError("Failed to update user")

    def update_last_login(self, uid: str) -> None:
        """Update user's last login timestamp"""
        try:
            self.db.query(User).filter(User.uid == uid).update({
                User.last_login: func.now()
            })
            self.db.commit()
            
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to update last login", error=str(e))

    def deactivate_user(self, uid: str) -> bool:
        """Deactivate user account"""
        try:
            db_user = self.get_user_by_uid(uid)
            if not db_user:
                return False
            
            db_user.is_active = False
            self.db.commit()
            
            logger.info("User deactivated", user_id=uid)
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to deactivate user", error=str(e))
            return False

    def verify_user_email(self, uid: str) -> bool:
        """Mark user email as verified"""
        try:
            db_user = self.get_user_by_uid(uid)
            if not db_user:
                return False
            
            db_user.is_verified = True
            self.db.commit()
            
            logger.info("User email verified", user_id=uid)
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to verify user email", error=str(e))
            return False

    # User Profile methods
    def get_user_profile(self, uid: str) -> Optional[UserProfile]:
        """Get user profile"""
        return self.db.query(UserProfile).filter(UserProfile.user_id == uid).first()

    def create_user_profile(self, uid: str, profile_data: UserProfileCreate) -> UserProfile:
        """Create user profile"""
        try:
            db_profile = UserProfile(
                user_id=uid,
                **profile_data.dict()
            )
            
            self.db.add(db_profile)
            self.db.commit()
            self.db.refresh(db_profile)
            
            logger.info("User profile created", user_id=uid)
            return db_profile
            
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to create user profile", error=str(e))
            raise ValidationError("Failed to create user profile")

    def update_user_profile(self, uid: str, profile_data: UserProfileUpdate) -> Optional[UserProfile]:
        """Update user profile"""
        try:
            db_profile = self.get_user_profile(uid)
            if not db_profile:
                # Create profile if it doesn't exist
                return self.create_user_profile(uid, UserProfileCreate(**profile_data.dict()))
            
            # Update fields
            for field, value in profile_data.dict(exclude_unset=True).items():
                setattr(db_profile, field, value)
            
            self.db.commit()
            self.db.refresh(db_profile)
            
            logger.info("User profile updated", user_id=uid)
            return db_profile
            
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to update user profile", error=str(e))
            raise ValidationError("Failed to update user profile")

    def get_user_stats(self, uid: str) -> dict:
        """Get user statistics"""
        try:
            user = self.get_user_by_uid(uid)
            if not user:
                raise NotFoundError("User not found")
            
            # Count user's restaurants
            restaurant_count = len(user.restaurants) if user.restaurants else 0
            
            # Count user's reviews
            review_count = len(user.reviews) if user.reviews else 0
            
            # Count user's market analyses
            analysis_count = len(user.market_analyses) if user.market_analyses else 0
            
            return {
                "restaurants_count": restaurant_count,
                "reviews_count": review_count,
                "analyses_count": analysis_count,
                "account_type": user.account_type,
                "is_verified": user.is_verified,
                "member_since": user.created_at.isoformat() if user.created_at else None
            }
            
        except Exception as e:
            logger.error("Failed to get user stats", error=str(e))
            raise ValidationError("Failed to get user statistics")