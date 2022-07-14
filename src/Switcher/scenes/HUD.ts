import Phaser from "phaser";

export default class HUD extends Phaser.Scene {
  constructor() {
    super("hud");
  }

  preload() {}

  init(data: {}) {
    console.log("HUD:", data);
  }

  create() {
    this.add.text(200, 20, "HUD...", {
      fontSize: "32px",
      color: "#FFFF00",
    });
  }

  update(t: number, dt: number) {}

  destroy() {}
}
