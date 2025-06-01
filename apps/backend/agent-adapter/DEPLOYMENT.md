# Deployment Guide

This guide covers how to deploy the BiteBase Agent Adapter to various environments.

## Local Deployment

### Prerequisites

- Node.js 14 or later
- npm or yarn

### Steps

1. Clone the repository or copy the agent adapter files
2. Install dependencies: `npm install`
3. Configure environment variables in `.env` file
4. Start the server: `npm start`

## Docker Deployment

### Prerequisites

- Docker
- Docker Compose (optional)

### Using Docker

1. Build the Docker image:
   ```bash
   docker build -t bitebase-agent-adapter .
   ```

2. Run the container:
   ```bash
   docker run -p 3002:3002 \
     -e AGENT_FASTAPI_URL=http://your-fastapi-url:8001 \
     -e AGENT_GATEWAY_URL=http://your-gateway-url:5000 \
     bitebase-agent-adapter
   ```

### Using Docker Compose

1. Modify `docker-compose.yml` to set the correct URLs for your agent services
2. Start the services:
   ```bash
   docker-compose up -d
   ```

## Cloud Deployment

### AWS Elastic Beanstalk

1. Initialize Elastic Beanstalk CLI:
   ```bash
   eb init
   ```

2. Create an Elastic Beanstalk environment:
   ```bash
   eb create bitebase-agent-adapter-production
   ```

3. Configure environment variables:
   ```bash
   eb setenv AGENT_FASTAPI_URL=http://your-fastapi-url:8001 AGENT_GATEWAY_URL=http://your-gateway-url:5000
   ```

4. Deploy the application:
   ```bash
   eb deploy
   ```

### Heroku

1. Create a `Procfile` with the following content:
   ```
   web: node agent-adapter.js
   ```

2. Create a Heroku app:
   ```bash
   heroku create bitebase-agent-adapter
   ```

3. Set environment variables:
   ```bash
   heroku config:set AGENT_FASTAPI_URL=http://your-fastapi-url:8001
   heroku config:set AGENT_GATEWAY_URL=http://your-gateway-url:5000
   ```

4. Deploy to Heroku:
   ```bash
   git push heroku main
   ```

### Google Cloud Run

1. Build and push the Docker image to Google Container Registry:
   ```bash
   gcloud builds submit --tag gcr.io/your-project/bitebase-agent-adapter
   ```

2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy bitebase-agent-adapter \
     --image gcr.io/your-project/bitebase-agent-adapter \
     --platform managed \
     --set-env-vars="AGENT_FASTAPI_URL=http://your-fastapi-url:8001,AGENT_GATEWAY_URL=http://your-gateway-url:5000"
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port to run the adapter on | 3002 |
| NODE_ENV | Node environment | production |
| AGENT_FASTAPI_URL | URL for the FastAPI agent service | http://localhost:8001 |
| AGENT_GATEWAY_URL | URL for the agent gateway service | http://localhost:5000 |
| RESEARCH_TIMEOUT | Timeout for research requests (ms) | 30000 |
| RESTAURANTS_TIMEOUT | Timeout for restaurant requests (ms) | 30000 |
| ANALYZE_TIMEOUT | Timeout for analysis requests (ms) | 45000 |
| GEOCODE_TIMEOUT | Timeout for geocoding requests (ms) | 15000 |
| HEALTH_TIMEOUT | Timeout for health checks (ms) | 5000 |

## Monitoring

### Health Check

You can monitor the health of the adapter and its connections to agent services by accessing the health endpoint:

```
GET /health
```

### Logging

The adapter logs all requests and errors to the console. In production environments, consider using a logging service like:

- AWS CloudWatch
- Google Cloud Logging
- Datadog
- Papertrail
- Loggly

### Performance Monitoring

For production deployments, consider using:

- New Relic
- Datadog
- Prometheus + Grafana

## Security Considerations

1. **Authentication**: The adapter doesn't include authentication by default. Consider adding authentication middleware for production deployments.

2. **HTTPS**: Always use HTTPS in production. Configure your reverse proxy (nginx, etc.) to handle SSL/TLS.

3. **Rate Limiting**: Add rate limiting to prevent abuse.

4. **Input Validation**: Validate all input parameters before forwarding to agent services.

## Scaling

The agent adapter can be scaled horizontally by deploying multiple instances behind a load balancer.

### Load Balancing

1. Deploy multiple instances of the adapter
2. Configure a load balancer (AWS ALB, Google Cloud Load Balancer, nginx, etc.)
3. Direct traffic to the instances

### Caching

To improve performance and reduce load on agent services, consider adding a caching layer:

```javascript
// Example using node-cache
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 minute TTL

app.get('/api/restaurants', async (req, res) => {
  try {
    const { latitude, longitude, radius, platforms } = req.query;
    
    // Create cache key from request parameters
    const cacheKey = `restaurants_${latitude}_${longitude}_${radius}_${platforms || 'all'}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    
    // Proceed with the actual request if not cached
    const response = await axios.get(`${AGENT_GATEWAY_URL}/api/restaurants`, {
      params: { latitude, longitude, radius, platforms },
      timeout: 30000
    });
    
    // Store result in cache
    cache.set(cacheKey, response.data);
    
    res.json(response.data);
  } catch (error) {
    // Error handling...
  }
});
``` 