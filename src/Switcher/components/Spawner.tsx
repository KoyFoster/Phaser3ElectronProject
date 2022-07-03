import Phaser from 'phaser';
import IComponentService, { IComponent } from '../services/ComponentService';
import StateMachine from '../statemachine/StateMachine';

export default class Spawner implements IComponent {
    private gameObject!: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform;
    private stateMachine!: StateMachine;
    private components!: IComponentService;
    private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(cursors: Phaser.Types.Input.Keyboard.CursorKeys)
    {
        this.cursors = cursors;
        this.stateMachine = new StateMachine(this, 'bomb-spawner');
        this.stateMachine.addState('idle',
        {
            onUpdate: this.handleIdleUpdate
        }).addState('spawn',
        {
            onEnter: this.handleSpawnEnter,
            onUpdate: this.handleSpawnUpdate
        }).setState('idle');
    }

    init(go: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform, components: IComponentService)
    {
        this.gameObject = go;
        this.components = components;
    }

    start()
    {
        // this.selectCursor = this.components.findComponent(this.gameObject, this.selectionCursor);
    }

    update(dt: number)
    {
        this.stateMachine.update(dt)
    }

    private handleIdleUpdate()
    {
        if(this.cursors.space.isDown)
        {
            console.log('space.isDown');
            this.stateMachine.setState('spawn')
        }
    }

    private handleSpawnEnter()
    {
        const {scene} = this.gameObject

        //const position = this.selectionCursor ? this.selectionCursor.selectorPOsition : {}
        const position = {x: this.gameObject.x, y: this.gameObject.y};


        scene.add.image(position.x, position.y, 'bomb')
    }

    private handleSpawnUpdate()
    {
        if(this.cursors.space.isUp)
        this.stateMachine.setState('idle');
    }
}