#!/bin/bash
# Lighthouse Audit Script
# Requires Lighthouse CLI and Chrome to be installed
# Usage: ./lighthouse-audit.sh

set -e

echo "🔍 Starting Lighthouse Audit..."
echo ""

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo "❌ Lighthouse CLI not found. Installing..."
    npm install -g @lhci/cli@latest lighthouse
fi

# Ensure the dev server is running
echo "🚀 Starting development server..."
PORT=5173
if ! nc -z localhost $PORT 2>/dev/null; then
    npm run dev &
    DEV_PID=$!
    sleep 3  # Wait for server to start
fi

echo "📊 Running Lighthouse audit on http://localhost:$PORT..."
echo ""

# Create reports directory
mkdir -p lighthouse-reports

# Run Lighthouse for desktop
lighthouse http://localhost:$PORT \
    --output html \
    --output json \
    --output-path ./lighthouse-reports/desktop \
    --preset=desktop \
    --chrome-flags="--headless"

echo ""
echo "✅ Audit complete!"
echo ""
echo "📄 Reports generated:"
echo "  - lighthouse-reports/desktop.html (view in browser)"
echo "  - lighthouse-reports/desktop.json (raw data)"
echo ""
echo "🎯 Opening report in browser..."
if command -v xdg-open &> /dev/null; then
    xdg-open ./lighthouse-reports/desktop.html
elif command -v open &> /dev/null; then
    open ./lighthouse-reports/desktop.html
else
    echo "📝 Report saved to: ./lighthouse-reports/desktop.html"
fi

# Kill the dev server if we started it
if [ ! -z "$DEV_PID" ]; then
    kill $DEV_PID 2>/dev/null || true
fi
