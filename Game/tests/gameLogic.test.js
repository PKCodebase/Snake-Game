import test from "node:test";
import assert from "node:assert/strict";

import {
  createInitialState,
  placeFood,
  setDirection,
  stepGame,
} from "../src/gameLogic.js";

test("snake moves one cell in its current direction", () => {
  const state = createInitialState(() => 0);
  const nextState = stepGame(state, () => 0);

  assert.deepEqual(nextState.snake[0], { x: 3, y: 8 });
  assert.equal(nextState.score, 0);
});

test("snake grows and score increases after eating food", () => {
  const state = {
    ...createInitialState(() => 0),
    food: { x: 3, y: 8 },
  };

  const nextState = stepGame(state, () => 0);

  assert.equal(nextState.snake.length, state.snake.length + 1);
  assert.equal(nextState.score, 1);
  assert.notDeepEqual(nextState.food, state.food);
});

test("reverse direction input is ignored", () => {
  const state = createInitialState(() => 0);
  const nextState = setDirection(state, "left");

  assert.equal(nextState.pendingDirection, "right");
});

test("wall collisions end the game", () => {
  const state = {
    ...createInitialState(() => 0),
    snake: [{ x: 15, y: 8 }, { x: 14, y: 8 }, { x: 13, y: 8 }],
    direction: "right",
    pendingDirection: "right",
  };

  const nextState = stepGame(state, () => 0);

  assert.equal(nextState.isGameOver, true);
});

test("self collisions end the game", () => {
  const state = {
    ...createInitialState(() => 0),
    snake: [
      { x: 4, y: 4 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
      { x: 3, y: 4 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
    ],
    direction: "up",
    pendingDirection: "left",
  };

  const nextState = stepGame(state, () => 0);

  assert.equal(nextState.isGameOver, true);
});

test("food placement skips occupied cells", () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];

  const food = placeFood(snake, 3, () => 0);

  assert.deepEqual(food, { x: 0, y: 1 });
});
