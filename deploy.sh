#!/bin/bash

# Production Deployment Script
# This script helps deploy the application to production

set -e

echo "==================================="
echo "Bulletin Board Production Deployment"
echo "==================================="
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found"
    echo "Please create .env.production file from .env.production.example"
    echo "Run: cp .env.production.example .env.production"
    echo "Then edit .env.production with your production values"
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Load environment variables
set -a
source .env.production
set +a

# Build and start services
echo "📦 Building Docker images..."
docker-compose -f docker-compose.prod.yml --env-file .env.production build

echo ""
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo ""
echo "🔍 Checking service status..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "✅ Deployment completed!"
echo ""
echo "Service URLs:"
echo "- Frontend: http://localhost:${FRONTEND_PORT:-3000}"
echo "- Backend: http://localhost:${BACKEND_PORT:-3001}"
echo ""
echo "To view logs, run:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "To stop services, run:"
echo "  docker-compose -f docker-compose.prod.yml down"
echo ""
