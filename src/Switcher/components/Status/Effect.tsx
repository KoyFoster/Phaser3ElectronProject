import Phaser from "phaser";
import {
  IComponent,
  IComponentsService,
} from "../../services/ComponentService";
import { Entity } from "../Entity";
import { IEntityProps } from "../Properties/Entity";

export class Effect implements IComponent {
  private gameObject!: Phaser.GameObjects.GameObject;
  private components!: IComponentsService;
  private properties?: IEntityProps;
  private lifeTime = 1000 as number;
  private timer = 0 as number;
  private mod = 0.5 as number;
  private modValue?: number;

  init(go: Phaser.GameObjects.GameObject) {
    this.gameObject = go;

    if (this.components) {
      const ent = this.components.findComponent(this.gameObject, Entity);
      if (ent) this.properties = ent.properties;
    }
  }

  constructor(components: IComponentsService) {
    this.components = components;
  }

  update(dt: number) {
    this.timer += dt;
    if (this.timer > this.lifeTime) {
      // self destruct
      this.timer = 0;
      this.components.removeComponent(this.gameObject, this);
    }
  }

  awake() {}

  start() {
    if (!this.properties) return;

    // start and apply affect
    this.modValue = this.properties.baseSpeed * this.mod;
    this.properties.speed -= this.modValue;
  }

  destroy() {
    if (!this.properties || !this.modValue) return;

    // remove affect
    this.properties.speed += this.modValue;
  }
}
