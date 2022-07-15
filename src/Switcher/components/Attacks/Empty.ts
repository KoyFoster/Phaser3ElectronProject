import Phaser from "phaser";
import { Entity } from "../../Entities/Entity";
import ComponentService, { IComponent } from "../../services/ComponentService";
import StateMachine from "../../statemachine/StateMachine";
import { Effect } from "../Status/Effect";
import { CommonPhysX } from "../Utils/CommonPhysX";
import { Attack } from "./Attack";

export class Empty extends Attack {
  constructor(sprite?: string, fx?: string) {
    super(sprite, fx);
    this.stateMachine.setID("Enpty");
    this.force = 1000;
  }

  attackUpdate(dt: number) {}

  setkeyInput(keyInput: () => boolean) {}
  setMouseInput(mouseInput: string, context: Phaser.Scene) {}

  handleHit = (
    obj1: Phaser.GameObjects.GameObject &
      Phaser.GameObjects.Components.Transform,
    obj2: Entity
  ) => {};

  awake() {}

  start() {}

  destroy() {}
}
