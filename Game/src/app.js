import {
  GRID_SIZE,
  createInitialState,
  getCellType,
  setDirection,
  stepGame,
  togglePause,
} from "./gameLogic.js";

const TICK_MS = 240;

const board = document.querySelector("#board");
const scoreValue = document.querySelector("#score");
const statusValue = document.querySelector("#status");
const pauseButton = document.querySelector("#pause-button");
const restartButton = document.querySelector("#restart-button");
const directionButtons = document.querySelectorAll("[data-direction]");

let state = createInitialState();

function buildBoard() {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < GRID_SIZE * GRID_SIZE; index += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    fragment.appendChild(cell);
  }

  board.appendChild(fragment);
}

function render() {
  const cells = board.children;

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const index = y * GRID_SIZE + x;
      const type = getCellType(state, x, y);
      cells[index].className = `cell${type === "empty" ? "" : ` ${type}`}`;
    }
  }

  scoreValue.textContent = String(state.score);
  statusValue.textContent = state.isGameOver
    ? "Game over"
    : state.isPaused
      ? "Paused"
      : "Running";
  pauseButton.textContent = state.isPaused ? "Resume" : "Pause";
}

function restart() {
  state = createInitialState();
  render();
}

function updateDirection(direction) {
  state = setDirection(state, direction);
}

function handleKeydown(event) {
  const keyMap = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    a: "left",
    s: "down",
    d: "right",
    W: "up",
    A: "left",
    S: "down",
    D: "right",
  };

  if (event.code === "Space") {
    event.preventDefault();
    state = togglePause(state);
    render();
    return;
  }

  const nextDirection = keyMap[event.key];
  if (nextDirection) {
    event.preventDefault();
    updateDirection(nextDirection);
  }
}

buildBoard();
render();

window.addEventListener("keydown", handleKeydown);
pauseButton.addEventListener("click", () => {
  state = togglePause(state);
  render();
});
restartButton.addEventListener("click", restart);
directionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updateDirection(button.dataset.direction);
  });
});

window.setInterval(() => {
  state = stepGame(state);
  render();
}, TICK_MS);
