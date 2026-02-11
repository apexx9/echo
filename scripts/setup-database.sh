#!/bin/bash

# Echo Database Setup Script for Render
# This script sets up PostgreSQL database with required extensions and schema

set -e  # Exit on any error

echo "🚀 Starting Echo database setup for Render..."

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is required"
    exit 1
fi

if [ -z "$GOOGLE_GENERATIVE_AI_API_KEY" ]; then
    echo "⚠️  GOOGLE_GENERATIVE_AI_API_KEY not set, AI features will not work"
fi

echo "📦 Installing dependencies..."
npm install

echo "🗄️  Generating Prisma client..."
npx prisma generate

echo "🏗️  Running database migrations..."
npx prisma db push

echo "🔧 Running custom migration script..."
# Execute the migration SQL
psql "$DATABASE_URL" -f scripts/migrate.sql

echo "🌱 Seeding database with sample data..."
npx prisma db seed

echo "✅ Database setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Set your environment variables in Render dashboard"
echo "   2. Deploy your application"
echo "   3. Test the database connection"
echo ""
echo "🔗 Environment variables needed:"
echo "   - DATABASE_URL (provided by Render PostgreSQL addon)"
echo "   - GOOGLE_GENERATIVE_AI_API_KEY"
echo "   - NEXTAUTH_URL"
echo "   - NEXTAUTH_SECRET"
