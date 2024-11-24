const canvas = document.getElementById("timer-canvas");
const ctx = canvas.getContext("2d");

const timeDisplay = document.getElementById("time-display");
const startPauseButton = document.getElementById("start-pause");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const timeInputs = document.querySelector(".time-inputs");
const controls = document.querySelector(".controls");

// Timer Variables
let timeLeft = 0;
let totalTime = 0;
let running = false;
let timerInterval;

// Canvas Dimensions
const devicePixelRatio = window.devicePixelRatio || 1;
const baseCanvasWidth = 300;
const baseCanvasHeight = 300;
const scaledWidth = baseCanvasWidth * devicePixelRatio;
const scaledHeight = baseCanvasHeight * devicePixelRatio;

canvas.width = scaledWidth;
canvas.height = scaledHeight;
canvas.style.width = `${baseCanvasWidth}px`;
canvas.style.height = `${baseCanvasHeight}px`;

ctx.scale(devicePixelRatio, devicePixelRatio);

const centerX = baseCanvasWidth / 2;
const centerY = baseCanvasHeight / 2;
const radius = 120;
const lineExtension = 20;
const innerRadius = 100;

// Frame update interval (higher FPS for smooth animation)
const frameInterval = 16; // ~60 FPS

// Draw the timer visuals
function drawTimer(progress) {
  ctx.clearRect(0, 0, baseCanvasWidth, baseCanvasHeight);

  // Draw static inner circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#000";
  ctx.stroke();

  // Draw static radius line (12 o'clock) with extension
  const staticX = centerX;
  const staticY = centerY - radius - lineExtension;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(staticX, staticY);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#000";
  ctx.stroke();

  // Calculate the dynamic radius endpoint with extension
  const dynamicAngle = -Math.PI / 2 - 2 * Math.PI * progress; // Moves counterclockwise
  const dynamicX = centerX + (radius + lineExtension) * Math.cos(dynamicAngle);
  const dynamicY = centerY + (radius + lineExtension) * Math.sin(dynamicAngle);

  // Draw dynamic radius line with extension
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(dynamicX, dynamicY);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#000";
  ctx.stroke();

  // Draw the shrinking arc
  if (progress < 1) {
    const arcStartAngle = dynamicAngle; // Dynamic radius line
    const arcEndAngle = -Math.PI / 2; // Static radius line
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, arcStartAngle, arcEndAngle, true);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.stroke();
  }
}

// Update the timer display
function updateTimeDisplay() {
  const mins = Math.floor(timeLeft / 60);
  const secs = Math.floor(timeLeft % 60);
  timeDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Smooth countdown function
function smoothCountdown() {
  if (timeLeft > 0) {
    const elapsed = totalTime - timeLeft;
    const progress = elapsed / totalTime;
    drawTimer(progress);
    updateTimeDisplay();
  } else {
    clearInterval(timerInterval);
    running = false;
    startPauseButton.innerHTML = `
      <svg viewBox="0 0 100 100">
        <polygon points="30,20 80,50 30,80" fill="none" stroke="black" stroke-width="4"></polygon>
      </svg>`;
    showControls(); // Reappear controls when the motion ends
    drawTimer(1); // Ensure final state overlaps perfectly
  }
}

// Show or Hide Input and Button Containers
function hideControls() {
  timeInputs.style.display = "none";
  controls.style.display = "none";
}

function showControls() {
  timeInputs.style.display = "flex";
  controls.style.display = "flex";
}

// Start or Pause the Timer
startPauseButton.addEventListener("click", () => {
  if (running) {
    clearInterval(timerInterval);
    running = false;
    startPauseButton.innerHTML = `
      <svg viewBox="0 0 100 100">
        <polygon points="30,20 80,50 30,80" fill="none" stroke="black" stroke-width="4"></polygon>
      </svg>`;
    showControls();
  } else {
    const minutes = parseInt(minutesInput.value || "0", 10);
    const seconds = parseInt(secondsInput.value || "0", 10);

    if (timeLeft === 0) {
      totalTime = minutes * 60 + seconds;
      timeLeft = totalTime;
    }

    if (timeLeft > 0) {
      running = true;
      startPauseButton.innerHTML = `
        <svg viewBox="0

javascript
코드 복사
        <svg viewBox="0 0 100 100">
          <rect x="25" y="20" width="20" height="60" fill="none" stroke="black" stroke-width="4"></rect>
          <rect x="55" y="20" width="20" height="60" fill="none" stroke="black" stroke-width="4"></rect>
        </svg>`;
      hideControls();
      timerInterval = setInterval(() => {
        timeLeft -= frameInterval / 1000;
        if (timeLeft < 0) timeLeft = 0;
        smoothCountdown();
      }, frameInterval);
    }
  }
});

// Initialize Timer
updateTimeDisplay();
drawTimer(0);
