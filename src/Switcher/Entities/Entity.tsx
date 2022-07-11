import Phaser, { Math as PMath, Scene } from "phaser";
import { HP } from "../components/HP";
import { Follow } from "../components/Follow";

import { EntityProps, IEntityProps } from "../components/Properties/Entity";
import ComponentService, {
  Constructor,
  IComponent,
  IComponentsService,
} from "../services/ComponentService";

// Inherit from gameobject
export class Entity extends Phaser.Physics.Arcade.Sprite {
  public d!: (fromScene?: boolean | undefined) => void;
  public properties = { ...EntityProps } as IEntityProps;

  // Components
  protected components!: IComponentsService;
  private hp!: HP;

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
    this.hp = new HP();
    this.components.addComponent(this, this.hp);
  }

  private extendDestroy() {
    // extend destroy
    this.d = this.destroy;
    this.destroy = this.destruct;
  }

  addComponent(component: IComponent): IComponent {
    return this.components.addComponent(this, component);
  }

  removeComponent(component: IComponent) {
    this.components.removeComponent(this, component);
  }

  findComponent<ComponentType>(componentType: Constructor<ComponentType>) {
    return this.components.findComponent(this, componentType);
  }

  dealDamage(value: number) {
    this.hp.doDamage(value);
  }

  follow(target: Phaser.GameObjects.GameObject) {
    this.components.addComponent(this, new Follow(target));
  }

  update(t: number, dt: number) {
    this.components.update(dt);
  }

  destruct = (fromScene?: boolean | undefined) => {
    this.components.removeAllComponents(this);
    this.d(fromScene);
  };
}
