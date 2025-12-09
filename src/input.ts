export default class Input {
  private keys: Set<string> = new Set();
  constructor() {
    window.addEventListener("keydown", (e) => this.keys.add(e.code));
    window.addEventListener("keyup", (e) => this.keys.delete(e.code));
  }
  isKeyPressed(code: string) {
    return this.keys.has(code);
  }
}
