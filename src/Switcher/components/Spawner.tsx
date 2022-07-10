import Phaser from 'phaser'
import StateMachine from '../statemachine/StateMachine'
import ComponentService, { IComponent } from '../services/ComponentService'
// import Countdown from './Countdown'
// import Explosion from './Explosion'

export default class Spawner implements IComponent
{
	private readonly colliders?: Phaser.Physics.Arcade.Group
	private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys
	private readonly layer?: Phaser.GameObjects.Layer

	private gameObject!: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform
	private components!: ComponentService

	// private selectionCursor?: SelectionCursor

	private stateMachine: StateMachine

	constructor(colliders: Phaser.Physics.Arcade.Group | undefined, cursors: Phaser.Types.Input.Keyboard.CursorKeys, layer?: Phaser.GameObjects.Layer)
	{
        if(colliders)
		this.colliders = colliders
		this.cursors = cursors
		this.layer = layer

		this.stateMachine = new StateMachine(this, 'star-spawner')
		this.stateMachine
			.addState('idle', {
				onUpdate: this.handleIdleUpdate
			})
			.addState('spawn', {
				onEnter: this.handleSpawnEnter,
				onUpdate: this.handleSpawnUpdate
			})
			.setState('idle')
	}

	init(go: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform, components: ComponentService)
	{
		this.gameObject = go
		this.components = components
	}

	start()
	{
		// this.selectionCursor = this.components.findComponent(this.gameObject, SelectionCursor)
	}

	update(dt: number)
	{
		this.stateMachine.update(dt)
	}

	private handleIdleUpdate()
	{
		if (this.cursors.space.isDown)
		{
			this.stateMachine.setState('spawn')
		}
	}

	private handleSpawnEnter()
	{
		const { scene } = this.gameObject

		const position = { x: this.gameObject.x, y: this.gameObject.y }

		const star = scene.add.image(position.x, position.y, 'star')

		// this.components.addComponent(star, new Countdown(3))
		// this.components.addComponent(star, new Explosion(this.colliders))

	}

	private handleSpawnUpdate()
	{
		if (this.cursors.space.isUp)
		{
			this.stateMachine.setState('idle')
		}
	}
}