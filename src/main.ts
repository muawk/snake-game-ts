import { SnakeGame } from "./game";

let game = new SnakeGame("game-canvas");
game.start();

(
  document.getElementById("restart-game-button") as HTMLButtonElement
).addEventListener("click", () => {
  game = new SnakeGame("game-canvas");
  game.start();
});
