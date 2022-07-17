import Phaser, { Math as PMath } from "phaser";
import { StartupScene } from "./scenes/StartupScene";
import Preloader from "./scenes/preloader";
import { Switcher } from "./scenes/Switcher";
import HUD from "./scenes/HUD";
import Controls from "./scenes/Controls";

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
      debug: false,
    },
  },
  scene: [Preloader, StartupScene, Switcher, HUD, Controls],
};

export default new Phaser.Game(config);
