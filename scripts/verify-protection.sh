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
