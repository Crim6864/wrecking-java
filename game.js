window.onload = function () {
    // Game Constants
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800; // Set canvas width
    canvas.height = 600; // Set canvas height
    const ballRadius = 10;
    const paddleHeight = 10;
    const paddleWidth = 75;
    const paddleOffsetBottom = 30; // Adjust this value to set the distance from the bottom
    let brickRowCount = 5; // Variable to hold the number of rows of bricks
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
    let paddleY = canvas.height - paddleHeight - paddleOffsetBottom; // Adjusted paddle position
    let rightPressed = false;
    let leftPressed = false;
    let lives = 3; // Number of lives
    let gameStarted = false; // Flag to check if the game has started
    let bricksDestroyed = 0; // Counter for destroyed bricks

    // Initialize Bricks
    function initBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 }; // status 1 means the brick is active
            }
        }
        bricksDestroyed = 0; // Reset bricksDestroyed counter
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
        ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
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
                        bricksDestroyed++; // Increment bricksDestroyed counter
                        if (bricksDestroyed === brickRowCount * brickColumnCount) {
                            // All bricks destroyed, trigger win condition
                            alert('Congratulations! You Win!');
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

    // Collision Detection with Paddle
    function paddleCollisionDetection() {
        if (y + dy > paddleY - ballRadius && y + dy < paddleY + paddleHeight + ballRadius) {
            // Check if hitting the paddle region
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy; // Reverse vertical direction
            }
        } else if (y + dy > canvas.height - ballRadius) {
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

    // Draw Lives
    function drawLives() {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#0095DD';
        ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
    }

    // Draw Walls
    function drawWalls() {
        ctx.lineWidth = 5; // Thickness for walls
        ctx.strokeStyle = '#0095DD'; // Color for walls

        // Top wall
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, 0);
        ctx.stroke();

        // Right wall
        ctx.moveTo(canvas.width, 0);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.stroke();

        // Bottom wall
        ctx.moveTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.stroke();

        // Left wall
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(0, 0);
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

    // Event Listeners for Touch Controls
    canvas.addEventListener('touchstart', touchStartHandler, false);
    canvas.addEventListener('touchmove', touchMoveHandler, false);
    canvas.addEventListener('touchend', touchEndHandler, false);

    // Variables to track touch events
    let touchX = null;

    // Touch Start Handler
    function touchStartHandler(e) {
        e.preventDefault();
        const touch = e.touches[0];
        touchX = touch.clientX;
    }

    // Touch Move Handler
    function touchMoveHandler(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const relativeX = touch.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    // Touch End Handler
    function touchEndHandler(e) {
        e.preventDefault();
        touchX = null;
    }

    // Update Paddle Position for Touch Controls
    function updatePaddlePositionForTouch() {
        if (touchX !== null) {
            paddleX = touchX - paddleWidth / 2;
        }
    }

    // Function to start the game
    function startGame(difficulty) {
        // Initialize bricks based on difficulty
        if (difficulty === 'easy') {
            brickRowCount = 3;
        } else if (difficulty === 'medium') {
            brickRowCount = 4;
        } else if (difficulty === 'hard') {
            brickRowCount = 5;
        }

        // Initialize game elements
        initBricks();
        resetGame();
        gameStarted = true;
        // Set ball speed based on difficulty only if the game has not started yet
        if (!gameStarted) {
            if (difficulty === 'easy') {
                dx = 2;
                dy = -2;
            } else if (difficulty === 'medium') {
                dx = 3;
                dy = -3;
            } else if (difficulty === 'hard') {
                dx = 4;
                dy = -4;
            }
        }
        update();
    }

    // Start Button Event Listener
    document.getElementById('easyButton').addEventListener('click', function () {
        startGame('easy');
    });

    document.getElementById('mediumButton').addEventListener('click', function () {
        startGame('medium');
    });

    document.getElementById('hardButton').addEventListener('click', function () {
        startGame('hard');
    });

    // Reset Game Function
    function resetGame() {
        lives = 3;
        x = canvas.width / 2;
        y = canvas.height - 30;
        paddleX = (canvas.width - paddleWidth) / 2;
    }

    // Event Listeners for Keyboard Controls
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

    // Update Game Loop
    function update() {
        if (!gameStarted) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWalls();
        drawBricks();
        drawBall();
        drawPaddle();
        drawLives();
        collisionDetection();
        paddleCollisionDetection();
        wallCollisionDetection();
        updatePaddlePosition();
        updatePaddlePositionForTouch(); // Update paddle position for touch controls
        x += dx;
        y += dy;

        requestAnimationFrame(update);
    }

    update();
};
