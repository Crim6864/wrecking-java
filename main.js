// Get the canvas element and its context
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Define paddle properties
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

// Define ball properties
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;

// Define control properties
var rightPressed = false;
var leftPressed = false;

// Define game state
var lives = 3;
var gameStarted = false; // Indicates if the game has started
var difficulty; // Stores the selected difficulty

// Define brick properties based on difficulty levels
var brickRowCount = 0;
var brickColumnCount = 0;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

function setDifficulty(level) {
    switch (level) {
        case 'easy':
            brickRowCount = 3;
            brickColumnCount = 5;
            break;
        case 'medium':
            brickRowCount = 4;
            brickColumnCount = 6;
            break;
        case 'hard':
            brickRowCount = 5;
            brickColumnCount = 7;
            break;
    }
}

// Create bricks
var bricks = [];
function createBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

// Event listeners for paddle control
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener("touchstart", touchStartHandler, false);
canvas.addEventListener("touchend", touchEndHandler, false);
canvas.addEventListener("touchmove", touchMoveHandler, false);


// Function to start the game with a delay
function startGameWithDelay(selectedDifficulty) {
    // Show announcement
    var announcement = document.createElement("div");
    announcement.textContent = "Starting game in 5 seconds...";
    document.body.appendChild(announcement);

    // Delay the start of the game
    setTimeout(function() {
        document.body.removeChild(announcement); // Remove announcement
        startGame(selectedDifficulty); // Start the game
        canvas.focus(); // Set focus to the canvas
    }, 5000); // Delay of 5 seconds
}

// Function to start the game
function startGame(selectedDifficulty) {
    difficulty = selectedDifficulty;
    setDifficulty(difficulty);
    createBricks();
    gameStarted = true;
    draw();
}

// Event listeners for difficulty buttons
document.getElementById("easy").addEventListener("click", function() {
    startGameWithDelay('easy');
});
document.getElementById("medium").addEventListener("click", function() {
    startGameWithDelay('medium');
});
document.getElementById("hard").addEventListener("click", function() {
    startGameWithDelay('hard');
});

// Set focus to the canvas when the page loads
canvas.focus();


// Function to start the game
function startGame(selectedDifficulty) {
    difficulty = selectedDifficulty;
    setDifficulty(difficulty);
    createBricks();
    gameStarted = true;
    canvas.focus(); // Set focus to the canvas
    draw();
}

// Event listeners for difficulty buttons
document.getElementById("easy").addEventListener("click", function() {
    startGameWithDelay('easy');
});
document.getElementById("medium").addEventListener("click", function() {
    startGameWithDelay('medium');
});
document.getElementById("hard").addEventListener("click", function() {
    startGameWithDelay('hard');
});

// Functions for paddle control
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function touchStartHandler(e) {
    var touch = e.touches[0];
    if (touch.pageX > canvas.width / 2) {
        rightPressed = true;
    } else {
        leftPressed = true;
    }
}

function touchEndHandler(e) {
    rightPressed = false;
    leftPressed = false;
}

function touchMoveHandler(e) {
    var touch = e.touches[0];
    if (touch.pageX > canvas.width / 2) {
        rightPressed = true;
        leftPressed = false;
    } else {
        leftPressed = true;
        rightPressed = false;
    }
}

// Collision detection for ball and bricks
function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var brick = bricks[c][r];
            if (brick.status == 1) {
                if (x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight) {
                    dy = -dy;
                    brick.status = 0;
                    if (bricks.every(row => row.every(brick => brick.status === 0))) {
                        alert("Congratulations! You win!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Draw the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Draw the bricks
function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Draw the score and lives
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

// Update game state
function update() {
    // Move the paddle
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    // Move the ball
    x += dx;
    y += dy;

    // Ball collision with walls
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        // Ball collision with paddle
        if (x > paddleX && x < paddleX + paddleWidth && y + dy > canvas.height - paddleHeight - ballRadius) {
            dy = -dy;
        } else {
            // Ball fell off the screen
            lives--;
            if (!lives) {
                alert("Game Over!");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    // Check for collision with bricks
    collisionDetection();
}

// Main draw function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    update();
    requestAnimationFrame(draw);
}

// Set focus to the canvas when the page loads
canvas.focus();
