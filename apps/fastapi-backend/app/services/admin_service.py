"""
Admin service for BiteBase FastAPI Backend
"""

from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, and_
import structlog
from datetime import datetime, timedelta

from app.core.exceptions import ValidationError, NotFoundError
from app.models.user import User, AccountType
from app.models.restaurant import Restaurant
from app.models.market_analysis import MarketAnalysis

logger = structlog.get_logger()

class AdminService:
    def __init__(self, db: Session):
        self.db = db

    def is_admin(self, user_id: str) -> bool:
        """Check if user has admin privileges"""
        try:
            user = self.db.query(User).filter(User.uid == user_id).first()
            return user and user.account_type == AccountType.ADMIN
            
        except Exception as e:
            logger.error("Failed to check admin status", error=str(e))
            return False

    def get_dashboard_stats(self) -> Dict[str, Any]:
        """Get admin dashboard statistics"""
        try:
            # User statistics
            total_users = self.db.query(func.count(User.id)).scalar() or 0
            active_users = self.db.query(func.count(User.id)).filter(User.is_active == True).scalar() or 0
            new_users_today = self.db.query(func.count(User.id)).filter(
                func.date(User.created_at) == datetime.utcnow().date()
            ).scalar() or 0
            
            # Restaurant statistics
            total_restaurants = self.db.query(func.count(Restaurant.id)).scalar() or 0
            restaurants_today = self.db.query(func.count(Restaurant.id)).filter(
                func.date(Restaurant.created_at) == datetime.utcnow().date()
            ).scalar() or 0
            
            # Market analysis statistics
            total_analyses = self.db.query(func.count(MarketAnalysis.id)).scalar() or 0
            analyses_today = self.db.query(func.count(MarketAnalysis.id)).filter(
                func.date(MarketAnalysis.created_at) == datetime.utcnow().date()
            ).scalar() or 0
            
            # Account type distribution
            account_type_stats = self.db.query(
                User.account_type, func.count(User.id)
            ).group_by(User.account_type).all()
            
            account_distribution = {str(account_type): count for account_type, count in account_type_stats}
            
            # Recent activity (last 7 days)
            week_ago = datetime.utcnow() - timedelta(days=7)
            recent_users = self.db.query(func.count(User.id)).filter(
                User.created_at >= week_ago
            ).scalar() or 0
            
            recent_restaurants = self.db.query(func.count(Restaurant.id)).filter(
                Restaurant.created_at >= week_ago
            ).scalar() or 0
            
            return {
                "users": {
                    "total": total_users,
                    "active": active_users,
                    "new_today": new_users_today,
                    "new_this_week": recent_users,
                    "account_distribution": account_distribution
                },
                "restaurants": {
                    "total": total_restaurants,
                    "new_today": restaurants_today,
                    "new_this_week": recent_restaurants
                },
                "market_analyses": {
                    "total": total_analyses,
                    "new_today": analyses_today
                },
                "system": {
                    "uptime": "99.9%",  # Mock data
                    "last_backup": "2024-01-01T00:00:00Z",  # Mock data
                    "database_size": "2.5 GB"  # Mock data
                }
            }
            
        except Exception as e:
            logger.error("Failed to get dashboard stats", error=str(e))
            raise ValidationError("Failed to retrieve dashboard statistics")

    def get_users(
        self, 
        limit: int = 50, 
        offset: int = 0, 
        search: Optional[str] = None,
        account_type: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> Tuple[List[User], int]:
        """Get users with filtering"""
        try:
            query = self.db.query(User)
            
            # Apply filters
            if search:
                search_term = f"%{search}%"
                query = query.filter(
                    or_(
                        User.email.ilike(search_term),
                        User.display_name.ilike(search_term),
                        User.company_name.ilike(search_term)
                    )
                )
            
            if account_type:
                query = query.filter(User.account_type == account_type)
            
            if is_active is not None:
                query = query.filter(User.is_active == is_active)
            
            # Get total count
            total = query.count()
            
            # Apply pagination and ordering
            users = query.order_by(User.created_at.desc()).offset(offset).limit(limit).all()
            
            return users, total
            
        except Exception as e:
            logger.error("Failed to get users", error=str(e))
            raise ValidationError("Failed to retrieve users")

    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        try:
            return self.db.query(User).filter(User.uid == user_id).first()
            
        except Exception as e:
            logger.error("Failed to get user by ID", error=str(e))
            raise ValidationError("Failed to retrieve user")

    def activate_user(self, user_id: str) -> bool:
        """Activate user account"""
        try:
            user = self.get_user_by_id(user_id)
            if not user:
                return False
            
            user.is_active = True
            self.db.commit()
            
            logger.info("User activated by admin", user_id=user_id)
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to activate user", error=str(e))
            return False

    def deactivate_user(self, user_id: str) -> bool:
        """Deactivate user account"""
        try:
            user = self.get_user_by_id(user_id)
            if not user:
                return False
            
            user.is_active = False
            self.db.commit()
            
            logger.info("User deactivated by admin", user_id=user_id)
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to deactivate user", error=str(e))
            return False

    def get_restaurants(
        self, 
        limit: int = 50, 
        offset: int = 0, 
        search: Optional[str] = None,
        cuisine: Optional[str] = None
    ) -> Tuple[List[Restaurant], int]:
        """Get restaurants with filtering"""
        try:
            query = self.db.query(Restaurant)
            
            # Apply filters
            if search:
                search_term = f"%{search}%"
                query = query.filter(
                    or_(
                        Restaurant.name.ilike(search_term),
                        Restaurant.address.ilike(search_term)
                    )
                )
            
            if cuisine:
                query = query.filter(Restaurant.cuisine.ilike(f"%{cuisine}%"))
            
            # Get total count
            total = query.count()
            
            # Apply pagination and ordering
            restaurants = query.order_by(Restaurant.created_at.desc()).offset(offset).limit(limit).all()
            
            return restaurants, total
            
        except Exception as e:
            logger.error("Failed to get restaurants", error=str(e))
            raise ValidationError("Failed to retrieve restaurants")

    def delete_restaurant(self, restaurant_id: int) -> bool:
        """Delete restaurant (admin override)"""
        try:
            restaurant = self.db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
            if not restaurant:
                return False
            
            self.db.delete(restaurant)
            self.db.commit()
            
            logger.info("Restaurant deleted by admin", restaurant_id=restaurant_id)
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to delete restaurant", error=str(e))
            return False

    def get_system_analytics(self, days: int = 30) -> Dict[str, Any]:
        """Get system-wide analytics"""
        try:
            start_date = datetime.utcnow() - timedelta(days=days)
            
            # User growth over time
            user_growth = []
            for i in range(days):
                date = start_date + timedelta(days=i)
                count = self.db.query(func.count(User.id)).filter(
                    func.date(User.created_at) == date.date()
                ).scalar() or 0
                user_growth.append({"date": date.date().isoformat(), "count": count})
            
            # Restaurant growth over time
            restaurant_growth = []
            for i in range(days):
                date = start_date + timedelta(days=i)
                count = self.db.query(func.count(Restaurant.id)).filter(
                    func.date(Restaurant.created_at) == date.date()
                ).scalar() or 0
                restaurant_growth.append({"date": date.date().isoformat(), "count": count})
            
            # Top cuisines
            top_cuisines = self.db.query(
                Restaurant.cuisine, func.count(Restaurant.id).label('count')
            ).filter(
                Restaurant.cuisine.isnot(None)
            ).group_by(Restaurant.cuisine).order_by(func.count(Restaurant.id).desc()).limit(10).all()
            
            cuisine_stats = [{"cuisine": cuisine, "count": count} for cuisine, count in top_cuisines]
            
            # Geographic distribution (mock data for now)
            geographic_distribution = [
                {"region": "North America", "users": 450, "restaurants": 120},
                {"region": "Europe", "users": 230, "restaurants": 80},
                {"region": "Asia", "users": 180, "restaurants": 95},
                {"region": "Other", "users": 90, "restaurants": 25}
            ]
            
            return {
                "period": f"Last {days} days",
                "user_growth": user_growth,
                "restaurant_growth": restaurant_growth,
                "top_cuisines": cuisine_stats,
                "geographic_distribution": geographic_distribution,
                "performance_metrics": {
                    "avg_response_time": "245ms",
                    "uptime_percentage": 99.9,
                    "error_rate": 0.1,
                    "active_sessions": 1250
                }
            }
            
        except Exception as e:
            logger.error("Failed to get system analytics", error=str(e))
            raise ValidationError("Failed to retrieve system analytics")

    def get_market_analyses(self, limit: int = 50, offset: int = 0) -> Tuple[List[MarketAnalysis], int]:
        """Get all market analyses"""
        try:
            query = self.db.query(MarketAnalysis)
            
            # Get total count
            total = query.count()
            
            # Apply pagination and ordering
            analyses = query.order_by(MarketAnalysis.created_at.desc()).offset(offset).limit(limit).all()
            
            return analyses, total
            
        except Exception as e:
            logger.error("Failed to get market analyses", error=str(e))
            raise ValidationError("Failed to retrieve market analyses")

    def perform_maintenance(self, action: str) -> Dict[str, Any]:
        """Perform system maintenance tasks"""
        try:
            if action == "cleanup_cache":
                # Clean up expired AI cache entries
                from app.models.market_analysis import AICache
                expired_count = self.db.query(AICache).filter(
                    AICache.expires_at < datetime.utcnow()
                ).count()
                
                self.db.query(AICache).filter(
                    AICache.expires_at < datetime.utcnow()
                ).delete()
                
                self.db.commit()
                
                return {
                    "action": action,
                    "status": "completed",
                    "details": f"Cleaned up {expired_count} expired cache entries"
                }
            
            elif action == "optimize_database":
                # Mock database optimization
                return {
                    "action": action,
                    "status": "completed",
                    "details": "Database optimization completed successfully"
                }
            
            elif action == "update_statistics":
                # Mock statistics update
                return {
                    "action": action,
                    "status": "completed",
                    "details": "System statistics updated"
                }
            
            else:
                raise ValidationError(f"Unknown maintenance action: {action}")
                
        except ValidationError:
            raise
        except Exception as e:
            logger.error("Maintenance task failed", error=str(e))
            raise ValidationError("Maintenance task failed")

    def get_system_logs(self, level: str = "INFO", limit: int = 100) -> List[Dict[str, Any]]:
        """Get system logs (mock implementation)"""
        try:
            # In a real system, this would fetch from actual log files or logging service
            mock_logs = []
            
            log_levels = ["DEBUG", "INFO", "WARNING", "ERROR"]
            if level.upper() not in log_levels:
                level = "INFO"
            
            # Generate mock log entries
            for i in range(min(limit, 50)):  # Limit to 50 mock entries
                timestamp = datetime.utcnow() - timedelta(minutes=i * 5)
                mock_logs.append({
                    "timestamp": timestamp.isoformat(),
                    "level": level,
                    "message": f"System operation completed successfully",
                    "service": "bitebase-api",
                    "request_id": f"req_{i:04d}"
                })
            
            return mock_logs
            
        except Exception as e:
            logger.error("Failed to get system logs", error=str(e))
            raise ValidationError("Failed to retrieve system logs")

    def create_backup(self, backup_type: str = "full") -> Dict[str, Any]:
        """Create system backup (mock implementation)"""
        try:
            if backup_type not in ["full", "incremental", "database"]:
                raise ValidationError("Invalid backup type")
            
            # Mock backup creation
            backup_id = f"backup_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
            
            return {
                "backup_id": backup_id,
                "type": backup_type,
                "status": "completed",
                "created_at": datetime.utcnow().isoformat(),
                "size": "1.2 GB",  # Mock size
                "location": f"s3://bitebase-backups/{backup_id}.tar.gz"
            }
            
        except ValidationError:
            raise
        except Exception as e:
            logger.error("Backup creation failed", error=str(e))
            raise ValidationError("Backup creation failed")