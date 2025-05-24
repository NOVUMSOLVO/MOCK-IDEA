#!/bin/bash

echo "🚀 Setting up MOCK IDEA Backend for Development"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed or not in PATH."
    echo "Please install PostgreSQL or update your PATH."
    echo "Alternatively, you can use Docker to run PostgreSQL:"
    echo "docker run --name mock-idea-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=mock_idea -p 5432:5432 -d postgres:15"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Check if database exists and is accessible
echo "🗄️  Checking database connection..."
if npx prisma db push --accept-data-loss; then
    echo "✅ Database schema updated successfully"
else
    echo "❌ Failed to connect to database. Please check your DATABASE_URL in .env"
    echo "Make sure PostgreSQL is running and the database exists."
    exit 1
fi

# Seed the database
echo "🌱 Seeding database with sample data..."
if npm run db:seed; then
    echo "✅ Database seeded successfully"
else
    echo "⚠️  Database seeding failed, but continuing..."
fi

echo ""
echo "🎉 Backend setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "The server will be available at http://localhost:3001"
echo ""
echo "Demo credentials:"
echo "  Email: demo@mockidea.com"
echo "  Password: demo123"
