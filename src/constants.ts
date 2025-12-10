export const UNIT = 25;
export const Colors = {
  Background: "black",
  GridOutline: "#c29558",
  GridEven: "#ddae7f",
  GridOdd: "#c89a5a",
  Snake: { r: 0, g: 255, b: 0 },
  SnakeOutline: "rgba(255,255,255,.25)",
  Food: "red",
  OverlayBackground: "rgba(122, 122, 122, .5)",
  Start: "lime",
  Over: "red",
};

export const LEVEL_UP_SCORE = 5;
export const MAX_LEVEL = 10;
export const INITIAL_SNAKE = [
  { x: UNIT * 3, y: 0 },
  { x: UNIT * 2, y: 0 },
  { x: UNIT, y: 0 },
  { x: 0, y: 0 },
];
export const INITIAL_FOOD_POSITION = { x: UNIT * 8, y: 0 };
export const INITIAL_SPEED = 200; // in milliseconds
export const SPEED_INCREMENT = 15; // in milliseconds
export const MIN_SPEED = 50; // in milliseconds
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 400;
export const HIGH_SCORE_KEY = "snake-game-high-score";
export const SCORE_THRESHOLD = 5;
export const SPEED_DECREASE = 20;
export const INITIAL_LEVEL = 1;
export const INITIAL_SCORE = 0;
