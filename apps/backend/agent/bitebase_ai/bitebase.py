"""Server"""

import os
import json
import asyncio
import logging
from typing import Dict, List, Any, Optional, AsyncGenerator
from datetime import datetime
from dotenv import load_dotenv
load_dotenv() # pylint: disable=wrong-import-position

from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel, Field
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitRemoteEndpoint, LangGraphAgent

# Import AIQToolkit components if available
try:
    from aiq.profiler.profile_runner import ProfileRunner
    from aiq.eval.evaluator import Evaluator
    from aiq.profiler.callbacks.langchain_callback_handler import LangchainCallbackHandler
    AIQ_AVAILABLE = True
    logger = logging.getLogger("bitebase")
    logger.info("AIQToolkit integration enabled for API endpoints")
except ImportError:
    AIQ_AVAILABLE = False
    logger = logging.getLogger("bitebase")
    logger.warning("AIQToolkit not available. Install with 'pip install aiqtoolkit'")

from .restaurant_research import create_research_agent
from .agents.restaurant_data_agent import RestaurantDataAgent
from .agents.restaurant_analysis_agent import RestaurantAnalysisAgent
from .agents.location_intelligence_agent import LocationIntelligenceAgent
from .core.llm_client import LLMClient
from .core.aiq_integration import AIQProfiler, AIQEvaluator

app = FastAPI(
    title="BiteBase Intelligence API",
    description="Restaurant Market Research and Analysis System",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the LangGraph agent
workflow = create_research_agent()

# Initialize the CopilotKit SDK
sdk = CopilotKitRemoteEndpoint(
    agents=[
        LangGraphAgent(
            name="bitebase-intelligence",
            description="Restaurant Market Research and Analysis System",
            agent=workflow,
        )
    ],
)

# Initialize the agents
restaurant_data_agent = RestaurantDataAgent()
restaurant_analysis_agent = RestaurantAnalysisAgent()
location_intelligence_agent = LocationIntelligenceAgent()
llm_client = LLMClient()

# Initialize AIQToolkit components if available
aiq_profiler = None
aiq_evaluator = None
if AIQ_AVAILABLE:
    try:
        aiq_profiler = AIQProfiler("BitebaseAPI", {
            "enabled": True,
            "save_results": True,
            "results_dir": "metrics/aiq/api"
        })
        aiq_evaluator = AIQEvaluator({
            "enabled": True,
            "criteria": ["accuracy", "relevance", "helpfulness"]
        })
        logger.info("AIQToolkit profiling and evaluation initialized for API endpoints")
    except Exception as e:
        logger.error(f"Error initializing AIQToolkit components: {str(e)}")

# Define request models
class RestaurantSearchRequest(BaseModel):
    latitude: float = Field(..., description="Center point latitude")
    longitude: float = Field(..., description="Center point longitude")
    radius_km: float = Field(..., description="Search radius in kilometers")
    platforms: Optional[List[str]] = Field(None, description="List of platforms to search")
    match: bool = Field(False, description="Whether to match restaurants across platforms")

class RestaurantAnalysisRequest(BaseModel):
    restaurant_data: Dict[str, Any] = Field(..., description="Restaurant data to analyze")
    analysis_type: Optional[str] = Field("comprehensive", description="Type of analysis to perform")

class LocationIntelligenceRequest(BaseModel):
    latitude: float = Field(..., description="Center point latitude")
    longitude: float = Field(..., description="Center point longitude")
    radius_km: float = Field(..., description="Analysis radius in kilometers")
    analysis_type: Optional[str] = Field("comprehensive", description="Type of analysis to perform")
    restaurant_data: Optional[Dict[str, Any]] = Field(None, description="Optional restaurant data to include in analysis")

add_fastapi_endpoint(app, sdk, "/copilotkit")

@app.post("/api/restaurants/search")
async def search_restaurants(request: RestaurantSearchRequest):
    """
    Search for restaurants.
    """
    # Start AIQ profiling if available
    if AIQ_AVAILABLE and aiq_profiler:
        aiq_profiler.start_profiling()
        
    try:
        result = restaurant_data_agent.execute(
            latitude=request.latitude,
            longitude=request.longitude,
            radius_km=request.radius_km,
            platforms=request.platforms,
            match=request.match
        )
        
        # End AIQ profiling if available
        if AIQ_AVAILABLE and aiq_profiler:
            metrics = aiq_profiler.end_profiling()
            logger.info(f"Restaurant search profiling metrics: {metrics}")
            # Include AIQ metrics in response metadata
            if "metadata" not in result:
                result["metadata"] = {}
            result["metadata"]["aiq_metrics"] = {
                "execution_time": metrics.get("execution_time", 0),
                "calls_count": metrics.get("calls_count", 0),
                "timestamp": datetime.now().isoformat()
            }
            
        return result
    except Exception as e:
        # End AIQ profiling if available
        if AIQ_AVAILABLE and aiq_profiler:
            aiq_profiler.end_profiling()
            
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(e)}
        )

@app.post("/api/restaurants/analyze")
async def analyze_restaurants(request: RestaurantAnalysisRequest):
    """
    Analyze restaurant data.
    """
    # Start AIQ profiling if available
    if AIQ_AVAILABLE and aiq_profiler:
        aiq_profiler.start_profiling()
        
    try:
        result = restaurant_analysis_agent.execute(
            restaurant_data=request.restaurant_data,
            analysis_type=request.analysis_type
        )
        
        # End AIQ profiling if available
        if AIQ_AVAILABLE and aiq_profiler:
            metrics = aiq_profiler.end_profiling()
            logger.info(f"Restaurant analysis profiling metrics: {metrics}")
            # Include AIQ metrics in response metadata
            if "metadata" not in result:
                result["metadata"] = {}
            result["metadata"]["aiq_metrics"] = {
                "execution_time": metrics.get("execution_time", 0),
                "calls_count": metrics.get("calls_count", 0),
                "timestamp": datetime.now().isoformat()
            }
            
        return result
    except Exception as e:
        # End AIQ profiling if available
        if AIQ_AVAILABLE and aiq_profiler:
            aiq_profiler.end_profiling()
            
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(e)}
        )

@app.post("/api/restaurants/insights")
async def generate_insights(request: RestaurantAnalysisRequest):
    """
    Generate insights from restaurant data.
    """
    # Start AIQ profiling if available
    if AIQ_AVAILABLE and aiq_profiler:
        aiq_profiler.start_profiling()
        
    try:
        insights = llm_client.generate_restaurant_insights(request.restaurant_data)
        
        # Evaluate insights if available
        if AIQ_AVAILABLE and aiq_evaluator:
            eval_results = aiq_evaluator.evaluate_response(
                query="Generate insights for restaurant data",
                response=insights
            )
            
        # End AIQ profiling if available
        if AIQ_AVAILABLE and aiq_profiler:
            metrics = aiq_profiler.end_profiling()
            logger.info(f"Restaurant insights profiling metrics: {metrics}")
            
        result = {"insights": insights}
        
        # Include evaluation results if available
        if AIQ_AVAILABLE and aiq_evaluator:
            result["evaluation"] = eval_results
            
        return result
    except Exception as e:
        # End AIQ profiling if available
        if AIQ_AVAILABLE and aiq_profiler:
            aiq_profiler.end_profiling()
            
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(e)}
        )

@app.post("/api/restaurants/insights/stream")
async def stream_insights(request: RestaurantAnalysisRequest):
    """
    Stream insights from restaurant data.
    """
    # For streaming, we don't use profiling directly as it would interfere with the stream
    async def generate():
        try:
            # Start AIQ profiling if available
            start_time = datetime.now()
            
            async for chunk in llm_client.generate_restaurant_insights_stream(request.restaurant_data):
                yield f"data: {json.dumps({'chunk': chunk})}\n\n"
                
            # Collect end time for simple metrics
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            # Add AIQ metrics at the end if available
            if AIQ_AVAILABLE:
                yield f"data: {json.dumps({'metrics': {'duration': duration}})}\n\n"
                
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        finally:
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream"
    )

@app.post("/api/location/analyze")
async def analyze_location(request: LocationIntelligenceRequest):
    """
    Analyze location data for restaurant market research.
    """
    # Start AIQ profiling if available
    if AIQ_AVAILABLE and aiq_profiler:
        aiq_profiler.start_profiling()
        
    try:
        # First, attempt to get real restaurant data using the restaurant data agent
        restaurant_data = None
        use_real_data = True
        
        try:
            # Initialize RestaurantDataAgent
            from .agents.restaurant_data_agent import RestaurantDataAgent
            restaurant_data_agent = RestaurantDataAgent()
            
            # Fetch real restaurant data from Google Maps
            real_data_results = restaurant_data_agent.run(
                latitude=request.latitude,
                longitude=request.longitude,
                radius_km=request.radius_km,
                platforms=["google_maps"],
                match=False,
                use_real_data=True
            )
            
            # Check if we found real data
            if real_data_results.get("metadata", {}).get("real_data_found", False):
                logger.info("Using real restaurant data from Google Maps for location analysis")
                restaurant_data = real_data_results
                use_real_data = True
            else:
                logger.info("No real restaurant data found, falling back to provided data or mock data")
                use_real_data = False
                # Use restaurant_data provided in the request if available
                if request.restaurant_data:
                    restaurant_data = request.restaurant_data
        except Exception as e:
            logger.warning(f"Error fetching real restaurant data: {str(e)}")
            use_real_data = False
            # Use restaurant_data provided in the request if available
            if request.restaurant_data:
                restaurant_data = request.restaurant_data
        
        # Pass the real restaurant data to the location intelligence agent
        result = location_intelligence_agent.execute(
            latitude=request.latitude,
            longitude=request.longitude,
            radius_km=request.radius_km,
            analysis_type=request.analysis_type,
            restaurant_data=restaurant_data
        )
        
        # Add metadata about data source
        if "metadata" not in result:
            result["metadata"] = {}
        result["metadata"]["data_source"] = "real" if use_real_data else "mock or provided"
        
        # End AIQ profiling if available
        if AIQ_AVAILABLE and aiq_profiler:
            metrics = aiq_profiler.end_profiling()
            logger.info(f"Location analysis profiling metrics: {metrics}")
            # Include AIQ metrics in response metadata
            if "metadata" not in result:
                result["metadata"] = {}
            result["metadata"]["aiq_metrics"] = {
                "execution_time": metrics.get("execution_time", 0),
                "calls_count": metrics.get("calls_count", 0),
                "timestamp": datetime.now().isoformat()
            }
            
        return result
    except Exception as e:
        # End AIQ profiling if available
        if AIQ_AVAILABLE and aiq_profiler:
            aiq_profiler.end_profiling()
            
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(e)}
        )

@app.get("/api/health")
async def health_check():
    """
    Health check endpoint with AIQ status.
    """
    aiq_status = {
        "available": AIQ_AVAILABLE,
        "profiling_enabled": AIQ_AVAILABLE and aiq_profiler is not None,
        "evaluation_enabled": AIQ_AVAILABLE and aiq_evaluator is not None
    }
    
    # If AIQ is available, add more detailed information
    if AIQ_AVAILABLE and aiq_profiler:
        # Get the last 5 profiling results
        import glob
        import os
        
        metrics_dir = "metrics/aiq/api"
        profile_files = glob.glob(f"{metrics_dir}/*.json")
        profile_files.sort(key=os.path.getmtime, reverse=True)
        
        recent_profiles = []
        for file in profile_files[:5]:
            try:
                with open(file, 'r') as f:
                    data = json.load(f)
                    recent_profiles.append({
                        "endpoint": os.path.basename(file).split('_')[0],
                        "timestamp": data.get("timestamp", ""),
                        "execution_time": data.get("execution_time", 0),
                        "calls_count": data.get("calls_count", 0)
                    })
            except Exception as e:
                logger.error(f"Error reading profile file {file}: {str(e)}")
        
        aiq_status["recent_profiles"] = recent_profiles
    
    return {
        "status": "ok", 
        "version": "1.0.0",
        "aiq": aiq_status
    }

def main():
    """Run the uvicorn server."""
    port = int(os.getenv("PORT", "3001"))  # Changed default port to 3001
    uvicorn.run(
        "bitebase_ai.bitebase:app",
        host="0.0.0.0",  # Changed to 0.0.0.0 to allow external connections
        port=port,
        reload=True,
        reload_dirs=["."]
    )

if __name__ == "__main__":
    main()
