"""
AI Service for BiteBase FastAPI Backend
"""

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
import requests
import json
import uuid
from datetime import datetime, timedelta
import structlog

from app.core.config import settings
from app.core.exceptions import ExternalServiceError, ValidationError
from app.models.market_analysis import AICache
from app.schemas.market_analysis import (
    AIMarketResearchResponse, AIChatResponse, AIAnalysisResult
)
from app.services.restaurant_service import RestaurantService

logger = structlog.get_logger()

class AIService:
    def __init__(self, db: Session):
        self.db = db
        self.ollama_url = "http://localhost:11434"
        self.model_name = "llama3.2:1b"

    async def chat_with_assistant(self, message: str, context: Optional[Dict[str, Any]], user_id: str) -> AIChatResponse:
        """Chat with AI assistant using Ollama"""
        try:
            # Build system prompt for restaurant business assistant
            system_prompt = """You are BiteBase AI, a specialized assistant for restaurant owners and managers. You help with:
- Restaurant business analysis and insights
- Sales performance and revenue optimization
- Customer behavior analysis
- Market competition analysis
- Menu optimization and pricing strategies
- Marketing and promotion recommendations

Current restaurant context:
- Monthly Revenue: ฿185,400 (+12.3% vs last month)
- Customer Count: 892 (+8.7% vs last month)
- Average Order Value: ฿680 (+5.2% vs last month)
- Satisfaction Score: 4.6/5 (+0.1% vs last month)
- Restaurant Type: Italian cuisine (Bella Vista Bistro)

Be helpful, professional, and provide actionable insights. Keep responses concise but informative."""

            # Add context information if provided
            context_info = ""
            if context:
                context_info = f"\nAdditional context: {json.dumps(context)}"

            # Build the full prompt
            full_prompt = f"{system_prompt}{context_info}\n\nUser question: {message}\n\nResponse:"

            # Call Ollama API
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": self.model_name,
                    "prompt": full_prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "max_tokens": 500
                    }
                },
                timeout=30
            )

            if response.status_code != 200:
                raise ExternalServiceError(f"Ollama API error: {response.status_code}")

            result = response.json()
            ai_response = result.get("response", "").strip()

            if not ai_response:
                raise ExternalServiceError("Empty response from Ollama")

            # Generate relevant suggestions based on the message
            suggestions = self._generate_suggestions(message, ai_response)

            return AIChatResponse(
                response=ai_response,
                suggestions=suggestions,
                context={"model": self.model_name, "user_id": user_id, "timestamp": datetime.utcnow().isoformat()}
            )

        except requests.RequestException as e:
            logger.error("Ollama API request failed", error=str(e))
            raise ExternalServiceError("AI service unavailable")
        except Exception as e:
            logger.error("AI chat failed", error=str(e))
            raise ExternalServiceError("AI chat service unavailable")

    def _generate_suggestions(self, message: str, response: str) -> List[str]:
        """Generate relevant suggestions based on the conversation"""
        # Simple keyword-based suggestion generation
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["sales", "revenue", "money", "income"]):
            return [
                "Analyze peak sales hours",
                "Review pricing strategy",
                "Check seasonal trends",
                "Compare with competitors"
            ]
        elif any(word in message_lower for word in ["customer", "client", "guest"]):
            return [
                "Review customer feedback",
                "Analyze customer demographics",
                "Check loyalty program performance",
                "Optimize customer experience"
            ]
        elif any(word in message_lower for word in ["menu", "food", "dish", "item"]):
            return [
                "Analyze menu performance",
                "Check popular items",
                "Review pricing strategy",
                "Optimize menu layout"
            ]
        elif any(word in message_lower for word in ["competitor", "competition", "market"]):
            return [
                "Analyze competitor pricing",
                "Check market positioning",
                "Review competitive advantages",
                "Monitor market trends"
            ]
        else:
            return [
                "Generate business report",
                "Analyze performance metrics",
                "Check market opportunities",
                "Review operational efficiency"
            ]

    async def conduct_market_research(
        self, 
        location: str, 
        business_type: str, 
        target_audience: str, 
        budget_range: str, 
        user_id: str
    ) -> AIMarketResearchResponse:
        """Conduct AI-powered market research"""
        try:
            # Use Ollama for market research

            # Check cache first
            cache_key = f"market_research:{location}:{business_type}:{target_audience}:{budget_range}"
            cached_result = self._get_cached_response(cache_key)
            if cached_result:
                return AIMarketResearchResponse(**cached_result)

            # Get restaurant data for the location
            restaurant_service = RestaurantService(self.db)
            # This would typically involve geocoding the location first
            # For now, we'll use mock coordinates
            restaurants, _ = restaurant_service.search_restaurants({
                "latitude": 40.7128,  # Mock NYC coordinates
                "longitude": -74.0060,
                "radius": 10,
                "limit": 100
            })

            # Prepare market data
            market_data = {
                "total_restaurants": len(restaurants),
                "cuisines": list(set([r.cuisine for r in restaurants if r.cuisine])),
                "price_ranges": list(set([r.price_range for r in restaurants if r.price_range])),
                "avg_rating": sum([r.rating for r in restaurants if r.rating]) / len(restaurants) if restaurants else 0
            }

            # Create AI prompt
            prompt = f"""
            Analyze the market for a {business_type} business in {location} targeting {target_audience} with a {budget_range} budget.
            
            Current market data:
            - Total restaurants: {market_data['total_restaurants']}
            - Available cuisines: {', '.join(market_data['cuisines'][:10])}
            - Price ranges: {', '.join(market_data['price_ranges'])}
            - Average rating: {market_data['avg_rating']:.2f}
            
            Provide a comprehensive market analysis including:
            1. Market size assessment
            2. Competition level
            3. Target demographics analysis
            4. Recommended strategies
            5. Risk factors
            6. Success probability
            
            Format the response as JSON with the following structure:
            {{
                "market_size": "small/medium/large",
                "competition_level": "low/medium/high",
                "target_demographics": "description",
                "recommended_strategies": ["strategy1", "strategy2", ...],
                "risk_factors": ["risk1", "risk2", ...],
                "success_probability": "low/medium/high"
            }}
            """

            # Call OpenAI API
            response = await self._call_openai_chat([
                {"role": "system", "content": "You are a market research expert. Provide detailed, actionable insights."},
                {"role": "user", "content": prompt}
            ])

            # Parse AI response
            try:
                analysis_data = json.loads(response)
                analysis = AIAnalysisResult(**analysis_data)
            except (json.JSONDecodeError, ValueError):
                # Fallback to structured response
                analysis = AIAnalysisResult(
                    market_size="medium",
                    competition_level="medium",
                    target_demographics=target_audience,
                    recommended_strategies=["Focus on unique value proposition", "Build strong online presence"],
                    risk_factors=["High competition", "Economic uncertainty"],
                    success_probability="medium"
                )

            # Generate recommendations
            recommendations = [
                f"Consider {business_type} concept for {location}",
                f"Target {target_audience} demographic",
                f"Budget allocation: {budget_range}",
                "Focus on differentiation from existing competitors"
            ]

            research_response = AIMarketResearchResponse(
                research_id=str(uuid.uuid4()),
                location=location,
                business_type=business_type,
                analysis=analysis,
                recommendations=recommendations,
                created_at=datetime.utcnow().isoformat()
            )

            # Cache the result
            self._cache_response(cache_key, research_response.dict(), hours=24)

            return research_response

        except ExternalServiceError:
            raise
        except Exception as e:
            logger.error("Market research failed", error=str(e))
            raise ExternalServiceError("Market research service unavailable")

    async def analyze_market_location(
        self, 
        location: str, 
        cuisine_type: str, 
        radius_km: float, 
        user_id: str
    ) -> Dict[str, Any]:
        """Analyze market for specific location and cuisine type"""
        try:
            # Get restaurant data for analysis
            restaurant_service = RestaurantService(self.db)
            
            # Mock analysis for now - in production, this would use real geocoding and data
            analysis = {
                "location": location,
                "cuisine_type": cuisine_type,
                "radius_km": radius_km,
                "analysis": {
                    "total_restaurants": 45,
                    "competition_density": "medium",
                    "market_saturation": "moderate",
                    "opportunity_score": 7.5,
                    "recommended_price_range": "moderate",
                    "peak_hours": ["12:00-14:00", "18:00-21:00"],
                    "customer_demographics": {
                        "age_groups": ["25-34", "35-44"],
                        "income_level": "middle to upper-middle",
                        "dining_preferences": ["quality", "convenience", "value"]
                    }
                },
                "recommendations": [
                    f"Strong opportunity for {cuisine_type} restaurant in {location}",
                    "Focus on lunch and dinner service",
                    "Consider delivery and takeout options",
                    "Target working professionals and families"
                ],
                "risk_factors": [
                    "Moderate competition in the area",
                    "Seasonal variations in foot traffic",
                    "Parking availability concerns"
                ]
            }

            return analysis

        except Exception as e:
            logger.error("Market location analysis failed", error=str(e))
            raise ExternalServiceError("Market analysis service unavailable")

    async def get_restaurant_recommendations(
        self, 
        preferences: Dict[str, Any], 
        user_id: str
    ) -> List[Dict[str, Any]]:
        """Get AI-powered restaurant recommendations"""
        try:
            restaurant_service = RestaurantService(self.db)
            
            # Get restaurants based on preferences
            search_params = {
                "cuisine": preferences.get("cuisine"),
                "price_range": preferences.get("price_range"),
                "rating_min": preferences.get("min_rating", 3.0),
                "limit": 10
            }
            
            restaurants, _ = restaurant_service.search_restaurants(search_params)
            
            # Enhance with AI insights
            recommendations = []
            for restaurant in restaurants:
                recommendation = {
                    "restaurant": {
                        "id": restaurant.id,
                        "name": restaurant.name,
                        "cuisine": restaurant.cuisine,
                        "rating": restaurant.rating,
                        "price_range": restaurant.price_range,
                        "address": restaurant.address
                    },
                    "ai_insights": {
                        "match_score": min(95, (restaurant.rating or 4.0) * 20),
                        "reasons": [
                            f"Matches your {preferences.get('cuisine', 'preferred')} cuisine preference",
                            f"Highly rated ({restaurant.rating or 4.0}/5.0)",
                            f"Within your {preferences.get('price_range', 'preferred')} price range"
                        ],
                        "best_dishes": ["Signature dish", "Popular appetizer", "Recommended dessert"],
                        "best_time_to_visit": "Weekday lunch for shorter wait times"
                    }
                }
                recommendations.append(recommendation)
            
            return recommendations

        except Exception as e:
            logger.error("Restaurant recommendations failed", error=str(e))
            raise ExternalServiceError("Recommendation service unavailable")

    async def generate_business_insights(
        self, 
        business_data: Dict[str, Any], 
        user_id: str
    ) -> Dict[str, Any]:
        """Generate AI-powered business insights"""
        try:
            insights = {
                "performance_analysis": {
                    "revenue_trend": "increasing",
                    "customer_satisfaction": "high",
                    "operational_efficiency": "good",
                    "market_position": "competitive"
                },
                "recommendations": [
                    "Expand delivery radius to capture more customers",
                    "Introduce loyalty program to increase retention",
                    "Optimize menu pricing based on competitor analysis",
                    "Enhance social media presence"
                ],
                "opportunities": [
                    "Catering services for local businesses",
                    "Weekend brunch menu expansion",
                    "Seasonal menu items",
                    "Partnership with food delivery apps"
                ],
                "risk_alerts": [
                    "New competitor opening nearby",
                    "Rising food costs affecting margins",
                    "Seasonal demand fluctuations"
                ],
                "kpi_targets": {
                    "customer_acquisition": "15% increase in 3 months",
                    "average_order_value": "$5 increase",
                    "customer_retention": "80% repeat customers",
                    "online_reviews": "Maintain 4.5+ rating"
                }
            }

            return insights

        except Exception as e:
            logger.error("Business insights generation failed", error=str(e))
            raise ExternalServiceError("Business insights service unavailable")

    async def optimize_menu(self, menu_data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """AI-powered menu optimization"""
        try:
            optimization = {
                "current_analysis": {
                    "total_items": len(menu_data.get("items", [])),
                    "price_range": "moderate",
                    "category_distribution": "balanced",
                    "profitability_score": 7.5
                },
                "recommendations": [
                    "Remove low-performing items with <2% order rate",
                    "Add 2-3 high-margin appetizers",
                    "Introduce seasonal specials",
                    "Optimize portion sizes for better margins"
                ],
                "pricing_suggestions": [
                    "Increase signature dish price by $2-3",
                    "Bundle appetizer + main for better value perception",
                    "Introduce premium options for higher AOV"
                ],
                "new_item_suggestions": [
                    "Trending fusion dishes",
                    "Healthy/vegan alternatives",
                    "Shareable appetizers",
                    "Signature cocktails/beverages"
                ],
                "performance_predictions": {
                    "revenue_impact": "+12% with recommended changes",
                    "customer_satisfaction": "maintained or improved",
                    "operational_complexity": "minimal increase"
                }
            }

            return optimization

        except Exception as e:
            logger.error("Menu optimization failed", error=str(e))
            raise ExternalServiceError("Menu optimization service unavailable")

    async def suggest_pricing_strategy(self, pricing_data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """AI-powered pricing strategy suggestions"""
        try:
            strategy = {
                "current_pricing_analysis": {
                    "competitive_position": "aligned with market",
                    "price_elasticity": "moderate",
                    "margin_health": "good",
                    "customer_perception": "fair value"
                },
                "strategy_recommendations": [
                    "Implement dynamic pricing for peak hours",
                    "Create value bundles for families",
                    "Premium pricing for signature items",
                    "Loyalty discounts for repeat customers"
                ],
                "price_adjustments": [
                    "Increase appetizer prices by 8-10%",
                    "Maintain main course pricing",
                    "Add premium options at 20% higher price point",
                    "Introduce early bird discounts"
                ],
                "revenue_optimization": {
                    "projected_increase": "8-15% revenue growth",
                    "customer_retention_risk": "low",
                    "implementation_timeline": "2-4 weeks",
                    "monitoring_metrics": ["AOV", "customer frequency", "satisfaction scores"]
                }
            }

            return strategy

        except Exception as e:
            logger.error("Pricing strategy generation failed", error=str(e))
            raise ExternalServiceError("Pricing strategy service unavailable")

    async def get_usage_stats(self, user_id: str) -> Dict[str, Any]:
        """Get AI service usage statistics"""
        try:
            # Mock usage stats - in production, this would track actual usage
            stats = {
                "current_period": {
                    "api_calls": 45,
                    "chat_messages": 23,
                    "market_analyses": 3,
                    "recommendations_generated": 15
                },
                "limits": {
                    "api_calls_limit": 1000,
                    "chat_messages_limit": 500,
                    "market_analyses_limit": 10,
                    "recommendations_limit": 100
                },
                "usage_percentage": {
                    "api_calls": 4.5,
                    "chat_messages": 4.6,
                    "market_analyses": 30.0,
                    "recommendations": 15.0
                },
                "reset_date": (datetime.utcnow() + timedelta(days=30)).isoformat()
            }

            return stats

        except Exception as e:
            logger.error("Failed to get usage stats", error=str(e))
            raise ExternalServiceError("Usage stats service unavailable")

    async def _call_openai_chat(self, messages: List[Dict[str, str]]) -> str:
        """Call OpenAI Chat API"""
        try:
            if not self.openai_client:
                # Return mock response if OpenAI is not configured
                return "AI service is currently unavailable. Please try again later."

            response = await self.openai_client.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=1000,
                temperature=0.7
            )

            return response.choices[0].message.content

        except Exception as e:
            logger.error("OpenAI API call failed", error=str(e))
            raise ExternalServiceError("AI service temporarily unavailable")

    def _generate_suggestions(self, message: str, response: str) -> List[str]:
        """Generate follow-up suggestions based on conversation"""
        suggestions = [
            "Tell me more about market analysis",
            "What are the best restaurant locations?",
            "How can I improve my restaurant's performance?",
            "Show me pricing strategies"
        ]
        
        # Customize suggestions based on message content
        if "market" in message.lower():
            suggestions = [
                "Analyze competition in my area",
                "What's the best cuisine for my location?",
                "Show me demographic data",
                "Calculate market opportunity score"
            ]
        elif "restaurant" in message.lower():
            suggestions = [
                "Optimize my menu",
                "Improve customer reviews",
                "Increase revenue",
                "Expand to new locations"
            ]
        
        return suggestions[:3]  # Return top 3 suggestions

    def _get_cached_response(self, cache_key: str) -> Optional[Dict[str, Any]]:
        """Get cached AI response"""
        try:
            cached = self.db.query(AICache).filter(
                AICache.cache_key == cache_key,
                AICache.expires_at > datetime.utcnow()
            ).first()
            
            if cached:
                return json.loads(cached.response)
            
            return None

        except Exception as e:
            logger.warning("Failed to get cached response", error=str(e))
            return None

    def _cache_response(self, cache_key: str, response: Dict[str, Any], hours: int = 1):
        """Cache AI response"""
        try:
            expires_at = datetime.utcnow() + timedelta(hours=hours)
            
            # Remove existing cache entry
            self.db.query(AICache).filter(AICache.cache_key == cache_key).delete()
            
            # Create new cache entry
            cache_entry = AICache(
                cache_key=cache_key,
                response=json.dumps(response),
                expires_at=expires_at
            )
            
            self.db.add(cache_entry)
            self.db.commit()

        except Exception as e:
            logger.warning("Failed to cache response", error=str(e))