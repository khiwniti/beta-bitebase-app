# Multi-stage Dockerfile for BiteBase Backend
# Optimized for production deployment on Render.com

# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ git curl

# Copy package files
COPY package.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm install

# Copy source code
COPY . .

# Build any necessary assets (if you have build scripts)
RUN npm run build 2>/dev/null || echo "No build script found"

# Stage 2: Production stage
FROM node:18-alpine AS production

# Install system dependencies for production
RUN apk add --no-cache \
    curl \
    dumb-init \
    python3 \
    make \
    g++ \
    postgresql-client \
    redis \
    ca-certificates

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S bitebase -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install only production dependencies
RUN npm install --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=bitebase:nodejs /app .

# Remove unnecessary files for smaller image
RUN rm -rf \
    .git \
    .gitignore \
    .dockerignore \
    README*.md \
    docs \
    tests \
    *.test.js \
    *.spec.js \
    node_modules/.cache

# Create necessary directories
RUN mkdir -p logs temp uploads cache && \
    chown -R bitebase:nodejs logs temp uploads cache

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Switch to non-root user
USER bitebase

# Expose port
EXPOSE 3001

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server-production.js"]