import Phaser from "phaser";

export default class HUD extends Phaser.Scene {
  w!: number;
  h!: number;
  refData = {
    health: 100,
    attacks: [],
    stats: {STR: 0},
  };
  health!: Phaser.GameObjects.Text;
  stats!: Phaser.GameObjects.Text;
  attacks!: Phaser.GameObjects.Text;

  constructor() {
    super("hud");
  }

  preload() {}

  init(data: {}) {
    console.log("HUD:", data);
    this.refData = data;
  }

  create() {
    this.w = this.sys.game.canvas.width;
    this.h = this.sys.game.canvas.height;
    this.initHealth();
    this.initStats();
    this.initAttacks();
  }

  /* FontStyle Ref
   fontFamily?: string;
   fontSize?: string;
   fontStyle?: string;
   font?: string;
   backgroundColor?: string;
   color?: string;
   stroke?: string;
   strokeThickness?: number;
   shadow?: Phaser.Types.GameObjects.Text.TextShadow;
   padding?: Phaser.Types.GameObjects.Text.TextPadding;
   align?: string;
   maxLines?: number;
   fixedWidth?: number;
   fixedHeight?: number;
   resolution?: number;
   rtl?: boolean;
   testString?: string;
   baselineX?: number;
   baselineY?: number;
   wordWrap?: Phaser.Types.GameObjects.Text.TextWordWrap;
   metrics?: Phaser.Types.GameObjects.Text.TextMetrics; */

  getHealth() {
    return `Health: ${this.refData.health}`;
  }
  initHealth() {
    this.health = this.add.text(20, 20, this.getHealth(), {
      fontSize: "32px",
      color: "#FFFF00",
    });
  }

  getStats() {
    const buffer = `-stats-\n${this.refData.stats.STR} :STR\n${0} :VIG\n${0} :DEX\n${0} :INT`;
    return buffer;
  }

  initStats() {
    this.stats = this.add.text(this.w - 20, 20, this.getStats(), {
      fontSize: "32px",
      color: "#FFFF00",

      align: "right",
      rtl: true,
    });
  }

  getAttacks() {
    let buffer = "-Attacks-";
    this.refData.attacks?.forEach((atk) => {
      buffer += "\n" + atk;
    });
    return buffer;
  }

  initAttacks() {
    this.attacks = this.add.text(this.w - 20, 170, this.getAttacks(), {
      fontSize: "32px",
      color: "#FFFF00",

      align: "right",
      rtl: true,
    });
  }

  update(t: number, dt: number) {
    this.health.setText(this.getHealth());
    this.stats.setText(this.getStats());
    this.attacks.setText(this.getAttacks());
  }

  destroy() {}
}
