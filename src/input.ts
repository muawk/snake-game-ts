type Direction = "up" | "down" | "left" | "right";

export default class Input {
  private pressed: Record<string, boolean> = {};
  private dirQueue: Direction[] = [];
  private readonly MAX_QUEUE = 2;

  constructor() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const key = e.code || e.key;
    this.pressed[key] = true;

    // Map arrow keys to Direction and enqueue
    const dir = this.keyToDirection(key);
    if (dir) {
      // prevent overfilling queue
      if (this.dirQueue.length < this.MAX_QUEUE) {
        this.dirQueue.push(dir);
      }
      // prevent default scrolling behavior
      e.preventDefault();
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    const key = e.code || e.key;
    this.pressed[key] = false;
  };

  isKeyPressed(keyName: string) {
    return !!this.pressed[keyName];
  }

  // Called by game each tick to consume next requested direction (if any)
  getNextDirection(): Direction | undefined {
    return this.dirQueue.shift();
  }

  // Utility: peek without consuming (if needed)
  peekNextDirection(): Direction | undefined {
    return this.dirQueue[0];
  }

  // clear direction queue (useful on restart)
  clearQueue() {
    this.dirQueue.length = 0;
  }

  private keyToDirection(key: string): Direction | undefined {
    switch (key) {
      case "ArrowUp":
      case "Up":
        return "up";
      case "ArrowDown":
      case "Down":
        return "down";
      case "ArrowLeft":
      case "Left":
        return "left";
      case "ArrowRight":
      case "Right":
        return "right";
      default:
        return undefined;
    }
  }
}
