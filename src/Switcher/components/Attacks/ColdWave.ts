import Phaser from "phaser";
import { Entity } from "../../Entities/Entity";
import ComponentService, { IComponent } from "../../services/ComponentService";
import StateMachine from "../../statemachine/StateMachine";
import { Slow } from "../Status/Slow";
import { CommonPhysX } from "../Utils/CommonPhysX";
import { Attack } from "./Attack";

export class ColdWave extends Attack {
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
    this.force = 3000;
  }

  handleHit = (
    obj1: Phaser.GameObjects.GameObject &
      Phaser.GameObjects.Components.Transform,
    obj2: Entity
  ) => {
    // check if obj is also hit
    if (this.hitMobs.includes(obj2)) return;

    // add mob to hit list, then release when weapon goes on cooldown
    this.hitMobs.push(obj2);

    obj2.dealDamage(11);
    CommonPhysX.foeKnockback(
      this.gameObject.properties.faceAngle,
      obj2 as any,
      this.force
    );

    // Apply Slow: add only once
    if (!obj2.findComponent(Slow)) obj2.addComponent(new Slow());

    if (obj2.properties.hp <= 0) {
      this.components.removeAllComponents(obj2);
      obj2.destroy();
    }
  };

  // awake() {}

  // start() {}

  // destroy() {}
}
