#!/usr/bin/env python3
"""
🚀 Laksh's Adventure Portfolio - Local Development Server
Starts a local web server to test your awesome game portfolio!
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

# Server configuration
PORT = 8000
HOST = 'localhost'

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler with better MIME types and caching"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        # Set proper MIME types
        if self.path.endswith('.js'):
            self.send_header('Content-Type', 'application/javascript')
        elif self.path.endswith('.css'):
            self.send_header('Content-Type', 'text/css')
        elif self.path.endswith('.html'):
            self.send_header('Content-Type', 'text/html')
            
        super().end_headers()
    
    def log_message(self, format, *args):
        # Custom logging with emojis
        print(f"🌐 {args[0]} - {args[1]} - {args[2]}")

def find_free_port(start_port=8000):
    """Find a free port starting from the given port"""
    import socket
    
    for port in range(start_port, start_port + 100):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind((HOST, port))
                return port
        except OSError:
            continue
    
    raise RuntimeError("No free ports found")

def main():
    # Change to the directory containing this script
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Check if index.html exists
    if not os.path.exists('index.html'):
        print("❌ Error: index.html not found!")
        print("Make sure you're running this from the portfolio directory.")
        sys.exit(1)
    
    try:
        # Find a free port
        port = find_free_port(PORT)
        
        # Create server
        with socketserver.TCPServer((HOST, port), CustomHandler) as httpd:
            server_url = f"http://{HOST}:{port}"
            
            print("=" * 60)
            print("🚀 LAKSH'S ADVENTURE PORTFOLIO SERVER")
            print("=" * 60)
            print(f"🌐 Server running at: {server_url}")
            print(f"📁 Serving files from: {os.getcwd()}")
            print("🎮 Your epic game portfolio is ready!")
            print()
            print("📱 Controls:")
            print("   • Desktop: WASD + SPACE to interact")
            print("   • Mobile: Touch controls")
            print()
            print("🛑 Press Ctrl+C to stop the server")
            print("=" * 60)
            
            # Try to open browser automatically
            try:
                print(f"🔗 Opening {server_url} in your browser...")
                webbrowser.open(server_url)
            except Exception as e:
                print(f"⚠️  Could not auto-open browser: {e}")
                print(f"🔗 Manually visit: {server_url}")
            
            # Start serving
            print("🟢 Server is running... enjoy your adventure portfolio!")
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()