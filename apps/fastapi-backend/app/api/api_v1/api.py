"""
Main API router for BiteBase FastAPI Backend
"""

from fastapi import APIRouter

from app.api.api_v1.endpoints import auth, users, restaurants, market_analysis, ai_assistant, admin

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(restaurants.router, prefix="/restaurants", tags=["restaurants"])
api_router.include_router(market_analysis.router, prefix="/market-analyses", tags=["market-analysis"])
api_router.include_router(ai_assistant.router, prefix="/ai", tags=["ai-assistant"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])