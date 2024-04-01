import { Component, World } from "./src";

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