#!/usr/bin/env python3
"""
Populate the database with sample restaurant data for testing
"""
import sys
import os
from pathlib import Path

# Add the FastAPI backend to Python path
sys.path.insert(0, str(Path(__file__).parent / "apps" / "fastapi-backend"))

import asyncio
from datetime import datetime
from sqlalchemy.orm import Session

# Import FastAPI backend modules
from app.db.database import get_db, engine
from app.models.restaurant import Restaurant, MenuItem, Review
from app.models.user import User
from app.schemas.restaurant import RestaurantCreate, MenuItemCreate, ReviewCreate
from app.services.restaurant_service import RestaurantService

# Sample restaurant data (simulating scraped data)
SAMPLE_RESTAURANTS = [
    {
        "name": "Som Tam Nua",
        "address": "392/14 Siam Square Soi 5, Pathum Wan, Bangkok 10330",
        "latitude": 13.7447,
        "longitude": 100.5339,
        "phone": "+66 2 251 4880",
        "website": "https://www.facebook.com/SomTamNua",
        "price_range": "budget",
        "cuisine": "Thai",
        "hours": '{"mon-sun": "10:00-22:00"}',
        "description": "Famous for authentic Isaan-style som tam (papaya salad) and northeastern Thai dishes.",
        "features": '["Outdoor Seating", "Takeaway", "Spicy Food", "Local Favorite"]',
        "images": '["https://example.com/somtam1.jpg", "https://example.com/somtam2.jpg"]'
    },
    {
        "name": "Gaggan Anand",
        "address": "68/1 Soi Langsuan, Ploenchit Rd, Lumpini, Pathum Wan, Bangkok 10330",
        "latitude": 13.7398,
        "longitude": 100.5441,
        "phone": "+66 2 652 1700",
        "website": "https://www.gaggan.in",
        "price_range": "luxury",
        "cuisine": "Modern Indian",
        "hours": '{"tue-sun": "18:00-23:00"}',
        "description": "Progressive Indian cuisine by Chef Gaggan Anand, featuring molecular gastronomy techniques.",
        "features": '["Fine Dining", "Tasting Menu", "Wine Pairing", "Reservation Required"]',
        "images": '["https://example.com/gaggan1.jpg", "https://example.com/gaggan2.jpg"]'
    },
    {
        "name": "Jay Fai",
        "address": "327 Maha Chai Rd, Samran Rat, Phra Nakhon, Bangkok 10200",
        "latitude": 13.7539,
        "longitude": 100.5014,
        "phone": "+66 2 223 9384",
        "website": "",
        "price_range": "moderate",
        "cuisine": "Thai Street Food",
        "hours": '{"tue-sun": "14:00-20:00"}',
        "description": "Michelin-starred street food stall famous for crab omelette and drunken noodles.",
        "features": '["Michelin Star", "Street Food", "Cash Only", "Long Queue"]',
        "images": '["https://example.com/jayfai1.jpg", "https://example.com/jayfai2.jpg"]'
    },
    {
        "name": "Thip Samai",
        "address": "313 Maha Chai Rd, Samran Rat, Phra Nakhon, Bangkok 10200",
        "latitude": 13.7545,
        "longitude": 100.5018,
        "phone": "+66 2 221 6280",
        "website": "",
        "price_range": "budget",
        "cuisine": "Thai",
        "hours": '{"tue-sun": "17:00-02:00"}',
        "description": "Bangkok's most famous pad thai restaurant, serving since 1966.",
        "features": '["Historic", "Late Night", "Pad Thai Specialist", "Local Institution"]',
        "images": '["https://example.com/thipsamai1.jpg", "https://example.com/thipsamai2.jpg"]'
    },
    {
        "name": "Supanniga Eating Room",
        "address": "160/11 Soi Sukhumvit 47, Watthana, Bangkok 10110",
        "latitude": 13.7307,
        "longitude": 100.5418,
        "phone": "+66 2 662 1374",
        "website": "https://www.supanniga.com",
        "price_range": "moderate",
        "cuisine": "Thai",
        "hours": '{"mon-sun": "11:30-14:30, 17:30-22:30"}',
        "description": "Refined Thai cuisine in a charming traditional house setting.",
        "features": '["Traditional Decor", "Garden Seating", "Thai Classics", "Romantic"]',
        "images": '["https://example.com/supanniga1.jpg", "https://example.com/supanniga2.jpg"]'
    },
    {
        "name": "Roast Coffee & Eatery",
        "address": "26/1 Soi Sukhumvit 31, Watthana, Bangkok 10110",
        "latitude": 13.7298,
        "longitude": 100.5601,
        "phone": "+66 2 662 6565",
        "website": "https://www.roastbangkok.com",
        "price_range": "moderate",
        "cuisine": "International",
        "hours": '{"mon-sun": "07:00-22:00"}',
        "description": "Popular brunch spot with excellent coffee and international comfort food.",
        "features": '["Brunch", "Coffee", "WiFi", "Pet Friendly"]',
        "images": '["https://example.com/roast1.jpg", "https://example.com/roast2.jpg"]'
    }
]

# Sample menu items for each restaurant
SAMPLE_MENU_ITEMS = {
    "Som Tam Nua": [
        {"name": "Som Tam Thai", "description": "Classic papaya salad with tomatoes and peanuts", "price": 120.0, "category": "Salads"},
        {"name": "Larb Moo", "description": "Spicy pork salad with herbs and lime", "price": 150.0, "category": "Salads"},
        {"name": "Sticky Rice", "description": "Traditional Thai sticky rice", "price": 40.0, "category": "Sides"}
    ],
    "Gaggan Anand": [
        {"name": "Tasting Menu", "description": "25-course progressive Indian tasting menu", "price": 8500.0, "category": "Tasting Menu"},
        {"name": "Wine Pairing", "description": "Curated wine pairing for tasting menu", "price": 4500.0, "category": "Beverages"}
    ],
    "Jay Fai": [
        {"name": "Crab Omelette", "description": "Famous crab omelette cooked over charcoal", "price": 1500.0, "category": "Main Course"},
        {"name": "Drunken Noodles", "description": "Spicy stir-fried noodles with seafood", "price": 400.0, "category": "Noodles"},
        {"name": "Tom Yum Soup", "description": "Spicy and sour soup with prawns", "price": 350.0, "category": "Soups"}
    ],
    "Thip Samai": [
        {"name": "Pad Thai Wrapped in Egg", "description": "Signature pad thai wrapped in thin egg crepe", "price": 80.0, "category": "Noodles"},
        {"name": "Classic Pad Thai", "description": "Traditional pad thai with shrimp", "price": 60.0, "category": "Noodles"},
        {"name": "Vegetarian Pad Thai", "description": "Pad thai with tofu and vegetables", "price": 50.0, "category": "Noodles"}
    ],
    "Supanniga Eating Room": [
        {"name": "Massaman Curry", "description": "Rich curry with beef and potatoes", "price": 320.0, "category": "Curries"},
        {"name": "Grilled Fish", "description": "Whole fish grilled with herbs", "price": 450.0, "category": "Seafood"},
        {"name": "Mango Sticky Rice", "description": "Traditional Thai dessert", "price": 180.0, "category": "Desserts"}
    ],
    "Roast Coffee & Eatery": [
        {"name": "Big Breakfast", "description": "Full English breakfast with coffee", "price": 380.0, "category": "Breakfast"},
        {"name": "Eggs Benedict", "description": "Poached eggs with hollandaise sauce", "price": 320.0, "category": "Breakfast"},
        {"name": "Flat White", "description": "Specialty coffee drink", "price": 120.0, "category": "Beverages"}
    ]
}

def create_sample_user(db: Session) -> User:
    """Create a sample user for testing"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == "test@bitebase.com").first()
    if existing_user:
        return existing_user
    
    # Create new user
    user_data = {
        "uid": "test-user-uid-123",
        "email": "test@bitebase.com",
        "display_name": "Test User",
        "hashed_password": "hashed_password_here",  # In real app, this would be properly hashed
        "account_type": "restaurant",
        "company_name": "Test Restaurant Group",
        "phone": "+66 2 123 4567",
        "is_active": True,
        "is_verified": True
    }
    
    user = User(**user_data)
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user

def populate_restaurants(db: Session, user_id: str):
    """Populate database with sample restaurant data"""
    restaurant_service = RestaurantService(db)
    
    created_restaurants = []
    
    for restaurant_data in SAMPLE_RESTAURANTS:
        try:
            # Check if restaurant already exists
            existing = db.query(Restaurant).filter(Restaurant.name == restaurant_data["name"]).first()
            if existing:
                print(f"Restaurant '{restaurant_data['name']}' already exists, skipping...")
                created_restaurants.append(existing)
                continue
            
            # Create restaurant
            restaurant_create = RestaurantCreate(**restaurant_data)
            restaurant = restaurant_service.create_restaurant(restaurant_create, user_id)
            created_restaurants.append(restaurant)
            
            print(f"Created restaurant: {restaurant.name} (ID: {restaurant.id})")
            
            # Add menu items
            if restaurant.name in SAMPLE_MENU_ITEMS:
                for menu_item_data in SAMPLE_MENU_ITEMS[restaurant.name]:
                    menu_item_data["restaurant_id"] = restaurant.id
                    menu_item_create = MenuItemCreate(**menu_item_data)
                    menu_item = restaurant_service.create_menu_item(menu_item_create, user_id)
                    print(f"  Added menu item: {menu_item.name}")
            
            # Add sample reviews
            sample_reviews = [
                {"rating": 5, "comment": "Excellent food and service!"},
                {"rating": 4, "comment": "Great atmosphere, will come back."},
                {"rating": 4, "comment": "Delicious food, slightly pricey but worth it."}
            ]
            
            for review_data in sample_reviews:
                review_data["restaurant_id"] = restaurant.id
                review_create = ReviewCreate(**review_data)
                review = restaurant_service.create_review(review_create, user_id)
                print(f"  Added review: {review.rating} stars")
            
        except Exception as e:
            print(f"Error creating restaurant {restaurant_data['name']}: {e}")
            continue
    
    return created_restaurants

def main():
    """Main function to populate sample data"""
    print("🍽️ Populating BiteBase with sample restaurant data...")
    
    # Create database session
    db = next(get_db())
    
    try:
        # Create sample user
        print("👤 Creating sample user...")
        user = create_sample_user(db)
        print(f"User created/found: {user.email} (ID: {user.id})")
        
        # Populate restaurants
        print("\n🏪 Creating sample restaurants...")
        restaurants = populate_restaurants(db, str(user.id))
        
        # Print summary
        print(f"\n✅ Successfully populated database!")
        print(f"📊 Summary:")
        print(f"  - Restaurants: {len(restaurants)}")
        
        # Get statistics
        restaurant_service = RestaurantService(db)
        total_count = restaurant_service.get_total_restaurant_count()
        cuisine_counts = restaurant_service.get_restaurant_counts_by_cuisine()
        rating_stats = restaurant_service.get_rating_statistics()
        
        print(f"  - Total restaurants in DB: {total_count}")
        print(f"  - Cuisine distribution: {cuisine_counts}")
        print(f"  - Average rating: {rating_stats['average_rating']:.2f}")
        
        print(f"\n🚀 Database is ready! You can now:")
        print(f"  1. Start the FastAPI backend: cd apps/fastapi-backend && uvicorn app.main:app --reload")
        print(f"  2. Test the API endpoints at http://localhost:8000/docs")
        print(f"  3. View restaurants at http://localhost:8000/api/v1/restaurants/")
        
    except Exception as e:
        print(f"❌ Error populating data: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main()