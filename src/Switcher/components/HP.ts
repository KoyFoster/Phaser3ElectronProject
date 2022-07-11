import Phaser from "phaser";
import { IComponent } from "../services/ComponentService";
import StateMachine from "../statemachine/StateMachine";

export class HP implements IComponent {
  private gameObject!: Phaser.GameObjects.GameObject &
    Phaser.GameObjects.Components.Transform;
  private stateMachine!: StateMachine;
  private hpText!: Phaser.GameObjects.Text;
  private nextDmg = 0;

  get getHP() {
    return this.gameObject.properties?.hp;
  }

  init(
    go: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform
  ) {
    this.gameObject = go;
    this.create();
  }

  create() {
    this.hpText = this.gameObject.scene.add
      .text(this.gameObject.x, this.gameObject.y - 90, `HP: ${this.getHP}`)
      .setOrigin(0.5);

    this.stateMachine = new StateMachine(this, `${this.gameObject.name} damage`)
      .addState("idle", {
        onEnter: this.idleEnter,
      })
      .addState("damage", {
        onEnter: this.damageEnter,
      });
    this.setState("idle");
  }

  update(dt: number) {
    this.stateMachine.update(dt);

    this.hpText.setPosition(this.gameObject.x, this.gameObject.y - 90);
  }

  idleEnter() {
    this.gameObject.fillColor = 0xffffff;
  }

  doDamage(value: number) {
    this.nextDmg = value;
    this.stateMachine.setState("damage");
  }

  setState(name: string) {
    this.stateMachine.setState(name);
  }

  private damageEnter() {
    console.error("damage");
    this.gameObject.fillColor = 0xff0000;

    this.gameObject.properties.hp -= this.nextDmg;
    this.nextDmg = 0;
    this.hpText.text = `HP: ${this.getHP}`;

    this.gameObject.scene.time.delayedCall(500, () => {
      this.stateMachine.setState("idle");
    });
  }

  awake() {}

  start() {}

  destroy() {
    this.hpText.destroy();
  }
}
