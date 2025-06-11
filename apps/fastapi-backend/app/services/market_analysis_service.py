"""
Market Analysis service for BiteBase FastAPI Backend
"""

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
import json
import structlog
from datetime import datetime

from app.core.exceptions import ValidationError, NotFoundError, AuthorizationError
from app.models.market_analysis import MarketAnalysis, AnalysisStatus, CompetitionLevel, MarketSize
from app.schemas.market_analysis import MarketAnalysisCreate, MarketAnalysisUpdate
from app.services.restaurant_service import RestaurantService

logger = structlog.get_logger()

class MarketAnalysisService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_analyses(self, user_id: str) -> List[MarketAnalysis]:
        """Get all market analyses for a user"""
        try:
            analyses = self.db.query(MarketAnalysis).filter(
                MarketAnalysis.user_id == user_id
            ).order_by(MarketAnalysis.created_at.desc()).all()
            
            return analyses
            
        except Exception as e:
            logger.error("Failed to get user analyses", error=str(e))
            raise ValidationError("Failed to retrieve market analyses")

    def get_analysis_by_id(self, analysis_id: int, user_id: str) -> Optional[MarketAnalysis]:
        """Get market analysis by ID (user must own it)"""
        try:
            analysis = self.db.query(MarketAnalysis).filter(
                MarketAnalysis.id == analysis_id,
                MarketAnalysis.user_id == user_id
            ).first()
            
            return analysis
            
        except Exception as e:
            logger.error("Failed to get analysis by ID", error=str(e))
            raise ValidationError("Failed to retrieve market analysis")

    def create_analysis(self, analysis_data: MarketAnalysisCreate, user_id: str) -> MarketAnalysis:
        """Create a new market analysis"""
        try:
            db_analysis = MarketAnalysis(
                **analysis_data.dict(),
                user_id=user_id,
                status=AnalysisStatus.PENDING
            )
            
            self.db.add(db_analysis)
            self.db.commit()
            self.db.refresh(db_analysis)
            
            logger.info("Market analysis created", analysis_id=db_analysis.id, user_id=user_id)
            return db_analysis
            
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to create market analysis", error=str(e))
            raise ValidationError("Failed to create market analysis")

    def update_analysis(self, analysis_id: int, analysis_data: MarketAnalysisUpdate, user_id: str) -> Optional[MarketAnalysis]:
        """Update market analysis (owner only)"""
        try:
            db_analysis = self.get_analysis_by_id(analysis_id, user_id)
            if not db_analysis:
                return None
            
            # Update fields
            for field, value in analysis_data.dict(exclude_unset=True).items():
                setattr(db_analysis, field, value)
            
            self.db.commit()
            self.db.refresh(db_analysis)
            
            logger.info("Market analysis updated", analysis_id=analysis_id, user_id=user_id)
            return db_analysis
            
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to update market analysis", error=str(e))
            raise ValidationError("Failed to update market analysis")

    def delete_analysis(self, analysis_id: int, user_id: str) -> bool:
        """Delete market analysis (owner only)"""
        try:
            db_analysis = self.get_analysis_by_id(analysis_id, user_id)
            if not db_analysis:
                return False
            
            self.db.delete(db_analysis)
            self.db.commit()
            
            logger.info("Market analysis deleted", analysis_id=analysis_id, user_id=user_id)
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error("Failed to delete market analysis", error=str(e))
            return False

    def process_analysis(self, analysis_id: int, user_id: str) -> Optional[MarketAnalysis]:
        """Process/run market analysis"""
        try:
            db_analysis = self.get_analysis_by_id(analysis_id, user_id)
            if not db_analysis:
                return None
            
            # Update status to processing
            db_analysis.status = AnalysisStatus.PROCESSING
            self.db.commit()
            
            # Perform the actual analysis
            analysis_results = self._perform_market_analysis(db_analysis)
            
            # Update with results
            db_analysis.status = AnalysisStatus.COMPLETED
            db_analysis.results = json.dumps(analysis_results["results"])
            db_analysis.opportunity_score = analysis_results["opportunity_score"]
            db_analysis.competition_level = analysis_results["competition_level"]
            db_analysis.market_size = analysis_results["market_size"]
            db_analysis.total_restaurants = analysis_results["total_restaurants"]
            db_analysis.avg_rating = analysis_results["avg_rating"]
            db_analysis.price_distribution = json.dumps(analysis_results["price_distribution"])
            db_analysis.cuisine_distribution = json.dumps(analysis_results["cuisine_distribution"])
            db_analysis.recommendations = json.dumps(analysis_results["recommendations"])
            db_analysis.risk_factors = json.dumps(analysis_results["risk_factors"])
            
            self.db.commit()
            self.db.refresh(db_analysis)
            
            logger.info("Market analysis processed", analysis_id=analysis_id, user_id=user_id)
            return db_analysis
            
        except Exception as e:
            self.db.rollback()
            # Update status to failed
            if db_analysis:
                db_analysis.status = AnalysisStatus.FAILED
                self.db.commit()
            
            logger.error("Failed to process market analysis", error=str(e))
            raise ValidationError("Failed to process market analysis")

    def export_analysis(self, analysis_id: int, user_id: str, format: str = "json") -> Optional[Dict[str, Any]]:
        """Export market analysis in specified format"""
        try:
            db_analysis = self.get_analysis_by_id(analysis_id, user_id)
            if not db_analysis:
                return None
            
            export_data = {
                "id": db_analysis.id,
                "location": db_analysis.location,
                "analysis_type": db_analysis.analysis_type,
                "status": db_analysis.status,
                "opportunity_score": db_analysis.opportunity_score,
                "competition_level": db_analysis.competition_level,
                "market_size": db_analysis.market_size,
                "total_restaurants": db_analysis.total_restaurants,
                "avg_rating": db_analysis.avg_rating,
                "created_at": db_analysis.created_at.isoformat() if db_analysis.created_at else None,
                "results": json.loads(db_analysis.results) if db_analysis.results else None,
                "price_distribution": json.loads(db_analysis.price_distribution) if db_analysis.price_distribution else None,
                "cuisine_distribution": json.loads(db_analysis.cuisine_distribution) if db_analysis.cuisine_distribution else None,
                "recommendations": json.loads(db_analysis.recommendations) if db_analysis.recommendations else None,
                "risk_factors": json.loads(db_analysis.risk_factors) if db_analysis.risk_factors else None
            }
            
            if format.lower() == "csv":
                # Convert to CSV format (simplified)
                return {
                    "format": "csv",
                    "data": self._convert_to_csv(export_data),
                    "filename": f"market_analysis_{analysis_id}.csv"
                }
            else:
                return {
                    "format": "json",
                    "data": export_data,
                    "filename": f"market_analysis_{analysis_id}.json"
                }
                
        except Exception as e:
            logger.error("Failed to export market analysis", error=str(e))
            raise ValidationError("Failed to export market analysis")

    def _perform_market_analysis(self, analysis: MarketAnalysis) -> Dict[str, Any]:
        """Perform the actual market analysis"""
        try:
            # Get restaurant data for the location
            restaurant_service = RestaurantService(self.db)
            
            # Use provided coordinates or default to mock coordinates
            latitude = analysis.latitude or 40.7128  # Default to NYC
            longitude = analysis.longitude or -74.0060
            radius = analysis.radius or 5.0
            
            # Search for restaurants in the area
            search_params = {
                "latitude": latitude,
                "longitude": longitude,
                "radius": radius,
                "limit": 1000  # Get all restaurants in the area
            }
            
            restaurants, total = restaurant_service.search_restaurants(search_params)
            
            # Analyze the data
            total_restaurants = len(restaurants)
            
            # Calculate average rating
            ratings = [r.rating for r in restaurants if r.rating]
            avg_rating = sum(ratings) / len(ratings) if ratings else 0.0
            
            # Analyze price distribution
            price_counts = {}
            for restaurant in restaurants:
                if restaurant.price_range:
                    price_counts[restaurant.price_range] = price_counts.get(restaurant.price_range, 0) + 1
            
            # Analyze cuisine distribution
            cuisine_counts = {}
            for restaurant in restaurants:
                if restaurant.cuisine:
                    cuisine_counts[restaurant.cuisine] = cuisine_counts.get(restaurant.cuisine, 0) + 1
            
            # Determine competition level
            if total_restaurants < 20:
                competition_level = CompetitionLevel.LOW
            elif total_restaurants < 50:
                competition_level = CompetitionLevel.MEDIUM
            else:
                competition_level = CompetitionLevel.HIGH
            
            # Determine market size
            if total_restaurants < 30:
                market_size = MarketSize.SMALL
            elif total_restaurants < 100:
                market_size = MarketSize.MEDIUM
            else:
                market_size = MarketSize.LARGE
            
            # Calculate opportunity score (0-10)
            opportunity_score = min(10.0, max(0.0, 
                (10 - (total_restaurants / 10)) +  # Lower competition = higher score
                (avg_rating / 5 * 2) +  # Higher average rating = higher score
                (5 if analysis.analysis_type == "comprehensive" else 3)  # Bonus for comprehensive analysis
            ))
            
            # Generate recommendations
            recommendations = [
                f"Market has {total_restaurants} existing restaurants",
                f"Average rating in area: {avg_rating:.1f}/5.0",
                f"Competition level: {competition_level.value}",
                f"Market size: {market_size.value}"
            ]
            
            if competition_level == CompetitionLevel.LOW:
                recommendations.append("Low competition presents good opportunity")
            elif competition_level == CompetitionLevel.HIGH:
                recommendations.append("High competition requires strong differentiation")
            
            # Generate risk factors
            risk_factors = []
            if competition_level == CompetitionLevel.HIGH:
                risk_factors.append("High competition in the area")
            if avg_rating > 4.0:
                risk_factors.append("High customer expectations due to quality competitors")
            if total_restaurants > 100:
                risk_factors.append("Market saturation risk")
            
            # Compile results
            results = {
                "summary": f"Analysis of {analysis.location} market",
                "methodology": "Geospatial analysis of restaurant density and ratings",
                "data_sources": ["Restaurant database", "Rating aggregation"],
                "analysis_date": datetime.utcnow().isoformat()
            }
            
            return {
                "results": results,
                "opportunity_score": opportunity_score,
                "competition_level": competition_level,
                "market_size": market_size,
                "total_restaurants": total_restaurants,
                "avg_rating": avg_rating,
                "price_distribution": price_counts,
                "cuisine_distribution": cuisine_counts,
                "recommendations": recommendations,
                "risk_factors": risk_factors
            }
            
        except Exception as e:
            logger.error("Market analysis processing failed", error=str(e))
            raise ValidationError("Market analysis processing failed")

    def _convert_to_csv(self, data: Dict[str, Any]) -> str:
        """Convert analysis data to CSV format"""
        try:
            csv_lines = []
            csv_lines.append("Field,Value")
            
            # Basic fields
            basic_fields = ["id", "location", "analysis_type", "status", "opportunity_score", 
                          "competition_level", "market_size", "total_restaurants", "avg_rating"]
            
            for field in basic_fields:
                if field in data and data[field] is not None:
                    csv_lines.append(f"{field},{data[field]}")
            
            # Add recommendations
            if data.get("recommendations"):
                csv_lines.append("Recommendations")
                for rec in data["recommendations"]:
                    csv_lines.append(f'"{rec}"')
            
            # Add risk factors
            if data.get("risk_factors"):
                csv_lines.append("Risk Factors")
                for risk in data["risk_factors"]:
                    csv_lines.append(f'"{risk}"')
            
            return "\n".join(csv_lines)
            
        except Exception as e:
            logger.error("CSV conversion failed", error=str(e))
            return "Error converting to CSV format"