import Phaser from 'phaser'
import short from 'short-uuid'

export type Constructor<T extends {} = {}> = new (...args: any[]) => T

export interface IComponent
{
    init: (go: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform, components: IComponentService) => void

    awake?: () => void
    start?: () => void
    update?: (dt: number) => void
    destroy?: () => void
}

export default class IComponentService
{
    private componentsByGameObject = new Map<string, IComponent[]>()
    private queueForStart: IComponent[] = []

    addComponent(go: Phaser.GameObjects.GameObject, component: IComponent)
    {
        // give gameobjects unique names
        if(!go.name)
        {
            go.name = short.generate();
        }
        // make sure there is a list of components fort his gameobject
        if(!this.componentsByGameObject.has(go.name))
        {
            this.componentsByGameObject.set(go.name, []);
        }
        // add newcomponent to this gameobjects's list
        const list = this.componentsByGameObject.get(go.name) as IComponent[];
        list.push(component);
        // call the lifecycle hooks
        component.init(go);

        if(component.awake) component.awake();
        if(component.start) this.queueForStart.push(component)
    }

    findComponent<ComponentType>(go: Phaser.GameObjects.GameObject, componentType: any)
    {
        // TODO: find component of type for this gameobject
        const components = this.componentsByGameObject.get(go.name)
        if(!components) return null;
        return components.find(component => components instanceof componentType)
    }

    destroy()
    {
        // clean up all components
        const entries = this.componentsByGameObject.entries()
        for(const [, components] of entries)
        {
            components.forEach(component => {
                if(component.destroy)
                component.destroy()
            })
        }
    }

    update(dt: number)
    {
        // process queue for start
        while(this.queueForStart.length)
        {
            const component = this.queueForStart.shift()
            if(component?.start) component.start()
        }

        // update each component on each gameobject
        const entries = this.componentsByGameObject.entries()
        for(const [, components] of entries)
        {
            components.forEach(component => {
                if(component.update)
                component.update(dt)
            })
        }
    }
}