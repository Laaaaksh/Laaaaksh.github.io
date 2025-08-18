#!/usr/bin/env node

/**
 * 🚀 Laksh's Adventure Portfolio - Node.js Development Server
 * A simple static file server for local development and testing
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Server configuration
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || 'localhost';
const isDev = process.argv.includes('--dev');

// MIME types for proper content serving
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

/**
 * Find an available port starting from the given port
 */
function findFreePort(startPort) {
    return new Promise((resolve, reject) => {
        const net = require('net');
        
        function checkPort(port) {
            const server = net.createServer();
            
            server.listen(port, HOST, () => {
                server.once('close', () => resolve(port));
                server.close();
            });
            
            server.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    checkPort(port + 1);
                } else {
                    reject(err);
                }
            });
        }
        
        checkPort(startPort);
    });
}

/**
 * Open URL in default browser
 */
function openBrowser(url) {
    const start = (process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open');
    
    exec(`${start} ${url}`, (error) => {
        if (error) {
            console.log(`⚠️  Could not auto-open browser: ${error.message}`);
            console.log(`🔗 Manually visit: ${url}`);
        }
    });
}

/**
 * Create HTTP server
 */
async function createServer() {
    try {
        // Find available port
        const port = await findFreePort(PORT);
        
        const server = http.createServer((req, res) => {
            // Parse URL
            let filePath = '.' + req.url;
            if (filePath === './') {
                filePath = './index.html';
            }
            
            // Get file extension
            const extname = String(path.extname(filePath)).toLowerCase();
            const contentType = mimeTypes[extname] || 'application/octet-stream';
            
            // Add CORS headers for development
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            
            // Handle preflight requests
            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }
            
            // Read and serve file
            fs.readFile(filePath, (error, content) => {
                if (error) {
                    if (error.code === 'ENOENT') {
                        // File not found
                        fs.readFile('./404.html', (error, content) => {
                            res.writeHead(404, { 'Content-Type': 'text/html' });
                            res.end(content || '404 - File Not Found', 'utf-8');
                        });
                    } else {
                        // Server error
                        res.writeHead(500);
                        res.end(`Server Error: ${error.code}`, 'utf-8');
                    }
                } else {
                    // Success
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
                
                // Log request (with emoji for fun!)
                const status = error ? (error.code === 'ENOENT' ? 404 : 500) : 200;
                const statusEmoji = status === 200 ? '✅' : status === 404 ? '❌' : '⚠️';
                console.log(`${statusEmoji} ${req.method} ${req.url} - ${status}`);
            });
        });
        
        // Start server
        server.listen(port, HOST, () => {
            const serverUrl = `http://${HOST}:${port}`;
            
            console.log('='.repeat(60));
            console.log('🚀 LAKSH\'S ADVENTURE PORTFOLIO SERVER');
            console.log('='.repeat(60));
            console.log(`🌐 Server running at: ${serverUrl}`);
            console.log(`📁 Serving files from: ${__dirname}`);
            console.log('🎮 Your epic game portfolio is ready!');
            console.log('');
            console.log('📱 Controls:');
            console.log('   • Desktop: WASD + SPACE to interact');
            console.log('   • Mobile: Touch controls');
            console.log('');
            console.log(`${isDev ? '🔧 Development mode enabled' : '🚀 Production mode'}`);
            console.log('🛑 Press Ctrl+C to stop the server');
            console.log('='.repeat(60));
            
            // Open browser
            console.log(`🔗 Opening ${serverUrl} in your browser...`);
            setTimeout(() => openBrowser(serverUrl), 1000);
            
            console.log('🟢 Server is running... enjoy your adventure portfolio!');
        });
        
        // Handle server errors
        server.on('error', (err) => {
            console.error(`❌ Server error: ${err.message}`);
            process.exit(1);
        });
        
        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n🛑 Server stopped by user');
            server.close(() => {
                console.log('👋 Goodbye!');
                process.exit(0);
            });
        });
        
    } catch (error) {
        console.error(`❌ Failed to start server: ${error.message}`);
        process.exit(1);
    }
}

// Check if running directly
if (require.main === module) {
    // Check if index.html exists
    if (!fs.existsSync('./index.html')) {
        console.error('❌ Error: index.html not found!');
        console.error('Make sure you\'re running this from the portfolio directory.');
        process.exit(1);
    }
    
    createServer();
}

module.exports = { createServer };