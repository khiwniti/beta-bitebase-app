#!/bin/bash

# Initialize the BiteBase database
set -e

echo "Initializing BiteBase database..."

# Copy schema.sql to container
docker cp database/schema.sql bitebase-postgres:/tmp/schema.sql

# Execute schema.sql
docker exec bitebase-postgres psql -U postgres -d bitebase -f /tmp/schema.sql

# Verify tables were created
docker exec bitebase-postgres psql -U postgres -d bitebase -c "\dt"

echo "Database initialization complete!" 