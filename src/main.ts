/***
 *
 * Canvas size 600 * 600 px
 * Unit (square) is 25 * 25 px
 * Total of 24 * 24 = 576 units (squares)
 *
 * 1. Press any key to start game
 * 2. Game over screen and Press 'r' key to restart the game
 * 3. Add score including high score and offline storage
 * 4. Add sound effects
 * 5. Add sprite animations for different actions
 * 6. Add different kinds of food items
 */

type Direction = "up" | "down" | "left" | "right";

type GameState = "NotStarted" | "Started" | "Over";

function getRandomIntInclusive(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

class Input {
  private keys: Set<string> = new Set();
  constructor() {
    window.addEventListener("keydown", (e) => this.keys.add(e.code));
    window.addEventListener("keyup", (e) => this.keys.delete(e.code));
  }
  isKeyPressed(code: string) {
    return this.keys.has(code);
  }
}

const UNIT = 25;

const Colors = {
  Background: "black",
  Grid: "rgba(255,255,255,.1)",
  Snake: { r: 0, g: 100, b: 0 },
  SnakeOutline: "rgba(255,255,255,.25)",
  Food: "red",
  OverlayBackground: "rgba(122, 122, 122, .5)",
  Start: "lime",
  Over: "red",
};

class SnakeGame {
  private ctx: CanvasRenderingContext2D;
  private snake = [
    { x: UNIT * 3, y: 0 },
    { x: UNIT * 2, y: 0 },
    { x: UNIT, y: 0 },
    { x: 0, y: 0 },
  ];
  private food = {
    x: UNIT * 8,
    y: 0,
  };
  private direction: Direction = "right";
  private startTimeMs: number = performance.now();
  private updateIntervals: number = 0;
  private input: Input;
  private speedInMs: number = 200;
  private gameState: GameState = "NotStarted";
  private sounds = {
    gameStart: new Audio("/assets/sound/game-start.mp3"),
    explode: new Audio("/assets/sound/explode.mp3"),
    gameOver: new Audio("/assets/sound/game-over.mp3"),
    swoosh: new Audio("/assets/sound/swoosh.mp3"),
    eat: new Audio("/assets/sound/eat.mp3"),
  };
  private images = {
    food: new Image(),
  };
  private level: number = 1;
  private score: number = 0;

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
    this.handleUserInput();
    if (this.gameState === "Over") return;

    const deltaInMs = timestampInMs - this.startTimeMs;

    this.startTimeMs = timestampInMs;

    // const fps = 1000 / deltaInMs;
    this.update(deltaInMs);
    this.render();
    requestAnimationFrame(this.loop);
  };

  private handleUserInput = () => {
    if (this.input.isKeyPressed("Space") && this.gameState === "NotStarted") {
      this.sounds.gameStart.play();
      this.gameState = "Started";
    } else if (
      this.input.isKeyPressed("ArrowUp") &&
      this.direction !== "down"
    ) {
      this.sounds.swoosh.play();
      this.direction = "up";
    } else if (
      this.input.isKeyPressed("ArrowDown") &&
      this.direction !== "up"
    ) {
      this.sounds.swoosh.play();
      this.direction = "down";
    } else if (
      this.input.isKeyPressed("ArrowLeft") &&
      this.direction !== "right"
    ) {
      this.sounds.swoosh.play();
      this.direction = "left";
    } else if (
      this.input.isKeyPressed("ArrowRight") &&
      this.direction !== "left"
    ) {
      this.sounds.swoosh.play();
      this.direction = "right";
    }
  };

  private update = (deltaInMs: number) => {
    if (this.gameState !== "Started") return;
    this.updateIntervals += deltaInMs;
    if (this.updateIntervals < this.speedInMs) return;
    this.updateIntervals = 0;
    // Let's move the snake
    // Find the head first
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
      if (this.score % 5 === 0) {
        this.level++;
        this.speedInMs = Math.max(50, this.speedInMs - 20);
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
        this.ctx.strokeStyle = Colors.Grid;
        this.ctx.strokeRect(x * UNIT, y * UNIT, UNIT, UNIT);
      }
    }
    this.ctx.fillStyle = "white";
    this.ctx.font = "Bold 18px monospace";
    this.ctx.textAlign = "right";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      `Level : ${this.level} | Score: ${this.score}`,
      this.ctx.canvas.width - 10,
      15
    );
  };

  private renderSnake = () => {
    this.snake.forEach((snakePart, index) => {
      // Draw the snake body
      this.ctx.fillStyle = `rgb(${Colors.Snake.r}, ${
        Colors.Snake.g + index * 10
      }, ${Colors.Snake.b})`;
      this.ctx.fillRect(snakePart.x, snakePart.y, UNIT, UNIT);
      // Draw the snake body outline
      this.ctx.strokeStyle = Colors.SnakeOutline;
      this.ctx.strokeRect(snakePart.x, snakePart.y, UNIT, UNIT);
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
    // this.ctx.fillStyle = Colors.Food;
    // this.ctx.fillRect(this.food.x, this.food.y, UNIT, UNIT);
    this.ctx.drawImage(this.images.food, this.food.x, this.food.y, UNIT, UNIT);
  };

  private spawnFood = (): void => {
    const spawnPosition = {
      x: getRandomIntInclusive(0, this.ctx.canvas.width / UNIT - 1) * UNIT,
      y: getRandomIntInclusive(0, this.ctx.canvas.height / UNIT - 1) * UNIT,
    };
    // Ensure food is not spawned behind the snake
    for (const snakePart of this.snake) {
      if (snakePart.x === spawnPosition.x && snakePart.y === spawnPosition.y) {
        return this.spawnFood();
      }
    }

    this.food = { ...spawnPosition };
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
    this.images.food.src = "/assets/images/apple.svg";
  };

  start = () => {
    requestAnimationFrame(this.loop);
  };
}

let game = new SnakeGame("game-canvas");
game.start();

(
  document.getElementById("restart-game-button") as HTMLButtonElement
).addEventListener("click", () => {
  game = new SnakeGame("game-canvas");
  game.start();
});
