"""
Market Analysis endpoints for BiteBase FastAPI Backend
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
from app.schemas.market_analysis import MarketAnalysis, MarketAnalysisCreate, MarketAnalysisUpdate
from app.services.market_analysis_service import MarketAnalysisService

logger = structlog.get_logger()
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/", response_model=List[MarketAnalysis])
async def get_market_analyses(
    request: Request,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get all market analyses for the current user"""
    try:
        analysis_service = MarketAnalysisService(db)
        analyses = analysis_service.get_user_analyses(current_user_id)
        
        return analyses
        
    except Exception as e:
        logger.error("Failed to get market analyses", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve market analyses")

@router.post("/", response_model=MarketAnalysis)
async def create_market_analysis(
    request: Request,
    analysis_data: MarketAnalysisCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Create a new market analysis"""
    try:
        analysis_service = MarketAnalysisService(db)
        analysis = analysis_service.create_analysis(analysis_data, current_user_id)
        
        logger.info("Market analysis created", analysis_id=analysis.id, user_id=current_user_id)
        return analysis
        
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Failed to create market analysis", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to create market analysis")

@router.get("/{analysis_id}", response_model=MarketAnalysis)
async def get_market_analysis(
    analysis_id: int,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get market analysis by ID"""
    try:
        analysis_service = MarketAnalysisService(db)
        analysis = analysis_service.get_analysis_by_id(analysis_id, current_user_id)
        
        if not analysis:
            raise NotFoundError("Market analysis not found")
        
        return analysis
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("Failed to get market analysis", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve market analysis")

@router.put("/{analysis_id}", response_model=MarketAnalysis)
async def update_market_analysis(
    analysis_id: int,
    analysis_data: MarketAnalysisUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Update market analysis"""
    try:
        analysis_service = MarketAnalysisService(db)
        analysis = analysis_service.update_analysis(analysis_id, analysis_data, current_user_id)
        
        if not analysis:
            raise NotFoundError("Market analysis not found")
        
        logger.info("Market analysis updated", analysis_id=analysis_id, user_id=current_user_id)
        return analysis
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Failed to update market analysis", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to update market analysis")

@router.delete("/{analysis_id}")
async def delete_market_analysis(
    analysis_id: int,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Delete market analysis"""
    try:
        analysis_service = MarketAnalysisService(db)
        success = analysis_service.delete_analysis(analysis_id, current_user_id)
        
        if not success:
            raise NotFoundError("Market analysis not found")
        
        logger.info("Market analysis deleted", analysis_id=analysis_id, user_id=current_user_id)
        return {"message": "Market analysis deleted successfully"}
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("Failed to delete market analysis", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to delete market analysis")

@router.post("/{analysis_id}/process")
async def process_market_analysis(
    analysis_id: int,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Process/run market analysis"""
    try:
        analysis_service = MarketAnalysisService(db)
        analysis = analysis_service.process_analysis(analysis_id, current_user_id)
        
        if not analysis:
            raise NotFoundError("Market analysis not found")
        
        logger.info("Market analysis processed", analysis_id=analysis_id, user_id=current_user_id)
        return analysis
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Failed to process market analysis", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to process market analysis")

@router.get("/{analysis_id}/export")
async def export_market_analysis(
    analysis_id: int,
    format: str = "json",
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Export market analysis in specified format"""
    try:
        analysis_service = MarketAnalysisService(db)
        export_data = analysis_service.export_analysis(analysis_id, current_user_id, format)
        
        if not export_data:
            raise NotFoundError("Market analysis not found")
        
        return export_data
        
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Failed to export market analysis", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to export market analysis")