import Phaser, { Math as PMath } from "phaser";
import { IComponent } from "../services/ComponentService";
import StateMachine from "../statemachine/StateMachine";

export class PlayerMovement implements IComponent {
  private gameObject!:
    | Phaser.GameObjects.GameObject
    | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private stateMachine!: StateMachine;
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys: any;

  constructor(cursors: Phaser.Types.Input.Keyboard.CursorKeys, keys: any) {
    this.cursors = cursors;
    this.keys = keys;
  }

  init(
    go:
      | Phaser.GameObjects.GameObject
      | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  ) {
    this.gameObject = go;
    this.create();
  }

  create() {
    this.stateMachine = new StateMachine(this, "player-movement");
  }

  inputs(dt: number) {
    const player = this
      .gameObject as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    // deadzone: to prevent infinite deacceleration
    const dz = 10;
    if (player.body.velocity.x <= dz && player.body.velocity.x >= -dz)
      player.setVelocityX(0);
    if (player.body.velocity.y <= dz && player.body.velocity.y >= -dz)
      player.setVelocityY(0);

    // TODO: Need to properly calculate angled movement
    let angle = { x: 0, y: 0 };
    let speed = 5 * dt;
    let up = this.cursors.up.isDown || this.keys.W.isDown,
      down = this.cursors.down.isDown || this.keys.S.isDown,
      left = this.cursors.left.isDown || this.keys.A.isDown,
      right = this.cursors.right.isDown || this.keys.D.isDown;

    if (up && right)
      angle = this.gameObject.scene.physics.velocityFromAngle(-45, speed);
    else if (up && left)
      angle = this.gameObject.scene.physics.velocityFromAngle(-135, speed);
    else if (down && right)
      angle = this.gameObject.scene.physics.velocityFromAngle(45, speed);
    else if (down && left)
      angle = this.gameObject.scene.physics.velocityFromAngle(135, speed);
    else if (up) angle.y = -speed;
    else if (down) angle.y = speed;
    else if (right) angle.x = speed;
    else if (left) angle.x = -speed;

    if (angle.y > 0) player.anims.play("up", true);
    else player.anims.play("down", true);

    if (angle.x > 0) player.anims.play("right", true);
    else player.anims.play("left", true);

    player.setVelocity(
      player.body.velocity.x + angle.x,
      player.body.velocity.y + angle.y
    );

    // check if player is moving
    if (!player.body.velocity.x && !player.body.velocity.y) {
      player.anims.play("turn", true);
    }
  }

  update(dt: number) {
    this.stateMachine.update(dt);

    this.inputs(dt);

    if (this.gameObject.body.velocity.x || this.gameObject.body.velocity.y) {
      this.gameObject.body.lastAngle = this.gameObject.body.angle;
    }
  }

  awake() {}
  start() {}
  destroy() {}
}
