# BiteBase Data Pipeline Integration Guide

## 🎯 Overview

This guide provides comprehensive instructions for setting up and integrating the BiteBase data scraping and ETL pipeline that collects restaurant information from Wongnai and processes it through a complete data lake architecture.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Wongnai       │───▶│   Data Lake     │───▶│   ETL Process   │───▶│   PostgreSQL    │
│   Web Scraping  │    │   (Raw Data)    │    │   (Processing)  │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │                       │
         ▼                       ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ • Restaurants   │    │ • JSON Files    │    │ • Data Cleaning │    │ • restaurants   │
│ • Menu Items    │    │ • Parquet Files │    │ • Validation    │    │ • menu_items    │
│ • Reviews       │    │ • Metadata      │    │ • Enrichment    │    │ • quality_logs  │
│ • Coordinates   │    │ • Versioning    │    │ • Deduplication │    │ • etl_jobs      │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Setup

### 1. Prerequisites

```bash
# System requirements
- Python 3.8+
- PostgreSQL 12+
- Chrome/Chromium browser
- 4GB+ RAM
- 10GB+ disk space

# Install system dependencies (Ubuntu/Debian)
sudo apt update
sudo apt install python3-pip python3-venv postgresql postgresql-contrib chromium-browser

# Install system dependencies (macOS)
brew install python postgresql chromium
```

### 2. Database Setup

```bash
# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# Create database and user
sudo -u postgres psql
CREATE DATABASE bitebase;
CREATE USER bitebase_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE bitebase TO bitebase_user;
\q
```

### 3. Pipeline Installation

```bash
# Navigate to data pipeline directory
cd /workspace/beta-bitebase-app/data-pipeline

# Run setup script
python setup.py

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and settings
```

### 4. Quick Test

```bash
# Test the pipeline with minimal data
./scripts/start_pipeline.sh --action run-once --max-pages 1

# Check status
python scripts/monitor_pipeline.py --action summary
```

## 📋 Detailed Configuration

### Environment Variables (.env)

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bitebase
DB_USER=bitebase_user
DB_PASSWORD=your_secure_password

# Data Lake Configuration
DATALAKE_TYPE=local  # Options: local, s3, minio
DATALAKE_BASE_PATH=./datalake

# For S3/MinIO (optional)
DATALAKE_BUCKET=bitebase-datalake
DATALAKE_ACCESS_KEY=your_access_key
DATALAKE_SECRET_KEY=your_secret_key
DATALAKE_ENDPOINT_URL=http://localhost:9000  # MinIO only

# Scraping Configuration
SCRAPING_DELAY=2.0              # Delay between requests (seconds)
SCRAPING_MAX_RETRIES=3          # Max retry attempts
SCRAPING_TIMEOUT=30             # Request timeout (seconds)
SCRAPING_HEADLESS=true          # Run browser in headless mode
SCRAPING_BROWSER=chromium       # Browser type

# ETL Configuration
ETL_BATCH_SIZE=1000             # Records per batch
ETL_MAX_WORKERS=4               # Parallel workers
ETL_ENABLE_VALIDATION=true      # Enable data validation
ETL_MIN_QUALITY_SCORE=0.8       # Minimum quality threshold

# Scheduling Configuration
CRON_RESTAURANT_SCHEDULE="0 2 * * *"  # Daily at 2 AM
CRON_MENU_SCHEDULE="0 4 * * *"        # Daily at 4 AM
CRON_ETL_SCHEDULE="0 6 * * *"         # Daily at 6 AM
CRON_ENABLE_MONITORING=true
CRON_ALERT_EMAIL=admin@bitebase.com

# Logging Configuration
LOG_LEVEL=INFO
LOG_DIRECTORY=./logs
LOG_ROTATION="1 day"
LOG_RETENTION="30 days"
```

## 🔧 Pipeline Components

### 1. Web Scraper

**Purpose**: Extract restaurant and menu data from Wongnai

**Features**:
- Multi-region support (Bangkok, Chiang Mai, Phuket, Pattaya)
- Category-based scraping (restaurants, cafes, bars, etc.)
- Detailed information extraction (coordinates, hours, features)
- Menu item scraping with prices and descriptions
- Rate limiting and retry logic
- User agent rotation

**Usage**:
```bash
# Scrape specific regions and categories
python scrapers/wongnai_scraper.py \
    --regions bangkok chiang_mai \
    --categories restaurant cafe \
    --max-pages 5

# Full scraping with details and menus
python scrapers/wongnai_scraper.py \
    --regions bangkok \
    --categories restaurant \
    --max-pages 10 \
    --scrape-details \
    --scrape-menus
```

### 2. Data Processor (ETL)

**Purpose**: Clean, validate, and enrich scraped data

**Features**:
- Data cleaning and standardization
- Duplicate detection and removal
- Data validation and quality scoring
- Feature enrichment (price categories, location quality)
- Schema validation and type conversion

**Usage**:
```bash
# Process restaurant data
python etl/data_processor.py \
    --data-type restaurants \
    --input-path raw/wongnai/restaurants/file.json

# Process menu data with validation
python etl/data_processor.py \
    --data-type menus \
    --input-path raw/wongnai/menus/file.json
```

### 3. Database Loader

**Purpose**: Load processed data into PostgreSQL database

**Features**:
- Batch loading with upsert logic
- Data quality tracking
- ETL job logging
- Schema management and migrations

**Usage**:
```bash
# Create database tables
python etl/database_loader.py --action create-tables

# Load processed data
python etl/database_loader.py \
    --action load-restaurants \
    --data-path curated/restaurants/file.parquet

# Check database status
python etl/database_loader.py --action status
```

### 4. Scheduler

**Purpose**: Automate pipeline execution with cron-like scheduling

**Features**:
- Cron-based job scheduling
- Job monitoring and alerting
- Health checks and system monitoring
- Failure recovery and retry logic

**Usage**:
```bash
# Start scheduler daemon
python cron/scheduler.py --action start

# Run specific job immediately
python cron/scheduler.py --action run-job --job scrape_restaurants

# Check scheduler status
python cron/scheduler.py --action status
```

## 📊 Data Schema

### Database Tables

#### restaurants
```sql
CREATE TABLE restaurants (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    latitude FLOAT,
    longitude FLOAT,
    phone VARCHAR(20),
    website VARCHAR(500),
    rating FLOAT,
    review_count INTEGER,
    price_range VARCHAR(20),
    price_category VARCHAR(20),
    cuisine_type VARCHAR(100),
    region VARCHAR(50),
    rating_category VARCHAR(20),
    opening_hours JSON,
    features JSON,
    images JSON,
    description TEXT,
    wongnai_url VARCHAR(500),
    location_quality VARCHAR(20),
    data_completeness FLOAT,
    is_active BOOLEAN DEFAULT TRUE,
    scraped_at TIMESTAMP,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### menu_items
```sql
CREATE TABLE menu_items (
    id VARCHAR(50) PRIMARY KEY,
    restaurant_id VARCHAR(50) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    price FLOAT,
    category VARCHAR(100),
    price_category VARCHAR(20),
    image_url VARCHAR(500),
    availability BOOLEAN DEFAULT TRUE,
    ingredients JSON,
    allergens JSON,
    nutritional_info JSON,
    data_completeness FLOAT,
    is_active BOOLEAN DEFAULT TRUE,
    scraped_at TIMESTAMP,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## ⏰ Scheduling & Automation

### Default Schedule

```bash
# Restaurant scraping: Daily at 2:00 AM
0 2 * * * /path/to/pipeline/scripts/start_pipeline.sh --action run-job --job scrape_restaurants

# Menu scraping: Daily at 4:00 AM  
0 4 * * * /path/to/pipeline/scripts/start_pipeline.sh --action run-job --job scrape_menus

# ETL processing: Daily at 6:00 AM
0 6 * * * /path/to/pipeline/scripts/start_pipeline.sh --action run-job --job process_data

# Health check: Every 15 minutes
*/15 * * * * /path/to/pipeline/scripts/monitor_pipeline.py --action health
```

### Custom Scheduling

```bash
# Start the built-in scheduler
./scripts/start_pipeline.sh --action scheduler

# Or use system cron
crontab -e
# Add the above cron entries
```

## 📈 Monitoring & Alerting

### Real-time Dashboard

```bash
# Start monitoring dashboard
python scripts/monitor_pipeline.py --action dashboard

# Show summary
python scripts/monitor_pipeline.py --action summary

# Health check
python scripts/monitor_pipeline.py --action health
```

### Log Monitoring

```bash
# Tail pipeline logs
python scripts/monitor_pipeline.py --action logs --log-type pipeline

# Tail scraper logs
python scripts/monitor_pipeline.py --action logs --log-type scraper

# Tail processor logs  
python scripts/monitor_pipeline.py --action logs --log-type processor
```

### Key Metrics

- **Data Volume**: Number of restaurants and menu items
- **Data Quality**: Completeness scores and validation results
- **Processing Speed**: Records per second, job duration
- **Success Rate**: Job success/failure rates
- **Data Freshness**: Time since last successful update

## 🔗 Integration with BiteBase Backend

### API Endpoints

The processed data is available through the BiteBase backend API:

```bash
# Get all restaurants
GET /api/restaurants

# Get restaurant by ID
GET /api/restaurants/{id}

# Get restaurant menu
GET /api/restaurants/{id}/menu

# Search restaurants
GET /api/restaurants/search?location=bangkok&cuisine=thai&price=moderate

# Get restaurant analytics
GET /api/restaurants/{id}/analytics
```

### Database Integration

The pipeline populates the same database used by the BiteBase backend:

```javascript
// Backend database configuration (apps/backend/config/database.js)
module.exports = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'bitebase',
    username: process.env.DB_USER || 'bitebase_user',
    password: process.env.DB_PASSWORD,
    dialect: 'postgres'
  }
};
```

### Real-time Updates

```javascript
// Backend service to get fresh data
class RestaurantService {
  async getRestaurants(filters = {}) {
    const query = `
      SELECT * FROM restaurants 
      WHERE is_active = true 
      AND data_completeness > 0.5
      ORDER BY updated_at DESC
    `;
    return await db.query(query);
  }
  
  async getDataFreshness() {
    const query = `
      SELECT MAX(updated_at) as last_update 
      FROM restaurants
    `;
    const result = await db.query(query);
    return result[0].last_update;
  }
}
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Chrome Driver Issues
```bash
# Install Chrome driver automatically
pip install chromedriver-autoinstaller

# Or download manually
wget https://chromedriver.storage.googleapis.com/LATEST_RELEASE
```

#### 2. Database Connection Errors
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U bitebase_user -d bitebase

# Check firewall
sudo ufw allow 5432
```

#### 3. Scraping Rate Limits
```bash
# Increase delay between requests
export SCRAPING_DELAY=5.0

# Use different user agents
export SCRAPING_BROWSER=firefox
```

#### 4. Memory Issues
```bash
# Reduce batch size
export ETL_BATCH_SIZE=500

# Limit concurrent workers
export ETL_MAX_WORKERS=2
```

### Log Analysis

```bash
# Check for errors
grep -i error logs/data_pipeline.log

# Monitor scraping progress
tail -f logs/wongnai_scraper.log

# Check ETL performance
grep "Processing batch" logs/data_processor.log
```

## 🔧 Advanced Configuration

### Custom Data Sources

Add new scrapers by extending the base scraper class:

```python
# scrapers/custom_scraper.py
from scrapers.base_scraper import BaseScraper

class CustomScraper(BaseScraper):
    def scrape_restaurants(self, region):
        # Custom scraping logic
        pass
```

### Data Lake Backends

Configure different storage backends:

```bash
# Local storage (default)
DATALAKE_TYPE=local
DATALAKE_BASE_PATH=./datalake

# AWS S3
DATALAKE_TYPE=s3
DATALAKE_BUCKET=my-bucket
DATALAKE_ACCESS_KEY=AKIA...
DATALAKE_SECRET_KEY=...

# MinIO (self-hosted S3)
DATALAKE_TYPE=minio
DATALAKE_ENDPOINT_URL=http://localhost:9000
DATALAKE_BUCKET=bitebase-datalake
```

### Custom ETL Processors

Add custom data processing logic:

```python
# etl/custom_processor.py
from etl.data_processor import DataProcessor

class CustomProcessor(DataProcessor):
    def _enrich_restaurant_data(self, df):
        # Add custom enrichment logic
        df['custom_score'] = self._calculate_custom_score(df)
        return super()._enrich_restaurant_data(df)
```

## 📊 Performance Optimization

### Scraping Performance

```bash
# Parallel scraping
export ETL_MAX_WORKERS=8

# Faster browser
export SCRAPING_BROWSER=chromium
export SCRAPING_HEADLESS=true

# Optimized delays
export SCRAPING_DELAY=1.0
```

### ETL Performance

```bash
# Larger batches
export ETL_BATCH_SIZE=2000

# Disable validation for speed
export ETL_ENABLE_VALIDATION=false

# Use faster storage
DATALAKE_TYPE=local  # Faster than S3 for small datasets
```

### Database Performance

```sql
-- Add indexes for common queries
CREATE INDEX idx_restaurants_region ON restaurants(region);
CREATE INDEX idx_restaurants_cuisine ON restaurants(cuisine_type);
CREATE INDEX idx_restaurants_rating ON restaurants(rating);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category);
```

## 🔐 Security & Compliance

### Data Privacy

- No personal customer data is collected
- Only public restaurant information is scraped
- Data is anonymized where applicable
- Compliance with data protection regulations

### Rate Limiting

- Respectful scraping with delays
- User agent rotation
- IP rotation (if needed)
- Compliance with robots.txt

### Access Control

```bash
# Secure database access
DB_PASSWORD=strong_random_password

# Restrict network access
# Configure PostgreSQL pg_hba.conf for specific IPs

# Use environment variables for secrets
# Never commit .env files to version control
```

## 📈 Scaling Considerations

### Horizontal Scaling

```bash
# Multiple scraper instances
python scrapers/wongnai_scraper.py --regions bangkok &
python scrapers/wongnai_scraper.py --regions chiang_mai &

# Distributed processing with Celery
pip install celery redis
celery worker -A pipeline_tasks
```

### Vertical Scaling

```bash
# Increase resources
export ETL_MAX_WORKERS=16
export ETL_BATCH_SIZE=5000

# Use faster storage (SSD)
# Increase database connection pool
```

### Cloud Deployment

```yaml
# docker-compose.yml for cloud deployment
version: '3.8'
services:
  pipeline:
    build: .
    environment:
      - DB_HOST=postgres
      - DATALAKE_TYPE=s3
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: bitebase
      POSTGRES_USER: bitebase_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
  
  redis:
    image: redis:6-alpine
```

## 🎯 Success Metrics

### Data Quality Metrics

- **Completeness**: % of records with all required fields
- **Accuracy**: % of records passing validation
- **Consistency**: % of records matching expected formats
- **Freshness**: Average age of data

### Performance Metrics

- **Throughput**: Records processed per hour
- **Latency**: Time from scraping to database
- **Reliability**: % of successful pipeline runs
- **Efficiency**: Resource utilization

### Business Metrics

- **Coverage**: Number of restaurants and regions
- **Growth**: Rate of new restaurant additions
- **Retention**: % of restaurants still active
- **Value**: Data utilization in BiteBase features

## 📞 Support & Maintenance

### Regular Maintenance

```bash
# Weekly data cleanup
python pipeline_manager.py --action cleanup --cleanup-days 30

# Monthly performance review
python scripts/monitor_pipeline.py --action summary

# Quarterly schema updates
python etl/database_loader.py --action create-tables
```

### Monitoring Alerts

Set up alerts for:
- Pipeline failures
- Data quality drops
- Performance degradation
- Storage capacity issues

### Documentation Updates

Keep documentation current with:
- Configuration changes
- New data sources
- Schema modifications
- Performance optimizations

---

## 🎉 Conclusion

This data pipeline provides a robust, scalable solution for collecting and processing restaurant data from Wongnai. It integrates seamlessly with the BiteBase platform to provide fresh, high-quality data for restaurant intelligence and analytics.

For additional support or questions, refer to the troubleshooting section or contact the development team.