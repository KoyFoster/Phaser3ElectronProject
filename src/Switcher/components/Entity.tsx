import Phaser from "phaser";
import { IComponent } from "../services/ComponentService";
import { EntityProps } from "./Properties/Entity";

export class Entity implements IComponent {
  private gameObject!: Phaser.GameObjects.GameObject;
  public properties = { ...EntityProps };

  // Entity Properties
  constructor() {

  }

  init(go: Phaser.GameObjects.GameObject) {
    this.gameObject = go;
  }

  awake() {}

  start() {}

  destroy() {}
}
