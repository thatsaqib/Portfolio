// --- Game State Variables ---
let gameInterval;
let gameSpeed = 1;
let score = 0;
let lives = 3;
let playerLane = 1; // 0: left, 1: middle, 2: right
const laneWidth = window.innerWidth / 3;
let enemies = [];
let boosters = [];
let lastEnemySpawnTime = 0;
let lastBoosterSpawnTime = 0;
let gameIsRunning = false;

// --- DOM Elements ---
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const gameArea = document.getElementById('game-area');
const road = document.getElementById('road');
const playerCar = document.createElement('img');
playerCar.id = 'player-car';
playerCar.src = 'car.png';
playerCar.className = 'car';

const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const speedEl = document.getElementById('speed-multiplier');
const finalScoreEl = document.getElementById('final-score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

// --- Audio Elements ---
const engineSound = document.getElementById('engine-sound');
engineSound.src = 'engine.mp3'; // Replace with your engine sound file
const collisionSound = document.getElementById('collision-sound');
collisionSound.src = 'collision.mp3'; // Replace with your collision sound file
const boosterSound = document.getElementById('booster-sound');
boosterSound.src = 'booster.mp3'; // Replace with your booster sound file

// --- Constants ---
const ENEMY_SPAWN_INTERVAL = 1500; // ms
const BOOSTER_SPAWN_INTERVAL = 7000; // ms
const MAX_ENEMIES = 2;
const MAX_LIVES = 3;
const BASE_SPEED = 0.5; // Base speed for road lines and objects
const SPEED_INCREASE_RATE = 0.0001; // How quickly speed increases

// --- Helper Functions ---
function getRandomLane() {
    return Math.floor(Math.random() * 3);
}

function getLaneX(laneIndex) {
    const carWidth = playerCar.getBoundingClientRect().width;
    // Calculate center of the lane and offset by half of the car's width
    return (laneIndex * laneWidth) + (laneWidth / 2) - (carWidth / 2);
}

function createRoadLines() {
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 4; j++) {
            const line = document.createElement('div');
            line.className = `road-line ${i === 0 ? 'left-line' : 'right-line'}`;
            line.style.top = `${j * 25}%`;
            road.appendChild(line);
        }
    }
}

function moveRoadLines() {
    const lines = document.querySelectorAll('.road-line');
    lines.forEach(line => {
        let top = parseFloat(line.style.top);
        top += BASE_SPEED * gameSpeed * 5;
        if (top > 100) {
            top -= 200; // Reset position to loop
        }
        line.style.top = `${top}%`;
    });
}

// --- Object Creation ---
function createEnemyCar() {
    const enemy = document.createElement('img');
    enemy.src = 'car.png';
    enemy.className = 'car enemy-car';
    enemy.dataset.lane = getRandomLane();
    enemy.style.left = `${getLaneX(parseInt(enemy.dataset.lane))}px`;
    enemy.style.top = `-${window.innerHeight * 0.2}px`; // Start off-screen
    road.appendChild(enemy);
    enemies.push(enemy);
}

function createBooster() {
    const booster = document.createElement('img');
    booster.src = '1062259.png'; // Use a different SVG/image for boosters
    booster.className = 'booster';
    booster.dataset.lane = getRandomLane();
    booster.style.left = `${getLaneX(parseInt(booster.dataset.lane))}px`;
    booster.style.top = `-${window.innerHeight * 0.1}px`;
    road.appendChild(booster);
    boosters.push(booster);
}

// --- Game Logic ---
function updateGame() {
    if (!gameIsRunning) return;

    // Update Score and Speed
    score += gameSpeed * 0.1;
    gameSpeed += SPEED_INCREASE_RATE;
    scoreEl.textContent = Math.floor(score);
    speedEl.textContent = gameSpeed.toFixed(2);

    // Move Objects
    moveObjects();

    // Spawning Logic
    const currentTime = Date.now();
    if (currentTime - lastEnemySpawnTime > ENEMY_SPAWN_INTERVAL / gameSpeed && enemies.length < MAX_ENEMIES) {
        const occupiedLanes = enemies.map(e => parseInt(e.dataset.lane));
        let newLane = getRandomLane();
        let attempts = 0;
        while (occupiedLanes.includes(newLane) && attempts < 5) {
            newLane = getRandomLane();
            attempts++;
        }
        if (!occupiedLanes.includes(newLane)) {
            createEnemyCar();
            lastEnemySpawnTime = currentTime;
        }
    }

    if (currentTime - lastBoosterSpawnTime > BOOSTER_SPAWN_INTERVAL && boosters.length < 1) {
        createBooster();
        lastBoosterSpawnTime = currentTime;
    }

    // Collision Detection and Clean-up
    checkCollisions();
    cleanupOffscreenObjects();
}

function moveObjects() {
    // Enemies
    enemies.forEach(enemy => {
        let top = parseFloat(enemy.style.top);
        top += BASE_SPEED * gameSpeed * 2;
        enemy.style.top = `${top}px`;
    });

    // Boosters
    boosters.forEach(booster => {
        let top = parseFloat(booster.style.top);
        top += BASE_SPEED * gameSpeed * 2;
        booster.style.top = `${top}px`;
    });

    moveRoadLines();
}

function checkCollisions() {
    const playerRect = playerCar.getBoundingClientRect();
    const playerCollisionBox = {
        left: playerRect.left + playerRect.width * 0.2,
        right: playerRect.right - playerRect.width * 0.2,
        top: playerRect.top + playerRect.height * 0.2,
        bottom: playerRect.bottom - playerRect.height * 0.1
    };

    // Check for collisions with enemies
    enemies.forEach((enemy, index) => {
        const enemyRect = enemy.getBoundingClientRect();
        const enemyCollisionBox = {
            left: enemyRect.left + enemyRect.width * 0.2,
            right: enemyRect.right - enemyRect.width * 0.2,
            top: enemyRect.top + enemyRect.height * 0.2,
            bottom: enemyRect.bottom - enemyRect.height * 0.1
        };

        if (playerCollisionBox.left < enemyCollisionBox.right &&
            playerCollisionBox.right > enemyCollisionBox.left &&
            playerCollisionBox.top < enemyCollisionBox.bottom &&
            playerCollisionBox.bottom > enemyCollisionBox.top) {
            
            // Collision detected
            lives--;
            livesEl.textContent = lives;
            collisionSound.currentTime = 0;
            collisionSound.play();
            
            // Remove the hit enemy
            enemy.remove();
            enemies.splice(index, 1);

            if (lives <= 0) {
                endGame();
            }
        }
    });

    // Check for collisions with boosters
    boosters.forEach((booster, index) => {
        const boosterRect = booster.getBoundingClientRect();
        if (playerRect.left < boosterRect.right &&
            playerRect.right > boosterRect.left &&
            playerRect.top < boosterRect.bottom &&
            playerRect.bottom > boosterRect.top) {
            
            // Booster collected
            if (lives < MAX_LIVES) {
                lives++;
                livesEl.textContent = lives;
                boosterSound.currentTime = 0;
                boosterSound.play();
            }
            
            // Remove the collected booster
            booster.remove();
            boosters.splice(index, 1);
        }
    });
}

function cleanupOffscreenObjects() {
    enemies = enemies.filter(enemy => {
        if (parseFloat(enemy.style.top) > window.innerHeight) {
            enemy.remove();
            return false;
        }
        return true;
    });

    boosters = boosters.filter(booster => {
        if (parseFloat(booster.style.top) > window.innerHeight) {
            booster.remove();
            return false;
        }
        return true;
    });
}

function endGame() {
    gameIsRunning = false;
    clearInterval(gameInterval);
    engineSound.pause();
    engineSound.currentTime = 0;

    gameArea.style.display = 'none';
    gameOverScreen.classList.remove('hidden');
    finalScoreEl.textContent = Math.floor(score);
}

// --- Game Initialization & Controls ---
function initGame() {
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    gameArea.style.display = 'block';

    // Reset game state
    score = 0;
    lives = 3;
    gameSpeed = 1;
    playerLane = 1;
    scoreEl.textContent = score;
    livesEl.textContent = lives;
    speedEl.textContent = gameSpeed.toFixed(2);
    enemies.forEach(e => e.remove());
    enemies = [];
    boosters.forEach(b => b.remove());
    boosters = [];

    // Player car setup
    road.appendChild(playerCar);
    playerCar.style.left = `${getLaneX(playerLane)}px`;

    // Road lines
    if (road.querySelectorAll('.road-line').length === 0) {
        createRoadLines();
    }
    
    // Start game loop
    gameIsRunning = true;
    gameInterval = setInterval(updateGame, 1000 / 60); // 60 FPS
    engineSound.play();
}

function switchLane(direction) {
    if (!gameIsRunning) return;
    
    if (direction === 'left' && playerLane > 0) {
        playerLane--;
    } else if (direction === 'right' && playerLane < 2) {
        playerLane++;
    }
    
    playerCar.style.left = `${getLaneX(playerLane)}px`;
}

// --- Event Listeners ---
startBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', initGame);
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

// Keyboard Controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        switchLane('left');
    } else if (e.key === 'ArrowRight') {
        switchLane('right');
    }
});

// Mobile Controls
leftBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    switchLane('left');
}, { passive: false });

rightBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    switchLane('right');
}, { passive: false });

// Initialize the start screen state
document.addEventListener('DOMContentLoaded', () => {
    startScreen.classList.remove('hidden');
    gameArea.style.display = 'none';
    gameOverScreen.classList.add('hidden');
});