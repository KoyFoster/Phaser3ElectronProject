import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import octopus from "../../assets/octopus/octopus.png";
import octopusxml from "../../assets/octopus/octopus.xml";

export default class AttackScene extends Phaser.Scene {
  private entity!: Phaser.Physics.Arcade.Sprite;
  private entityStateMachine!: StateMachine;
  private attackHitBox!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  private box!: Phaser.GameObjects.Rectangle;
  private boxStateMachine!: StateMachine;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private hpText!: Phaser.GameObjects.Text;
  private boxHP = 100;

  constructor() {
    super("attack");
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  preload() {
    //  Here we load the Starling Texture Atlas and XML file
    this.load.atlasXML("octopus", octopus, octopusxml);
  }

  create() {
    const { width, height } = this.scale;
    // this.entity = this.physics.add.sprite(
    //   width * 0.5,
    //   height * 0.5,
    //   "entity",
    //   "Idle (1).png"
    // );
    this.entity = this.physics.add.sprite(width * 0.5, height * 0.5, "octopus");
    // this.entity.setBodySize(this.entity.width * 0.4, this.entity.height * 0.85);
    this.entity.setCollideWorldBounds(true);

    this.createAnimations();

    this.entityStateMachine = new StateMachine(this, "entity")
      .addState("idle", {
        onEnter: this.entityIdleEnter,
        onUpdate: this.entityIdleUpdate,
      })
      .addState("run", {
        onEnter: this.entityOnEnter,
        onUpdate: this.entityRunUpdate,
      })
      .addState("attack", {
        onEnter: this.entityAttackEnter,
        onUpdate: this.entityAttackUpdate
      });

    this.entityStateMachine.setState("idle");

    this.box = this.add.rectangle(
      width * 0.75,
      height * 0.5,
      64,
      128,
      0xffffff
    );
    this.physics.add.existing(this.box, true);

    this.boxStateMachine = new StateMachine(this, "box")
      .addState("idle", {
        onEnter: this.boxIdleEnter,
      })
      .addState("damage", {
        onEnter: this.boxDamageEnter,
      });

    this.boxStateMachine.setState("idle");

    this.hpText = this.add
      .text(this.box.x, this.box.y - 90, `HP: ${this.boxHP}`)
      .setOrigin(0.5);

    // TODO: create sword swing hit box

    this.attackHitBox = this.add.rectangle(
      0,
      0,
      32,
      64,
      0xffffff,
      0
    ) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    this.physics.add.existing(this.attackHitBox);
    this.attackHitBox.body.enable = false;
    this.physics.world.remove(this.attackHitBox.body);
    console.log(this.attackHitBox.body);

    this.physics.add.collider(this.entity, this.box);

    // TODO: add physics overlap with dummy box; show box damaged on overlap
    // this.boxStateMachine.setState('damage')
    this.physics.add.overlap(
      this.attackHitBox,
      this.box,
      this.handleHit,
      undefined,
      this
    );
  }

  update(t: number, dt: number) {
    this.entityStateMachine.update(dt);
  }

  handleHit(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    console.error("hit");
    this.boxStateMachine.setState("damage");
  }

  boxIdleEnter() {
    this.box.fillColor = 0xffffff;
  }

  private boxDamageEnter() {
    this.box.fillColor = 0xff0000;

    this.boxHP -= 10;
    this.hpText.text = `HP: ${this.boxHP}`;

    this.time.delayedCall(500, () => {
      this.boxStateMachine.setState("idle");
    });
  }

  private entityIdleEnter() {
    this.entity.play("idle");
    this.entity.setVelocityX(0);
  }

  private entityIdleUpdate() {
    if (this.cursors.left.isDown || this.cursors.right.isDown) {
      this.entityStateMachine.setState("run");
    } else if (this.cursors.space.isDown) {
      this.entityStateMachine.setState("attack");
    }
  }

  private entityOnEnter() {
    this.entity.play("run");
  }

  private entityRunUpdate() {
    if (this.cursors.space.isDown) {
      this.entityStateMachine.setState("attack");
    } else if (this.cursors.left.isDown) {
      this.entity.setVelocityX(-300);
      this.entity.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.entity.flipX = false;
      this.entity.setVelocityX(300);
    } else {
      this.entityStateMachine.setState("idle");
    }
  }

  //   private entityAttackEnter() {
  //     this.entity.play("attack");
  //     this.entity.setVelocityX(0);

  //     // TODO: move sword swing hitbox into place
  //     // does it need to start part way into the animation?
  //     const startHit = (
  //       anim: Phaser.Animations.Animation,
  //       frame: Phaser.Animations.AnimationFrame
  //     ) => {
  //       if (frame.index < 20) {
  //         return;
  //       }

  //       this.entity.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);

  //       this.attackHitBox.x =
  //         this.entity.x +
  //         (this.entity.flipX ? -this.entity.width : this.entity.width);

  //       this.attackHitBox.y = this.entity.y + this.entity.height * 0.2;

  //       this.attackHitBox.body.enable = true;
  //       this.physics.world.add(this.attackHitBox.body);
  //     };

  //     this.entity.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);

  //     this.entity.once(
  //       Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "attack",
  //       () => {
  //         this.entityStateMachine.setState("idle");

  //         // TODO: hide and remove the sword swing hitbox
  //         this.attackHitBox.body.enable = false;
  //         this.physics.world.remove(this.attackHitBox.body);
  //       }
  //     );
  //   }

  private entityAttackEnter() {
    this.attackHitBox.x =
      this.entity.x +
      (this.entity.flipX ? -this.entity.width : this.entity.width);

    this.attackHitBox.y = this.entity.y + this.entity.height * 0.2;

    this.attackHitBox.body.enable = true;
    this.physics.world.add(this.attackHitBox.body);

    this.time.delayedCall(500, () => {
      this.attackHitBox.body.enable = false;
      this.physics.world.remove(this.attackHitBox.body);
      this.entityStateMachine.setState("idle");
    });
  }

  private entityAttackUpdate() {
        if (this.cursors.left.isDown) {
        this.entity.setVelocityX(-300);
        this.entity.flipX = true;
      } else if (this.cursors.right.isDown) {
        this.entity.flipX = false;
        this.entity.setVelocityX(300);
      }
  }

  private createAnimations() {
    //  Create an animation called 'swim', the fact we don't specify any frames means it will use all frames in the atlas
    //  Bob the octopus up and down with a tween
    // this.tweens.add({
    //     target: this.entity,
    //     y: 300,
    //     duration: 2000,
    //     ease: 'Power2',
    //     completeDelay: 1000
    // });

    const frames = this.anims.generateFrameNames("octopus");

    this.entity.anims.create({
      key: "swim",
      frames: frames,
      frameRate: 30,
      repeat: -1,
    });

    // this.entity.anims.create({
    //   key: "idle",
    //   frames: this.entity.anims.generateFrameNames("entity", {
    //     start: 1,
    //     end: 10,
    //     prefix: "Idle (",
    //     suffix: ").png",
    //   }),
    //   frameRate: 10,
    //   repeat: -1,
    // });

    this.entity.anims.create({
      key: "idle",
      frames: frames,
      frameRate: 30,
      repeat: -1,
    });

    // this.entity.anims.create({
    //   key: "run",
    //   frames: this.entity.anims.generateFrameNames("entity", {
    //     start: 1,
    //     end: 10,
    //     prefix: "Run (",
    //     suffix: ").png",
    //   }),
    //   frameRate: 20,
    //   repeat: -1,
    // });

    this.entity.anims.create({
      key: "run",
      frames: frames,
      frameRate: 30,
      repeat: -1,
    });

    // this.entity.anims.create({
    //   key: "attack",
    //   frames: this.entity.anims.generateFrameNames("entity", {
    //     start: 1,
    //     end: 10,
    //     prefix: "Attack (",
    //     suffix: ").png",
    //   }),
    //   frameRate: 20,
    // });

    this.entity.anims.create({
      key: "attack",
      frames: frames,
      frameRate: 30,
    });
  }
}
