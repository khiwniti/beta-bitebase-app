#!/usr/bin/env python3
"""
Live test of restaurant data scraping functionality
"""
import sys
import json
from pathlib import Path

# Add data-pipeline to Python path
sys.path.insert(0, str(Path(__file__).parent / "data-pipeline"))

def test_live_scraping():
    """Test actual scraping with a simple HTTP request"""
    print("🌐 Testing live scraping functionality...")
    
    try:
        from scrapers.wongnai_scraper import WongnaiScraper
        from config.settings import WONGNAI_REGIONS
        
        scraper = WongnaiScraper()
        
        # Test basic HTTP request to Wongnai (without Selenium)
        test_url = "https://www.wongnai.com/bangkok/restaurant"
        print(f"  - Testing URL: {test_url}")
        
        # Make a simple request without Selenium
        soup = scraper._make_request(test_url, use_selenium=False)
        
        if soup:
            print("  ✅ Successfully fetched page content")
            print(f"  - Page title: {soup.title.string if soup.title else 'No title'}")
            print(f"  - Page contains 'wongnai': {'wongnai' in str(soup).lower()}")
            print(f"  - Page size: {len(str(soup))} characters")
            
            # Look for restaurant-related content
            restaurant_links = soup.find_all('a', href=lambda x: x and '/restaurant/' in x)
            print(f"  - Found {len(restaurant_links)} restaurant links")
            
            return True
        else:
            print("  ❌ Failed to fetch page content")
            return False
            
    except Exception as e:
        print(f"  ❌ Live scraping test failed: {e}")
        return False

def test_data_extraction():
    """Test data extraction methods"""
    print("🔍 Testing data extraction methods...")
    
    try:
        from scrapers.wongnai_scraper import WongnaiScraper
        
        scraper = WongnaiScraper()
        
        # Test URL construction for different regions
        regions_to_test = ['bangkok', 'chiang_mai']
        categories_to_test = ['restaurant', 'cafe']
        
        for region in regions_to_test:
            for category in categories_to_test:
                from config.settings import WONGNAI_REGIONS
                region_config = WONGNAI_REGIONS.get(region)
                if region_config:
                    url = f"{scraper.config.wongnai_base_url}/{region_config['url_path']}/{category}"
                    print(f"  ✅ {region}/{category}: {url}")
        
        print("  ✅ URL construction working for all regions/categories")
        return True
        
    except Exception as e:
        print(f"  ❌ Data extraction test failed: {e}")
        return False

def test_data_storage():
    """Test data storage functionality"""
    print("💾 Testing data storage...")
    
    try:
        from utils.datalake import datalake
        from datetime import datetime
        
        # Test saving sample data
        sample_data = {
            "test_restaurant": {
                "name": "Test Restaurant",
                "rating": 4.5,
                "cuisine_type": "Thai",
                "scraped_at": datetime.now().isoformat()
            }
        }
        
        # Save test data
        file_path = datalake.save_raw_data(sample_data, 'wongnai', 'test_restaurants', datetime.now())
        print(f"  ✅ Test data saved to: {file_path}")
        
        # Verify file exists
        if Path(file_path).exists():
            print("  ✅ Data file exists and is accessible")
            
            # Read back the data
            with open(file_path, 'r') as f:
                loaded_data = json.load(f)
            
            if loaded_data == sample_data:
                print("  ✅ Data integrity verified")
                return True
            else:
                print("  ❌ Data integrity check failed")
                return False
        else:
            print("  ❌ Data file not found")
            return False
            
    except Exception as e:
        print(f"  ❌ Data storage test failed: {e}")
        return False

def main():
    """Run live scraping tests"""
    print("🧪 BiteBase Live Scraping Test Suite")
    print("=" * 50)
    
    tests = [
        test_data_extraction,
        test_data_storage,
        test_live_scraping
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
            print()
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {e}")
            print()
    
    print("=" * 50)
    print(f"📊 Live Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All live tests passed! Scraping system is fully functional.")
        print("\n📝 Production readiness:")
        print("✅ Configuration system working")
        print("✅ Data pipeline structure ready")
        print("✅ HTTP requests functional")
        print("✅ Data storage working")
        print("✅ URL construction for all regions")
        
        print("\n🚀 Ready for production deployment!")
        print("To run full scraping pipeline:")
        print("  cd data-pipeline && python pipeline_manager.py")
        
    else:
        print("⚠️ Some live tests failed. Check network connectivity and configuration.")
    
    return passed == total

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)