import Phaser from "phaser";
import { Entity } from "../../Entities/Entity";
import {
  IComponent,
  IComponentsService,
} from "../../services/ComponentService";

export class Effect implements IComponent {
  protected gameObject!: Entity;
  protected lifeTime = 200 as number;
  protected timer = 0 as number;
  protected mod = 0.75 as number;
  protected modValue?: number;

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
      return;
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
