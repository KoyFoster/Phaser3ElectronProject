import Phaser from "phaser";
import { Entity } from "../../Entities/Entity";
import {
  IComponent,
  IComponentsService,
} from "../../services/ComponentService";
import { Effect } from "./Effect";

export class Juggle extends Effect {
  private peak = (this.lifeTime * 0.5) as number;
  private lift = 0 as number;
  private originalScale = 0 as number;

  // status properties
  shadow!: Phaser.GameObjects.Arc;

  init(go: Phaser.GameObjects.GameObject) {
    this.gameObject = go as Entity;
    // Create shadow
    this.shadow = this.gameObject.scene.add.circle(0, 0, 16, 0x000000, 0.5);
  }

  start() {
    this.originalScale = this.gameObject.scale;
    this.gameObject.setVelocity(0);
    console.log("originalScale:", this.originalScale);
  }

  constructor() {
    super();
  }

  update(dt: number) {
    this.timer += dt;
    this.lift += dt;
    if (this.timer > this.lifeTime) {
      // self destruct
      this.timer = 0;
      this.gameObject.removeComponent(this);
      return;
    }
    this.gameObject.properties.grounded = false;
    this.gameObject.setDrag(0);

    const scale = this.peak / this.lifeTime;

    this.gameObject.setScale(this.originalScale + scale);
    console.log("setScale juggle:", this.gameObject.scale);

    // update show to entity position
    this.shadow.setPosition(
      this.gameObject.body.position.x,
      this.gameObject.body.position.y
    );
  }
  destroy() {
    // remove effect
    console.log("destroy juggle:", this.originalScale);
    this.gameObject.setScale(this.originalScale);
    this.gameObject.properties.grounded = true;
    this.gameObject.setDrag(this.gameObject.properties.drag);

    this.shadow.destroy();
  }
}
