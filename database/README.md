# BiteBase Database Initialization

This directory contains scripts and configuration for initializing the BiteBase database.

## Database Options

BiteBase can use either:

1. **Local PostgreSQL Database** (Development)
   - Uses Docker container with PostGIS extension
   - Used for local development and testing

2. **Neon.tech PostgreSQL Database** (Staging/Production)
   - Cloud-hosted PostgreSQL with automatic scaling
   - Used for staging and production environments

## Database Schema

The database schema is defined in `schema.sql` and includes the following tables:
- `users` - User accounts and profiles
- `restaurants` - Restaurant data including location information
- `market_analyses` - Market analysis results
- `user_profiles` - Extended user profile data
- `ai_cache` - Cached AI responses
- `subscriptions` - User subscription information

## Initialization Instructions

### Option 1: Using Neon.tech Database (Recommended for Staging/Production)

The following scripts will initialize the Neon.tech database:

```bash
# Install required Python package
pip install psycopg2-binary

# Initialize the database (non-interactive)
python database/init_neon_db_auto.py

# Or, to force recreation of existing tables:
python database/init_neon_db_auto.py --force

# Alternatively, use the shell script:
./database/init_neon_db.sh
```

The connection string for the Neon.tech database is:
```
postgresql://bitebasedb_staging_owner:npg_vzp02ERAaXoQ@ep-damp-tooth-a4orgq86-pooler.us-east-1.aws.neon.tech/bitebasedb_staging?sslmode=require
```

### Option 2: Using Local PostgreSQL (Development Only)

```bash
# Start PostgreSQL container
docker run -d --name bitebase-postgres \
    -e POSTGRES_DB=bitebase \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=password \
    -p 5432:5432 \
    postgis/postgis:15-3.3

# Copy schema to container and execute
docker cp database/schema.sql bitebase-postgres:/tmp/schema.sql
docker exec bitebase-postgres psql -U postgres -d bitebase -f /tmp/schema.sql

# Verify tables were created
docker exec bitebase-postgres psql -U postgres -d bitebase -c "\dt"
```

## Backend Configuration

The backend is configured to use either database based on the `USE_NEON_DB` setting in the configuration.

- In `development` mode, this can be toggled manually
- In `staging` and `production` modes, Neon.tech is used by default

To update the configuration, edit `apps/user-backend/app/core/config.py`. 