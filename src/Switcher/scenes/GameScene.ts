import Phaser from "phaser";
import ComponentService from "../services/ComponentService";

import bomb from "../../assets/bomb.png";

import { PhaserComponent } from "../components/Component";

export class GameScene extends Phaser.Scene {
  private components!: ComponentService;
  private entities: Phaser.GameObjects.Image[] = [];

  constructor() {
    super("Game");
    console.log('GameScene')
  }

  preload() {
    this.load.image("bomb", bomb);
  }


  init() {
    this.components = new ComponentService();
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.components.destroy();
    });
  }

  create() {
    this.add.text(20, 20, "Running game...", { fontSize: '32px', color: '#FFFF00' });
    const bomb = this.add.image(500, 500, "bomb");
    this.entities.push(bomb);
    this.components.addComponent(bomb, new PhaserComponent());
  }

  update(t: number, dt: number) {
    this.components.update(dt);
  }
}
