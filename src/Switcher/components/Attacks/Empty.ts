import Phaser from "phaser";
import { Entity } from "../../Entities/Entity";
import ComponentService, { IComponent } from "../../services/ComponentService";
import StateMachine from "../../statemachine/StateMachine";
import { Effect } from "../Status/Effect";
import { CommonPhysX } from "../Utils/CommonPhysX";
import { Attack } from "./Attack";

export class Empty extends Attack {
  constructor() {
    super();
    this.extendInit();
  }

  // attackUpdate(dt: number) {}
  // setkeyInput(keyInput: () => boolean) {}
  // setMouseInput(mouseInput: string, context: Phaser.Scene) {}

  // Remapping init so that we can add to it
  private extendInit() {
    // extend destroy
    this.i = this.init;
    this.init = this.initialize;
  }
  i(
    go: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform,
    components: ComponentService
  ) {}
  initialize(
    go: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform,
    components: ComponentService
  ) {
    this.i(go, components);

   //  this.stateMachine.setID("Empty");
    this.force = 1000;
  }

  // handleHit = (
  //   obj1: Phaser.GameObjects.GameObject &
  //     Phaser.GameObjects.Components.Transform,
  //   obj2: Entity
  // ) => {};

  // awake() {}

  // start() {}

  // destroy() {}
}
