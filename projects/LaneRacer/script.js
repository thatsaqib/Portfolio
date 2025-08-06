const lines = document.querySelectorAll('.road-line');
const enemyCar = document.querySelector('.enemy-car');
const scoreDisplay = document.getElementById("score");
const playerCar = document.querySelector('.player-car');

let enemyTop = -120;
let lanes = [60, 120, 180];
let isGameOver = false;
let score = 0;
let speed = 5;

let carPosition = 155;
playerCar.style.left = carPosition + 'px';

// Move player car with keyboard
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();

    if ((key === 'a' || key === 'arrowleft') && carPosition > 5) {
        carPosition -= 20;
    } else if ((key === 'd' || key === 'arrowright') && carPosition < 230) {
        carPosition += 20;
    }

    playerCar.style.left = carPosition + 'px';
});

// Increase score over time
setInterval(() => {
    if (isGameOver) return;

    score++;
    scoreDisplay.innerHTML = "Score: " + score;

    if (score % 5 === 0 && speed < 20) {
        speed++;
    }
}, 1000);

// Move road lines
lines.forEach((line) => {
    let top = parseInt(line.style.top) || 0;

    setInterval(() => {
        if (isGameOver) return;

        top += speed;
        if (top > 500) {
            top = -80;
        }
        line.style.top = top + 'px';
    }, 50);
});

// Enemy car movement
function moveEnemy() {
    if (isGameOver) return;

    enemyTop += speed;
    enemyCar.style.top = enemyTop + 'px';

    if (enemyTop > 500) {
        enemyTop = -120;
        const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
        enemyCar.style.left = randomLane + 'px';
    }

    checkCollision();
    requestAnimationFrame(moveEnemy);
}
moveEnemy();

function checkCollision() {
    const enemyRect = enemyCar.getBoundingClientRect();
    const playerRect = playerCar.getBoundingClientRect();

    const isColliding =
        enemyRect.left < playerRect.right &&
        enemyRect.right > playerRect.left &&
        enemyRect.top < playerRect.bottom &&
        enemyRect.bottom > playerRect.top;

    if (isColliding) {
        gameOver();
    }
}

const crashSound = document.getElementById("crashSound");
let isAudioEnabled = false;

// Enable audio after first user interaction
document.addEventListener("keydown", () => {
    if (!isAudioEnabled) {
        crashSound.play().then(() => {
            crashSound.pause();
            crashSound.currentTime = 0;
            isAudioEnabled = true;
        }).catch(err => {
            console.warn("Autoplay prevented:", err);
        });
    }
}, { once: true });

// Game Over
function gameOver() {
    isGameOver = true;

    document.getElementById("explode").style.display = "block";
    document.getElementById("game-over").style.display = "block";

    if (isAudioEnabled) {
        crashSound.currentTime = 1; // starts from 1 sec if needed
        crashSound.play();
    }
    setTimeout(() => location.reload(), 2000);
}


