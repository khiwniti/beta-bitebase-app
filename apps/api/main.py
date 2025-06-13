from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import uvicorn
import os
import hashlib
import jwt
import datetime
from typing import Optional, Dict, Any

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

# Security
security = HTTPBearer()
SECRET_KEY = "bitebase-secret-key-2025"
ALGORITHM = "HS256"

# Pydantic models
class UserRegister(BaseModel):
    email: str
    password: str
    firstName: str
    lastName: str
    phone: Optional[str] = ""

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: int
    email: str
    role: str
    name: str

# In-memory database (replace with real database in production)
users_db: Dict[str, Dict[str, Any]] = {
    "admin@bitebase.app": {
        "id": 1,
        "email": "admin@bitebase.app",
        "password": hashlib.sha256("Libralytics1234!*".encode()).hexdigest(),
        "role": "admin",
        "name": "BiteBase Admin",
        "firstName": "BiteBase",
        "lastName": "Admin",
        "phone": "",
        "created_at": datetime.datetime.now().isoformat()
    }
}

# Helper functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return email
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(email: str = Depends(verify_token)):
    user = users_db.get(email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

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

# Auth endpoints
@app.post("/api/auth/register")
async def register(user_data: UserRegister):
    # Check if user already exists
    if user_data.email in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user_id = len(users_db) + 1
    hashed_password = hash_password(user_data.password)
    
    new_user = {
        "id": user_id,
        "email": user_data.email,
        "password": hashed_password,
        "role": "user",
        "name": f"{user_data.firstName} {user_data.lastName}",
        "firstName": user_data.firstName,
        "lastName": user_data.lastName,
        "phone": user_data.phone,
        "created_at": datetime.datetime.now().isoformat()
    }
    
    users_db[user_data.email] = new_user
    
    # Create access token
    access_token = create_access_token(data={"sub": user_data.email})
    
    return {
        "message": "Registration successful",
        "status": "success",
        "token": access_token,
        "user": {
            "id": new_user["id"],
            "email": new_user["email"],
            "role": new_user["role"],
            "name": new_user["name"]
        }
    }

@app.post("/api/auth/login")
async def login(user_data: UserLogin):
    # Check if user exists
    user = users_db.get(user_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(user_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user_data.email})
    
    return {
        "message": "Login successful",
        "status": "success",
        "token": access_token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "role": user["role"],
            "name": user["name"]
        }
    }

@app.get("/api/auth/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "role": current_user["role"],
        "name": current_user["name"]
    }

# Admin endpoints
@app.get("/api/admin/users")
async def get_all_users(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    users_list = []
    for email, user in users_db.items():
        users_list.append({
            "id": user["id"],
            "email": user["email"],
            "role": user["role"],
            "name": user["name"],
            "created_at": user["created_at"]
        })
    
    return {"users": users_list}

@app.post("/api/admin/users/{user_id}/role")
async def update_user_role(user_id: int, role: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Find user by ID
    target_user = None
    target_email = None
    for email, user in users_db.items():
        if user["id"] == user_id:
            target_user = user
            target_email = email
            break
    
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update role
    users_db[target_email]["role"] = role
    
    return {
        "message": "User role updated successfully",
        "user": {
            "id": target_user["id"],
            "email": target_user["email"],
            "role": role,
            "name": target_user["name"]
        }
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