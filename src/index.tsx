import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import Phaser from "phaser";
import ground from "./assets/platform.png";
import star from "./assets/star.png";
import bomb from "./assets/bomb.png";
import dude from "./assets/dude.png";


import logoImg from './assets/logo.png';
import sky from './assets/sky.png';

class MyGame extends Phaser.Scene {
  preload() {
    try {
      this.load.image('logo', logoImg);
      this.load.image('sky', sky);
      this.load.image("ground", ground);
      this.load.image("star", star);
      this.load.image("bomb", bomb);
      this.load.spritesheet("dude", dude, {
        frameWidth: 32,
        frameHeight: 48,
      });
    } catch (e) {
      console.error("e:", e);
    }
  }

  create() {
    console.log("assets loaded:", this.textures.exists('sky') );
    this.add.image(400, 300, "sky");
    const logo = this.add.image(400, 150, 'logo');
    // bounce
    this.tweens.add({
        targets: logo,
        y: 450,
        duration: 2000,
        ease: "Power2",
        yoyo: true,
        loop: -1
    });
  }

  update() {}
}

// Game Window Config
const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1920,
  height: 1080,
  scene: MyGame,
};

const game = new Phaser.Game(config);

// Main app
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
