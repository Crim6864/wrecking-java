// Game Constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let bricks = [];
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let lives = 3; // Number of lives

// Initialize Bricks
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }; // status 1 means the brick is active
    }
}

// Draw Bricks
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#0095DD';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Collision Detection with Bricks
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];
            if (brick.status === 1) {
                if (x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight) {
                    dy = -dy;
                    brick.status = 0; // Set brick status to 0, meaning it's destroyed
                }
            }
        }
    }
}

// Collision Detection with Paddle
function paddleCollisionDetection() {
    if (y + dy > canvas.height - ballRadius - paddleHeight) {
        // Check if hitting bottom wall
        if (x > paddleX && x < paddleX + paddleWidth) {
            // Check if ball hits the top edge of the paddle
            if (y + dy < canvas.height - paddleHeight + ballRadius) {
                dy = -dy; // Reverse vertical direction if hitting top edge of paddle
            } else {
                // Calculate the angle of the bounce based on where the ball hits the paddle
                const collidePoint = x - (paddleX + paddleWidth / 2);
                const normalizedCollidePoint = collidePoint / (paddleWidth / 2);
                const bounceAngle = normalizedCollidePoint * Math.PI / 3; // Adjust the bounce angle as needed
                dx = ballRadius * Math.sin(bounceAngle);
                dy = -ballRadius * Math.cos(bounceAngle);
            }
        } else {
            // Ball misses the paddle, lose a life
            lives--;
            if (!lives) {
                // No more lives, game over
                alert('Game Over');
                document.location.reload();
            } else {
                // Reset ball position and continue game
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
}

// Draw Lives
function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

// Draw Walls
function drawWalls() {
    ctx.beginPath();
    ctx.moveTo(0, 0); // Top-left corner
    ctx.lineTo(canvas.width, 0); // Top-right corner
    ctx.lineTo(canvas.width, canvas.height); // Bottom-right corner
    ctx.lineTo(0, canvas.height); // Bottom-left corner
    ctx.closePath();
    ctx.strokeStyle = '#0095DD';
    ctx.stroke();
}

// Wall Collision Detection
function wallCollisionDetection() {
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx; // Reverse horizontal direction if hitting left or right wall
    }
    if (y + dy < ballRadius) {
        dy = -dy; // Reverse vertical direction if hitting top wall
    }
}

// Update Paddle Position
function updatePaddlePosition() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
}

// Event Listeners
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
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

// Update Game
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWalls(); // Draw walls
    drawBricks();
    drawBall();
    drawPaddle();
    drawLives();
    collisionDetection();
    paddleCollisionDetection();
    wallCollisionDetection();
    updatePaddlePosition();
    x += dx;
    y += dy;

    requestAnimationFrame(update);
}

update();
