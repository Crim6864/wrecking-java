$(document).ready(function() {
    var ball = document.getElementById('ball');
    var gameContainer = document.getElementById('game-container');
    var startBtn = document.getElementById('startBtn');
    var gameInterval;
  
    function moveBall() {
      var currentBottom = parseInt(window.getComputedStyle(ball).getPropertyValue('bottom'));
      ball.style.bottom = (currentBottom + 10) + 'px';
      if (currentBottom >= gameContainer.clientHeight - ball.clientHeight) {
        clearInterval(gameInterval);
        alert("Game Over!");
      }
    }
  
    startBtn.addEventListener('click', function() {
      gameInterval = setInterval(moveBall, 100);
    });
  
    // Touch feature for mobile
    ball.addEventListener('touchstart', function(event) {
      var touch = event.touches[0];
      var startX = touch.clientX;
      var startY = touch.clientY;
  
      function moveBallOnTouch(event) {
        var touch = event.touches[0];
        var offsetX = touch.clientX - startX;
        var offsetY = touch.clientY - startY;
  
        var currentBottom = parseInt(window.getComputedStyle(ball).getPropertyValue('bottom'));
        ball.style.bottom = (currentBottom - offsetY) + 'px';
  
        startX = touch.clientX;
        startY = touch.clientY;
      }
  
      function endTouch() {
        ball.removeEventListener('touchmove', moveBallOnTouch);
        ball.removeEventListener('touchend', endTouch);
      }
  
      ball.addEventListener('touchmove', moveBallOnTouch);
      ball.addEventListener('touchend', endTouch);
    });
  });
  