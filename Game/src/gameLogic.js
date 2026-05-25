export const GRID_SIZE = 16;
export const INITIAL_DIRECTION = "right";
export const INITIAL_SNAKE = [
  { x: 2, y: 8 },
  { x: 1, y: 8 },
  { x: 0, y: 8 },
];

const OFFSETS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export function createInitialState(random = Math.random) {
  const snake = INITIAL_SNAKE.map((segment) => ({ ...segment }));
  return {
    gridSize: GRID_SIZE,
    snake,
    direction: INITIAL_DIRECTION,
    pendingDirection: INITIAL_DIRECTION,
    food: placeFood(snake, GRID_SIZE, random),
    score: 0,
    isGameOver: false,
    isPaused: false,
  };
}

export function setDirection(state, nextDirection) {
  if (!OFFSETS[nextDirection] || state.isGameOver) {
    return state;
  }

  const activeDirection = state.pendingDirection || state.direction;
  if (OPPOSITES[activeDirection] === nextDirection) {
    return state;
  }

  return {
    ...state,
    pendingDirection: nextDirection,
  };
}

export function togglePause(state) {
  if (state.isGameOver) {
    return state;
  }

  return {
    ...state,
    isPaused: !state.isPaused,
  };
}

export function stepGame(state, random = Math.random) {
  if (state.isGameOver || state.isPaused) {
    return state;
  }

  const direction = state.pendingDirection || state.direction;
  const nextHead = getNextHead(state.snake[0], direction);
  const willEat = positionsEqual(nextHead, state.food);
  const collisionBody = willEat ? state.snake : state.snake.slice(0, -1);

  if (
    isOutOfBounds(nextHead, state.gridSize) ||
    collisionBody.some((segment) => positionsEqual(segment, nextHead))
  ) {
    return {
      ...state,
      direction,
      pendingDirection: direction,
      isGameOver: true,
    };
  }

  const nextSnake = [nextHead, ...state.snake];
  if (!willEat) {
    nextSnake.pop();
  }

  return {
    ...state,
    snake: nextSnake,
    direction,
    pendingDirection: direction,
    food: willEat ? placeFood(nextSnake, state.gridSize, random) : state.food,
    score: willEat ? state.score + 1 : state.score,
  };
}

export function placeFood(snake, gridSize, random = Math.random) {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const emptyCells = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        emptyCells.push({ x, y });
      }
    }
  }

  if (emptyCells.length === 0) {
    return null;
  }

  const index = Math.floor(random() * emptyCells.length);
  return emptyCells[index];
}

export function getCellType(state, x, y) {
  if (state.food && state.food.x === x && state.food.y === y) {
    return "food";
  }

  const segmentIndex = state.snake.findIndex(
    (segment) => segment.x === x && segment.y === y,
  );

  if (segmentIndex === 0) {
    return "head";
  }

  if (segmentIndex > 0) {
    return "snake";
  }

  return "empty";
}

function getNextHead(head, direction) {
  const offset = OFFSETS[direction];
  return {
    x: head.x + offset.x,
    y: head.y + offset.y,
  };
}

function positionsEqual(a, b) {
  return a.x === b.x && a.y === b.y;
}

function isOutOfBounds(position, gridSize) {
  return (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= gridSize ||
    position.y >= gridSize
  );
}
