# BiteBase Data Pipeline

A comprehensive data scraping and ETL pipeline for restaurant information from Wongnai, designed to feed the BiteBase restaurant intelligence platform.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Scraping  │───▶│   Data Lake     │───▶│   ETL Process   │───▶│   Database      │
│   (Wongnai)     │    │   (Raw Data)    │    │   (Cleaning)    │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │                       │
         ▼                       ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ • Restaurant    │    │ • JSON Files    │    │ • Data Cleaning │    │ • Restaurants   │
│   Listings      │    │ • Parquet Files │    │ • Validation    │    │ • Menu Items    │
│ • Menu Items    │    │ • Metadata      │    │ • Enrichment    │    │ • Quality Logs  │
│ • Reviews       │    │ • Versioning    │    │ • Deduplication │    │ • ETL Jobs      │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. Setup

```bash
# Navigate to data pipeline directory
cd data-pipeline

# Run setup script
python setup.py

# Copy and configure environment
cp .env.example .env
# Edit .env with your configuration
```

### 2. Configuration

Update `.env` file with your settings:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bitebase
DB_USER=postgres
DB_PASSWORD=your_password

# Data Lake (choose one)
DATALAKE_TYPE=local  # or s3, minio

# Scraping
SCRAPING_DELAY=2.0
SCRAPING_HEADLESS=true
```

### 3. Run Pipeline

```bash
# Run full pipeline once
python pipeline_manager.py --action run-full-pipeline

# Start scheduled pipeline
python pipeline_manager.py --action start-scheduler

# Check status
python pipeline_manager.py --action status
```

## 📁 Project Structure

```
data-pipeline/
├── config/
│   └── settings.py          # Configuration management
├── scrapers/
│   └── wongnai_scraper.py   # Wongnai web scraper
├── etl/
│   ├── data_processor.py    # Data cleaning and processing
│   └── database_loader.py   # Database loading utilities
├── cron/
│   └── scheduler.py         # Job scheduling and monitoring
├── utils/
│   ├── logger.py           # Logging utilities
│   └── datalake.py         # Data lake management
├── datalake/               # Local data storage
│   ├── raw/               # Raw scraped data
│   ├── processed/         # Cleaned data
│   ├── curated/          # Final processed data
│   └── archive/          # Archived data
├── logs/                  # Application logs
├── pipeline_manager.py    # Main pipeline orchestrator
├── setup.py              # Setup script
└── requirements.txt      # Python dependencies
```

## 🔧 Components

### 1. Web Scraper (`scrapers/wongnai_scraper.py`)

- **Purpose**: Scrape restaurant and menu data from Wongnai
- **Features**:
  - Multi-region support (Bangkok, Chiang Mai, Phuket, etc.)
  - Category-based scraping (restaurants, cafes, bars, etc.)
  - Detailed restaurant information extraction
  - Menu item scraping with prices and descriptions
  - Rate limiting and retry logic
  - User agent rotation

**Usage**:
```bash
# Scrape restaurants from Bangkok
python scrapers/wongnai_scraper.py --regions bangkok --categories restaurant --max-pages 5

# Scrape with details and menus
python scrapers/wongnai_scraper.py --regions bangkok chiang_mai --categories restaurant cafe
```

### 2. Data Processor (`etl/data_processor.py`)

- **Purpose**: Clean, validate, and enrich scraped data
- **Features**:
  - Data cleaning and standardization
  - Duplicate detection and removal
  - Data validation and quality scoring
  - Feature enrichment (coordinates, categories, etc.)
  - Schema validation

**Usage**:
```bash
# Process restaurant data
python etl/data_processor.py --data-type restaurants --input-path raw/wongnai/restaurants/file.json

# Process menu data
python etl/data_processor.py --data-type menus --input-path raw/wongnai/menus/file.json
```

### 3. Database Loader (`etl/database_loader.py`)

- **Purpose**: Load processed data into PostgreSQL database
- **Features**:
  - Batch loading with upsert logic
  - Data quality tracking
  - ETL job logging
  - Schema management

**Usage**:
```bash
# Create database tables
python etl/database_loader.py --action create-tables

# Load restaurant data
python etl/database_loader.py --action load-restaurants --data-path curated/restaurants/file.parquet

# Check status
python etl/database_loader.py --action status
```

### 4. Scheduler (`cron/scheduler.py`)

- **Purpose**: Schedule and monitor pipeline jobs
- **Features**:
  - Cron-based scheduling
  - Job monitoring and alerting
  - Health checks
  - Failure recovery

**Usage**:
```bash
# Start scheduler
python cron/scheduler.py --action start

# Run specific job
python cron/scheduler.py --action run-job --job scrape_restaurants

# Check status
python cron/scheduler.py --action status
```

### 5. Data Lake (`utils/datalake.py`)

- **Purpose**: Manage data storage and versioning
- **Features**:
  - Multi-backend support (local, S3, MinIO)
  - Data versioning and metadata
  - Efficient storage formats (JSON, Parquet)
  - Data lifecycle management

## 📊 Data Schema

### Restaurants Table
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
    cuisine_type VARCHAR(100),
    region VARCHAR(50),
    opening_hours JSON,
    features JSON,
    images JSON,
    description TEXT,
    wongnai_url VARCHAR(500),
    data_completeness FLOAT,
    is_active BOOLEAN DEFAULT TRUE,
    scraped_at TIMESTAMP,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Menu Items Table
```sql
CREATE TABLE menu_items (
    id VARCHAR(50) PRIMARY KEY,
    restaurant_id VARCHAR(50) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    price FLOAT,
    category VARCHAR(100),
    image_url VARCHAR(500),
    ingredients JSON,
    allergens JSON,
    availability BOOLEAN DEFAULT TRUE,
    data_completeness FLOAT,
    is_active BOOLEAN DEFAULT TRUE,
    scraped_at TIMESTAMP,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## ⏰ Scheduling

Default cron schedules:

- **Restaurant Scraping**: Daily at 2:00 AM
- **Menu Scraping**: Daily at 4:00 AM  
- **ETL Processing**: Daily at 6:00 AM
- **Health Checks**: Every 15 minutes
- **Data Cleanup**: Weekly on Sunday at 1:00 AM

## 📈 Monitoring

### Health Checks
- Data lake accessibility
- Database connectivity
- Recent job success rates
- Disk and memory usage

### Quality Metrics
- Data completeness scores
- Validation failure rates
- Duplicate detection
- Processing success rates

### Alerting
- Job failure notifications
- Data quality threshold alerts
- System resource warnings

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | bitebase |
| `SCRAPING_DELAY` | Delay between requests (seconds) | 2.0 |
| `ETL_BATCH_SIZE` | Batch size for processing | 1000 |
| `LOG_LEVEL` | Logging level | INFO |

### Scraping Configuration

```python
# Regions to scrape
WONGNAI_REGIONS = {
    "bangkok": {"name": "Bangkok", "url_path": "bangkok"},
    "chiang_mai": {"name": "Chiang Mai", "url_path": "chiang-mai"},
    "phuket": {"name": "Phuket", "url_path": "phuket"}
}

# Categories to scrape
WONGNAI_CATEGORIES = [
    "restaurant", "cafe", "bar", "bakery", 
    "street-food", "buffet", "fine-dining"
]
```

## 🚨 Troubleshooting

### Common Issues

1. **Chrome Driver Issues**
   ```bash
   pip install chromedriver-autoinstaller
   ```

2. **Database Connection Errors**
   - Check PostgreSQL is running
   - Verify connection credentials in `.env`
   - Ensure database exists

3. **Scraping Failures**
   - Check internet connection
   - Verify Wongnai website accessibility
   - Adjust `SCRAPING_DELAY` if rate limited

4. **Memory Issues**
   - Reduce `ETL_BATCH_SIZE`
   - Increase system memory
   - Enable data streaming for large datasets

### Logs

Check logs in the `logs/` directory:
- `data_pipeline.log` - General pipeline logs
- `wongnai_scraper.log` - Scraping logs
- `data_processor.log` - ETL logs
- `scheduler.log` - Job scheduling logs

## 🔄 Data Flow

1. **Scraping Stage**
   - Scrape restaurant listings from Wongnai
   - Extract detailed restaurant information
   - Scrape menu items and prices
   - Save raw data to data lake

2. **Processing Stage**
   - Load raw data from data lake
   - Clean and validate data
   - Enrich with additional features
   - Generate quality reports
   - Save processed data

3. **Loading Stage**
   - Load processed data into database
   - Handle upserts for existing records
   - Log ETL job statistics
   - Update data quality metrics

4. **Validation Stage**
   - Verify data integrity
   - Check business rules
   - Generate quality reports
   - Alert on issues

## 📚 API Integration

The processed data can be accessed through the BiteBase backend API:

```bash
# Get restaurants
GET /api/restaurants

# Get restaurant details
GET /api/restaurants/{id}

# Get menu items
GET /api/restaurants/{id}/menu

# Search restaurants
GET /api/restaurants/search?location=bangkok&cuisine=thai
```

## 🔐 Security

- Environment variables for sensitive data
- Rate limiting to respect website terms
- Data encryption in transit and at rest
- Access logging and monitoring
- Regular security updates

## 📝 License

This project is part of the BiteBase platform and is proprietary software.

## 🤝 Contributing

1. Follow the existing code structure
2. Add comprehensive logging
3. Include error handling
4. Write tests for new features
5. Update documentation

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review logs for error details
- Contact the development team