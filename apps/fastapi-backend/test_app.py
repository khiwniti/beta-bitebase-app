"""
Simple test script to verify FastAPI backend functionality
"""

import asyncio
import httpx
import json
from datetime import datetime

async def test_fastapi_backend():
    """Test the FastAPI backend endpoints"""
    base_url = "http://localhost:8000"
    
    async with httpx.AsyncClient() as client:
        print("🧪 Testing BiteBase FastAPI Backend")
        print("=" * 50)
        
        # Test health endpoint
        try:
            response = await client.get(f"{base_url}/health")
            print(f"✅ Health Check: {response.status_code} - {response.json()}")
        except Exception as e:
            print(f"❌ Health Check Failed: {e}")
        
        # Test AI status endpoint
        try:
            response = await client.get(f"{base_url}/api/v1/ai")
            print(f"✅ AI Status: {response.status_code} - {response.json()}")
        except Exception as e:
            print(f"❌ AI Status Failed: {e}")
        
        # Test restaurant endpoints
        try:
            response = await client.get(f"{base_url}/api/v1/restaurants")
            print(f"✅ Restaurants List: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   Found {len(data.get('restaurants', []))} restaurants")
        except Exception as e:
            print(f"❌ Restaurants List Failed: {e}")
        
        # Test restaurant search
        try:
            params = {
                "latitude": 13.7563,
                "longitude": 100.5018,
                "radius": 5
            }
            response = await client.get(f"{base_url}/api/v1/restaurants/search", params=params)
            print(f"✅ Restaurant Search: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   Found {len(data.get('restaurants', []))} restaurants in search")
        except Exception as e:
            print(f"❌ Restaurant Search Failed: {e}")
        
        print("\n" + "=" * 50)
        print("🎉 Backend testing completed!")

if __name__ == "__main__":
    asyncio.run(test_fastapi_backend())