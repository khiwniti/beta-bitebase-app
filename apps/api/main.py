from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import uvicorn
import os

app = FastAPI(
    title="BiteBase API",
    description="Modern Restaurant Management System Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "🍽️ BiteBase API is running!",
        "version": "1.0.0",
        "docs": "/docs",
        "frontend": "http://localhost:3000",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "bitebase-api",
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "development")
    }

# Serve manifest.json
@app.get("/manifest.json")
async def manifest():
    return {
        "name": "BiteBase",
        "short_name": "BiteBase",
        "description": "Restaurant Management System",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#000000",
        "icons": [
            {
                "src": "/logo.png",
                "sizes": "192x192",
                "type": "image/png"
            }
        ]
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
                "location": "Downtown",
                "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
                "description": "Authentic Italian cuisine in the heart of downtown"
            },
            {
                "id": 2,
                "name": "Burger Palace",
                "cuisine": "American",
                "rating": 4.2,
                "location": "Mall District",
                "image": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
                "description": "Gourmet burgers and classic American fare"
            },
            {
                "id": 3,
                "name": "Sushi Zen",
                "cuisine": "Japanese",
                "rating": 4.8,
                "location": "City Center",
                "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
                "description": "Fresh sushi and traditional Japanese dishes"
            }
        ]
    }

@app.get("/api/restaurants/{restaurant_id}")
async def get_restaurant(restaurant_id: int):
    restaurants = {
        1: {
            "id": 1,
            "name": "Bella Italia",
            "cuisine": "Italian",
            "rating": 4.5,
            "location": "Downtown",
            "description": "Authentic Italian cuisine in the heart of downtown",
            "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
            "menu": [
                {"id": 1, "name": "Pizza Margherita", "price": 12.99, "category": "Pizza"},
                {"id": 2, "name": "Pasta Carbonara", "price": 14.99, "category": "Pasta"},
                {"id": 3, "name": "Tiramisu", "price": 6.99, "category": "Dessert"}
            ]
        },
        2: {
            "id": 2,
            "name": "Burger Palace",
            "cuisine": "American",
            "rating": 4.2,
            "location": "Mall District",
            "description": "Gourmet burgers and classic American fare",
            "image": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
            "menu": [
                {"id": 4, "name": "Classic Burger", "price": 9.99, "category": "Burgers"},
                {"id": 5, "name": "Deluxe Burger", "price": 12.99, "category": "Burgers"},
                {"id": 6, "name": "Fries", "price": 4.99, "category": "Sides"}
            ]
        },
        3: {
            "id": 3,
            "name": "Sushi Zen",
            "cuisine": "Japanese",
            "rating": 4.8,
            "location": "City Center",
            "description": "Fresh sushi and traditional Japanese dishes",
            "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
            "menu": [
                {"id": 7, "name": "Salmon Roll", "price": 8.99, "category": "Sushi"},
                {"id": 8, "name": "Tuna Sashimi", "price": 12.99, "category": "Sashimi"},
                {"id": 9, "name": "Miso Soup", "price": 3.99, "category": "Soup"}
            ]
        }
    }

    restaurant = restaurants.get(restaurant_id)
    if restaurant:
        return restaurant
    else:
        raise HTTPException(status_code=404, detail="Restaurant not found")

@app.get("/api/menu")
async def get_menu():
    return {
        "menu": [
            {"id": 1, "name": "Pizza Margherita", "price": 12.99, "category": "Pizza", "restaurant": "Bella Italia"},
            {"id": 2, "name": "Pasta Carbonara", "price": 14.99, "category": "Pasta", "restaurant": "Bella Italia"},
            {"id": 3, "name": "Tiramisu", "price": 6.99, "category": "Dessert", "restaurant": "Bella Italia"},
            {"id": 4, "name": "Classic Burger", "price": 9.99, "category": "Burgers", "restaurant": "Burger Palace"},
            {"id": 5, "name": "Deluxe Burger", "price": 12.99, "category": "Burgers", "restaurant": "Burger Palace"},
            {"id": 6, "name": "Fries", "price": 4.99, "category": "Sides", "restaurant": "Burger Palace"},
            {"id": 7, "name": "Salmon Roll", "price": 8.99, "category": "Sushi", "restaurant": "Sushi Zen"},
            {"id": 8, "name": "Tuna Sashimi", "price": 12.99, "category": "Sashimi", "restaurant": "Sushi Zen"},
            {"id": 9, "name": "Miso Soup", "price": 3.99, "category": "Soup", "restaurant": "Sushi Zen"}
        ]
    }

# Auth endpoints (mock)
@app.post("/api/auth/register")
async def register():
    return {
        "message": "Registration successful",
        "status": "success",
        "user": {"id": 1, "email": "user@example.com"}
    }

@app.post("/api/auth/login")
async def login():
    return {
        "message": "Login successful",
        "status": "success",
        "token": "jwt-token-here"
    }

# Page endpoints
@app.get("/privacy")
async def privacy():
    return {
        "page": "privacy",
        "title": "Privacy Policy",
        "content": "Your privacy is important to us..."
    }

@app.get("/terms")
async def terms():
    return {
        "page": "terms",
        "title": "Terms of Service",
        "content": "By using our service, you agree to..."
    }

@app.get("/reset-password")
async def reset_password():
    return {
        "page": "reset-password",
        "title": "Reset Password",
        "content": "Enter your email to reset password"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)