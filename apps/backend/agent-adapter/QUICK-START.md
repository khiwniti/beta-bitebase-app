# BiteBase Agent Adapter Quick Start Guide

This guide will help you quickly get started with the BiteBase Agent Adapter.

## 1. Prerequisites

- Node.js 14 or later
- npm or yarn
- Access to BiteBase agent services (FastAPI and Gateway)

## 2. Installation

### Option 1: Using the setup script

The easiest way to install the agent adapter is using the provided setup script:

```bash
# Make the script executable
chmod +x setup-agent-adapter.sh

# Run the setup script
./setup-agent-adapter.sh
```

### Option 2: Manual installation

If you prefer to install manually:

```bash
# Create a directory for the agent adapter
mkdir -p agent-adapter
cd agent-adapter

# Copy the necessary files
# (You'll need to copy agent-adapter.js, config.js, logger.js, etc.)

# Install dependencies
npm install
```

## 3. Configuration

The agent adapter uses environment variables for configuration. You can set these in a `.env` file:

```bash
# Create a .env file
cat > .env << EOL
# Server settings
PORT=3002
HOST=0.0.0.0
NODE_ENV=development

# Agent service URLs
AGENT_FASTAPI_URL=http://localhost:8001
AGENT_GATEWAY_URL=http://localhost:5000

# Timeout settings (milliseconds)
RESEARCH_TIMEOUT=30000
RESTAURANTS_TIMEOUT=30000
ANALYZE_TIMEOUT=45000
GEOCODE_TIMEOUT=15000
HEALTH_TIMEOUT=5000

# CORS settings
CORS_ORIGIN=*
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Origin,X-Requested-With,Content-Type,Accept,Authorization

# Logging settings
LOG_LEVEL=info
ENABLE_LOGGING=true
EOL
```

Update the URLs to point to your BiteBase agent services.

## 4. Running the Adapter

### Start the adapter

```bash
npm start
```

Or use the start script:

```bash
# Make the script executable
chmod +x start-agent.sh

# Run the start script
./start-agent.sh
```

### Running in development mode

```bash
npm run dev
```

This will start the adapter with nodemon, which will automatically restart when you make changes.

## 5. Testing

To test that the adapter is working correctly:

```bash
# Run the test script
npm test
```

## 6. Using the Adapter

Once the adapter is running, you can use it to interact with the BiteBase agent system:

### Health Check

```bash
curl http://localhost:3002/health
```

### Research

```bash
curl -X POST http://localhost:3002/api/research \
  -H "Content-Type: application/json" \
  -d '{"query": "Thai restaurant business model", "type": "restaurant"}'
```

### Restaurants

```bash
curl "http://localhost:3002/api/restaurants?latitude=40.7128&longitude=-74.0060&radius=5"
```

### Market Analysis

```bash
curl "http://localhost:3002/api/analyze?latitude=40.7128&longitude=-74.0060&radius=5&analysis_type=comprehensive"
```

### Geocoding

```bash
curl "http://localhost:3002/api/geocode?address=350%205th%20Ave%2C%20New%20York%2C%20NY%2010118"
```

## 7. Next Steps

- Review the full [README.md](./README.md) for detailed documentation
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide for production deployment options
- See [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) for examples of how to integrate with frontend frameworks

## 8. Troubleshooting

### Common Issues

1. **Connection refused errors**:
   - Ensure the agent services (FastAPI and Gateway) are running
   - Check that the URLs in the `.env` file are correct

2. **Port already in use**:
   - Change the port in the `.env` file
   - Or stop the process using the port: `kill $(lsof -t -i:3002)`

3. **Permission denied**:
   - Ensure the scripts have execute permissions: `chmod +x *.sh`

4. **Missing dependencies**:
   - Run `npm install` to install dependencies

### Checking Logs

Logs are stored in the `logs` directory:

```bash
# View the most recent logs
tail -f logs/combined.log

# View error logs
tail -f logs/error.log
``` 