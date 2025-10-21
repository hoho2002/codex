const ROWS = 20;
const COLS = 10;
const LINE_TARGET_PER_LEVEL = 10;
const DROP_SPEED_MIN = 120;
const DROP_SPEED_START = 900;

const TETROMINOES = [
  {
    name: "I",
    color: "#38bdf8",
    rotations: [
      [
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
        [2, 3],
      ],
    ],
  },
  {
    name: "J",
    color: "#6366f1",
    rotations: [
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [2, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
        [2, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [0, 2],
        [1, 2],
      ],
    ],
  },
  {
    name: "L",
    color: "#f97316",
    rotations: [
      [
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
        [0, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [1, 2],
      ],
    ],
  },
  {
    name: "O",
    color: "#facc15",
    rotations: [
      [
        [1, 0],
        [2, 0],
        [1, 1],
        [2, 1],
      ],
    ],
  },
  {
    name: "S",
    color: "#22c55e",
    rotations: [
      [
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
      ],
      [
        [1, 0],
        [1, 1],
        [2, 1],
        [2, 2],
      ],
    ],
  },
  {
    name: "T",
    color: "#a855f7",
    rotations: [
      [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [1, 1],
        [2, 1],
        [1, 2],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
        [1, 2],
      ],
      [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, 2],
      ],
    ],
  },
  {
    name: "Z",
    color: "#ef4444",
    rotations: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
      ],
      [
        [2, 0],
        [1, 1],
        [2, 1],
        [1, 2],
      ],
    ],
  },
];

const boardElement = document.getElementById("board");
const nextElement = document.getElementById("next");
const scoreElement = document.getElementById("score");
const linesElement = document.getElementById("lines");
const levelElement = document.getElementById("level");
const speedElement = document.getElementById("speed");
const statusElement = document.getElementById("status");
const startButton = document.getElementById("start-btn");
const pauseButton = document.getElementById("pause-btn");

const cells = createGrid(boardElement, ROWS, COLS);
const previewCells = createGrid(nextElement, 4, 4);

let board = createBoard();
let currentPiece = null;
let nextPiece = null;
let dropTimer = null;
let dropInterval = DROP_SPEED_START;
let isRunning = false;
let isPaused = false;
let score = 0;
let clearedLines = 0;
let level = 1;

function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function createGrid(container, rows, cols) {
  const items = [];
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      container.appendChild(cell);
      items.push(cell);
    }
  }
  return items;
}

function randomTetromino() {
  const shape = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
  return {
    name: shape.name,
    color: shape.color,
    rotation: 0,
    rotations: shape.rotations,
    x: Math.floor(COLS / 2) - 2,
    y: -2,
  };
}

function getCells(piece, offsetX = 0, offsetY = 0, rotationDelta = 0) {
  const total = piece.rotations.length;
  const rotationIndex = (piece.rotation + rotationDelta + total) % total;
  return piece.rotations[rotationIndex].map(([x, y]) => [piece.x + x + offsetX, piece.y + y + offsetY]);
}

function canPlace(piece, offsetX = 0, offsetY = 0, rotationDelta = 0) {
  return getCells(piece, offsetX, offsetY, rotationDelta).every(([x, y]) => {
    if (x < 0 || x >= COLS) {
      return false;
    }
    if (y >= ROWS) {
      return false;
    }
    if (y < 0) {
      return true;
    }
    return board[y][x] === null;
  });
}

function render() {
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const index = y * COLS + x;
      const cell = cells[index];
      const color = board[y][x];
      if (color) {
        cell.style.backgroundColor = color;
        cell.classList.add("filled");
      } else {
        cell.style.backgroundColor = "";
        cell.classList.remove("filled");
      }
    }
  }

  if (!currentPiece) {
    return;
  }

  getCells(currentPiece).forEach(([x, y]) => {
    if (y < 0 || y >= ROWS || x < 0 || x >= COLS) {
      return;
    }
    const index = y * COLS + x;
    const cell = cells[index];
    cell.style.backgroundColor = currentPiece.color;
    cell.classList.add("filled");
  });
}

function updatePreview() {
  previewCells.forEach((cell) => {
    cell.style.backgroundColor = "";
    cell.classList.remove("filled");
  });

  if (!nextPiece) {
    return;
  }

  const rotation = nextPiece.rotations[0];
  rotation.forEach(([x, y]) => {
    const index = y * 4 + x;
    const cell = previewCells[index];
    if (cell) {
      cell.style.backgroundColor = nextPiece.color;
      cell.classList.add("filled");
    }
  });
}

function spawnPiece() {
  currentPiece = nextPiece ?? randomTetromino();
  currentPiece.rotation = 0;
  currentPiece.x = Math.floor(COLS / 2) - 2;
  currentPiece.y = -2;
  nextPiece = randomTetromino();
  updatePreview();

  if (!canPlace(currentPiece)) {
    gameOver();
  }
}

function lockPiece() {
  getCells(currentPiece).forEach(([x, y]) => {
    if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
      board[y][x] = currentPiece.color;
    }
  });

  const cleared = clearLines();
  if (cleared > 0) {
    const scoreMap = [0, 100, 300, 500, 800];
    score += scoreMap[cleared] * level;
    clearedLines += cleared;
    updateLevel();
    statusElement.textContent = `Cleared ${cleared} ${cleared === 1 ? "line" : "lines"}!`;
  } else {
    statusElement.textContent = "";
  }

  spawnPiece();
  render();
}

function clearLines() {
  let lines = 0;
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    const isFull = board[row].every((value) => value !== null);
    if (isFull) {
      board.splice(row, 1);
      board.unshift(Array(COLS).fill(null));
      lines += 1;
      row += 1;
    }
  }
  return lines;
}

function updateLevel() {
  level = Math.floor(clearedLines / LINE_TARGET_PER_LEVEL) + 1;
  dropInterval = Math.max(DROP_SPEED_MIN, DROP_SPEED_START - (level - 1) * 70);
  updateScoreboard();
  restartTimer();
}

function updateScoreboard() {
  scoreElement.textContent = score.toString();
  linesElement.textContent = clearedLines.toString();
  levelElement.textContent = level.toString();
  const speedMultiplier = (1000 / dropInterval).toFixed(1);
  speedElement.textContent = `${speedMultiplier}x`;
}

function restartTimer() {
  if (dropTimer) {
    clearInterval(dropTimer);
  }
  if (isRunning && !isPaused) {
    dropTimer = setInterval(tick, dropInterval);
  }
}

function tick() {
  if (!currentPiece) {
    return;
  }

  if (canPlace(currentPiece, 0, 1)) {
    currentPiece.y += 1;
    render();
  } else {
    lockPiece();
  }
}

function movePiece(dx, dy) {
  if (!currentPiece) {
    return;
  }
  if (canPlace(currentPiece, dx, dy)) {
    currentPiece.x += dx;
    currentPiece.y += dy;
    if (dy > 0) {
      score += 1;
    }
    updateScoreboard();
    render();
  } else if (dy > 0) {
    lockPiece();
  }
}

function rotatePiece() {
  if (!currentPiece) {
    return;
  }
  if (canPlace(currentPiece, 0, 0, 1)) {
    currentPiece.rotation = (currentPiece.rotation + 1) % currentPiece.rotations.length;
    render();
    return;
  }

  // Simple wall kicks: attempt to nudge left or right once
  if (canPlace(currentPiece, -1, 0, 1)) {
    currentPiece.x -= 1;
    currentPiece.rotation = (currentPiece.rotation + 1) % currentPiece.rotations.length;
    render();
    return;
  }
  if (canPlace(currentPiece, 1, 0, 1)) {
    currentPiece.x += 1;
    currentPiece.rotation = (currentPiece.rotation + 1) % currentPiece.rotations.length;
    render();
  }
}

function hardDrop() {
  if (!currentPiece) {
    return;
  }
  let distance = 0;
  while (canPlace(currentPiece, 0, 1)) {
    currentPiece.y += 1;
    distance += 1;
  }
  score += distance * 2;
  updateScoreboard();
  render();
  lockPiece();
}

function startGame() {
  board = createBoard();
  score = 0;
  clearedLines = 0;
  level = 1;
  dropInterval = DROP_SPEED_START;
  nextPiece = randomTetromino();
  updateScoreboard();
  statusElement.textContent = "Good luck!";

  isRunning = true;
  isPaused = false;
  startButton.disabled = true;
  pauseButton.disabled = false;
  pauseButton.textContent = "Pause";

  spawnPiece();
  render();
  restartTimer();
}

function togglePause() {
  if (!isRunning) {
    return;
  }
  isPaused = !isPaused;
  if (isPaused) {
    clearInterval(dropTimer);
    statusElement.textContent = "Paused";
    pauseButton.textContent = "Resume";
  } else {
    statusElement.textContent = "";
    pauseButton.textContent = "Pause";
    restartTimer();
  }
}

function gameOver() {
  isRunning = false;
  isPaused = false;
  clearInterval(dropTimer);
  statusElement.textContent = "Game over! Press Start to play again.";
  pauseButton.disabled = true;
  pauseButton.textContent = "Pause";
  startButton.disabled = false;
}

function handleKeyDown(event) {
  if (!isRunning) {
    if (event.key.toLowerCase() === "p") {
      event.preventDefault();
    }
    return;
  }

  if (event.key === "p" || event.key === "P") {
    event.preventDefault();
    togglePause();
    return;
  }

  if (isPaused) {
    return;
  }

  switch (event.key) {
    case "ArrowLeft":
      event.preventDefault();
      movePiece(-1, 0);
      break;
    case "ArrowRight":
      event.preventDefault();
      movePiece(1, 0);
      break;
    case "ArrowDown":
      event.preventDefault();
      movePiece(0, 1);
      break;
    case "ArrowUp":
      event.preventDefault();
      rotatePiece();
      break;
    case " ":
      event.preventDefault();
      hardDrop();
      break;
    default:
      break;
  }
}

startButton.addEventListener("click", () => {
  startGame();
});

pauseButton.addEventListener("click", () => {
  togglePause();
});

document.addEventListener("keydown", handleKeyDown);

updateScoreboard();
render();
updatePreview();
