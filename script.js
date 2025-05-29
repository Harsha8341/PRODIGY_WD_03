const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const canvas = document.getElementById('celebration');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let currentPlayer = 'X';
let board = Array(9).fill(null);
let gameActive = true;
let scoreX = 0;
let scoreO = 0;
let confettiParticles = [];

function checkWinner() {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  for (const pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      status.textContent = `Winner: ${board[a]}`;
      [a,b,c].forEach(i => cells[i].classList.add('winner'));
      gameActive = false;
      updateScore(board[a]);
      startCelebration();
      return;
    }
  }

  if (!board.includes(null)) {
    status.textContent = "It's a draw!";
    gameActive = false;
  }
}

function updateScore(player) {
  if (player === 'X') {
    scoreX++;
    scoreXEl.textContent = scoreX;
  } else {
    scoreO++;
    scoreOEl.textContent = scoreO;
  }
}

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = cell.getAttribute('data-index');
    if (!gameActive || board[index]) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken');
    checkWinner();

    if (gameActive) {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      status.textContent = `Current Turn: ${currentPlayer}`;
    }
  });
});

resetBtn.addEventListener('click', () => {
  board = Array(9).fill(null);
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken', 'winner');
  });
  gameActive = true;
  currentPlayer = 'X';
  status.textContent = 'Current Turn: X';
  confettiParticles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function startCelebration() {
  for (let i = 0; i < 100; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - 500,
      size: Math.random() * 8 + 4,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1
    });
  }
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiParticles.forEach(p => {
    p.y += p.speedY;
    p.x += p.speedX;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });
  confettiParticles = confettiParticles.filter(p => p.y < canvas.height);
  if (confettiParticles.length > 0) {
    requestAnimationFrame(animateConfetti);
  }
}
