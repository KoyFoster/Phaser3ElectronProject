import Phaser from "phaser";
import ground from "../../assets/platform.png";
import boundary from "../../assets/boundary.png";
import tile0 from "../../assets/tile0.png";
import pixel from "../../assets/pixel.png";
import star from "../../assets/star.png";
import bomb from "../../assets/bomb.png";
import dude from "../../assets/dude.png";
import hurbox from "../../assets/hurbox.png";
import upswing from "../../assets/upswing.png";

import logoImg from "../../assets/logo.png";
import sky from "../../assets/sky.png";

import swipe from "../../assets/audio/fx/swipe.mp3";
import punch from "../../assets/audio/fx/punch.mp3";
import slap from "../../assets/audio/fx/slap.mp3";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    // load image assets
    this.load.audio("swipe", swipe);
    this.load.audio("punch", punch);
    this.load.audio("slap", slap);

    // load image assets
    this.load.image("upswing", upswing);
    this.load.image("pixel", pixel);
    this.load.image("star", star);
    this.load.image("bomb", bomb);
    this.load.image("ground", ground);
    this.load.image("boundary", boundary);
    this.load.image("tile0", tile0);
    this.load.image("hurbox", hurbox);
    this.load.image("logoImg", logoImg);
    this.load.image("sky", sky);
    this.load.spritesheet("dude", dude, {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.add.text(20, 20, "Loading assets...", {
      fontSize: "32px",
      color: "#FFFF00",
    });

    // Generate animations for player
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

    this.scene.start("Startup");
  }
}
