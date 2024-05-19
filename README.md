# @luminight/ecs

An ECS-like library for the games I've been working on.

## Usage

```ts
import { World, Component } from "@luminight/ecs";

const world = new World()

// Components

@Component("PlayerComponent")
class Player {}

@Component("PositionComponent")
class Position { x = 0; y = 0 }

// EntityId
const player = world.createEntity(
	new Player(),
	new Position()
)

// System
world.addSystem((world) => {
	world.listen("start", () => {
		console.log("Game starting!")	
	})
})

// player: PlayerComponent
// position: PositionComponent
// entity: EntityId
for (const [player, position, entity] of world.query(Player, Position, Entities)) {
	console.log("Player's position: ", position)
}
```

### Querying

Querying for entities is as easy as calling `world.query`

With an LSP turned on, you will also have the advantages of knowing the type of the components. In the example `sprite` will have the type of `Sprite`, while `position` will have the type of `Position`

```js
for (const [sprite, position] of world.query(Sprite, Position)) {
	// Render that sprite at position
}
```

In cases where we also need to work with the entities, we can use the `Entities` keyword in the query
```js
for (const [entity, health] of world.query(Entities, Health)) {
	if (health.hp <= 0) {
		world.addComponent(entity, new Fainted())
		
		// Or

		world.deleteEntity(entity)
	}
}
```

### Components

Defining a class as a component defines a static `COMPONENT_ID` field, that is then used as a key for the component type. This is to ensure that the typing system still works on obfuscated release built code.

```ts
@Component("PositionComponent")
export class FooComponent {

}

// OR

export class FooComponent {
	COMPONENT_ID = "FooComponent" as const
}

// OR

export class FooComponent {

}
Component("FooComponent")(FooComponent) // JS "decorator"
```


### Entity

```ts
world.createEntity(
	// Components list
	new Position(x, y)
	new Sprite("@"),
	new Health(10),
	new Player(),
)
```

### System

There are two flavors of systems at the moment.

Function-Systems
```ts
function UpdateSystem(world: World) {
	// Setup system, listen to events

	world.listen("onUpdate", () => {...})
}
world.addSystem(UpdateSystem)
```


Class-Systems
```ts
class UpdateSystem {
	constructor() {
		// Additional setup / external dependencies
	}

	setup(world: World) {
		// Listen to events, setup
		world.listen("onUpdate", this.onUpdate.bind(this))
	}

	onUpdate() {

	}
}

world.addSystem(new UpdateSystem())
```

Both of these achieve the same results.


### Dependency

Dependencies are a good way to store `singleton` values or external libraries. They are defined by a class

Registering a dependency:
```ts
class DeltaTime { dt = 0 }

const dt = new DeltaTime()
world.injectDependency(dt)
```

Accessing a dependency:
```ts
function UpdateSystem(world: World) {
	const deltaTime = world.getDependency(DeltaTime)

	world.listen("onUpdate", () => {
		console.log(deltaTime.dt)
	})
}
```
