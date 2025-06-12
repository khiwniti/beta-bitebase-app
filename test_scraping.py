#!/usr/bin/env python3
"""
Test script to verify restaurant data scraping functionality
"""
import sys
import os
from pathlib import Path

# Add data-pipeline to Python path
sys.path.insert(0, str(Path(__file__).parent / "data-pipeline"))

def test_scraper_initialization():
    """Test if scraper can be initialized"""
    print("🔧 Testing scraper initialization...")
    try:
        from scrapers.wongnai_scraper import WongnaiScraper
        scraper = WongnaiScraper()
        print("✅ Scraper initialized successfully")
        return True
    except Exception as e:
        print(f"❌ Scraper initialization failed: {e}")
        return False

def test_configuration():
    """Test configuration loading"""
    print("⚙️ Testing configuration...")
    try:
        from config.settings import settings, WONGNAI_REGIONS, WONGNAI_CATEGORIES
        print(f"  - Database URL: {settings.database.url[:50]}...")
        print(f"  - Scraping delay: {settings.scraping.request_delay}s")
        print(f"  - Available regions: {list(WONGNAI_REGIONS.keys())}")
        print(f"  - Available categories: {WONGNAI_CATEGORIES[:3]}...")
        print("✅ Configuration loaded successfully")
        return True
    except Exception as e:
        print(f"❌ Configuration test failed: {e}")
        return False

def test_pipeline_manager():
    """Test pipeline manager initialization"""
    print("🔄 Testing pipeline manager...")
    try:
        from pipeline_manager import PipelineManager
        pipeline = PipelineManager()
        print("✅ Pipeline manager initialized successfully")
        return True
    except Exception as e:
        print(f"❌ Pipeline manager test failed: {e}")
        return False

def test_basic_scraping():
    """Test basic scraping functionality (without actual web requests)"""
    print("🕷️ Testing basic scraping functionality...")
    try:
        from config.settings import WONGNAI_REGIONS
        from scrapers.wongnai_scraper import WongnaiScraper
        
        scraper = WongnaiScraper()
        
        # Test URL construction
        region = "bangkok"
        category = "restaurant"
        region_config = WONGNAI_REGIONS.get(region)
        base_url = f"{scraper.config.wongnai_base_url}/{region_config['url_path']}/{category}"
        
        print(f"  - Test URL: {base_url}")
        print(f"  - User agent configured: {bool(scraper.ua)}")
        print(f"  - Session configured: {bool(scraper.session)}")
        
        print("✅ Basic scraping setup working")
        return True
    except Exception as e:
        print(f"❌ Basic scraping test failed: {e}")
        return False

def test_data_directories():
    """Test data directory structure"""
    print("📁 Testing data directories...")
    try:
        from config.settings import settings
        
        print(f"  - Project root: {settings.project_root}")
        print(f"  - Data directory: {settings.data_dir}")
        print(f"  - Logs directory: {settings.logs_dir}")
        
        # Check if directories exist
        dirs_to_check = [
            settings.data_dir,
            settings.logs_dir,
            settings.raw_data_path,
            settings.processed_data_path,
            settings.curated_data_path
        ]
        
        for dir_path in dirs_to_check:
            if dir_path.exists():
                print(f"  ✅ {dir_path.name} directory exists")
            else:
                print(f"  ❌ {dir_path.name} directory missing")
                dir_path.mkdir(parents=True, exist_ok=True)
                print(f"  ✅ Created {dir_path.name} directory")
        
        print("✅ Data directories verified")
        return True
    except Exception as e:
        print(f"❌ Data directories test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 BiteBase Data Scraping Test Suite")
    print("=" * 50)
    
    tests = [
        test_configuration,
        test_data_directories,
        test_scraper_initialization,
        test_basic_scraping,
        test_pipeline_manager
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
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Scraping system is ready.")
        print("\n📝 Next steps:")
        print("1. Install Chrome/Chromium for Selenium WebDriver")
        print("2. Set up proper environment variables for production")
        print("3. Configure database connection for data loading")
        print("4. Run: python data-pipeline/pipeline_manager.py --test-run")
    else:
        print("⚠️ Some tests failed. Please check the configuration.")
        
    return passed == total

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Please ensure you're running from the project root directory")
        print("and all dependencies are installed:")
        print("  pip install -r data-pipeline/requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)