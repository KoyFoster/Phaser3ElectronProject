import Phaser, { Math as PMath } from "phaser";
import { Attack } from "../components/Attack";
import { Damage } from "../components/Damage";
import { Entity } from "../components/Entity";
import { Follow } from "../components/Follow";
import { PlayerMovement } from "../components/PlayerMovement";
import IComponentService from "../services/ComponentService";
const { Between } = PMath.Angle;

function spawnAroundFrame(
  width: number,
  height: number,
  group: Phaser.Physics.Arcade.Group,
  target: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  sprite: string,
  num: number,
  padding = 500,
  components: IComponentService
) {
  // spawn right outside of view
  for (let i = 0; i < num; i += 1) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const i = Math.random() > 0.5;
    const mob = group.create(
      x > y ? x - padding : i ? width + padding : 0,
      x > y ? (i ? height + padding : 0) : y - padding,
      sprite
    ) as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    const comp = new Damage();
    components.addComponent(mob, comp);
    components.addComponent(mob, new Entity());
    components.addComponent(mob, new Follow(target, components));
  }
}

export class Switcher extends Phaser.Scene {
  private components!: IComponentService;
  boundaries!: Phaser.Physics.Arcade.StaticGroup;
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  mobs!: Phaser.Physics.Arcade.Group;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  keys: any;

  score = 0;
  debugText!: Phaser.GameObjects.Text;
  gameOver = false;

  constructor() {
    super("Switcher");
  }

  preload() {}

  init() {
    this.components = new IComponentService();
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.components.destroy();
    });
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    // boundaries
    this.boundaries = this.physics.add.staticGroup();
    const tile = this.add.tileSprite(
      width * 0.5,
      height * 0.5,
      width,
      height,
      "tile0"
    );
    // frame
    const thiccness = 100;
    this.boundaries
      .create(width * 0.5, 0, "pixel")
      .setScale(width, thiccness)
      .refreshBody(); // Top
    this.boundaries
      .create(width * 0.5, height, "pixel")
      .setScale(width, thiccness)
      .refreshBody(); // Bottom
    this.boundaries
      .create(0, height * 0.5, "pixel")
      .setScale(thiccness, height)
      .refreshBody(); // Left
    this.boundaries
      .create(width, height * 0.5, "pixel")
      .setScale(thiccness, height)
      .refreshBody(); // Right

    // listeners
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("W,A,S,D");

    // score
    this.debugText = this.add.text(16, 16, "debugText: 0", {
      fontSize: "32px",
      color: "#eeee00",
    });

    this.player = this.physics.add.sprite(width * 0.5, height * 0.5, "dude");
    this.player.setDrag(0.0001);
    this.player.setDamping(true);

    this.cameras.main.startFollow(this.player);

    // Spawn some mobs
    this.mobs = this.physics.add.group();

    spawnAroundFrame(
      width,
      height,
      this.mobs,
      this.player,
      "bomb",
      1,
      0,
      this.components
    );

    // Add movement to player
    this.components.addComponent(
      this.player,
      new PlayerMovement(this.cursors, this.keys)
    );

    // Set new attack
    const newAttack = new Attack("upswing", "swipe");
    this.components.addComponent(this.player, newAttack);
    newAttack.setMobs(this.mobs as Phaser.Physics.Arcade.Group);
    // newAttack.setkeyInput(() => {
    //   return this.cursors.space.isDown;
    // }, this);
    newAttack.setMouseInput("pointerdown", this);

    // collisions
    this.physics.add.collider(this.mobs, this.mobs);
    this.physics.add.collider(this.mobs, this.boundaries);
    // this.physics.add.collider(this.mobs, this.player);
    this.physics.add.collider(this.player, this.boundaries);

    // listeners
    window.addEventListener("mousemove", (e) => this.mouseMove(e));
  }

  destroy() {}

  mouseMove(e) {
    const { width, height } = this.sys.game.canvas;
    let { x, y } = e;
    const pos = { x, y };
    const center = { x: width * 0.5, y: height * 0.5 };

    // calculate angle from mouse position relative to the center of the screen
    this.player.mouseAngle = Between(center.x, center.y, pos.x, pos.y);
  }

  update(t: number, dt: number) {
    this.debugText.text = `Vel: [${this.player.body.velocity.x}, ${this.player.body.velocity.y}],
    Acc: [${this.player.body.acceleration.x}, ${this.player.body.acceleration.y}],
    Angle: [${this.player.body.angle}]`;

    this.components.update(dt);
  }
}
