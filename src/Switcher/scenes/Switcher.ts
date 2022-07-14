import Phaser, { Math as PMath, Scene } from "phaser";
import { Attack } from "../components/Attack";
import { Entity } from "../Entities/Entity";
import { Player } from "../Entities/Player";
import ComponentService from "../services/ComponentService";

function spawnAroundFrame(
  context: Scene,
  width: number,
  height: number,
  group: Phaser.Physics.Arcade.Group,
  target: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  sprite: string,
  num: number,
  padding = 500
) {
  // spawn right outside of view
  for (let i = 0; i < num; i += 1) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const i = Math.random() > 0.5;
    const mob = new Entity(
      context,
      x > y ? x - padding : i ? width + padding : 0,
      x > y ? (i ? height + padding : 0) : y - padding,
      sprite
    );

    group.add(mob);

    mob.follow(target);
  }
}

export class Switcher extends Phaser.Scene {
  private components!: ComponentService;
  boundaries!: Phaser.Physics.Arcade.StaticGroup;
  player!: Player;
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
    this.components = new ComponentService();
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


    // score
    this.debugText = this.add.text(16, 16, "debugText: 0", {
      fontSize: "32px",
      color: "#eeee00",
    });

    // listeners
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("W,A,S,D");
    this.player = new Player(this.cursors, this.keys, this, width * 0.5, height * 0.5, "dude");
    this.mobs = this.physics.add.group();
    this.player.addAttack(Attack, this.mobs, undefined);

    this.cameras.main.startFollow(this.player);

    // Spawn some mobs
    spawnAroundFrame(this, width, height, this.mobs, this.player as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, "bomb", 1, 0);

    this.mobs.add(new Entity(this, 500, 500, "bomb", 0));

    // collisions
    this.physics.add.collider(this.mobs, this.mobs);
    this.physics.add.collider(this.mobs, this.boundaries);
    // this.physics.add.collider(this.mobs, this.player);
    this.physics.add.collider(this.player, this.boundaries);

    // Launch HUD
    this.scene.launch("hud", {ass: 'ass'});
  }

  update(t: number, dt: number) {
    this.components.update(dt);

    // update player
    this.player.update(t, dt);
    // update mobs
    this.mobs.getChildren().forEach((element) => {
      element.update(t, dt);
    });
  }

  destroy() {}
}
