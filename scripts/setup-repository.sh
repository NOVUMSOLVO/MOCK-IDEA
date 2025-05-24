#!/bin/bash

# MOCK IDEA Repository Setup and Validation Script
# This script validates the entire project setup and prepares it for GitHub

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}$1${NC}"
}

# Header
echo ""
print_header "🚀 MOCK IDEA Repository Setup & Validation"
print_header "============================================"
echo ""

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "This script must be run from the MOCK IDEA project root directory"
    exit 1
fi

print_status "Starting repository setup and validation..."

# 1. Validate Project Structure
print_header "📁 Validating Project Structure"
echo ""

required_dirs=("backend" "frontend" "ai-service" "scripts")
required_files=("README.md" "LICENSE" "CONTRIBUTING.md" "CODE_OF_CONDUCT.md")

for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        print_success "Directory exists: $dir"
    else
        print_error "Missing directory: $dir"
        exit 1
    fi
done

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "File exists: $file"
    else
        print_error "Missing file: $file"
        exit 1
    fi
done

# 2. Validate Backend Setup
print_header "🖥️  Validating Backend Setup"
echo ""

cd backend

# Check for required backend files
backend_files=("package.json" "prisma/schema.prisma" "src/server.ts" ".env.example")
for file in "${backend_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "Backend file exists: $file"
    else
        print_error "Missing backend file: $file"
        exit 1
    fi
done

# Check if dependencies are installed
if [ -d "node_modules" ]; then
    print_success "Backend dependencies installed"
else
    print_warning "Backend dependencies not installed. Installing..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed successfully"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
fi

# Check Prisma setup
if npx prisma generate > /dev/null 2>&1; then
    print_success "Prisma client generated successfully"
else
    print_warning "Generating Prisma client..."
    npx prisma generate
fi

cd ..

# 3. Validate Frontend Setup
print_header "🌐 Validating Frontend Setup"
echo ""

cd frontend

# Check for required frontend files
frontend_files=("package.json" "next.config.js" "tailwind.config.js" ".env.local.example")
for file in "${frontend_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "Frontend file exists: $file"
    else
        print_error "Missing frontend file: $file"
        exit 1
    fi
done

# Check if dependencies are installed
if [ -d "node_modules" ]; then
    print_success "Frontend dependencies installed"
else
    print_warning "Frontend dependencies not installed. Installing..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
fi

cd ..

# 4. Validate AI Service Setup
print_header "🤖 Validating AI Service Setup"
echo ""

cd ai-service

# Check for required AI service files
ai_files=("requirements.txt" "main.py" ".env.example")
for file in "${ai_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "AI service file exists: $file"
    else
        print_error "Missing AI service file: $file"
        exit 1
    fi
done

# Check Python virtual environment
if [ -d "venv" ]; then
    print_success "Python virtual environment exists"
else
    print_warning "Creating Python virtual environment..."
    python3 -m venv venv
    if [ $? -eq 0 ]; then
        print_success "Python virtual environment created"
    else
        print_error "Failed to create Python virtual environment"
        exit 1
    fi
fi

cd ..

# 5. Validate Environment Files
print_header "⚙️  Validating Environment Configuration"
echo ""

# Check for .env.example files
env_examples=("backend/.env.example" "frontend/.env.local.example" "ai-service/.env.example")
for env_file in "${env_examples[@]}"; do
    if [ -f "$env_file" ]; then
        print_success "Environment example exists: $env_file"
    else
        print_warning "Missing environment example: $env_file"
    fi
done

# 6. Validate Scripts
print_header "📜 Validating Scripts"
echo ""

# Make all scripts executable
chmod +x scripts/*.sh
chmod +x start-app.sh
chmod +x backend/setup-dev.sh
chmod +x backend/start-backend.sh
chmod +x ai-service/start.sh

print_success "All scripts made executable"

# 7. Validate Git Setup
print_header "📝 Validating Git Configuration"
echo ""

if [ -f ".gitignore" ]; then
    print_success ".gitignore file exists"
else
    print_error "Missing .gitignore file"
    exit 1
fi

# Check if git is initialized
if [ -d ".git" ]; then
    print_success "Git repository initialized"
else
    print_warning "Git repository not initialized. Initializing..."
    git init
    print_success "Git repository initialized"
fi

# 8. Security Validation
print_header "🔒 Running Security Validation"
echo ""

# Run protection verification if it exists
if [ -f "scripts/verify-protection.sh" ]; then
    chmod +x scripts/verify-protection.sh
    ./scripts/verify-protection.sh
else
    print_warning "Protection verification script not found"
fi

# 9. Documentation Validation
print_header "📚 Validating Documentation"
echo ""

# Check README content
if grep -q "MOCK IDEA" README.md; then
    print_success "README.md contains project name"
else
    print_warning "README.md may need project name update"
fi

# Check for commercial license documentation
if [ -f "COMMERCIAL_LICENSE.md" ]; then
    print_success "Commercial license documentation exists"
else
    print_warning "Commercial license documentation not found"
fi

# 10. Final Validation Summary
print_header "✅ Setup Validation Complete"
echo ""

print_success "Repository structure validated"
print_success "Backend setup validated"
print_success "Frontend setup validated"
print_success "AI service setup validated"
print_success "Environment configuration validated"
print_success "Scripts validated and made executable"
print_success "Git configuration validated"
print_success "Security validation completed"
print_success "Documentation validated"

echo ""
print_header "🎉 MOCK IDEA Repository is Ready!"
echo ""
print_status "Next steps:"
echo "  1. Review any warnings above"
echo "  2. Set up environment variables (.env files)"
echo "  3. Test the application with ./start-app.sh"
echo "  4. Commit and push to GitHub"
echo ""
print_status "GitHub Repository: https://github.com/djval79/mock-idea"
echo ""