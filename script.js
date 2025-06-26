let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let username = "";
let interval;

function startGame() {
  username = document.getElementById("username").value.trim();
  if (!username) return alert("Enter your username!");
  document.getElementById("player-name").textContent = username;
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("game-container").classList.remove("hidden");
  drawFood();
  interval = setInterval(gameLoop, 150);
  updateLeaderboard();
}

function gameLoop() {
  const head = { ...snake[0] };
  head.x += direction.x;
  head.y += direction.y;
  if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    clearInterval(interval);
    saveScore();
    alert("Game Over!");
    return;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").textContent = score;
    drawFood();
  } else {
    snake.pop();
  }
  drawGame();
}

function drawGame() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "lime";
  snake.forEach(part => {
    ctx.fillRect(part.x * 20, part.y * 20, 20, 20);
  });
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
}

function drawFood() {
  food.x = Math.floor(Math.random() * 20);
  food.y = Math.floor(Math.random() * 20);
}

function restartGame() {
  score = 0;
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  document.getElementById("score").textContent = score;
  clearInterval(interval);
  interval = setInterval(gameLoop, 150);
}

document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp": direction = { x: 0, y: -1 }; break;
    case "ArrowDown": direction = { x: 0, y: 1 }; break;
    case "ArrowLeft": direction = { x: -1, y: 0 }; break;
    case "ArrowRight": direction = { x: 1, y: 0 }; break;
  }
});

function saveScore() {
  const today = new Date().toISOString().split('T')[0];
  const scores = JSON.parse(localStorage.getItem("leaderboard") || "{}");
  if (!scores["allTime"] || scores["allTime"].score < score) {
    scores["allTime"] = { username, score };
  }
  if (!scores[today] || scores[today].score < score) {
    scores[today] = { username, score };
  }
  localStorage.setItem("leaderboard", JSON.stringify(scores));
  updateLeaderboard();
}

function updateLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("leaderboard") || "{}");
  const today = new Date().toISOString().split('T')[0];
  document.getElementById("allTimeHigh").textContent =
    scores["allTime"] ? `${scores["allTime"].username} - ${scores["allTime"].score}` : "None";
  document.getElementById("todayHigh").textContent =
    scores[today] ? `${scores[today].username} - ${scores[today].score}` : "None";
}