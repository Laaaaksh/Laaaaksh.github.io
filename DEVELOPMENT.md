# 🚀 Local Development Guide

## Quick Start Options

### 🐍 **Python Server (Recommended)**
```bash
# Option 1: Run Python script directly
python3 start-server.py

# Option 2: Use shell script (Linux/Mac)
./start-server.sh

# Option 3: Use batch file (Windows)
start-server.bat
```

### 🟢 **Node.js Server**
```bash
# First time setup
npm install

# Start server
npm start

# Development mode
npm run dev

# Alternative: Use http-server
npm run serve
```

### 🔧 **Other Options**

#### PHP Server
```bash
php -S localhost:8000
```

#### Live Server (VS Code Extension)
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

#### Python Simple Server
```bash
# Python 3
python -m http.server 8000

# Python 2 (legacy)
python -m SimpleHTTPServer 8000
```

---

## 🎮 **What You'll See**

Once the server starts, your browser will automatically open to:
- **URL**: `http://localhost:8000`
- **Controls**: WASD + SPACE (desktop) or touch controls (mobile)

## 🌟 **Features**

- **Auto-browser opening**: Server automatically opens your default browser
- **Cross-platform**: Works on Windows, Mac, and Linux
- **Mobile-friendly**: Touch controls for smartphones/tablets
- **Hot-reload ready**: Refresh browser after code changes
- **Error handling**: Helpful error messages and port auto-detection

## 🔧 **Troubleshooting**

### Port Already in Use
The servers automatically find free ports starting from 8000, so this shouldn't happen. If it does:
- Check what's running on port 8000: `lsof -i :8000` (Mac/Linux) or `netstat -an | find "8000"` (Windows)
- Kill the process or use a different port

### Python Not Found
- **Windows**: Install from [python.org](https://python.org) and check "Add to PATH"
- **Mac**: Use `brew install python3` or install from python.org
- **Linux**: Use `sudo apt install python3` (Ubuntu/Debian) or equivalent

### Node.js Not Found
- Install from [nodejs.org](https://nodejs.org)
- Verify with `node --version` and `npm --version`

### File Not Found Errors
Make sure you're running the server from the portfolio directory containing `index.html`.

---

## 🎯 **Development Workflow**

1. **Start server**: Use any method above
2. **Edit files**: Modify HTML, CSS, or JS files
3. **Test changes**: Refresh browser to see updates
4. **Debug**: Use browser dev tools (F12)
5. **Deploy**: Push to GitHub Pages when ready

## 📱 **Mobile Testing**

To test on mobile devices on your local network:

1. **Find your IP address**:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` or `ip addr`

2. **Use IP instead of localhost**:
   - Example: `http://192.168.1.100:8000`

3. **Connect mobile device** to same WiFi network

4. **Visit the IP URL** on your mobile browser

---

## 🚀 **Production Deployment**

Your portfolio automatically deploys to **GitHub Pages** at:
- **https://laaaaksh.github.io**

No additional setup needed - GitHub Actions handles the deployment!

---

## 🎮 **Enjoy Your Adventure Portfolio!**

Your local development environment is ready. Start exploring the coolest backend engineer portfolio ever created! 🌟