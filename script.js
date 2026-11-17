
const arena = document.getElementById('arena');
const target = document.getElementById('target');
const scoreEl = document.getElementById('score');
const startButton = document.getElementById('startButton');
const hint = document.getElementById('hint');
const crosshair = document.getElementById('crosshair');
const bulletLayer = document.getElementById('bulletLayer');
const hitMessage = document.getElementById('hitMessage');
const toast = document.getElementById('toast');

let score = 0;
let playing = false;
let movementTimer = null;
let countdownTimer = null;
let toastTimer = null;
let timeLeft = 30;

const targetSize = 88;

// Move target randomly
function placeTarget() {
  const bounds = arena.getBoundingClientRect();

  const pad = targetSize / 2 + 16;
  const minX = pad;
  const maxX = Math.max(pad, bounds.width - pad);
  const minY = 65;
  const maxY = Math.max(minY, bounds.height - 55);

  const x = minX + Math.random() * (maxX - minX);
  const y = minY + Math.random() * (maxY - minY);

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
  target.style.transform = 'translate(-50%, -50%)';
  target.style.display = 'block';
  target.style.opacity = '1';
  target.style.pointerEvents = 'auto';
}

// Toast notification
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 1100);
}

// Bullet animation
function makeShot(fromX, fromY, toX, toY) {
  const line = document.createElement('span');

  line.className = 'bullet';

  const dx = toX - fromX;
  const dy = toY - fromY;
  const length = Math.hypot(dx, dy);

  line.style.left = `${fromX}px`;
  line.style.top = `${fromY}px`;
  line.style.width = `${length}px`;

  line.style.transform =
    `rotate(${Math.atan2(dy, dx)}rad)`;

  bulletLayer.appendChild(line);

  setTimeout(() => line.remove(), 260);
}

// Shooting function
function shoot(event) {
  if (!playing) return;

  const rect = arena.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const tRect = target.getBoundingClientRect();

  const tx = tRect.left - rect.left + tRect.width / 2;
  const ty = tRect.top - rect.top + tRect.height / 2;

  crosshair.style.left = `${x}px`;
  crosshair.style.top = `${y}px`;
  crosshair.style.display = 'block';

  makeShot(
    rect.width / 2,
    rect.height - 12,
    x,
    y
  );

  const hitRadius = targetSize * 0.58;

  if (Math.hypot(x - tx, y - ty) <= hitRadius) {
    registerHit();
  } else {
    showToast('Almost! Try again 💗');
  }
}

// Successful hit
function registerHit() {
  score += 1;

  scoreEl.textContent = String(score).padStart(2, '0');

  hitMessage.classList.remove('show');

  // Keep normal hit animation separate from final result
  if (!hitMessage.classList.contains('result-screen')) {
    hitMessage.innerHTML = '';
  }

  showToast('Perfect shot! +1 kiss 💋');
}

// Countdown timer
function startCountdown() {
  timeLeft = 30;

  hint.textContent = `Time Left: ${timeLeft}s`;

  countdownTimer = setInterval(() => {
    timeLeft--;

    hint.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// End game and show final result
function endGame() {
  playing = false;

  clearInterval(movementTimer);
  clearInterval(countdownTimer);

  target.style.pointerEvents = 'none';
  target.style.display = 'none';

  hint.textContent = 'Challenge completed! ❤️';
  startButton.textContent = 'PLAY AGAIN ♥';

  hitMessage.classList.add('result-screen');
  hitMessage.classList.add('show');

  hitMessage.innerHTML = `
    <div class="result-content">
      <h2>TIME'S UP! ❤️</h2>
      <h1>${score} KISSES 💋</h1>
      <p>You scored ${score} kisses!</p>
      <p>Now give all these kisses to Piyush! ❤️😘</p>
    </div>
  `;
}

// Start or restart game
function startGame() {
  score = 0;
  timeLeft = 30;

  scoreEl.textContent = '00';

  playing = true;

  clearInterval(movementTimer);
  clearInterval(countdownTimer);
  clearTimeout(toastTimer);

  // Completely reset previous result
  hitMessage.classList.remove('show');
  hitMessage.classList.remove('result-screen');
  hitMessage.innerHTML = '';

  // Reset target
  target.style.display = 'block';
  target.style.opacity = '1';
  target.style.pointerEvents = 'auto';

  // Start at a random position
  placeTarget();

  // Move target every 0.5 seconds
  movementTimer = setInterval(() => {
    if (playing) {
      placeTarget();
    }
  }, 500);

  startButton.textContent = 'RESTART GAME ♥';

  hint.textContent = 'Time Left: 30s';

  showToast('Let the kisses begin! 💋');

  // Start 30-second countdown
  startCountdown();
}

// Start button
startButton.addEventListener('click', startGame);

// Shooting event
arena.addEventListener('pointerdown', shoot);

// Crosshair movement
arena.addEventListener('pointermove', (event) => {
  if (!playing) return;

  const rect = arena.getBoundingClientRect();

  crosshair.style.left =
    `${event.clientX - rect.left}px`;

  crosshair.style.top =
    `${event.clientY - rect.top}px`;

  crosshair.style.display = 'block';
});

// Hide crosshair outside arena
arena.addEventListener('pointerleave', () => {
  crosshair.style.display = 'none';
});

// Floating hearts background
const hearts = document.querySelector('.hearts');

if (hearts) {
  for (let i = 0; i < 12; i++) {
    const heart = document.createElement('span');

    heart.className = 'float-heart';
    heart.textContent = i % 2 ? '♥' : '♡';

    heart.style.left = `${Math.random() * 100}%`;
    heart.style.bottom = `${-10 - Math.random() * 90}px`;
    heart.style.animationDelay = `${Math.random() * 8}s`;
    heart.style.animationDuration = `${7 + Math.random() * 7}s`;
    heart.style.fontSize = `${10 + Math.random() * 15}px`;

    hearts.appendChild(heart);
  }
}
