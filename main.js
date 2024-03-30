// Game Constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ballRadius = 20;
const paddleHeight = 10;
const paddleWidth = 75;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let paddleX = (canvas.width - paddleWidth) / 2;

// Touch Controls
let touchStartX = 0;
let touchEndX = 0;

canvas.addEventListener('touchstart', touchStart, false);
canvas.addEventListener('touchend', touchEnd, false);

function touchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
}

function touchEnd(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleTouchControls();
}

function handleTouchControls() {
    const touchDiff = touchEndX - touchStartX;
    if (touchDiff > 0) {
        // Swipe right
        paddleX += 10;
    } else {
        // Swipe left
        paddleX -= 10;
    }
}

// Draw Ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

// Draw Paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

// Collision Detection
function collisionDetection() {
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            alert('Game Over');
            document.location.reload();
        }
    }
}

// Update Game
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    collisionDetection();

    x += dx;
    y += dy;

    requestAnimationFrame(update);
}

update();
