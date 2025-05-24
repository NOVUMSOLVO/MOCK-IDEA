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
