from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

app = FastAPI(
    title="BiteBase API",
    description="Restaurant Management System Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS - Allow Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",
        "https://your-domain.com",  # Add your custom domain
        "*"  # Remove this in production, add specific domains
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "BiteBase API is running!",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "bitebase-api",
        "version": "1.0.0"
    }

# Restaurant endpoints
@app.get("/api/restaurants")
async def get_restaurants():
    return {
        "restaurants": [
            {
                "id": 1,
                "name": "Bella Italia",
                "cuisine": "Italian",
                "rating": 4.5,
                "location": "Downtown"
            },
            {
                "id": 2,
                "name": "Burger Palace",
                "cuisine": "American",
                "rating": 4.2,
                "location": "Mall District"
            }
        ]
    }

@app.get("/api/restaurants/{restaurant_id}")
async def get_restaurant(restaurant_id: int):
    if restaurant_id == 1:
        return {
            "id": 1,
            "name": "Bella Italia",
            "cuisine": "Italian",
            "rating": 4.5,
            "location": "Downtown",
            "menu": [
                {"id": 1, "name": "Pizza Margherita", "price": 12.99},
                {"id": 2, "name": "Pasta Carbonara", "price": 14.99}
            ]
        }
    elif restaurant_id == 2:
        return {
            "id": 2,
            "name": "Burger Palace",
            "cuisine": "American",
            "rating": 4.2,
            "location": "Mall District",
            "menu": [
                {"id": 3, "name": "Classic Burger", "price": 9.99},
                {"id": 4, "name": "Deluxe Burger", "price": 12.99}
            ]
        }
    else:
        raise HTTPException(status_code=404, detail="Restaurant not found")

@app.get("/api/menu")
async def get_menu():
    return {
        "menu": [
            {"id": 1, "name": "Pizza Margherita", "price": 12.99, "category": "Pizza"},
            {"id": 2, "name": "Pasta Carbonara", "price": 14.99, "category": "Pasta"},
            {"id": 3, "name": "Classic Burger", "price": 9.99, "category": "Burgers"},
            {"id": 4, "name": "Caesar Salad", "price": 8.99, "category": "Salads"}
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)