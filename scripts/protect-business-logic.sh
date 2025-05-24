#!/bin/bash

# MOCK IDEA - Business Logic Protection Script
# This script helps protect proprietary algorithms and business logic
# before pushing to public repositories

set -e

echo "🔒 MOCK IDEA Business Logic Protection Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "backend/package.json" ]; then
    print_error "This script must be run from the MOCK IDEA root directory"
    exit 1
fi

print_status "Starting business logic protection process..."

# Create protected directories if they don't exist
mkdir -p .protected
mkdir -p .protected/algorithms
mkdir -p .protected/business-logic
mkdir -p .protected/ai-models

# Function to move sensitive files
protect_file() {
    local file_path="$1"
    local protected_path="$2"
    
    if [ -f "$file_path" ]; then
        print_status "Protecting: $file_path"
        mkdir -p "$(dirname ".protected/$protected_path")"
        mv "$file_path" ".protected/$protected_path"
        
        # Create a placeholder file
        cat > "$file_path" << EOF
// PROTECTED: This file contains proprietary business logic
// Original file moved to .protected/ directory
// Contact: licensing@mockidea.com for commercial access

export default function protectedFunction() {
    throw new Error('This functionality requires a commercial license. Contact licensing@mockidea.com');
}
EOF
        print_success "Protected: $file_path"
    fi
}

# Function to obfuscate sensitive code
obfuscate_file() {
    local file_path="$1"
    
    if [ -f "$file_path" ]; then
        print_status "Obfuscating: $file_path"
        
        # Create backup
        cp "$file_path" ".protected/$(basename "$file_path").backup"
        
        # Replace sensitive content with placeholders
        sed -i.bak 's/\/\/ PROPRIETARY:.*/\/\/ PROPRIETARY: Content removed for public repository/g' "$file_path"
        sed -i.bak 's/\/\* BUSINESS_LOGIC_START \*\/.*\/\* BUSINESS_LOGIC_END \*\//\/\* BUSINESS_LOGIC: Removed for public repository \*\//g' "$file_path"
        
        # Remove backup files
        rm -f "$file_path.bak"
        
        print_success "Obfuscated: $file_path"
    fi
}

print_status "Protecting AI service algorithms..."

# Protect AI service proprietary algorithms
if [ -d "ai-service" ]; then
    # Move proprietary AI models
    protect_file "ai-service/models/proprietary_model.pkl" "ai-models/proprietary_model.pkl"
    protect_file "ai-service/algorithms/style_detection.py" "algorithms/style_detection.py"
    protect_file "ai-service/algorithms/complexity_analysis.py" "algorithms/complexity_analysis.py"
    protect_file "ai-service/training_data/" "ai-models/training_data/"
    
    # Create public-safe AI service
    if [ -f "ai-service/main.py" ]; then
        print_status "Creating public-safe AI service..."
        cp "ai-service/main.py" ".protected/ai-service-main.py.backup"
        
        # Replace proprietary functions with placeholders
        cat > "ai-service/main.py" << 'EOF'
# MOCK IDEA AI Service - Public Version
# Proprietary algorithms removed for public repository
# Contact licensing@mockidea.com for commercial access

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging

app = FastAPI(title="MOCK IDEA AI Service (Public)", version="1.0.0")

class AnalyzeLogoRequest(BaseModel):
    image: str
    colors: list

class AnalyzeLogoResponse(BaseModel):
    style: str
    complexity: int
    hasText: bool
    recommendedCategories: list

@app.post("/analyze-logo", response_model=AnalyzeLogoResponse)
async def analyze_logo(request: AnalyzeLogoRequest):
    """
    Logo analysis endpoint - Public version with limited functionality
    Full AI analysis requires commercial license
    """
    raise HTTPException(
        status_code=501,
        detail="Advanced AI analysis requires commercial license. Contact licensing@mockidea.com"
    )

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Public AI service - Limited functionality"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF
        print_success "Created public-safe AI service"
    fi
fi

print_status "Protecting backend business logic..."

# Protect backend proprietary algorithms
if [ -d "backend/src" ]; then
    # Move pricing algorithms
    protect_file "backend/src/services/pricingEngine.ts" "business-logic/pricingEngine.ts"
    protect_file "backend/src/services/subscriptionLogic.ts" "business-logic/subscriptionLogic.ts"
    
    # Move template processing algorithms
    protect_file "backend/src/services/templateProcessor.ts" "algorithms/templateProcessor.ts"
    protect_file "backend/src/services/mockupGenerator.ts" "algorithms/mockupGenerator.ts"
    protect_file "backend/src/services/imageProcessor.ts" "algorithms/imageProcessor.ts"
    
    # Obfuscate remaining sensitive files
    find backend/src -name "*.ts" -exec grep -l "PROPRIETARY\|BUSINESS_LOGIC" {} \; | while read file; do
        obfuscate_file "$file"
    done
fi

print_status "Protecting frontend proprietary components..."

# Protect frontend business logic
if [ -d "frontend/src" ]; then
    # Move proprietary components
    protect_file "frontend/src/components/premium/AdvancedEditor.tsx" "business-logic/AdvancedEditor.tsx"
    protect_file "frontend/src/hooks/usePremiumFeatures.ts" "business-logic/usePremiumFeatures.ts"
    
    # Obfuscate pricing display logic
    find frontend/src -name "*.tsx" -o -name "*.ts" | xargs grep -l "PROPRIETARY\|BUSINESS_LOGIC" | while read file; do
        obfuscate_file "$file"
    done
fi

print_status "Creating public documentation..."

# Create public-safe documentation
cat > "COMMERCIAL_LICENSE.md" << 'EOF'
# 💼 Commercial License Information

## Overview

MOCK IDEA contains proprietary algorithms and business logic that are not included in this public repository. The public version provides a foundation for evaluation and educational purposes.

## What's Protected

### 🤖 AI Algorithms
- Advanced logo style detection
- Complexity analysis algorithms
- Smart template recommendation engine
- Image processing optimizations

### 💰 Business Logic
- Pricing calculation engines
- Subscription management logic
- Usage tracking and analytics
- Premium feature implementations

### 🎨 Template Processing
- Advanced mockup generation algorithms
- Image composition techniques
- Quality optimization processes
- Batch processing capabilities

## Commercial Licensing

For access to the complete platform with all proprietary features:

- **Email**: licensing@mockidea.com
- **Website**: https://mockidea.com/enterprise
- **Phone**: Available upon request

### License Tiers

1. **Startup License** - For small businesses and startups
2. **Enterprise License** - For large organizations
3. **White-label License** - For agencies and resellers
4. **Source Code License** - Full source code access

## What You Get

### Public Repository
- ✅ Basic project structure
- ✅ Authentication system
- ✅ Database schema
- ✅ Frontend framework
- ✅ API endpoints structure
- ❌ Proprietary algorithms
- ❌ Advanced AI features
- ❌ Business logic

### Commercial License
- ✅ Complete source code
- ✅ Proprietary AI algorithms
- ✅ Advanced business logic
- ✅ Premium features
- ✅ Technical support
- ✅ Updates and maintenance
- ✅ Commercial usage rights

## Contact Us

Ready to unlock the full potential of MOCK IDEA?

**Email**: licensing@mockidea.com
**Subject**: Commercial License Inquiry
**Include**: Your use case, team size, and requirements

We'll respond within 24 hours with a customized proposal.
EOF

print_status "Updating .gitignore for protected content..."

# Add protected directories to .gitignore
cat >> ".gitignore" << 'EOF'

# ================================
# PROTECTED BUSINESS LOGIC
# ================================
.protected/
*.backup
proprietary/
business-logic/
algorithms/private/
models/proprietary/
EOF

print_status "Creating protection verification script..."

# Create verification script
cat > "scripts/verify-protection.sh" << 'EOF'
#!/bin/bash

echo "🔍 Verifying business logic protection..."

# Check for sensitive patterns
echo "Checking for exposed proprietary content..."

SENSITIVE_PATTERNS=(
    "PROPRIETARY:"
    "BUSINESS_LOGIC_START"
    "CONFIDENTIAL:"
    "TRADE_SECRET:"
    "pricing.*algorithm"
    "subscription.*logic"
)

for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    if grep -r "$pattern" --exclude-dir=.protected --exclude-dir=node_modules --exclude-dir=.git .; then
        echo "⚠️  WARNING: Found potentially sensitive content: $pattern"
    fi
done

echo "✅ Protection verification complete"
EOF

chmod +x "scripts/verify-protection.sh"

print_status "Creating restore script for development..."

# Create restore script for development
cat > "scripts/restore-business-logic.sh" << 'EOF'
#!/bin/bash

echo "🔓 Restoring business logic for development..."

if [ ! -d ".protected" ]; then
    echo "❌ No protected files found. Nothing to restore."
    exit 1
fi

# Restore protected files
find .protected -type f | while read protected_file; do
    original_path="${protected_file#.protected/}"
    if [ -f "$original_path" ]; then
        echo "Restoring: $original_path"
        cp "$protected_file" "$original_path"
    fi
done

echo "✅ Business logic restored for development"
echo "⚠️  Remember to run protect-business-logic.sh before committing!"
EOF

chmod +x "scripts/restore-business-logic.sh"

print_success "Business logic protection complete!"
print_warning "Protected files moved to .protected/ directory"
print_warning "Run 'scripts/restore-business-logic.sh' to restore for development"
print_warning "Run 'scripts/verify-protection.sh' to verify protection before pushing"

echo ""
echo "📋 Next Steps:"
echo "1. Review protected files in .protected/ directory"
echo "2. Test the public version to ensure it works"
echo "3. Run verification script before pushing to GitHub"
echo "4. Update documentation as needed"
echo ""
echo "🔒 Your business logic is now protected!"
