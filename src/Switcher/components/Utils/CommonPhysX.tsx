export class CommonPhysX {
  // common physics calls
  static posPulse(
    entity: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
    direction: number,
    speed: number
  ) {
    // send player backwards
    const vel = entity.scene.physics.velocityFromRotation(direction, speed);
    entity.setVelocity(
      entity.body.velocity.x - vel.x,
      entity.body.velocity.y - vel.y
    );
  }

  static selfKnockback(
    entity: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
    force: number
  ) {
    // send player backwards
    CommonPhysX.posPulse(entity, entity.body.angle, force);
  }

  static foeKnockback(
    angle: number,
    foe: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
    force: number
  ) {
    CommonPhysX.posPulse(foe, angle - Math.PI, force);
  }
}
