import Phaser from "phaser";
import IComponentService, { IComponent } from "../services/ComponentService";
import StateMachine from "../statemachine/StateMachine";
import { Damage } from "./Damage";

export class Attack implements IComponent {
  private cooldown = 1000 as number;
  private cdTimer = 0 as number;
  private linger = 250 as number;
  private lTimer = 0 as number;
  private components!: IComponentService;
  private gameObject!: Phaser.GameObjects.GameObject &
    Phaser.GameObjects.Components.Transform;
  private hitbox!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private cdElipse!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private lElipse!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
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
    this.cdElipse = scene.add.rectangle(
        0,
        0,
        32,
        64,
        0xffffff,
        0.5
    ) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    this.lElipse = scene.add
      .rectangle(
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
      .addState("on-cooldown", {
        onEnter: this.onCoolDownEnter,
        onUpdate: this.onCoolDownUpdate,
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
      this.stateMachine.setState("attack");
    }
  }

  onCoolDownEnter() {}
  onCoolDownUpdate(dt: number) {
    this.cdTimer += dt;
    // console.log({dt, timer: this.cdTimer})
    if (this.cdTimer >= this.cooldown) {
      this.cdTimer = 0;
      this.stateMachine.setState("off-cooldown");
    }
    const angle = (this.cdTimer / this.cooldown) * 64;
    this.cdElipse.height = angle;
  }

  attackEnter() {
    // console.log("attackEnter");
    if (!this.parent) return;

    this.hitbox.body.enable = true;
    this.gameObject.scene.physics.world.add(this.hitbox.body);
  }

  attackUpdate(dt: number) {
    if (!this.parent) return;
    const x =
      this.parent.x +
      (this.parent.flipX ? -this.parent.width : this.parent.width);
    const y = this.parent.y + this.parent.height * 0.2;
    this.hitbox.x = x;
    this.hitbox.y = y;
    this.lElipse.x = x - 64;
    this.lElipse.y = y + 32;
    this.cdElipse.x = x - 32;
    this.cdElipse.y = y + 32;

    // timer
    this.lTimer += dt;
    // console.log({dt, timer: this.lTimer})
    if (this.lTimer >= this.linger) {
      this.lTimer = 0;
      this.hitbox.body.enable = false;
      const { scene } = this.gameObject;
      scene.physics.world.remove(this.hitbox.body);
      this.stateMachine.setState("on-cooldown");
    }

    const angle = (this.lTimer / this.linger) * 64;
    this.lElipse.height = angle;
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
    const comp = this.components.findComponent(obj2, Damage);
    if (comp) {
      comp.setState("damage");
      if (comp.getHP <= 100) {
        this.components.removeAllComponents(obj2);
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

  destroy() {}

  private handleClick() {}
}
