import Phaser from "phaser";
import short from "short-uuid";

export type Constructor<T extends {} = {}> = new (...args: any[]) => T;

export interface IComponent {
  init: (
    go: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform,
    components: IComponentService
  ) => void;

  awake?: () => void;
  start?: () => void;
  update?: (dt: number) => void;
  destroy?: () => void;
}

export interface IComponentsService {
  addComponent(go: Phaser.GameObjects.GameObject, component: IComponent): void;
  findComponent<ComponentType>(
    go: Phaser.GameObjects.GameObject,
    componentType: Constructor<ComponentType>
  ): ComponentType | undefined;
  removeComponent(
    go: Phaser.GameObjects.GameObject,
    component: IComponent
  ): void;
  removeAllComponents(go: Phaser.GameObjects.GameObject): void;
  destroy(): void;
  update(dt: number): void;
}

export default class IComponentService implements IComponentsService {
  private componentsByGameObject = new Map<string, IComponent[]>();
  private queueForStart: IComponent[] = [];

  addComponent(go: Phaser.GameObjects.GameObject, component: IComponent) {
    // give gameobjects unique names
    if (!go.name) {
      go.name = short.generate();
    }
    // make sure there is a list of components fort his gameobject
    if (!this.componentsByGameObject.has(go.name)) {
      this.componentsByGameObject.set(go.name, []);
    }
    // add newcomponent to this gameobjects's list
    const list = this.componentsByGameObject.get(go.name) as IComponent[];
    list.push(component);
    // call the lifecycle hooks
    component.init(go, this);

    if (component.awake) component.awake();
    if (component.start) this.queueForStart.push(component);
  }

  removeComponent(go: Phaser.GameObjects.GameObject, component: IComponent) {
    if (!go.name) {
      return;
    }

    if (!this.componentsByGameObject.has(go.name)) {
      return;
    }

    const list = this.componentsByGameObject.get(go.name) as IComponent[];
    const index = list.findIndex((comp) => comp === component);

    if (index < 0) {
      return;
    }

    list.splice(index, 1);

    console.error("destroy:", component);
    component.destroy?.();
    console.error("componentsByGameObject:", this.componentsByGameObject);
  }

  removeAllComponents(go: Phaser.GameObjects.GameObject) {
    {
      const components = this.componentsByGameObject.get(go.name) ?? [];
      components.forEach((component) => {
        component.destroy?.();
      });
    }
    this.componentsByGameObject.delete(go.name);
  }

  findComponent<ComponentType>(
    go: Phaser.GameObjects.GameObject,
    componentType: Constructor<ComponentType>
  ) {
    const components = this.componentsByGameObject.get(go.name) ?? [];
    return components.find(
      (component) => component instanceof componentType
    ) as ComponentType | undefined;
  }

  destroy() {
    this.componentsByGameObject.forEach((components) => {
      components.forEach((component) => {
        if (component.destroy) {
          component.destroy();
        }
      });
    });
  }

  update(dt: number) {
    // process queue for start
    while (this.queueForStart.length) {
      const component = this.queueForStart.shift();
      if (component?.start) component.start();
    }

    // update each component on each gameobject
    const entries = this.componentsByGameObject.entries();
    for (const [, components] of entries) {
      components.forEach((component) => {
        if (component.update) component.update(dt);
      });
    }
  }
}
