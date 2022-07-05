import Phaser from "phaser";
import IComponentService, { IComponent } from "../services/ComponentService";
import StateMachine from "../statemachine/StateMachine";
import { Damage } from "./Damage";

export class Attack implements IComponent {
  private components!: IComponentService;
  private gameObject!: Phaser.GameObjects.GameObject &
    Phaser.GameObjects.Components.Transform;
  private hitbox!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private stateMachine!: StateMachine;
  private mobs?: Phaser.GameObjects.Image[] | Phaser.Physics.Arcade.Group;
  private parent?: Phaser.GameObjects.Image;
  // input bind
  private input?: () => boolean;

  // this may be creating a new instance of components
  init(
    go: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform,
    components: IComponentService
  ) {
    console.log({ go, components });
    this.gameObject = go;
    this.components = components;
    this.create();
  }

  constructor() {}

  create() {
    const { scene } = this.gameObject;
    this.hitbox = scene.add.rectangle(
      0,
      0,
      32,
      64,
      0xffffff,
      0.5
    ) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    scene.physics.add.existing(this.hitbox);
    this.hitbox.body.enable = false;
    scene.physics.world.remove(this.hitbox.body);

    this.stateMachine = new StateMachine(this, "generic-attack");
    this.stateMachine
      .addState("off-cooldown", {
        onEnter: this.offCoolDownEnter,
        onUpdate: this.offCoolDownUpdate,
      })
      .addState("attack", {
        onEnter: this.attackEnter,
        onUpdate: this.attackUpdate,
      })
      .setState("off-cooldown");
  }

  update(dt: number) {
    this.stateMachine.update(dt);
  }

  offCoolDownEnter() {
    // console.log("offCoolDownEnter");
  }

  offCoolDownUpdate() {
    if (this.input && this.input()) {
      // console.log("switching to attack");
      this.stateMachine.setState("attack");
    }
  }

  attackEnter() {
    // console.log("attackEnter");
    if (!this.parent) return;
    const { scene } = this.gameObject;

    this.hitbox.body.enable = true;
    scene.physics.world.add(this.hitbox.body);

    scene.time.delayedCall(500, () => {
      // console.log("attack timer end");
      this.hitbox.body.enable = false;
      scene.physics.world.remove(this.hitbox.body);
      this.stateMachine.setState("off-cooldown");
    });
  }

  attackUpdate() {
    if (!this.parent) return;
    this.hitbox.x =
      this.parent.x +
      (this.parent.flipX ? -this.parent.width : this.parent.width);

    this.hitbox.y = this.parent.y + this.parent.height * 0.2;
  }

  setParent(parent: Phaser.GameObjects.Image) {
    this.parent = parent;
  }

  setMobs(mobs: Phaser.GameObjects.Image[]) {
    this.mobs = mobs;
    // console.log({ mobs: this.mobs, hb: this.hitbox });
    this.gameObject.scene.physics.add.overlap(
      this.hitbox,
      this.mobs,
      this.handleHit,
      undefined,
      this.gameObject
    );
  }

  setInput(input: () => boolean) {
    this.input = input;
  }

  handleHit = (
    obj1: Phaser.GameObjects.GameObject &
      Phaser.GameObjects.Components.Transform,
    obj2: Phaser.GameObjects.GameObject &
      Phaser.GameObjects.Components.Transform
  ) => {
    // console.error("hit:", obj2);
    // obj2.destroy();
    const comp = this.components.findComponent(obj2, Damage);
    if (comp) {
      console.log("comp:", comp);
      comp.setState("damage");
      if (comp.getHP <= 90) {
        this.components.removeAllComponents(obj2)
        obj2.destroy();
      }
    }
  };

  awake() {
    // console.log("awake");
  }

  start() {
    // console.log("start");
  }

  destroy() {
  }

  private handleClick() {}
}
