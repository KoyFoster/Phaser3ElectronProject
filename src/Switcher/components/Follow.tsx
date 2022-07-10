import Phaser, { Math as PMath } from "phaser";
import { IComponent, IComponentsService } from "../services/ComponentService";
import { Entity } from "./Entity";
import { IEntityProps } from "./Properties/Entity";
const { Between } = PMath.Angle;

export class Follow implements IComponent {
  private gameObject!:
    | Phaser.GameObjects.GameObject
    | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private properties?: IEntityProps;
  private components!: IComponentsService;
  private target!: Phaser.GameObjects.GameObject;

  constructor(
    target: Phaser.GameObjects.GameObject,
    components: IComponentsService
  ) {
    this.target = target;
    this.components = components;
  }

  init(go: Phaser.GameObjects.GameObject) {
    this.gameObject = go;

    if (this.components) {
      const ent = this.components.findComponent(this.gameObject, Entity);
      if (ent) this.properties = ent.properties;
    }

    const entity = this
      .gameObject as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    entity.setDrag(0.0001) as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    entity.setDamping(true);
  }

  followPlayer(dt: number) {
    if (!this.properties) return;

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

    const dir = self.scene.physics.velocityFromRotation(
      angle,
      this.properties.speed
    );
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
