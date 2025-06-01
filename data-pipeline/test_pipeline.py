#!/usr/bin/env python3
"""
Basic pipeline test script
"""
import sys
import json
from pathlib import Path
from datetime import datetime

# Add current directory to path
sys.path.append(str(Path(__file__).parent))

def test_imports():
    """Test if all modules can be imported"""
    print("🧪 Testing module imports...")
    
    try:
        from config.settings import settings
        print("✅ Settings imported successfully")
    except Exception as e:
        print(f"❌ Settings import failed: {e}")
        return False
    
    try:
        from utils.logger import get_logger
        logger = get_logger("test")
        print("✅ Logger imported successfully")
    except Exception as e:
        print(f"❌ Logger import failed: {e}")
        return False
    
    try:
        from utils.datalake import datalake
        print("✅ Data lake imported successfully")
    except Exception as e:
        print(f"❌ Data lake import failed: {e}")
        return False
    
    try:
        from scrapers.wongnai_scraper import WongnaiScraper
        print("✅ Scraper imported successfully")
    except Exception as e:
        print(f"❌ Scraper import failed: {e}")
        return False
    
    try:
        from etl.data_processor import DataProcessor
        print("✅ Data processor imported successfully")
    except Exception as e:
        print(f"❌ Data processor import failed: {e}")
        return False
    
    try:
        from etl.database_loader import DatabaseLoader
        print("✅ Database loader imported successfully")
    except Exception as e:
        print(f"❌ Database loader import failed: {e}")
        return False
    
    return True

def test_configuration():
    """Test configuration loading"""
    print("\n🔧 Testing configuration...")
    
    try:
        from config.settings import settings
        
        print(f"✅ Database config: {settings.database.host}:{settings.database.port}")
        print(f"✅ Data lake type: {settings.datalake.type}")
        print(f"✅ Scraping delay: {settings.scraping.request_delay}s")
        print(f"✅ ETL batch size: {settings.etl.batch_size}")
        
        return True
    except Exception as e:
        print(f"❌ Configuration test failed: {e}")
        return False

def test_data_lake():
    """Test data lake functionality"""
    print("\n💾 Testing data lake...")
    
    try:
        from utils.datalake import datalake
        
        # Test basic operations
        test_data = {
            "test": "data",
            "timestamp": datetime.now().isoformat(),
            "items": [1, 2, 3]
        }
        
        # Save test data
        file_path = datalake.save_raw_data(test_data, "test", "pipeline_test")
        print(f"✅ Test data saved to: {file_path}")
        
        # List files
        files = datalake.list_files("raw/test")
        print(f"✅ Found {len(files)} test files")
        
        # Load test data
        loaded_data = datalake.load_data(file_path)
        if loaded_data and 'data' in loaded_data:
            print("✅ Test data loaded successfully")
        else:
            print("❌ Test data loading failed")
            return False
        
        return True
    except Exception as e:
        print(f"❌ Data lake test failed: {e}")
        return False

def test_database_connection():
    """Test database connection"""
    print("\n🗄️  Testing database connection...")
    
    try:
        from etl.database_loader import DatabaseLoader
        
        loader = DatabaseLoader()
        
        # Test connection by creating tables
        loader.create_tables()
        print("✅ Database tables created/verified")
        
        # Test basic queries
        restaurant_count = loader.get_restaurant_count()
        menu_count = loader.get_menu_item_count()
        
        print(f"✅ Current restaurant count: {restaurant_count}")
        print(f"✅ Current menu item count: {menu_count}")
        
        return True
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False

def test_scraper_initialization():
    """Test scraper initialization"""
    print("\n🕷️  Testing scraper initialization...")
    
    try:
        from scrapers.wongnai_scraper import WongnaiScraper
        
        scraper = WongnaiScraper()
        print("✅ Scraper initialized successfully")
        
        # Test basic functionality (without actual scraping)
        test_url = "https://www.wongnai.com/bangkok/restaurant"
        print(f"✅ Test URL configured: {test_url}")
        
        return True
    except Exception as e:
        print(f"❌ Scraper test failed: {e}")
        return False

def test_data_processor():
    """Test data processor"""
    print("\n🔄 Testing data processor...")
    
    try:
        from etl.data_processor import DataProcessor
        import pandas as pd
        
        processor = DataProcessor()
        print("✅ Data processor initialized")
        
        # Create test data
        test_restaurants = [
            {
                "name": "Test Restaurant 1",
                "wongnai_url": "https://www.wongnai.com/restaurant/123-test",
                "rating": 4.5,
                "price_range": "moderate",
                "cuisine_type": "thai",
                "scraped_at": datetime.now().isoformat()
            },
            {
                "name": "Test Restaurant 2", 
                "wongnai_url": "https://www.wongnai.com/restaurant/456-test",
                "rating": 3.8,
                "price_range": "budget",
                "cuisine_type": "chinese",
                "scraped_at": datetime.now().isoformat()
            }
        ]
        
        df = pd.DataFrame(test_restaurants)
        
        # Test cleaning
        df_cleaned = processor._clean_restaurant_data(df)
        print(f"✅ Cleaned {len(df_cleaned)} test restaurants")
        
        # Test enrichment
        df_enriched = processor._enrich_restaurant_data(df_cleaned)
        print(f"✅ Enriched data with {len(df_enriched.columns)} columns")
        
        return True
    except Exception as e:
        print(f"❌ Data processor test failed: {e}")
        return False

def run_all_tests():
    """Run all tests"""
    print("🚀 Starting BiteBase Data Pipeline Tests")
    print("=" * 50)
    
    tests = [
        ("Module Imports", test_imports),
        ("Configuration", test_configuration),
        ("Data Lake", test_data_lake),
        ("Database Connection", test_database_connection),
        ("Scraper Initialization", test_scraper_initialization),
        ("Data Processor", test_data_processor)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
            else:
                print(f"❌ {test_name} test failed")
        except Exception as e:
            print(f"❌ {test_name} test error: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Pipeline is ready to use.")
        return True
    else:
        print("⚠️  Some tests failed. Please check the configuration and dependencies.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)