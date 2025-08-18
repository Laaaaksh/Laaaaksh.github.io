// 🚀 LAKSH'S ADVENTURE PORTFOLIO GAME ENGINE 🚀
// Welcome to the coolest backend engineer's interactive portfolio!

// Game initialization and canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const miniMapCanvas = document.getElementById('miniMapCanvas');
const miniMapCtx = miniMapCanvas.getContext('2d');
const loadingScreen = document.getElementById('loadingScreen');
const loadingProgress = document.getElementById('loadingProgress');

// Set canvas resolution for crisp pixel art
function resizeCanvas() {
    const container = document.querySelector('.game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Ensure pixel perfect rendering
    ctx.imageSmoothingEnabled = false;
    miniMapCtx.imageSmoothingEnabled = false;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Epic loading sequence with Razorpay vibes 🔥
let loadProgress = 0;
const loadingMessages = [
    "Initializing Cell Router architecture...",
    "Loading Razorpay merchant systems...",
    "Connecting to DynamoDB clusters...",
    "Optimizing Golang microservices...",
    "Scaling to handle 250 req/sec...",
    "Loading NIT Karnataka achievements...",
    "Preparing backend adventure...",
    "Ready to explore! 🚀"
];

let messageIndex = 0;
const loadingInterval = setInterval(() => {
    loadProgress += Math.random() * 12 + 8;
    if (loadProgress > 100) loadProgress = 100;
    
    loadingProgress.style.width = loadProgress + '%';
    
    // Update loading message
    if (loadProgress > messageIndex * 12.5 && messageIndex < loadingMessages.length) {
        const msgElement = document.querySelector('.loading-text span:last-child');
        msgElement.textContent = loadingMessages[messageIndex];
        messageIndex++;
    }
    
    if (loadProgress >= 100) {
        clearInterval(loadingInterval);
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                initGame();
            }, 800);
        }, 1500);
    }
}, 120);

// 🎮 GAME STATE - The heart of the adventure
const gameState = {
    player: {
        x: 600,
        y: 400,
        width: 24,
        height: 24,
        speed: 4,
        direction: 'down',
        animFrame: 0,
        isMoving: false,
        color: '#00ffff'
    },
    camera: { x: 0, y: 0 },
    currentRoom: 'hub',
    discoveries: 0,
    totalDiscoveries: 20,
    keys: {},
    gameTime: 0,
    particles: [],
    achievements: [],
    showMiniMap: true,
    interactionRadius: 80
};

// ✨ PARTICLE SYSTEM for amazing visual effects
class Particle {
    constructor(x, y, config = {}) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * (config.speed || 4);
        this.vy = (Math.random() - 0.5) * (config.speed || 4);
        this.color = config.color || '#00ff00';
        this.life = config.life || 60;
        this.maxLife = this.life;
        this.size = config.size || (Math.random() * 4 + 2);
        this.type = config.type || 'default';
        this.gravity = config.gravity || 0;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life--;
        
        // Add some physics based on particle type
        if (this.type === 'spark') {
            this.vx *= 0.95;
            this.vy *= 0.95;
        } else if (this.type === 'code') {
            this.vy += 0.1; // Falling code effect
        }
    }

    draw() {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        
        if (this.type === 'code') {
            ctx.fillStyle = this.color;
            ctx.font = `${this.size * 2}px Courier New`;
            ctx.fillText(['0', '1', '{', '}', '(', ')', ';'][Math.floor(Math.random() * 7)], this.x, this.y);
        } else {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }

    isDead() {
        return this.life <= 0;
    }
}

// 🏢 ROOMS/WORLDS - Each showcasing different aspects of your journey
const rooms = {
    hub: {
        name: 'Tech Hub Central',
        width: 1400,
        height: 1000,
        background: '#001122',
        description: 'The central hub of Laksh\'s professional universe',
        npcs: [
            { 
                x: 700, y: 300, type: 'welcome', name: 'Welcome AI Assistant', 
                message: '👋 Welcome to Laksh\'s Adventure Portfolio! I\'m a Senior Backend Engineer at Razorpay with 4+ years of experience building scalable systems. Use WASD to explore different zones!',
                discovered: false 
            },
            { 
                x: 300, y: 500, type: 'portal', name: '🏢 Razorpay HQ', 
                message: 'Step into the world of India\'s leading fintech! Discover my journey from SDE to Senior SDE.', 
                target: 'razorpay',
                discovered: false 
            },
            { 
                x: 1100, y: 500, type: 'portal', name: '💻 Tech Skills Lab', 
                message: 'Explore my technical arsenal: Golang, Python, Kubernetes, and more!', 
                target: 'skills',
                discovered: false 
            },
            { 
                x: 500, y: 750, type: 'portal', name: '🎓 Education Zone', 
                message: 'Visit NIT Karnataka and learn about my academic journey!', 
                target: 'education',
                discovered: false 
            },
            { 
                x: 900, y: 750, type: 'portal', name: '🚀 Projects Gallery', 
                message: 'Check out my awesome projects including Cell Router and more!', 
                target: 'projects',
                discovered: false 
            }
        ],
        decorations: [
            { x: 150, y: 150, type: 'server-rack', emoji: '🖥️' },
            { x: 1250, y: 150, type: 'cloud', emoji: '☁️' },
            { x: 150, y: 850, type: 'database', emoji: '🗄️' },
            { x: 1250, y: 850, type: 'rocket', emoji: '🚀' }
        ]
    },

    razorpay: {
        name: 'Razorpay Engineering',
        width: 1600,
        height: 1200,
        background: '#0d1b2a',
        description: 'The fintech giant where I architect scalable payment solutions',
        npcs: [
            {
                x: 400, y: 300, type: 'experience', name: '🏗️ Cell Router Architect',
                message: 'I architected Cell Router - a Go-based central gateway using cell-based architecture! It handles 100-150 merchants with VPC peering, disaster recovery, and sub-10ms DynamoDB lookups. 🔥',
                discovered: false
            },
            {
                x: 800, y: 300, type: 'experience', name: '📈 Scale Master',
                message: 'Achieved MASSIVE scale improvements! Increased daily disbursal capacity by 900% (from 300-400K to 3M), automated merchant processes, and reduced activation time from 1 week to 1 day! 🚀',
                discovered: false
            },
            {
                x: 1200, y: 300, type: 'experience', name: '🔧 Performance Optimizer',
                message: 'Optimized payment risk engine database - achieved 50% reduction in p99 latency (100ms to 50ms) and cut MySQL costs by 75%! Also handled 250+ req/sec with high-throughput services.',
                discovered: false
            },
            {
                x: 400, y: 600, type: 'experience', name: '👥 Team Lead & Mentor',
                message: 'Led backend engineering for merchant platforms (One Home, One Nav, Cross-Sell). Mentored 2 junior engineers + 3 interns, boosting productivity by 60% and reducing onboarding time!',
                discovered: false
            },
            {
                x: 800, y: 600, type: 'experience', name: '🤖 AI Integration Pioneer',
                message: 'Leveraged cutting-edge AI tools (LLM, Cursor, MCPs) to onboard 1,900+ routes efficiently! Also drove 700 daily unique merchant cross-sells within 7 days of launch.',
                discovered: false
            },
            {
                x: 1200, y: 600, type: 'experience', name: '🏗️ Infrastructure Expert',
                message: 'Designed infrastructure supporting 3+ microservices with Kubernetes, Terraform (IaC), performance testing environments. Enabled 250 req/sec throughput and 80% manual setup reduction!',
                discovered: false
            },
            {
                x: 600, y: 900, type: 'experience', name: '💰 Revenue Impact',
                message: 'Built registration fee collection system generating $5K monthly capital gains. Led PHP to Golang microservice migration with zero-downtime and improved system performance!',
                discovered: false
            },
            { 
                x: 200, y: 1100, type: 'portal', name: '← Back to Hub', 
                message: 'Return to the central hub', target: 'hub',
                discovered: false 
            }
        ]
    },

    skills: {
        name: 'Technical Skills Laboratory',
        width: 1500,
        height: 1100,
        background: '#1a0033',
        description: 'My technical arsenal forged through years of backend mastery',
        npcs: [
            {
                x: 300, y: 250, type: 'skill', name: '🐹 Golang Master',
                message: 'Go is my weapon of choice! Built Cell Router, merchant platforms, and microservices. Expert in Gin framework, gRPC, Protobuf, and high-performance concurrent systems.',
                discovered: false
            },
            {
                x: 750, y: 250, type: 'skill', name: '🐍 Python Wizard',
                message: 'Python for rapid development! Built chatbots with Flask & LLMs, automation scripts, data processing, and API integrations. From Django to FastAPI!',
                discovered: false
            },
            {
                x: 1200, y: 250, type: 'skill', name: '☸️ Kubernetes Captain',
                message: 'Container orchestration expert! Managed Services, Deployments, Ingress controllers. Scaled applications handling 250+ req/sec with zero-downtime deployments.',
                discovered: false
            },
            {
                x: 300, y: 500, type: 'skill', name: '🗄️ Database Guru',
                message: 'Multi-database mastery! MySQL optimization (75% cost reduction), DynamoDB for sub-10ms lookups, Redis for caching, Elasticsearch for search. Performance is my passion!',
                discovered: false
            },
            {
                x: 750, y: 500, type: 'skill', name: '🔧 DevOps Engineer',
                message: 'Infrastructure as Code with Terraform! Docker containerization, Helm charts, Kong API gateway, performance testing environments. Automation is key!',
                discovered: false
            },
            {
                x: 1200, y: 500, type: 'skill', name: '📊 Messaging Systems',
                message: 'Event-driven architecture expert! Apache Kafka for real-time data streaming, AWS SQS for reliable message queuing. Built resilient distributed systems!',
                discovered: false
            },
            {
                x: 525, y: 750, type: 'skill', name: '🤖 AI & Modern Tools',
                message: 'Early adopter of AI-assisted development! Expert with LLMs, Cursor IDE, MCPs (Model Context Protocol). Onboarded 1,900+ routes efficiently using AI tools!',
                discovered: false
            },
            {
                x: 975, y: 750, type: 'skill', name: '🔐 Security & Auth',
                message: 'Security-first mindset! OAuth 2.0, JWT tokens, secure API design, thread-safe client caching. Built systems handling sensitive financial data at Razorpay!',
                discovered: false
            },
            { 
                x: 200, y: 1000, type: 'portal', name: '← Back to Hub', 
                message: 'Return to the central hub', target: 'hub',
                discovered: false 
            }
        ]
    },

    education: {
        name: 'NIT Karnataka Campus',
        width: 1200,
        height: 900,
        background: '#0f1419',
        description: 'Where the engineering foundation was built',
        npcs: [
            {
                x: 600, y: 200, type: 'education', name: '🎓 NIT Karnataka Graduate',
                message: 'B.Tech from National Institute of Technology, Karnataka, Surathkal (2018-2022). Major: Material Science (CGPA: 8.63), Minor: Computer Science (CGPA: 8.00). Excellence in academics! 📚',
                discovered: false
            },
            {
                x: 300, y: 400, type: 'education', name: '💻 CS Minor Journey',
                message: 'Computer Science Minor gave me the programming foundation! Data Structures, Algorithms, Database Systems, Software Engineering principles. The bridge to my tech career!',
                discovered: false
            },
            {
                x: 900, y: 400, type: 'education', name: '🔬 Material Science Major',
                message: 'Material Science taught me analytical thinking and problem-solving! Understanding complex systems, optimization, and scientific methodology - skills I apply in backend engineering daily.',
                discovered: false
            },
            {
                x: 600, y: 600, type: 'education', name: '🏆 Academic Excellence',
                message: 'Maintained high CGPA in both majors while transitioning to tech! Demonstrates dedication, learning ability, and time management - essential for Senior SDE role.',
                discovered: false
            },
            { 
                x: 200, y: 800, type: 'portal', name: '← Back to Hub', 
                message: 'Return to the central hub', target: 'hub',
                discovered: false 
            }
        ]
    },

    projects: {
        name: 'Project Innovation Lab',
        width: 1400,
        height: 1000,
        background: '#1a1a2e',
        description: 'Showcasing my technical creations and innovations',
        npcs: [
            {
                x: 350, y: 300, type: 'project', name: '🏗️ Cell Router Architecture',
                message: 'My masterpiece at Razorpay! Go-based central gateway with cell-based architecture, VPC peering, disaster recovery strategy, and DynamoDB integration. Serves 100-150 merchants! 🚀',
                discovered: false
            },
            {
                x: 750, y: 300, type: 'project', name: '📱 Reddit AutoScroller',
                message: 'Privacy-first browser extension for smooth Reddit browsing! Local storage only, no data collection. Built with JavaScript and browser APIs. Check it out on GitHub! 🔒',
                discovered: false
            },
            {
                x: 1050, y: 300, type: 'project', name: '💰 Payment Systems',
                message: 'Built multiple payment solutions: KYC automation, fund release systems (900% capacity boost), registration fee collection ($5K monthly gains). Fintech expertise! 💳',
                discovered: false
            },
            {
                x: 350, y: 600, type: 'project', name: '🤖 AI-Powered Chatbot',
                message: 'Built during Edzeeta internship! Python + Flask + LLMs for customer support. Achieved 50% reduction in support tickets. OAuth 2.0 & JWT authentication included! 🤖',
                discovered: false
            },
            {
                x: 750, y: 600, type: 'project', name: '🎮 This Portfolio Game!',
                message: 'You\'re experiencing it right now! Built with HTML5 Canvas, vanilla JavaScript, and lots of creativity. A unique way to showcase a backend engineer\'s journey! ✨',
                discovered: false
            },
            {
                x: 1050, y: 600, type: 'project', name: '⚡ Performance Optimizations',
                message: 'Multiple optimization projects: 50% latency reduction, 75% cost savings, 80% manual setup reduction. Engineering excellence through data-driven improvements! 📊',
                discovered: false
            },
            { 
                x: 200, y: 900, type: 'portal', name: '← Back to Hub', 
                message: 'Return to the central hub', target: 'hub',
                discovered: false 
            }
        ]
    }
};

// 🎯 INPUT HANDLING - Responsive controls (Keyboard + Touch)
window.addEventListener('keydown', (e) => {
    gameState.keys[e.key.toLowerCase()] = true;
    
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleInteraction();
    } else if (e.key.toLowerCase() === 'm') {
        gameState.showMiniMap = !gameState.showMiniMap;
        document.getElementById('miniMap').style.display = gameState.showMiniMap ? 'block' : 'none';
    } else if (e.key.toLowerCase() === 'e') {
        showRoomInfo();
    }
});

window.addEventListener('keyup', (e) => {
    gameState.keys[e.key.toLowerCase()] = false;
});

// 📱 TOUCH CONTROLS for mobile devices
function setupTouchControls() {
    // Detect if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobile = window.innerWidth <= 768;
    
    if (isTouchDevice && isMobile) {
        document.getElementById('touchControls').style.display = 'block';
        document.getElementById('controlsInfo').innerHTML = 
            '📱 Use touch controls below • <strong>⚡</strong> to interact • <strong>Tap screen</strong> for details';
    }
    
    // Touch button handlers
    const touchButtons = document.querySelectorAll('.touch-btn');
    touchButtons.forEach(btn => {
        const key = btn.getAttribute('data-key');
        
        // Handle touch start
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            gameState.keys[key] = true;
            btn.style.transform = 'scale(0.9)';
            
            if (key === ' ') {
                handleInteraction();
            }
        });
        
        // Handle touch end
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            gameState.keys[key] = false;
            btn.style.transform = 'scale(1)';
        });
        
        // Prevent context menu
        btn.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Mouse support for desktop testing
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            gameState.keys[key] = true;
            if (key === ' ') handleInteraction();
        });
        
        btn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            gameState.keys[key] = false;
        });
    });
    
    // Touch interaction on canvas for mobile
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        showRoomInfo();
    });
}

// 🔄 BROWSER COMPATIBILITY checks
function checkBrowserCompatibility() {
    // Check for Canvas support
    const canvas = document.createElement('canvas');
    if (!canvas.getContext || !canvas.getContext('2d')) {
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; color: #ff0000; font-family: Arial;">
                <div style="text-align: center;">
                    <h2>🚫 Browser Not Supported</h2>
                    <p>This portfolio requires HTML5 Canvas support.</p>
                    <p>Please use a modern browser like Chrome, Firefox, or Safari.</p>
                    <a href="mailto:laksh.sadhwani07@gmail.com" style="color: #00ff00;">Contact via Email Instead</a>
                </div>
            </div>
        `;
        return false;
    }
    
    // Check for requestAnimationFrame
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
                                     window.mozRequestAnimationFrame || 
                                     function(callback) { setTimeout(callback, 16); };
    }
    
    return true;
}

// 🎮 GAME INITIALIZATION
function initGame() {
    // Check browser compatibility first
    if (!checkBrowserCompatibility()) {
        return;
    }
    
    console.log('🚀 Welcome to Laksh\'s Adventure Portfolio!');
    console.log('👨‍💻 Senior Backend Engineer @ Razorpay');
    console.log('🎓 NIT Karnataka Graduate');
    console.log('Use WASD to move, SPACE to interact!');
    
    // Setup touch controls for mobile
    setupTouchControls();
    
    // Add some initial particles for atmosphere
    createAmbientParticles();
    
    // Start the game loop
    gameLoop();
}

// 🏃‍♂️ PLAYER MOVEMENT & PHYSICS
function updatePlayer() {
    const player = gameState.player;
    let moving = false;
    
    // Smooth movement with momentum
    if (gameState.keys['w'] || gameState.keys['arrowup']) {
        player.y -= player.speed;
        player.direction = 'up';
        moving = true;
    }
    if (gameState.keys['s'] || gameState.keys['arrowdown']) {
        player.y += player.speed;
        player.direction = 'down';
        moving = true;
    }
    if (gameState.keys['a'] || gameState.keys['arrowleft']) {
        player.x -= player.speed;
        player.direction = 'left';
        moving = true;
    }
    if (gameState.keys['d'] || gameState.keys['arrowright']) {
        player.x += player.speed;
        player.direction = 'right';
        moving = true;
    }

    player.isMoving = moving;
    if (moving) {
        player.animFrame += 0.15;
        
        // Add movement particles occasionally
        if (Math.random() < 0.3) {
            gameState.particles.push(new Particle(
                player.x + (Math.random() - 0.5) * 20,
                player.y + (Math.random() - 0.5) * 20,
                { color: player.color, life: 30, size: 2 }
            ));
        }
    }

    // World boundaries
    const room = rooms[gameState.currentRoom];
    player.x = Math.max(20, Math.min(room.width - 20, player.x));
    player.y = Math.max(20, Math.min(room.height - 20, player.y));

    // Smooth camera following
    const targetCameraX = player.x - canvas.width / 2;
    const targetCameraY = player.y - canvas.height / 2;
    
    gameState.camera.x += (targetCameraX - gameState.camera.x) * 0.1;
    gameState.camera.y += (targetCameraY - gameState.camera.y) * 0.1;
    
    // Camera boundaries
    gameState.camera.x = Math.max(0, Math.min(room.width - canvas.width, gameState.camera.x));
    gameState.camera.y = Math.max(0, Math.min(room.height - canvas.height, gameState.camera.y));
}

// 🎯 INTERACTION SYSTEM
function handleInteraction() {
    const player = gameState.player;
    const room = rooms[gameState.currentRoom];
    let interacted = false;
    
    room.npcs.forEach(npc => {
        const distance = Math.sqrt(
            Math.pow(player.x - npc.x, 2) + 
            Math.pow(player.y - npc.y, 2)
        );
        
        if (distance < gameState.interactionRadius) {
            interacted = true;
            
            if (npc.type === 'portal') {
                // Room transition with cool effect
                createPortalEffect(npc.x, npc.y);
                setTimeout(() => {
                    gameState.currentRoom = npc.target;
                    gameState.player.x = 600;
                    gameState.player.y = 400;
                    document.getElementById('currentArea').textContent = rooms[npc.target].name;
                    createSpawnEffect();
                }, 500);
            } else {
                showDialog(npc.message);
                
                // Discovery system
                if (!npc.discovered) {
                    npc.discovered = true;
                    gameState.discoveries++;
                    document.getElementById('discoveries').textContent = `${gameState.discoveries}/${gameState.totalDiscoveries}`;
                    
                    // Achievement effect
                    createDiscoveryEffect(npc.x, npc.y);
                    showAchievement(`Discovered: ${npc.name}`);
                    
                    // Update experience level
                    updateExperienceLevel();
                }
            }
        }
    });
    
    if (!interacted) {
        // Show interaction hint for nearby NPCs
        const nearbyNPC = findNearbyNPC();
        if (nearbyNPC) {
            showDialog(`Move closer to ${nearbyNPC.name} to interact!`);
        }
    }
}

// 📱 UI FUNCTIONS
function showDialog(text) {
    const dialogBox = document.getElementById('dialogBox');
    const dialogText = document.getElementById('dialogText');
    
    dialogText.innerHTML = text;
    dialogBox.style.display = 'block';
    
    setTimeout(() => {
        dialogBox.style.display = 'none';
    }, 6000);
}

function showAchievement(text) {
    const popup = document.getElementById('achievementPopup');
    const textEl = document.getElementById('achievementText');
    
    textEl.textContent = text;
    popup.style.display = 'block';
    
    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
}

function showRoomInfo() {
    const room = rooms[gameState.currentRoom];
    showDialog(`📍 ${room.name}: ${room.description}`);
}

function updateExperienceLevel() {
    const progress = (gameState.discoveries / gameState.totalDiscoveries) * 100;
    document.getElementById('healthFill').style.width = progress + '%';
}

function findNearbyNPC() {
    const player = gameState.player;
    const room = rooms[gameState.currentRoom];
    
    return room.npcs.find(npc => {
        const distance = Math.sqrt(
            Math.pow(player.x - npc.x, 2) + 
            Math.pow(player.y - npc.y, 2)
        );
        return distance < gameState.interactionRadius * 1.5;
    });
}

// ✨ VISUAL EFFECTS
function createPortalEffect(x, y) {
    for (let i = 0; i < 15; i++) {
        gameState.particles.push(new Particle(x, y, {
            color: '#9900ff',
            life: 60,
            size: 6,
            speed: 8
        }));
    }
}

function createSpawnEffect() {
    const player = gameState.player;
    for (let i = 0; i < 20; i++) {
        gameState.particles.push(new Particle(
            player.x + (Math.random() - 0.5) * 60,
            player.y + (Math.random() - 0.5) * 60,
            { color: '#00ffff', life: 90, size: 4 }
        ));
    }
}

function createDiscoveryEffect(x, y) {
    for (let i = 0; i < 12; i++) {
        gameState.particles.push(new Particle(x, y, {
            color: ['#ffff00', '#ffd700', '#ffaa00'][Math.floor(Math.random() * 3)],
            life: 80,
            size: 5,
            speed: 6
        }));
    }
}

function createAmbientParticles() {
    // Add floating code particles
    for (let i = 0; i < 8; i++) {
        const room = rooms[gameState.currentRoom];
        gameState.particles.push(new Particle(
            Math.random() * room.width,
            Math.random() * room.height,
            {
                type: 'code',
                color: 'rgba(0, 255, 0, 0.6)',
                life: 300,
                size: 3,
                speed: 1
            }
        ));
    }
}

// 🎨 RENDERING ENGINE
function drawBackground() {
    const room = rooms[gameState.currentRoom];
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, room.background);
    gradient.addColorStop(1, adjustColor(room.background, -20));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid pattern
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.05)';
    ctx.lineWidth = 1;
    
    const gridSize = 60;
    const offsetX = -gameState.camera.x % gridSize;
    const offsetY = -gameState.camera.y % gridSize;
    
    for (let x = offsetX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = offsetY; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Room boundary
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(
        -gameState.camera.x - 1, 
        -gameState.camera.y - 1, 
        room.width + 2, 
        room.height + 2
    );
    
    // Draw decorations
    if (room.decorations) {
        ctx.font = '40px Courier New';
        ctx.textAlign = 'center';
        room.decorations.forEach(decoration => {
            const x = decoration.x - gameState.camera.x;
            const y = decoration.y - gameState.camera.y;
            if (x > -60 && x < canvas.width + 60 && y > -60 && y < canvas.height + 60) {
                ctx.fillText(decoration.emoji, x, y);
            }
        });
    }
}

function drawPlayer() {
    const player = gameState.player;
    const x = player.x - gameState.camera.x;
    const y = player.y - gameState.camera.y;
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + 20, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Player body with animation
    const bounce = player.isMoving ? Math.sin(player.animFrame * 2) * 3 : 0;
    
    ctx.fillStyle = player.color;
    ctx.fillRect(x - 12, y - 12 + bounce, 24, 24);
    
    // Player details
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 8, y - 8 + bounce, 16, 16);
    
    // Direction indicator
    const dirColors = { up: '#ff0000', down: '#00ff00', left: '#0000ff', right: '#ffff00' };
    ctx.fillStyle = dirColors[player.direction];
    
    const dirOffsets = {
        up: { x: 0, y: -18 }, down: { x: 0, y: 18 },
        left: { x: -18, y: 0 }, right: { x: 18, y: 0 }
    };
    
    const offset = dirOffsets[player.direction];
    ctx.fillRect(x + offset.x - 3 + bounce/2, y + offset.y - 3 + bounce/2, 6, 6);
    
    // Add glowing effect
    ctx.shadowColor = player.color;
    ctx.shadowBlur = 10;
    ctx.fillRect(x - 1, y - 1, 2, 2);
    ctx.shadowBlur = 0;
}

function drawNPC(npc) {
    const x = npc.x - gameState.camera.x;
    const y = npc.y - gameState.camera.y;
    
    // Skip if off-screen
    if (x < -100 || x > canvas.width + 100 || y < -100 || y > canvas.height + 100) return;
    
    // NPC colors and emojis
    const npcConfig = {
        welcome: { color: '#ff6600', emoji: '👋' },
        portal: { color: '#9900ff', emoji: '🌀' },
        experience: { color: '#ff3366', emoji: '💼' },
        skill: { color: '#00ff99', emoji: '⚡' },
        education: { color: '#ffff00', emoji: '🎓' },
        project: { color: '#ff9900', emoji: '🚀' }
    };
    
    const config = npcConfig[npc.type] || { color: '#ffffff', emoji: '❓' };
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(x, y + 25, 15, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Pulsing effect
    const pulse = Math.sin(gameState.gameTime * 0.05) * 0.2 + 1;
    const size = 20 * pulse;
    
    // NPC body
    ctx.fillStyle = config.color;
    ctx.fillRect(x - size/2, y - size/2, size, size);
    
    // Emoji
    ctx.font = `${size + 8}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText(config.emoji, x, y + 6);
    
    // Interaction indicator
    const distance = Math.sqrt(
        Math.pow(gameState.player.x - npc.x, 2) + 
        Math.pow(gameState.player.y - npc.y, 2)
    );
    
    if (distance < gameState.interactionRadius) {
        // Interaction circle
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 40 + Math.sin(gameState.gameTime * 0.1) * 8, 0, Math.PI * 2);
        ctx.stroke();
        
        // Instruction text
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('SPACE', x, y - 35);
    }
    
    // Name label
    ctx.fillStyle = npc.discovered ? '#00ff00' : '#ffffff';
    ctx.font = '10px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(npc.name, x, y + 45);
    
    // Discovery indicator
    if (npc.discovered) {
        ctx.fillStyle = '#ffff00';
        ctx.font = '16px Courier New';
        ctx.fillText('✓', x + 20, y - 20);
    }
}

function updateParticles() {
    for (let i = gameState.particles.length - 1; i >= 0; i--) {
        const particle = gameState.particles[i];
        particle.update();
        
        if (particle.isDead()) {
            gameState.particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    gameState.particles.forEach(particle => {
        const x = particle.x - gameState.camera.x;
        const y = particle.y - gameState.camera.y;
        
        if (x > -50 && x < canvas.width + 50 && y > -50 && y < canvas.height + 50) {
            particle.x = x + gameState.camera.x;
            particle.y = y + gameState.camera.y;
            particle.draw();
        }
    });
}

function drawMiniMap() {
    if (!gameState.showMiniMap) return;
    
    const room = rooms[gameState.currentRoom];
    const scale = 0.1;
    
    miniMapCtx.clearRect(0, 0, 150, 120);
    
    // Room outline
    miniMapCtx.strokeStyle = '#00ff00';
    miniMapCtx.strokeRect(2, 2, 146, 116);
    
    // Player position
    const playerX = (gameState.player.x / room.width) * 146 + 2;
    const playerY = (gameState.player.y / room.height) * 116 + 2;
    
    miniMapCtx.fillStyle = '#00ffff';
    miniMapCtx.fillRect(playerX - 2, playerY - 2, 4, 4);
    
    // NPCs
    room.npcs.forEach(npc => {
        const npcX = (npc.x / room.width) * 146 + 2;
        const npcY = (npc.y / room.height) * 116 + 2;
        
        miniMapCtx.fillStyle = npc.type === 'portal' ? '#9900ff' : '#ff6600';
        miniMapCtx.fillRect(npcX - 1, npcY - 1, 2, 2);
    });
}

// 🎮 MAIN GAME LOOP
function gameLoop() {
    gameState.gameTime++;
    
    // Update
    updatePlayer();
    updateParticles();
    
    // Clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBackground();
    
    // Draw NPCs
    const currentRoom = rooms[gameState.currentRoom];
    currentRoom.npcs.forEach(drawNPC);
    
    drawParticles();
    drawPlayer();
    drawMiniMap();
    
    // Add ambient particles periodically
    if (gameState.gameTime % 180 === 0) {
        createAmbientParticles();
    }
    
    requestAnimationFrame(gameLoop);
}

// 🛠️ UTILITY FUNCTIONS
function adjustColor(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

// Easter egg console messages
console.log(`
🚀 LAKSH'S ADVENTURE PORTFOLIO 🚀
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👨‍💻 Senior Backend Engineer @ Razorpay
🎓 NIT Karnataka Graduate  
💻 4+ Years Experience
⚡ Golang • Python • Kubernetes Expert

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 Game Controls:
   WASD - Move around
   SPACE - Interact with NPCs
   E - Room info  
   M - Toggle minimap

📧 Contact: laksh.sadhwani07@gmail.com
🐙 GitHub: github.com/Laaaaksh
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);