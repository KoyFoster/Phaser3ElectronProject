import Phaser, { Math as PMath } from "phaser";
const { Vector2 } = PMath;
import { StartupScene } from "./scenes/StartupScene";
import { GameScene } from "./scenes/GameScene";
import IComponentService from "./services/ComponentService";
import Spawner from "./components/Spawner";
import Preloader from "./scenes/preloader";
import { Attack } from "./components/Attack";
import { Damage } from "./components/Damage";
import { PlayerMovement } from "./components/PlayerMovement";

const width = 1920 * 0.75;
const height = 1080 * 0.75;

function spawnAroundFrame(
  group: Phaser.Physics.Arcade.Group,
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
    // components.removeComponent(mob, comp);
    mob.setVelocity(240, 0);
    mob.setVelocity(240, 0);
    mob.setFriction(1);
  }
}

class Switcher extends Phaser.Scene {
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

  followPlayer() {
    // chase player
    this.mobs.children.iterate((mob) => {
      this.physics.moveToObject(mob, this.player, 120);
    });
  }

  init() {
    this.components = new IComponentService();
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.components.destroy();
    });
  }

  create() {
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
    this.boundaries
      .create(width * 0.5, 0, "pixel")
      .setScale(width, 1)
      .refreshBody(); // Top
    this.boundaries
      .create(width * 0.5, height, "pixel")
      .setScale(width, 1)
      .refreshBody(); // Bottom
    this.boundaries
      .create(0, height * 0.5, "pixel")
      .setScale(1, height)
      .refreshBody(); // Left
    this.boundaries
      .create(width, height * 0.5, "pixel")
      .setScale(1, height)
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

    // Spritesheep frame events
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "down",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "up",
      frames: [{ key: "dude", frame: 5 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 6, end: 9 }),
      frameRate: 10,
      repeat: -1,
    });

    // mobs
    this.mobs = this.physics.add.group();
    spawnAroundFrame(this.mobs, "bomb", 10, 0, this.components);

    // const bombsLayer = this.add.layer()
    // this.components.addComponent(this.player, new Spawner(undefined, this.cursors, bombsLayer));
    // add attack to player
    const newAttack = new Attack("upswing", "swipe");
    this.components.addComponent(this.player, new PlayerMovement(this.cursors, this.keys));
    this.components.addComponent(this.player, newAttack);
    newAttack.setMobs(this.mobs as Phaser.Physics.Arcade.Group);
    newAttack.setInput(() => {
      return this.cursors.space.isDown;
    });

    // collisions
    this.physics.add.collider(this.mobs, this.boundaries);
    this.physics.add.collider(this.player, this.boundaries);
  }

  update(t: number, dt: number) {
    this.debugText.text = `Vel: [${this.player.body.velocity.x}, ${this.player.body.velocity.y}],
    Acc: [${this.player.body.acceleration.x}, ${this.player.body.acceleration.y}]`

    this.followPlayer();

    this.components.update(dt);
  }
}

// Game Window Config
export const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: width,
  height: height,
  physics: {
    default: "arcade",
    arcade: {
      // gravity: { y: 300 },
      debug: true,
    },
  },
  scene: [Preloader, Switcher, StartupScene, GameScene],
};

export default new Phaser.Game(config);
