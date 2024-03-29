
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

    // Define brick properties
    var brickRowCount = 5;
    var brickColumnCount = 3;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;

    // Define game state
    var lives = 3;

    // Create bricks
    var bricks = [];
    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    // Event listeners for paddle control
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

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
            if (x > paddleX && x < paddleX + paddleWidth) {
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

    draw();