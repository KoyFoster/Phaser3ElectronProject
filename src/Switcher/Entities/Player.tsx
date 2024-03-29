import Phaser, { Math as PMath, Scene } from "phaser";
const { Between } = PMath.Angle;
import { Attack } from "../components/Attacks/Attack";
import { PlayerMovement } from "../components/PlayerMovement";
import { Entity } from "./Entity";

// Inherit from gameobject
export class Player extends Entity {
  keys!: object;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  scene!: Phaser.Scene;

  constructor(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    keys: object,
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number | undefined
  ) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.cursors = cursors;
    this.keys = keys;

    // Set physics
    scene.physics.add.existing(this);
    this.setDrag(this.properties.drag);
    this.setDamping(true);

    // Add component
    this.components.addComponent(this, new PlayerMovement(cursors, keys));

    // listeners
    window.addEventListener("mousemove", (e) => this.mouseMove(e));
  }

  addAttack(attack: Attack, mobs: [], input?: () => boolean) {
    if (input) attack.setInput(input);
    this.components.addComponent(this, attack);
    attack.setMobs(mobs);
    return attack;
  }

  mouseMove(e) {
    const { width, height } = this.scene.sys.game.canvas;
    let { x, y } = e;
    const pos = { x, y };
    const center = { x: width * 0.5, y: height * 0.5 };

    // calculate angle from mouse position relative to the center of the screen
    this.properties.faceAngle = Between(center.x, center.y, pos.x, pos.y);
  }

  update(t: number, dt: number) {
    this.components.update(dt);

    // Debugger
    // this.debugText.text = `Vel: [${this.player.body.velocity.x}, ${this.player.body.velocity.y}],
    // Acc: [${this.player.body.acceleration.x}, ${this.player.body.acceleration.y}],
    // Angle: [${this.player.body.angle}]`;
  }
}
