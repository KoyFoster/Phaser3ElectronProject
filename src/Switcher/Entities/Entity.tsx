import Phaser, { Math as PMath, Scene } from "phaser";
import { Damage } from "../components/Damage";
import { Follow } from "../components/Follow";

import { EntityProps, IEntityProps } from "../components/Properties/Entity";
import ComponentService, {
  Constructor,
  IComponent,
  IComponentsService,
} from "../services/ComponentService";

// Inherit from gameobject
export class Entity extends Phaser.Physics.Arcade.Sprite {
  // Phaser.GameObjects.GameObject
  private components!: IComponentsService;
  private damage!: Damage;
  public properties = { ...EntityProps } as IEntityProps;
  public d!: (fromScene?: boolean | undefined) => void;
  public trash = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number | undefined
  ) {
    console.log("Entity: ", { scene, x, y, texture, frame });
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    this.extendDestroy();

    // Create Component Manager
    this.components = new ComponentService();
    scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.components.destroy();
    });

    // Add Components
    this.damage = new Damage();
    this.components.addComponent(this, this.damage);
  }

  private extendDestroy() {
    // extend destroy
    this.d = this.destroy;
    this.destroy = this.destruct;
  }

  addComponent(component: IComponent) {
    this.components.addComponent(this, component);
  }

  removeComponent(component: IComponent) {
    this.components.removeComponent(this, component);
  }

  findComponent<ComponentType>(componentType: Constructor<ComponentType>) {
    return this.components.findComponent(this, componentType);
  }

  dealDamage(value: number) {
    this.damage.doDamage(value);
  }

  follow(target: Phaser.GameObjects.GameObject) {
    this.components.addComponent(this, new Follow(target));
  }

  update(t: number, dt: number) {
    this.components.update(dt);
  }

  destruct = (fromScene?: boolean | undefined) => {
    if (this.trash) return;

    console.log("destroy:", this.trash, this);
    this.components.removeAllComponents(this);
    this.d(fromScene);
    this.trash = true;
  };
}
