import Phaser from "phaser";
import IComponentService from "../services/ComponentService";

import bomb from "../../assets/bomb.png";

import { PhaserComponent } from "../components/Component";
import StateMachine from "../statemachine/StateMachine";
import Spawner from "../components/Spawner";

export class GameScene extends Phaser.Scene {
  private stateMachine!: StateMachine;
  private components!: IComponentService;
  private entities: Phaser.GameObjects.Image[] = [];
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("Game");
  }

  preload() {
    this.load.image("bomb", bomb);
  }


  init() {
    this.components = new IComponentService();
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.components.destroy();
    });
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.stateMachine = new StateMachine(this);
    this.add.text(20, 20, "Running game...", { fontSize: '32px', color: '#FFFF00' });
    const bomb = this.add.image(500, 500, "bomb");
    this.entities.push(bomb);
    this.components.addComponent(bomb, new PhaserComponent());
    this.components.addComponent(bomb, new Spawner(this.cursors, this.cursors));
  }

  update(t: number, dt: number) {
    this.stateMachine.update(dt);
    this.components.update(dt);
  }
}
