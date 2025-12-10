import type { Direction, GameState } from "./types";

import {
  gameStartSound,
  explodeSound,
  gameOverSound,
  swooshSound,
  eatSound,
} from "./assets/sounds/index";
import { appleImage } from "./assets/images/index";
import { getRandomIntInclusive } from "./utils";
import Input from "./input";
import {
  UNIT,
  Colors,
  INITIAL_SNAKE,
  INITIAL_FOOD_POSITION,
  INITIAL_SPEED,
  SCORE_THRESHOLD,
  MIN_SPEED,
  SPEED_DECREASE,
  INITIAL_LEVEL,
  INITIAL_SCORE,
} from "./constants";

class SnakeGame {
  private ctx: CanvasRenderingContext2D;
  private snake = [...INITIAL_SNAKE];
  private food = { ...INITIAL_FOOD_POSITION };
  private direction: Direction = "right";
  private startTimeMs: number = performance.now();
  // accumulator for fixed-timestep updates (ms)
  private accumulatorMs: number = 0;
  private input: Input;
  private speedInMs: number = INITIAL_SPEED;
  private gameState: GameState = "NotStarted";
  private sounds = {
    gameStart: new Audio(gameStartSound),
    explode: new Audio(explodeSound),
    gameOver: new Audio(gameOverSound),
    swoosh: new Audio(swooshSound),
    eat: new Audio(eatSound),
  };
  private images = {
    food: new Image(),
  };
  private level: number = INITIAL_LEVEL;
  private score: number = INITIAL_SCORE;

  constructor(canvasId: string) {
    const canvas = document.getElementById(
      canvasId
    ) as HTMLCanvasElement | null;
    if (!canvas) throw Error(`Could not find canvas with id: ${canvasId}`);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw Error("Could not initialize 2D context");
    this.ctx = ctx;
    this.input = new Input();
    this.loadAssets();
  }

  private loop = (timestampInMs: number) => {
    // handle non-directional input (start/restart)
    if (this.input.isKeyPressed("Space") && this.gameState === "NotStarted") {
      this.sounds.gameStart.play();
      this.gameState = "Started";
      // clear queued directions on start to avoid unexpected immediate turns
      this.input.clearQueue();
    }

    if (this.gameState === "Over") return;

    const deltaInMs = timestampInMs - this.startTimeMs;
    this.startTimeMs = timestampInMs;

    // accumulate time and run fixed ticks (one movement per tick)
    this.accumulatorMs += deltaInMs;
    while (this.accumulatorMs >= this.speedInMs) {
      this.accumulatorMs -= this.speedInMs;
      this.updateTick(); // single movement/update tick
    }

    this.render();
    requestAnimationFrame(this.loop);
  };

  // helper: ignore opposite direction changes
  private isOpposite(dirA: Direction, dirB: Direction) {
    return (
      (dirA === "up" && dirB === "down") ||
      (dirA === "down" && dirB === "up") ||
      (dirA === "left" && dirB === "right") ||
      (dirA === "right" && dirB === "left")
    );
  }

  // perform a single movement tick — consumes at most one buffered direction
  private updateTick = () => {
    if (this.gameState !== "Started") return;

    // consume one buffered direction, validate it
    const nextDir = this.input.getNextDirection();
    if (nextDir && !this.isOpposite(nextDir, this.direction)) {
      this.sounds.swoosh.play();
      this.direction = nextDir;
    }

    // Move the snake one unit
    const head = this.snake[0]!;
    const newHead = { ...head };
    switch (this.direction) {
      case "up":
        newHead.y -= UNIT;
        break;
      case "down":
        newHead.y += UNIT;
        break;
      case "left":
        newHead.x -= UNIT;
        break;
      case "right":
        newHead.x += UNIT;
        break;
    }

    if (this.isGameOver(newHead)) {
      this.gameState = "Over";
      this.sounds.explode.play();
      setTimeout(() => {
        this.sounds.gameOver.play();
      }, 500);
      return;
    }

    this.snake.unshift(newHead);

    if (newHead.x === this.food.x && newHead.y === this.food.y) {
      this.sounds.eat.play();
      this.score++;
      if (this.score % SCORE_THRESHOLD === 0) {
        this.level++;
        this.speedInMs = Math.max(MIN_SPEED, this.speedInMs - SPEED_DECREASE);
      }
      this.spawnFood();
      return;
    }

    this.snake.pop();
  };

  private isGameOver = (head: { x: number; y: number }): boolean => {
    if (
      head.x < 0 ||
      head.x > this.ctx.canvas.width - UNIT ||
      head.y < 0 ||
      head.y > this.ctx.canvas.height - UNIT
    ) {
      return true;
    }
    if (
      this.snake.some(
        (snakePart) => snakePart.x === head.x && snakePart.y === head.y
      )
    ) {
      return true;
    }
    return false;
  };

  private renderGrid = () => {
    // Remove (clear) everything in canvas
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = Colors.Background;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    const numberOfRows = this.ctx.canvas.width / UNIT;
    const numberOfCols = this.ctx.canvas.height / UNIT;
    for (let x = 0; x < numberOfRows; x++) {
      for (let y = 0; y < numberOfCols; y++) {
        this.ctx.strokeStyle = Colors.GridOutline;
        this.ctx.fillStyle =
          (x + y) % 2 === 0 ? Colors.GridEven : Colors.GridOdd;
        this.ctx.fillRect(x * UNIT, y * UNIT, UNIT, UNIT);
        this.ctx.strokeRect(x * UNIT, y * UNIT, UNIT, UNIT);
      }
    }
    this.ctx.fillStyle = "white";
    this.ctx.font = "Bold 18px monospace";
    this.ctx.textAlign = "right";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      `Level: ${this.level} | Score: ${this.score}`,
      this.ctx.canvas.width - 10,
      15
    );
  };

  // add two eyes in which ever direction the snake is moving
  private renderEyes = () => {
    const head = this.snake[0]!;
    const eyeOffsetX = UNIT / 5;
    const eyeOffsetY = UNIT / 5;
    const eyeSize = UNIT / 5;

    let leftEyeX = head.x + eyeOffsetX;
    let leftEyeY = head.y + eyeOffsetY;
    let rightEyeX = head.x + UNIT - eyeOffsetX - eyeSize;
    let rightEyeY = head.y + eyeOffsetY;

    if (this.direction === "down") {
      leftEyeY = head.y + UNIT - eyeOffsetY - eyeSize;
      rightEyeY = head.y + UNIT - eyeOffsetY - eyeSize;
    } else if (this.direction === "left") {
      leftEyeX = head.x + eyeOffsetX;
      rightEyeX = head.x + eyeOffsetX;
      leftEyeY = head.y + UNIT - eyeOffsetY - eyeSize;
      rightEyeY = head.y + eyeOffsetY;
    } else if (this.direction === "right") {
      leftEyeX = head.x + UNIT - eyeOffsetX - eyeSize;
      rightEyeX = head.x + UNIT - eyeOffsetX - eyeSize;
      leftEyeY = head.y + eyeOffsetY;
      rightEyeY = head.y + UNIT - eyeOffsetY - eyeSize;
    }

    this.ctx.fillStyle = "white";
    this.ctx.fillRect(leftEyeX, leftEyeY, eyeSize, eyeSize);
    this.ctx.fillRect(rightEyeX, rightEyeY, eyeSize, eyeSize);
  };

  private renderSnake = () => {
    this.snake.forEach((snakePart, index) => {
      // Draw the snake body
      this.ctx.fillStyle = `rgb(${Colors.Snake.r}, ${
        Colors.Snake.g - index * 10
      }, ${Colors.Snake.b})`;
      this.ctx.fillRect(snakePart.x, snakePart.y, UNIT, UNIT);
      // Draw the snake body outline
      this.ctx.strokeStyle = Colors.SnakeOutline;
      this.ctx.strokeRect(snakePart.x, snakePart.y, UNIT, UNIT);

      if (index === 0) {
        this.renderEyes();
        return;
      }
    });
  };

  private renderGameState = () => {
    if (this.gameState === "Started") return;
    const message =
      this.gameState === "Over"
        ? "Game Over!"
        : "Press 'spacebar' to start the game";
    this.ctx.fillStyle = Colors.OverlayBackground;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.font = "Bold 24px monospace";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = this.gameState === "Over" ? Colors.Over : Colors.Start;

    this.ctx.fillText(
      message,
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2
    );
  };

  private renderFood = () => {
    this.ctx.drawImage(this.images.food, this.food.x, this.food.y, UNIT, UNIT);
  };

  private spawnFood = (): void => {
    let spawnPosition: { x: number; y: number } = { x: 0, y: 0 };
    let isValidPosition = false;

    while (!isValidPosition) {
      spawnPosition = {
        x: getRandomIntInclusive(0, this.ctx.canvas.width / UNIT - 1) * UNIT,
        y: getRandomIntInclusive(0, this.ctx.canvas.height / UNIT - 1) * UNIT,
      };

      // Ensure food is not spawned on the snake
      isValidPosition = !this.snake.some(
        (snakePart) =>
          snakePart.x === spawnPosition.x && snakePart.y === spawnPosition.y
      );
    }

    this.food = spawnPosition;
  };

  private render = () => {
    this.renderGrid();
    this.renderFood();
    this.renderSnake();
    this.renderGameState();
  };

  private loadAssets = () => {
    Object.values(this.sounds).forEach((sound) => {
      sound.load();
    });
    this.images.food.src = appleImage;
  };

  start = () => {
    requestAnimationFrame(this.loop);
  };
}
export { SnakeGame };
export default SnakeGame;
