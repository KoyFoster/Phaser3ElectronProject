import Phaser, { Math as PMath } from "phaser";
const { Vector2 } = PMath;
import ground from "../assets/platform.png";
import boundary from "../assets/boundary.png";
import tile0 from "../assets/tile0.png";
import pixel from "../assets/pixel.png";
import star from "../assets/star.png";
import bomb from "../assets/bomb.png";
import dude from "../assets/dude.png";
import hurbox from "../assets/hurbox.png";
import upswing from "../assets/upswing.png";

import logoImg from "../assets/logo.png";
import sky from "../assets/sky.png";

const width = 1920 * 0.75;
const height = 1080 * 0.75;

function spawnAroundFrame(
  group: Phaser.Physics.Arcade.Group,
  sprite: string,
  num: number,
  padding = 500
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
    );
    mob.setFriction(120);
  }
}

class Switcher extends Phaser.Scene {
  boundaries: Phaser.Physics.Arcade.StaticGroup;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  punch: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
  timer: Phaser.Time.TimerEvent;
  swinging: boolean;
  mobs: Phaser.Physics.Arcade.Group;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  keys: any;

  score = 0;
  scoreText: Phaser.GameObjects.Text;
  gameOver = false;

  constructor() {
    super("");
  }

  preload() {
    // load assets
    this.load.image("upswing", upswing);
    this.load.image("pixel", pixel);
    this.load.image("bomb", bomb);
    this.load.image("ground", ground);
    this.load.image("boundary", boundary);
    this.load.image("tile0", tile0);
    this.load.image("hurbox", hurbox);
    this.load.spritesheet("dude", dude, {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  followPlayer() {
    // chase player
    this.mobs.children.iterate((mob) => {
      //if(this.mobs.active)
      this.physics.accelerateToObject(mob, this.player, 120);
    });
  }

  create() {
    // boundaries
    this.boundaries = this.physics.add.staticGroup();
    const tile = this.add.tileSprite(width*0.5, height*0.5,width, height, "tile0")
    // frame
    this.boundaries.create(width*0.5, 0, "pixel").setScale(width, 1).refreshBody(); // Top
    this.boundaries.create(width*0.5, height, "pixel").setScale(width, 1).refreshBody(); // Bottom
    this.boundaries.create(0, height*0.5, "pixel").setScale(1, height).refreshBody(); // Left
    this.boundaries.create(width, height*0.5, "pixel").setScale(1, height).refreshBody(); // Right

    // listeners
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("W,A,S,D");

    // timer
    this.swinging = false;
    this.timer = this.time.addEvent({
      delay: 500,                // ms
      callback: () => {},
      args: [],
      callbackScope: this,
      loop: false,
      repeat: 0,
      startAt: 0,
      timeScale: 1,
      paused: false
  });

    // bg

    // platforms

    // collectible

    // score
    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000000",
    });

    this.player = this.physics.add.sprite(width * 0.5, height * 0.5, "dude");
    this.cameras.main.startFollow(this.player);

    this.punch = this.physics.add.staticSprite(width * 0.5, height * 0.5, "upswing");
    this.punch.debugShowBody = true;
    this.punch.setOrigin(0.25, 1);
    this.punch.disableBody(true, true);

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
    spawnAroundFrame(this.mobs, "bomb", 50);
    this.mobs.create(666, 666, "bomb");

    // collisions
    this.physics.add.collider(this.mobs, this.boundaries);
    this.physics.add.collider(this.player, this.boundaries);

    this.physics.add.collider(
      this.mobs,
      this.punch,
      this.hitMobs as ArcadePhysicsCallback
    );
  }

  hitMobs(
    punch: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    mob: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  ) {
    // get direction
    let vector = new Vector2(
      mob.body.position.x - punch.body.position.x,
      mob.body.position.y - punch.body.position.y
    );
    vector.normalize();
    // force back mobs
    mob.setAcceleration(vector.x * 1000, vector.y * 1000);

    // console.log('disable:', true)
  }

  swing(end = false)
  {
    // rotate to mouse position
    // const angle = PMath.Angle.BetweenPoints(this.input.mousePointer, this.punch.body.position);
    // this.punch.setRotation(angle + PMath.PI2*0.25);
    // enable
    if(!end && !this.swinging)
    {
      this.swinging = true;
      this.punch.enableBody(
        true,
        this.player.body.position.x,
        this.player.body.position.y,
        true,
        true
      );
    }
    else
    {
      this.swinging = false;
      this.punch.disableBody(true, true);
    }
  }

  inputs() {
    if (this.cursors.up.isDown || this.keys.W.isDown) {
      this.player.setVelocityY(-160);
      this.player.anims.play("up", true);
    } else if (this.cursors.down.isDown || this.keys.S.isDown) {
      this.player.setVelocityY(160);
      this.player.anims.play("down", true);
    } else {
      this.player.setVelocityY(0);
    }

    if (this.cursors.left.isDown || this.keys.A.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown || this.keys.D.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
    }

    // check if player is moving
    if (!this.player.body.velocity.x && !this.player.body.velocity.y) {
      this.player.anims.play("turn", true);
    }

    // on left click
    if (this.input.mousePointer.leftButtonDown()) {
      this.swing(false);
      this.timer.reset({
        delay: 200,                // ms
        callback: () => {this.swing(true)},
        args: [],
        callbackScope: this,
        loop: false,
        repeat: 0,
        startAt: 0,
        timeScale: 1,
        paused: false
    });
    }
  }

  update() {
    this.inputs();

    this.followPlayer();
  }
}

// Game Window Config
export const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: width,
  height: height,
  scene: Switcher,
  physics: {
    default: "arcade",
    arcade: {
      // gravity: { y: 300 },
      debug: true,
    },
  },
};