from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage

# Import our custom LLM client
from .core.llm_client import LLMClient

load_dotenv()

app = FastAPI(title="Marketing MCP Server")

# Get API keys from environment variables
openai_api_key = os.environ.get("OPENAI_API_KEY", "")
deepseek_api_key = os.environ.get("DEEPSEEK_API_KEY", "")

# Determine which provider to use based on environment variable or available API keys
llm_provider = os.environ.get("LLM_PROVIDER", "deepseek")
if llm_provider not in ["openai", "deepseek"]:
    llm_provider = "deepseek" if deepseek_api_key else "openai"

llm_model = os.environ.get("LLM_MODEL", "deepseek-chat" if llm_provider == "deepseek" else "gpt-4-turbo-preview")

# Initialize the LLM
if llm_provider == "deepseek":
    # Use our custom LLM client for DeepSeek
    custom_llm_client = LLMClient({
        "provider": "deepseek",
        "model": llm_model,
        "temperature": 0.7,
        "max_tokens": 4096,
        "api_keys": {
            "deepseek": deepseek_api_key
        }
    })

    # Create a wrapper that mimics the ChatOpenAI interface
    from langchain_core.runnables import Runnable

    class DeepSeekLLM(Runnable):
        def __init__(self, client):
            self.client = client

        def invoke(self, messages):
            response = self.client.chat_completion(
                [{"role": msg.type, "content": msg.content} for msg in messages]
            )
            return AIMessage(content=self.client.extract_response_text(response))

        # Implement the required Runnable interface methods
        def get_input_schema(self, config=None):
            return None

        def get_output_schema(self, config=None):
            return None

    llm = DeepSeekLLM(custom_llm_client)
else:
    # Fallback to OpenAI if explicitly configured
    llm = ChatOpenAI(
        model=llm_model,
        temperature=0.7,
        api_key=openai_api_key
    )

class MarketingRequest(BaseModel):
    location: str
    cuisine_type: str
    tool: str
    parameters: Optional[Dict] = None

class MarketingResponse(BaseModel):
    result: Dict
    metadata: Optional[Dict] = None

async def analyze_customer_segments(request: MarketingRequest) -> MarketingResponse:
    """Analyze customer segments for the restaurant"""
    prompt = f"""Analyze customer segments for a {request.cuisine_type} restaurant in {request.location}:
    - Demographics
    - Psychographics
    - Behavioral patterns
    - Spending habits
    - Dining preferences
    """
    response = llm.invoke([HumanMessage(content=prompt)])
    return MarketingResponse(
        result={"segments": response.content},
        metadata={"tool": "analyze-customer-segments"}
    )

async def competitor_gap_analysis(request: MarketingRequest) -> MarketingResponse:
    """Analyze gaps in the market compared to competitors"""
    prompt = f"""Analyze market gaps for a {request.cuisine_type} restaurant in {request.location}:
    - Competitor offerings
    - Market gaps
    - Opportunities
    - Competitive advantages
    """
    response = llm.invoke([HumanMessage(content=prompt)])
    return MarketingResponse(
        result={"analysis": response.content},
        metadata={"tool": "competitor-gap-analysis"}
    )

async def optimal_pricing_analysis(request: MarketingRequest) -> MarketingResponse:
    """Analyze optimal pricing strategy"""
    prompt = f"""Analyze optimal pricing for a {request.cuisine_type} restaurant in {request.location}:
    - Market price points
    - Cost structure
    - Profit margins
    - Price sensitivity
    """
    response = llm.invoke([HumanMessage(content=prompt)])
    return MarketingResponse(
        result={"pricing": response.content},
        metadata={"tool": "optimal-pricing-analysis"}
    )

async def social_sentiment_analysis(request: MarketingRequest) -> MarketingResponse:
    """Analyze social media sentiment"""
    prompt = f"""Analyze social media sentiment for {request.cuisine_type} restaurants in {request.location}:
    - Customer reviews
    - Social media mentions
    - Sentiment trends
    - Key topics
    """
    response = llm.invoke([HumanMessage(content=prompt)])
    return MarketingResponse(
        result={"sentiment": response.content},
        metadata={"tool": "social-sentiment-analysis"}
    )

async def local_event_opportunity(request: MarketingRequest) -> MarketingResponse:
    """Analyze local event opportunities"""
    prompt = f"""Analyze local event opportunities for a {request.cuisine_type} restaurant in {request.location}:
    - Upcoming events
    - Partnership opportunities
    - Marketing potential
    - ROI analysis
    """
    response = llm.invoke([HumanMessage(content=prompt)])
    return MarketingResponse(
        result={"opportunities": response.content},
        metadata={"tool": "local-event-opportunity"}
    )

TOOL_MAP = {
    "analyze-customer-segments": analyze_customer_segments,
    "competitor-gap-analysis": competitor_gap_analysis,
    "optimal-pricing-analysis": optimal_pricing_analysis,
    "social-sentiment-analysis": social_sentiment_analysis,
    "local-event-opportunity": local_event_opportunity
}

@app.post("/marketing-tools/{tool_name}", response_model=MarketingResponse)
async def execute_marketing_tool(tool_name: str, request: MarketingRequest):
    """Execute a marketing research tool"""
    if tool_name not in TOOL_MAP:
        raise HTTPException(status_code=404, detail=f"Tool {tool_name} not found")

    try:
        result = await TOOL_MAP[tool_name](request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "tools": list(TOOL_MAP.keys())}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)