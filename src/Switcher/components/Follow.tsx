import Phaser, { Math as PMath } from "phaser";
import { IComponent } from "../services/ComponentService";
const { Between } = PMath.Angle;

export class Follow implements IComponent {
  private gameObject!:
    | Phaser.GameObjects.GameObject
    | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private target!: Phaser.GameObjects.GameObject;
  private speed = 1 as number;

  constructor(target: Phaser.GameObjects.GameObject) {
    this.target = target;
  }

  init(go: Phaser.GameObjects.GameObject) {
    this.gameObject = go;
    const entity = this
      .gameObject as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    entity.setDrag(0.0001) as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    entity.setDamping(true);
  }

  followPlayer(dt: number) {
    const self = this
      .gameObject as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    const target = this
      .target as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    let angle = Between(
      self.body.position.x,
      self.body.position.y,
      target.body.position.x,
      target.body.position.y
    );

    const dir = self.scene.physics.velocityFromRotation(angle, this.speed);
    self.setVelocity(
      self.body.velocity.x + dir.x * dt,
      self.body.velocity.y + dir.y * dt
    );
  }

  awake() {}

  start() {}

  destroy() {}

  update(dt: number) {
    this.followPlayer(dt);
  }
}
