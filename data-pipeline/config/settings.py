"""
Configuration settings for the data pipeline
"""
import os
from pathlib import Path
from typing import Dict, List, Optional
try:
    from pydantic_settings import BaseSettings
    from pydantic import Field
except ImportError:
    from pydantic import BaseSettings, Field
from dotenv import load_dotenv

load_dotenv()

class DatabaseConfig(BaseSettings):
    """Database configuration"""
    host: str = Field(default="localhost", env="DB_HOST")
    port: int = Field(default=5432, env="DB_PORT")
    name: str = Field(default="bitebase", env="DB_NAME")
    user: str = Field(default="postgres", env="DB_USER")
    password: str = Field(default="password", env="DB_PASSWORD")
    
    @property
    def url(self) -> str:
        return f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.name}"

class DataLakeConfig(BaseSettings):
    """Data Lake configuration"""
    type: str = Field(default="local", env="DATALAKE_TYPE")  # local, s3, minio
    base_path: str = Field(default="./datalake", env="DATALAKE_BASE_PATH")
    
    # S3/MinIO configuration
    endpoint_url: Optional[str] = Field(default=None, env="DATALAKE_ENDPOINT_URL")
    access_key: Optional[str] = Field(default=None, env="DATALAKE_ACCESS_KEY")
    secret_key: Optional[str] = Field(default=None, env="DATALAKE_SECRET_KEY")
    bucket_name: str = Field(default="bitebase-datalake", env="DATALAKE_BUCKET")
    region: str = Field(default="us-east-1", env="DATALAKE_REGION")

class ScrapingConfig(BaseSettings):
    """Web scraping configuration"""
    user_agents: List[str] = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    ]
    
    # Rate limiting
    request_delay: float = Field(default=2.0, env="SCRAPING_DELAY")
    max_retries: int = Field(default=3, env="SCRAPING_MAX_RETRIES")
    timeout: int = Field(default=30, env="SCRAPING_TIMEOUT")
    
    # Wongnai specific
    wongnai_base_url: str = "https://www.wongnai.com"
    wongnai_api_base: str = "https://api.wongnai.com"
    
    # Selenium/Playwright settings
    headless: bool = Field(default=True, env="SCRAPING_HEADLESS")
    browser_type: str = Field(default="chromium", env="SCRAPING_BROWSER")  # chromium, firefox, webkit

class ETLConfig(BaseSettings):
    """ETL configuration"""
    batch_size: int = Field(default=1000, env="ETL_BATCH_SIZE")
    max_workers: int = Field(default=4, env="ETL_MAX_WORKERS")
    
    # Data validation
    enable_validation: bool = Field(default=True, env="ETL_ENABLE_VALIDATION")
    validation_sample_rate: float = Field(default=0.1, env="ETL_VALIDATION_SAMPLE_RATE")
    
    # Data quality thresholds
    min_data_quality_score: float = Field(default=0.8, env="ETL_MIN_QUALITY_SCORE")
    max_null_percentage: float = Field(default=0.2, env="ETL_MAX_NULL_PERCENTAGE")

class CronConfig(BaseSettings):
    """Cron job configuration"""
    # Schedule patterns (cron format)
    restaurant_scraping_schedule: str = Field(default="0 2 * * *", env="CRON_RESTAURANT_SCHEDULE")  # Daily at 2 AM
    menu_scraping_schedule: str = Field(default="0 4 * * *", env="CRON_MENU_SCHEDULE")  # Daily at 4 AM
    etl_schedule: str = Field(default="0 6 * * *", env="CRON_ETL_SCHEDULE")  # Daily at 6 AM
    
    # Monitoring
    enable_monitoring: bool = Field(default=True, env="CRON_ENABLE_MONITORING")
    alert_email: Optional[str] = Field(default=None, env="CRON_ALERT_EMAIL")

class LoggingConfig(BaseSettings):
    """Logging configuration"""
    level: str = Field(default="INFO", env="LOG_LEVEL")
    format: str = "{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{function}:{line} | {message}"
    rotation: str = Field(default="1 day", env="LOG_ROTATION")
    retention: str = Field(default="30 days", env="LOG_RETENTION")
    
    # Log destinations
    log_to_file: bool = Field(default=True, env="LOG_TO_FILE")
    log_to_console: bool = Field(default=True, env="LOG_TO_CONSOLE")
    log_directory: str = Field(default="./logs", env="LOG_DIRECTORY")

class MonitoringConfig(BaseSettings):
    """Monitoring and alerting configuration"""
    prometheus_port: int = Field(default=8090, env="PROMETHEUS_PORT")
    enable_metrics: bool = Field(default=True, env="ENABLE_METRICS")
    
    # Health check endpoints
    health_check_interval: int = Field(default=60, env="HEALTH_CHECK_INTERVAL")  # seconds
    
    # Alerting thresholds
    max_scraping_failures: int = Field(default=5, env="MAX_SCRAPING_FAILURES")
    max_etl_failures: int = Field(default=3, env="MAX_ETL_FAILURES")

class Settings:
    """Main settings class"""
    
    def __init__(self):
        self.database = DatabaseConfig()
        self.datalake = DataLakeConfig()
        self.scraping = ScrapingConfig()
        self.etl = ETLConfig()
        self.cron = CronConfig()
        self.logging = LoggingConfig()
        self.monitoring = MonitoringConfig()
        
        # Paths
        self.project_root = Path(__file__).parent.parent
        self.data_dir = self.project_root / "datalake"
        self.logs_dir = Path(self.logging.log_directory)
        
        # Create directories
        self.data_dir.mkdir(exist_ok=True)
        self.logs_dir.mkdir(exist_ok=True)
        
        # Data lake structure
        self.raw_data_path = self.data_dir / "raw"
        self.processed_data_path = self.data_dir / "processed"
        self.curated_data_path = self.data_dir / "curated"
        self.archive_data_path = self.data_dir / "archive"
        
        for path in [self.raw_data_path, self.processed_data_path, 
                    self.curated_data_path, self.archive_data_path]:
            path.mkdir(exist_ok=True)

# Global settings instance
settings = Settings()

# Wongnai specific configurations
WONGNAI_REGIONS = {
    "bangkok": {
        "name": "Bangkok",
        "url_path": "bangkok",
        "coordinates": {"lat": 13.7563, "lng": 100.5018}
    },
    "chiang_mai": {
        "name": "Chiang Mai", 
        "url_path": "chiang-mai",
        "coordinates": {"lat": 18.7883, "lng": 98.9853}
    },
    "phuket": {
        "name": "Phuket",
        "url_path": "phuket", 
        "coordinates": {"lat": 7.8804, "lng": 98.3923}
    },
    "pattaya": {
        "name": "Pattaya",
        "url_path": "pattaya",
        "coordinates": {"lat": 12.9236, "lng": 100.8825}
    }
}

WONGNAI_CATEGORIES = [
    "restaurant",
    "cafe", 
    "bar",
    "bakery",
    "street-food",
    "buffet",
    "fine-dining",
    "fast-food",
    "delivery"
]

# Data schema definitions
RESTAURANT_SCHEMA = {
    "id": "string",
    "name": "string", 
    "address": "string",
    "latitude": "float",
    "longitude": "float",
    "phone": "string",
    "website": "string",
    "rating": "float",
    "review_count": "integer",
    "price_range": "string",
    "cuisine_type": "string",
    "opening_hours": "object",
    "features": "array",
    "images": "array",
    "description": "string",
    "wongnai_url": "string",
    "scraped_at": "datetime",
    "last_updated": "datetime"
}

MENU_SCHEMA = {
    "restaurant_id": "string",
    "item_name": "string",
    "description": "string", 
    "price": "float",
    "category": "string",
    "image_url": "string",
    "availability": "boolean",
    "ingredients": "array",
    "allergens": "array",
    "nutritional_info": "object",
    "scraped_at": "datetime"
}