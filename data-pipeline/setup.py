"""
Setup script for the data pipeline
"""
import os
import sys
import subprocess
from pathlib import Path

def install_requirements():
    """Install Python requirements"""
    print("Installing Python requirements...")
    
    requirements_file = Path(__file__).parent / "requirements.txt"
    
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "-r", str(requirements_file)
        ])
        print("✅ Requirements installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False
    
    return True

def setup_directories():
    """Create necessary directories"""
    print("Setting up directories...")
    
    base_dir = Path(__file__).parent
    directories = [
        "datalake/raw/wongnai/restaurants",
        "datalake/raw/wongnai/menus", 
        "datalake/processed/wongnai/restaurants",
        "datalake/processed/wongnai/menus",
        "datalake/curated/restaurants",
        "datalake/curated/menus",
        "datalake/archive",
        "logs",
        "config",
        "temp"
    ]
    
    for directory in directories:
        dir_path = base_dir / directory
        dir_path.mkdir(parents=True, exist_ok=True)
        print(f"✅ Created directory: {directory}")
    
    return True

def setup_environment():
    """Setup environment file"""
    print("Setting up environment configuration...")
    
    base_dir = Path(__file__).parent
    env_example = base_dir / ".env.example"
    env_file = base_dir / ".env"
    
    if not env_file.exists():
        if env_example.exists():
            # Copy example to .env
            with open(env_example, 'r') as src, open(env_file, 'w') as dst:
                dst.write(src.read())
            print("✅ Created .env file from .env.example")
        else:
            print("❌ .env.example file not found")
            return False
    else:
        print("✅ .env file already exists")
    
    return True

def install_chrome_driver():
    """Install Chrome WebDriver for Selenium"""
    print("Setting up Chrome WebDriver...")
    
    try:
        # Try to install chromedriver-autoinstaller
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "chromedriver-autoinstaller"
        ])
        
        # Auto-install chromedriver
        import chromedriver_autoinstaller
        chromedriver_autoinstaller.install()
        
        print("✅ Chrome WebDriver installed successfully")
    except Exception as e:
        print(f"⚠️  Chrome WebDriver installation failed: {e}")
        print("   You may need to install Chrome and ChromeDriver manually")
        return False
    
    return True

def setup_database():
    """Setup database tables"""
    print("Setting up database...")
    
    try:
        from etl.database_loader import DatabaseLoader
        
        loader = DatabaseLoader()
        loader.create_tables()
        
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"⚠️  Database setup failed: {e}")
        print("   Make sure PostgreSQL is running and connection details are correct")
        return False
    
    return True

def test_components():
    """Test key components"""
    print("Testing components...")
    
    tests_passed = 0
    total_tests = 4
    
    # Test data lake
    try:
        from utils.datalake import datalake
        files = datalake.list_files()
        print("✅ Data lake connection successful")
        tests_passed += 1
    except Exception as e:
        print(f"❌ Data lake test failed: {e}")
    
    # Test database connection
    try:
        from etl.database_loader import DatabaseLoader
        loader = DatabaseLoader()
        count = loader.get_restaurant_count()
        print(f"✅ Database connection successful (restaurants: {count})")
        tests_passed += 1
    except Exception as e:
        print(f"❌ Database test failed: {e}")
    
    # Test scraper initialization
    try:
        from scrapers.wongnai_scraper import WongnaiScraper
        scraper = WongnaiScraper()
        print("✅ Scraper initialization successful")
        tests_passed += 1
    except Exception as e:
        print(f"❌ Scraper test failed: {e}")
    
    # Test processor initialization
    try:
        from etl.data_processor import DataProcessor
        processor = DataProcessor()
        print("✅ Data processor initialization successful")
        tests_passed += 1
    except Exception as e:
        print(f"❌ Data processor test failed: {e}")
    
    print(f"\nTests passed: {tests_passed}/{total_tests}")
    return tests_passed == total_tests

def main():
    """Main setup function"""
    print("🚀 Setting up BiteBase Data Pipeline")
    print("=" * 50)
    
    success = True
    
    # Step 1: Install requirements
    if not install_requirements():
        success = False
    
    print()
    
    # Step 2: Setup directories
    if not setup_directories():
        success = False
    
    print()
    
    # Step 3: Setup environment
    if not setup_environment():
        success = False
    
    print()
    
    # Step 4: Install Chrome driver
    if not install_chrome_driver():
        success = False
    
    print()
    
    # Step 5: Setup database
    if not setup_database():
        success = False
    
    print()
    
    # Step 6: Test components
    if not test_components():
        success = False
    
    print()
    print("=" * 50)
    
    if success:
        print("🎉 Setup completed successfully!")
        print("\nNext steps:")
        print("1. Review and update .env file with your configuration")
        print("2. Ensure PostgreSQL is running")
        print("3. Run a test scraping: python pipeline_manager.py --action run-full-pipeline --max-pages 1")
        print("4. Start the scheduler: python pipeline_manager.py --action start-scheduler")
    else:
        print("❌ Setup completed with some issues")
        print("Please review the errors above and fix them before proceeding")
        sys.exit(1)

if __name__ == "__main__":
    main()