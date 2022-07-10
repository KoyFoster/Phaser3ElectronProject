import Phaser from "phaser";
import ComponentService, { IComponent } from "../services/ComponentService";
import StateMachine from "../statemachine/StateMachine";
import { Effect } from "./Status/Effect";
import { CommonPhysX } from "./Utils/CommonPhysX";

export class Attack implements IComponent {
  private cooldown = 500 as number;
  private cdTimer = 0 as number;
  private linger = 250 as number;
  private lTimer = 0 as number;

  private force = 500 as number;

  private components!: ComponentService;
  private gameObject!: Phaser.GameObjects.GameObject &
    Phaser.GameObjects.Components.Transform;
  private stateMachine!: StateMachine;

  private hitbox!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private mobs?: Phaser.GameObjects.Image[] | Phaser.Physics.Arcade.Group;

  private cdElipse!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private lElipse!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  // input binds
  private keyInput?: () => boolean;
  private mouseInput?: string;
  private inputContext?: Phaser.GameObjects.GameObject;

  // assets
  private sprite?: string;
  private fx?: string;

  // Text
  private nameText!: Phaser.GameObjects.Text;
  private name = "Basic Attack";

  // this may be creating a new instance of components
  init(
    go: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform,
    components: ComponentService
  ) {
    this.gameObject = go;
    this.components = components;
    this.create();
  }

  constructor(sprite?: string, fx?: string) {
    this.sprite = sprite;
    this.fx = fx;
  }

  create() {
    const { scene } = this.gameObject;

    this.nameText = scene.add
      .text(this.gameObject.x, this.gameObject.y - 90, `HP: ${this.name}`)
      .setOrigin(0.5);

    if (this.sprite) {
      this.hitbox = scene.physics.add.image(0, 0, this.sprite);
    } else {
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
    }
    this.hitbox.visible = false;

    this.cdElipse = scene.add.rectangle(
      0,
      0,
      32,
      64,
      0xffffff,
      0.5
    ) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

    this.lElipse = scene.add.rectangle(
      0,
      0,
      32,
      64,
      0xffffff,
      0.5
    ) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
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
    this.nameText.setPosition(this.gameObject.x, this.gameObject.y - 90);
  }

  offCoolDownEnter() {}
  offCoolDownUpdate() {
    if (this.keyInput && this.keyInput()) {
      this.stateMachine.setState("attack");
    }
  }

  onCoolDownEnter() {}
  onCoolDownUpdate(dt: number) {
    this.cdTimer += dt;
    if (this.cdTimer >= this.cooldown) {
      this.cdTimer = 0;
      this.stateMachine.setState("off-cooldown");
    }
    const angle = (this.cdTimer / this.cooldown) * 64;
    this.cdElipse.height = angle;
  }

  setAttackInFront() {
    const x = this.gameObject.x;
    const y = this.gameObject.y;
    let dir = { x: 0, y: 0 };
    const angle = this.gameObject.mouseAngle;
    if (angle !== undefined) {
      dir = this.gameObject.scene.physics.velocityFromRotation(angle, 60);
      this.hitbox.rotation = angle + Math.PI * 0.5;
    }

    this.hitbox.setPosition(x + dir.x, y + dir.y);
    this.lElipse.setPosition(x - 64, y + 32);
    this.cdElipse.setPosition(x - 32, y + 32);
  }

  attackEnter() {
    if (!this.gameObject) return;

    this.hitbox.body.enable = true;
    this.hitbox.visible = true;
    this.gameObject.scene.physics.world.add(this.hitbox.body);
    if (this.fx) this.gameObject.scene.sound.play(this.fx);

    // Position into the facing direction
    this.setAttackInFront();
  }

  attackUpdate(dt: number) {
    if (!this.gameObject) return;

    // Position into the facing direction
    this.setAttackInFront();

    // timer
    this.lTimer += dt;
    if (this.lTimer >= this.linger) {
      this.lTimer = 0;
      this.hitbox.body.enable = false;
      this.hitbox.visible = false;
      const { scene } = this.gameObject;
      scene.physics.world.remove(this.hitbox.body);
      this.stateMachine.setState("on-cooldown");
    }

    const angle = (this.lTimer / this.linger) * 64;
    this.lElipse.height = angle;
  }

  setMobs(mobs: Phaser.GameObjects.Image[]) {
    this.mobs = mobs;
    this.gameObject.scene.physics.add.overlap(
      this.hitbox,
      this.mobs,
      this.handleHit,
      undefined,
      this.gameObject
    );
  }

  setkeyInput(keyInput: () => boolean) {
    this.keyInput = keyInput;
  }
  setMouseInput(mouseInput: string, context: Phaser.GameObjects.GameObject) {
    if (mouseInput) this.mouseInput = mouseInput;
    this.inputContext = context;
    context.input.on(mouseInput, () => {
      this.stateMachine.setState("attack");
    });
  }

  handleHit = (
    obj1: Phaser.GameObjects.GameObject &
      Phaser.GameObjects.Components.Transform,
    obj2: Phaser.GameObjects.GameObject &
      Phaser.GameObjects.Components.Transform
  ) => {
    console.error("hit");
    obj2.dealDamage(11);
    CommonPhysX.foeKnockback(this.gameObject.mouseAngle, obj2, this.force);

    // Apply Slow: add only once
    const effect = this.components.findComponent(obj2, Effect);
    if (!effect)
      this.components.addComponent(obj2, new Effect(this.components));

    console.log(obj2.properties);
    if (obj2.properties.hp <= 99) {
      this.components.removeAllComponents(obj2);
      obj2.destroy();
    }
  };

  awake() {}

  start() {}

  destroy() {
    if (this.inputContext && this.mouseInput)
      this.inputContext.off(this.mouseInput, () => {
        this.stateMachine.setState("attack");
      });
  }
}
