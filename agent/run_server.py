#!/usr/bin/env python3
"""
Restaurant Market Research Agent Server

This server provides REST API endpoints for the restaurant market research agent.
"""

import os
import sys
import json
import logging
import asyncio
import uvicorn
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

# Add the parent directory to sys.path to find modules
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("restaurant-research-server")

# Try to import agent components, use dummy implementation if failed
AGENT_LOADED = False
try:
    from bitebase_ai.restaurant_research import (
        analyze_market, analyze_demographics, analyze_competitors,
        analyze_nearby_restaurants, analyze_location, calculate_foot_traffic, analyze_area,
        run_research
    )
    from bitebase_ai.search import search_for_places, get_place_details
    from bitebase_ai.agents.restaurant_research_agent import RestaurantResearchAgent
    
    # Try initializing the agent
    agent = RestaurantResearchAgent()
    logger.info("Restaurant Research Agent initialized successfully")
    AGENT_LOADED = True
except Exception as e:
    logger.error(f"Failed to load agent components: {e}")
    logger.warning("Running in fallback mode with limited functionality")
    
    # Define dummy implementations for missing functions
    async def generate_insights(data):
        for chunk in ["This is a fallback response. ", 
                      "The agent components could not be loaded properly. ", 
                      "Please check your installation and Python path."]:
            yield chunk
    
    # Create a dummy agent class
    class DummyAgent:
        async def run_async(self, **kwargs):
            stream_callback = kwargs.get("stream_callback")
            if stream_callback:
                await stream_callback("Running in fallback mode. Agent components not loaded.")
            return {"status": "error", "message": "Agent components not loaded"}
            
        async def generate_insights(self, data):
            async for chunk in generate_insights(data):
                yield chunk
    
    # Use dummy implementations
    agent = DummyAgent()
    
    def dummy_function(**kwargs):
        return {
            "status": "error",
            "message": "This function is not available in fallback mode",
            "params": kwargs
        }
    
    # Define dummy functions
    analyze_market = analyze_demographics = analyze_competitors = dummy_function
    analyze_nearby_restaurants = analyze_location = calculate_foot_traffic = dummy_function
    analyze_area = search_for_places = get_place_details = dummy_function
    run_research = lambda *args, **kwargs: {"status": "error", "message": "Research function not available in fallback mode"}

# Initialize the FastAPI app
app = FastAPI(title="Restaurant Market Research Agent API")
app.agent_loaded = AGENT_LOADED

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define API models
class LocationRequest(BaseModel):
    latitude: float
    longitude: float
    radius_km: float = 1.0
    platforms: Optional[List[str]] = None
    match: bool = False
    analyze: bool = True

class SearchRequest(BaseModel):
    queries: List[str]
    location: str
    filters: Optional[Dict[str, Any]] = None

class MarketAnalysisRequest(BaseModel):
    location: str
    cuisine_type: Optional[str] = ""
    radius_km: float = 1.0

class CompetitorAnalysisRequest(BaseModel):
    location: str
    restaurant_type: Optional[str] = ""
    radius_km: float = 1.0

class LocationAnalysisRequest(BaseModel):
    address: str

class FootTrafficRequest(BaseModel):
    location: str
    day_of_week: Optional[str] = "average"

class AreaAnalysisRequest(BaseModel):
    latitude: float
    longitude: float
    radius_km: float = 1.0

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ResearchRequest(BaseModel):
    location: str
    cuisine_type: str
    additional_context: Optional[Dict[str, Any]] = None

# Define API endpoints
@app.get("/")
async def root():
    status = "fully operational" if AGENT_LOADED else "running in fallback mode"
    return {
        "message": f"Restaurant Market Research Agent API ({status})",
        "agent_loaded": AGENT_LOADED
    }

@app.get("/api/status")
async def status():
    """Get the status of the API and agent components"""
    return {
        "status": "ok",
        "agent_loaded": AGENT_LOADED,
        "version": "0.1.0"
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "BiteBase AI Agent",
        "version": "0.1.0"
    }

@app.post("/api/research")
async def research_location(request: LocationRequest):
    """Run restaurant research for a specific location"""
    try:
        result = await agent.run_async(
            latitude=request.latitude,
            longitude=request.longitude,
            radius_km=request.radius_km,
            platforms=request.platforms,
            match=request.match,
            analyze=request.analyze
        )
        return result
    except Exception as e:
        logger.error(f"Error in research: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/search/places")
async def search_places(request: SearchRequest):
    """Search for places matching queries"""
    try:
        result = search_for_places(
            queries=request.queries,
            location=request.location,
            filters=request.filters
        )
        return {"results": result}
    except Exception as e:
        logger.error(f"Error in place search: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/place/{place_id}")
async def get_place(place_id: str):
    """Get details for a specific place"""
    try:
        result = get_place_details(place_id)
        return result
    except Exception as e:
        logger.error(f"Error getting place details: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/market/analyze")
async def market_analysis(request: MarketAnalysisRequest):
    """Analyze market for a location"""
    try:
        result = analyze_market(
            location=request.location,
            cuisine_type=request.cuisine_type,
            radius_km=request.radius_km
        )
        return result
    except Exception as e:
        logger.error(f"Error in market analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/competitors/analyze")
async def competitor_analysis(request: CompetitorAnalysisRequest):
    """Analyze competitors for a location"""
    try:
        result = analyze_competitors(
            location=request.location,
            restaurant_type=request.restaurant_type,
            radius_km=request.radius_km
        )
        return result
    except Exception as e:
        logger.error(f"Error in competitor analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/location/analyze")
async def location_analysis(request: LocationAnalysisRequest):
    """Analyze a specific location"""
    try:
        result = analyze_location(address=request.address)
        return result
    except Exception as e:
        logger.error(f"Error in location analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/foottraffic/analyze")
async def foot_traffic_analysis(request: FootTrafficRequest):
    """Analyze foot traffic for a location"""
    try:
        result = calculate_foot_traffic(
            location=request.location,
            day_of_week=request.day_of_week
        )
        return result
    except Exception as e:
        logger.error(f"Error in foot traffic analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/area/analyze")
async def area_analysis(request: AreaAnalysisRequest):
    """Analyze an area by coordinates"""
    try:
        result = analyze_area(
            coordinates={"lat": request.latitude, "lng": request.longitude},
            radius_km=request.radius_km
        )
        return result
    except Exception as e:
        logger.error(f"Error in area analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Chat with the restaurant market research agent"""
    try:
        # In a real implementation, you would maintain session state
        # For now, we'll just generate insights based on a simple prompt
        insights = []
        async for chunk in agent.generate_insights({"query": request.message}):
            insights.append(chunk)
        
        return {"response": "".join(insights)}
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/research")
async def conduct_research(request: ResearchRequest):
    """Run comprehensive restaurant market research"""
    try:
        results = run_research(
            location=request.location,
            cuisine_type=request.cuisine_type,
            additional_context=request.additional_context
        )
        return results
    except Exception as e:
        logger.error(f"Error in comprehensive research: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# WebSocket for streaming responses
@app.websocket("/ws/research")
async def websocket_research(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive request from client
            data = await websocket.receive_text()
            request_data = json.loads(data)
            
            # Extract parameters
            latitude = request_data.get("latitude")
            longitude = request_data.get("longitude")
            radius_km = request_data.get("radius_km", 1.0)
            
            # Define streaming callback
            async def stream_callback(chunk: str):
                await websocket.send_text(chunk)
            
            # Run agent with streaming
            result = await agent.run_async(
                latitude=latitude,
                longitude=longitude,
                radius_km=radius_km,
                stream_callback=stream_callback
            )
            
            # Send final result
            await websocket.send_json({"status": "complete", "result": result})
            
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        await websocket.send_json({"status": "error", "message": str(e)})

# Serve static files
try:
    app.mount("/static", StaticFiles(directory="static"), name="static")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Serve the index.html for any path not matched by API endpoints
        return FileResponse("static/index.html")
except Exception as e:
    logger.warning(f"Static files directory not found. Web UI will not be available: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("run_server:app", host="0.0.0.0", port=8000, reload=True)
