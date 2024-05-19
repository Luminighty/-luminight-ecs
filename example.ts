import { Component, Entities, World } from "./src";

const world = new World()

// Components

class PlayerComponent {}

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
for (const [entities, player, position] of world.query(Entities, PlayerComponent, PositionComponent)) {
	console.log("Player's position: ", position.x)
}

// player: PlayerComponent
// position: PositionComponent
for (const [player, position] of world.query(PlayerComponent, PositionComponent)) {
	console.log("Player's position: ", position.x)
}