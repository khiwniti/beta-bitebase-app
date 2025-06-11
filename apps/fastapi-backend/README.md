# BiteBase FastAPI Backend

A complete serverless FastAPI backend for the BiteBase restaurant discovery and management platform.

## 🚀 Features

- **Complete Restaurant Management**: CRUD operations for restaurants, reviews, and menu items
- **AI-Powered Assistant**: Market research, business insights, and recommendations
- **User Management**: Authentication, profiles, and role-based access
- **Market Analysis**: Comprehensive market research and analytics
- **External API Integration**: Wongnai, Google Places, and Yelp integration
- **Admin Dashboard**: System management and analytics
- **Serverless Architecture**: Optimized for cloud deployment
- **Production Ready**: Comprehensive logging, error handling, and monitoring

## 🏗️ Architecture

```
app/
├── api/                    # API routes and endpoints
│   └── api_v1/
│       ├── api.py         # Main API router
│       └── endpoints/     # Individual endpoint modules
├── core/                  # Core functionality
│   ├── config.py         # Configuration management
│   ├── security.py       # Authentication and security
│   ├── exceptions.py     # Custom exceptions
│   └── logging.py        # Logging configuration
├── db/                   # Database configuration
│   └── database.py       # SQLAlchemy setup
├── models/               # SQLAlchemy models
├── schemas/              # Pydantic schemas
├── services/             # Business logic layer
└── main.py              # FastAPI application entry point
```

## 🛠️ Technology Stack

- **Framework**: FastAPI 0.104.1
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens with bcrypt
- **AI Integration**: OpenAI GPT for intelligent features
- **Caching**: Redis for performance optimization
- **Validation**: Pydantic for data validation
- **Migrations**: Alembic for database migrations
- **Monitoring**: Structured logging with structlog
- **Rate Limiting**: slowapi for API rate limiting

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 14+
- Redis (optional, for caching)

### Local Development

1. **Clone and navigate to the backend directory**:
   ```bash
   cd apps/fastapi-backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run database migrations**:
   ```bash
   alembic upgrade head
   ```

6. **Start the development server**:
   ```bash
   ./start.sh
   # Or manually: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000`

### Docker Development

1. **Build and run with Docker**:
   ```bash
   docker build -t bitebase-api .
   docker run -p 8000:8000 --env-file .env bitebase-api
   ```

## 🌐 Deployment

### Render.com Deployment

1. **Connect your repository** to Render.com

2. **Use the provided render.yaml** configuration:
   - The `render.yaml` file contains all necessary configuration
   - Environment variables are automatically managed
   - Database and Redis are provisioned automatically

3. **Set required environment variables**:
   ```bash
   DATABASE_URL=postgresql://...  # Auto-provided by Render
   JWT_SECRET_KEY=your-secret-key
   OPENAI_API_KEY=your-openai-key  # Optional
   STRIPE_SECRET_KEY=your-stripe-key  # Optional
   ```

4. **Deploy**:
   - Push to your main branch
   - Render will automatically build and deploy

### Manual Cloud Deployment

For AWS, GCP, or Azure deployment:

1. **Build Docker image**:
   ```bash
   docker build -t bitebase-api .
   ```

2. **Push to container registry**:
   ```bash
   docker tag bitebase-api your-registry/bitebase-api
   docker push your-registry/bitebase-api
   ```

3. **Deploy to your cloud platform** with appropriate environment variables

## 📚 API Documentation

### Interactive Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Main Endpoints

#### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user

#### Restaurants
- `GET /api/v1/restaurants` - List restaurants
- `GET /api/v1/restaurants/search` - Search restaurants
- `POST /api/v1/restaurants` - Create restaurant
- `GET /api/v1/restaurants/{id}` - Get restaurant details
- `PUT /api/v1/restaurants/{id}` - Update restaurant
- `DELETE /api/v1/restaurants/{id}` - Delete restaurant

#### AI Assistant
- `POST /api/v1/ai/chat` - Chat with AI assistant
- `POST /api/v1/ai/market-research` - AI market research
- `POST /api/v1/ai/market-analysis` - Market analysis
- `POST /api/v1/ai/restaurant-recommendations` - Get recommendations

#### Market Analysis
- `GET /api/v1/market-analyses` - List analyses
- `POST /api/v1/market-analyses` - Create analysis
- `GET /api/v1/market-analyses/{id}` - Get analysis
- `POST /api/v1/market-analyses/{id}/process` - Process analysis

#### Admin
- `GET /api/v1/admin/dashboard` - Admin dashboard
- `GET /api/v1/admin/users` - Manage users
- `GET /api/v1/admin/analytics` - System analytics

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `JWT_SECRET_KEY` | Secret key for JWT tokens | Yes | - |
| `ENVIRONMENT` | Environment (development/production) | No | development |
| `DEBUG` | Enable debug mode | No | True |
| `ALLOWED_ORIGINS` | CORS allowed origins | No | * |
| `REDIS_URL` | Redis connection string | No | - |
| `OPENAI_API_KEY` | OpenAI API key for AI features | No | - |
| `STRIPE_SECRET_KEY` | Stripe secret key for payments | No | - |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key | No | - |
| `AWS_ACCESS_KEY_ID` | AWS access key for S3 | No | - |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for S3 | No | - |
| `AWS_BUCKET_NAME` | S3 bucket for file uploads | No | - |
| `SENTRY_DSN` | Sentry DSN for error tracking | No | - |

### Database Configuration

The application uses PostgreSQL with SQLAlchemy ORM. Database migrations are managed with Alembic.

**Create a new migration**:
```bash
alembic revision --autogenerate -m "Description of changes"
```

**Apply migrations**:
```bash
alembic upgrade head
```

## 🧪 Testing

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# Run with coverage
pytest --cov=app tests/
```

### Test Structure

```
tests/
├── conftest.py           # Test configuration
├── test_auth.py         # Authentication tests
├── test_restaurants.py  # Restaurant API tests
├── test_ai.py          # AI assistant tests
└── test_admin.py       # Admin functionality tests
```

## 🔒 Security

### Authentication

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on sensitive endpoints
- CORS protection

### Data Protection

- Input validation with Pydantic
- SQL injection prevention with SQLAlchemy
- XSS protection with proper data sanitization
- Environment-based configuration

## 📊 Monitoring and Logging

### Structured Logging

The application uses structured logging with `structlog`:

```python
import structlog
logger = structlog.get_logger()
logger.info("User action", user_id=user_id, action="login")
```

### Health Checks

- `GET /health` - Application health status
- `GET /api/v1/ai` - AI service status

### Metrics

- Request/response times
- Error rates
- Database connection status
- External API status

## 🤝 Integration with Frontend

The FastAPI backend is designed to work seamlessly with the Next.js frontend:

### API Client Configuration

Update your frontend API client to use the FastAPI backend:

```typescript
// In your frontend API client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';
```

### Authentication Flow

1. User registers/logs in via `/api/v1/auth/login`
2. Frontend receives JWT access token and refresh token
3. Include access token in Authorization header: `Bearer <token>`
4. Refresh token when needed via `/api/v1/auth/refresh`

## 🚀 Performance Optimization

### Caching Strategy

- Redis caching for frequently accessed data
- AI response caching to reduce API costs
- Database query optimization with proper indexing

### Database Optimization

- Connection pooling with SQLAlchemy
- Proper database indexes
- Query optimization and monitoring

### API Performance

- Rate limiting to prevent abuse
- Async/await for non-blocking operations
- Efficient pagination for large datasets

## 🔄 CI/CD Pipeline

### GitHub Actions (Recommended)

```yaml
name: Deploy to Render
on:
  push:
    branches: [main]
    paths: ['apps/fastapi-backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        uses: render-deploy/action@v1
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

## 📈 Scaling Considerations

### Horizontal Scaling

- Stateless application design
- Database connection pooling
- Load balancer compatibility

### Vertical Scaling

- Configurable worker processes
- Memory optimization
- CPU-intensive task optimization

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**:
   ```bash
   # Check DATABASE_URL format
   postgresql://username:password@host:port/database
   ```

2. **Migration Issues**:
   ```bash
   # Reset migrations (development only)
   alembic downgrade base
   alembic upgrade head
   ```

3. **Import Errors**:
   ```bash
   # Ensure PYTHONPATH is set
   export PYTHONPATH=/app
   ```

### Debug Mode

Enable debug mode for detailed error messages:

```bash
export DEBUG=True
export ENVIRONMENT=development
```

## 📞 Support

For issues and questions:

1. Check the [API documentation](http://localhost:8000/docs)
2. Review the logs for error details
3. Check environment variable configuration
4. Verify database connectivity

## 🔮 Future Enhancements

- [ ] WebSocket support for real-time features
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Advanced caching strategies
- [ ] Microservices architecture migration
- [ ] GraphQL API support

## 📄 License

This project is part of the BiteBase platform. See the main repository for license information.