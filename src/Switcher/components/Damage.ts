import Phaser from "phaser";
import { IComponent } from "../services/ComponentService";
import StateMachine from "../statemachine/StateMachine";

export class Damage implements IComponent {
  private gameObject!: Phaser.GameObjects.GameObject &
    Phaser.GameObjects.Components.Transform;
  private stateMachine!: StateMachine;
  private hpText!: Phaser.GameObjects.Text;
  private HP = 100;

  get getHP() {
    return this.HP;
  }

  init(
    go: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform
  ) {
    this.gameObject = go;
    this.create();
  }

  create() {
    this.hpText = this.gameObject.scene.add
      .text(this.gameObject.x, this.gameObject.y - 90, `HP: ${this.HP}`)
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

  setState(name: string) {
    this.stateMachine.setState(name);
  }

  private damageEnter() {
    console.error("damage");
    this.gameObject.fillColor = 0xff0000;

    this.HP -= 10;
    this.hpText.text = `HP: ${this.HP}`;

    this.gameObject.scene.time.delayedCall(500, () => {
      this.stateMachine.setState("idle");
    });
  }

  awake() {
    // console.log("awake");
  }

  start() {
    // console.log("start");
  }

  destroy() {
    console.log("destroy");
  }

  private handleClick() {}
}
