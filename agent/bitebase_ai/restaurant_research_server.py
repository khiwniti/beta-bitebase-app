from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional
from .restaurant_research import run_research

app = FastAPI(title="Restaurant Research Agent API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    location: str
    cuisine_type: str
    additional_context: Optional[Dict] = None

class ResearchResponse(BaseModel):
    market_data: Dict
    competitor_analysis: Dict
    location_data: Dict
    customer_insights: Dict
    financial_analysis: Dict

@app.post("/research", response_model=ResearchResponse)
async def conduct_research(request: ResearchRequest):
    try:
        results = run_research(request.location, request.cuisine_type)
        return ResearchResponse(**results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 