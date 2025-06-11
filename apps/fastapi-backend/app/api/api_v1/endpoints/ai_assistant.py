"""
AI Assistant endpoints for BiteBase FastAPI Backend
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
import structlog

from app.core.security import get_current_user_id
from app.core.exceptions import ValidationError, ExternalServiceError
from app.db.database import get_db
from app.schemas.market_analysis import (
    AIMarketResearchRequest, AIMarketResearchResponse, AIMarketAnalysisRequest,
    AIChatMessage, AIChatResponse
)
from app.services.ai_service import AIService

logger = structlog.get_logger()
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/")
async def ai_status(request: Request):
    """AI Assistant status endpoint"""
    return {
        "status": "healthy",
        "service": "ai-assistant",
        "version": "1.0.0",
        "features": [
            "market_research",
            "restaurant_recommendations",
            "chat_assistance",
            "data_analysis"
        ]
    }

@router.post("/chat", response_model=AIChatResponse)
async def ai_chat(
    request: Request,
    chat_message: AIChatMessage,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """AI Chat assistant for general queries"""
    try:
        ai_service = AIService(db)
        response = await ai_service.chat_with_assistant(
            message=chat_message.message,
            context=chat_message.context,
            user_id=current_user_id
        )
        
        return response
        
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ExternalServiceError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        logger.error("AI chat failed", error=str(e))
        raise HTTPException(status_code=500, detail="AI chat service unavailable")

@router.post("/market-research", response_model=AIMarketResearchResponse)
async def ai_market_research(
    request: Request,
    research_request: AIMarketResearchRequest,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """AI-powered market research analysis"""
    try:
        ai_service = AIService(db)
        response = await ai_service.conduct_market_research(
            location=research_request.location,
            business_type=research_request.business_type,
            target_audience=research_request.target_audience,
            budget_range=research_request.budget_range,
            user_id=current_user_id
        )
        
        return response
        
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ExternalServiceError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        logger.error("AI market research failed", error=str(e))
        raise HTTPException(status_code=500, detail="Market research service unavailable")

@router.post("/market-analysis")
async def ai_market_analysis(
    request: Request,
    analysis_request: AIMarketAnalysisRequest,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """AI-powered market analysis for specific location and cuisine"""
    try:
        ai_service = AIService(db)
        response = await ai_service.analyze_market_location(
            location=analysis_request.location,
            cuisine_type=analysis_request.cuisine_type,
            radius_km=analysis_request.radius_km,
            user_id=current_user_id
        )
        
        return response
        
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ExternalServiceError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        logger.error("AI market analysis failed", error=str(e))
        raise HTTPException(status_code=500, detail="Market analysis service unavailable")

@router.post("/restaurant-recommendations")
async def ai_restaurant_recommendations(
    request: Request,
    preferences: Dict[str, Any],
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """AI-powered restaurant recommendations based on user preferences"""
    try:
        ai_service = AIService(db)
        recommendations = await ai_service.get_restaurant_recommendations(
            preferences=preferences,
            user_id=current_user_id
        )
        
        return {
            "recommendations": recommendations,
            "total": len(recommendations),
            "generated_at": "2024-01-01T00:00:00Z"
        }
        
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ExternalServiceError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        logger.error("AI restaurant recommendations failed", error=str(e))
        raise HTTPException(status_code=500, detail="Recommendation service unavailable")

@router.post("/business-insights")
async def ai_business_insights(
    request: Request,
    business_data: Dict[str, Any],
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """AI-powered business insights and recommendations"""
    try:
        ai_service = AIService(db)
        insights = await ai_service.generate_business_insights(
            business_data=business_data,
            user_id=current_user_id
        )
        
        return insights
        
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ExternalServiceError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        logger.error("AI business insights failed", error=str(e))
        raise HTTPException(status_code=500, detail="Business insights service unavailable")

@router.post("/optimize-menu")
async def ai_optimize_menu(
    request: Request,
    menu_data: Dict[str, Any],
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """AI-powered menu optimization suggestions"""
    try:
        ai_service = AIService(db)
        optimization = await ai_service.optimize_menu(
            menu_data=menu_data,
            user_id=current_user_id
        )
        
        return optimization
        
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ExternalServiceError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        logger.error("AI menu optimization failed", error=str(e))
        raise HTTPException(status_code=500, detail="Menu optimization service unavailable")

@router.post("/pricing-strategy")
async def ai_pricing_strategy(
    request: Request,
    pricing_data: Dict[str, Any],
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """AI-powered pricing strategy recommendations"""
    try:
        ai_service = AIService(db)
        strategy = await ai_service.suggest_pricing_strategy(
            pricing_data=pricing_data,
            user_id=current_user_id
        )
        
        return strategy
        
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ExternalServiceError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        logger.error("AI pricing strategy failed", error=str(e))
        raise HTTPException(status_code=500, detail="Pricing strategy service unavailable")

@router.get("/usage-stats")
async def ai_usage_stats(
    request: Request,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get AI service usage statistics for the user"""
    try:
        ai_service = AIService(db)
        stats = await ai_service.get_usage_stats(current_user_id)
        
        return stats
        
    except Exception as e:
        logger.error("Failed to get AI usage stats", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve usage statistics")