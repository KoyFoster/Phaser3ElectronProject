import Phaser from "phaser";
import { Entity } from "../../Entities/Entity";
import {
  IComponent,
  IComponentsService,
} from "../../services/ComponentService";

export class Effect implements IComponent {
  private gameObject!: Entity;
  private lifeTime = 1000 as number;
  private timer = 0 as number;
  private mod = 0.5 as number;
  private modValue?: number;

  init(go: Phaser.GameObjects.GameObject) {
    this.gameObject = go as Entity;
  }

  constructor() {}

  update(dt: number) {
    this.timer += dt;
    if (this.timer > this.lifeTime) {
      // self destruct
      this.timer = 0;
      this.gameObject.removeComponent(this);
    }
  }

  awake() {}

  start() {
    // start and apply affect
    this.modValue = this.gameObject.properties.baseSpeed * this.mod;
    this.gameObject.properties.speed -= this.modValue;
  }

  destroy() {
    if (!this.modValue) return;

    // remove affect
    this.gameObject.properties.speed += this.modValue;
  }
}
