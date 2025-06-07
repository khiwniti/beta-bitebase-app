#!/bin/bash

# Script to update all pages with new brand theme colors

echo "Updating BiteBase theme colors across all pages..."

# Find all TypeScript/TSX files
find . -name "*.tsx" -o -name "*.ts" | while read file; do
    echo "Processing: $file"
    
    # Update green colors to primary
    sed -i 's/bg-green-50/bg-primary-50/g' "$file"
    sed -i 's/bg-green-100/bg-primary-100/g' "$file"
    sed -i 's/bg-green-200/bg-primary-200/g' "$file"
    sed -i 's/bg-green-300/bg-primary-300/g' "$file"
    sed -i 's/bg-green-400/bg-primary-400/g' "$file"
    sed -i 's/bg-green-500/bg-primary-500/g' "$file"
    sed -i 's/bg-green-600/bg-primary-600/g' "$file"
    sed -i 's/bg-green-700/bg-primary-700/g' "$file"
    sed -i 's/bg-green-800/bg-primary-800/g' "$file"
    sed -i 's/bg-green-900/bg-primary-900/g' "$file"
    
    # Update text colors
    sed -i 's/text-green-50/text-primary-50/g' "$file"
    sed -i 's/text-green-100/text-primary-100/g' "$file"
    sed -i 's/text-green-200/text-primary-200/g' "$file"
    sed -i 's/text-green-300/text-primary-300/g' "$file"
    sed -i 's/text-green-400/text-primary-400/g' "$file"
    sed -i 's/text-green-500/text-primary-500/g' "$file"
    sed -i 's/text-green-600/text-primary-600/g' "$file"
    sed -i 's/text-green-700/text-primary-700/g' "$file"
    sed -i 's/text-green-800/text-primary-800/g' "$file"
    sed -i 's/text-green-900/text-primary-900/g' "$file"
    
    # Update border colors
    sed -i 's/border-green-50/border-primary-50/g' "$file"
    sed -i 's/border-green-100/border-primary-100/g' "$file"
    sed -i 's/border-green-200/border-primary-200/g' "$file"
    sed -i 's/border-green-300/border-primary-300/g' "$file"
    sed -i 's/border-green-400/border-primary-400/g' "$file"
    sed -i 's/border-green-500/border-primary-500/g' "$file"
    sed -i 's/border-green-600/border-primary-600/g' "$file"
    sed -i 's/border-green-700/border-primary-700/g' "$file"
    sed -i 's/border-green-800/border-primary-800/g' "$file"
    sed -i 's/border-green-900/border-primary-900/g' "$file"
    
    # Update hover states
    sed -i 's/hover:bg-green-50/hover:bg-primary-50/g' "$file"
    sed -i 's/hover:bg-green-100/hover:bg-primary-100/g' "$file"
    sed -i 's/hover:bg-green-200/hover:bg-primary-200/g' "$file"
    sed -i 's/hover:bg-green-300/hover:bg-primary-300/g' "$file"
    sed -i 's/hover:bg-green-400/hover:bg-primary-400/g' "$file"
    sed -i 's/hover:bg-green-500/hover:bg-primary-500/g' "$file"
    sed -i 's/hover:bg-green-600/hover:bg-primary-600/g' "$file"
    sed -i 's/hover:bg-green-700/hover:bg-primary-700/g' "$file"
    sed -i 's/hover:bg-green-800/hover:bg-primary-800/g' "$file"
    sed -i 's/hover:bg-green-900/hover:bg-primary-900/g' "$file"
    
    sed -i 's/hover:text-green-50/hover:text-primary-50/g' "$file"
    sed -i 's/hover:text-green-100/hover:text-primary-100/g' "$file"
    sed -i 's/hover:text-green-200/hover:text-primary-200/g' "$file"
    sed -i 's/hover:text-green-300/hover:text-primary-300/g' "$file"
    sed -i 's/hover:text-green-400/hover:text-primary-400/g' "$file"
    sed -i 's/hover:text-green-500/hover:text-primary-500/g' "$file"
    sed -i 's/hover:text-green-600/hover:text-primary-600/g' "$file"
    sed -i 's/hover:text-green-700/hover:text-primary-700/g' "$file"
    sed -i 's/hover:text-green-800/hover:text-primary-800/g' "$file"
    sed -i 's/hover:text-green-900/hover:text-primary-900/g' "$file"
    
    # Update focus states
    sed -i 's/focus:ring-green-500/focus:ring-primary-500/g' "$file"
    sed -i 's/focus:border-green-500/focus:border-primary-500/g' "$file"
    
    # Update font classes
    sed -i 's/font-sans/font-body/g' "$file"
    
    # Update specific hex colors
    sed -i 's/#10b981/#74C365/g' "$file"
    sed -i 's/#059669/#5fa854/g' "$file"
    sed -i 's/#d1fae5/#e8f5e5/g' "$file"
done

echo "Theme update completed!"