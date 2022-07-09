import Phaser, { Math as PMath } from "phaser";
const { Vector2 } = PMath;
import { StartupScene } from "./scenes/StartupScene";
import { GameScene } from "./scenes/GameScene";
import Preloader from "./scenes/preloader";
import { Switcher } from "./scenes/Switcher";

const width = 1920 * 0.75;
const height = 1080 * 0.75;

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
