#!/bin/bash

# 🚀 Laksh's Adventure Portfolio - Linux/Mac Server Launcher

echo "🚀 LAKSH'S ADVENTURE PORTFOLIO SERVER"
echo "======================================"

# Make Python server executable
chmod +x start-server.py

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "🐍 Starting Python 3 server..."
    python3 start-server.py
elif command -v python &> /dev/null; then
    echo "🐍 Starting Python server..."
    python start-server.py
elif command -v node &> /dev/null && [ -f "package.json" ]; then
    echo "🟢 Starting Node.js server..."
    npm start
else
    echo "❌ Error: No suitable server found!"
    echo "Please install Python 3 or Node.js to run the local server."
    echo ""
    echo "🔧 Quick fixes:"
    echo "   • Install Python 3: https://python.org"
    echo "   • Install Node.js: https://nodejs.org"
    echo ""
    echo "🌐 Alternatively, you can use any static file server:"
    echo "   • PHP: php -S localhost:8000"
    echo "   • Live Server extension in VS Code"
    echo "   • http-server: npm install -g http-server"
    exit 1
fi