# @luminight/ecs

An ECS-like library for the games I've been working on.

## Usage

```ts
import { World, Component } from "@luminight/ecs";

const world = new World()

// Components

@Component("PlayerComponent")
class PlayerComponent {}

@Component("PositionComponent")
class PositionComponent { x = 0; y = 0 }

// Entity
const player = world.createEntity(
	new PlayerComponent(),
	new PositionComponent()
)

// System
world.addSystem((world) => {
	world.listen("start", () => {
		console.log("Game starting!")	
	})
})

// player: PlayerComponent
// position: PositionComponent
for (const [player, position] of world.query(PlayerComponent, PositionComponent)) {
	console.log("Player's position: ", position)
}
```


### Components

Defining a class as a component defines a static `COMPONENT_ID` field, ahat is then used as a key for the component type. This is to ensure that the typing system still works on obfuscated release built code.

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
	// Component list
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

**TODO**: Dependencies might require a decorator, similarly to how Components do