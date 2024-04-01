import { World, Component } from "../src"

@Component("Position")
class Position { x = 0; y = 0 }

@Component("Player")
class Player { }

test("adding components", () => {
	const world = new World();
	const player = world.createEntity()

	const position = world.addComponent(player, new Position())
	position.x = 10

	expect(player.components).toHaveLength(1)

	expect(player.hasComponent(Position)).toBe(true)
	expect(player.hasComponent(Player)).toBe(false)

})

test("removing components", () => {
	const world = new World();

	const position = new Position()
	
	const player = world.createEntity(
		position,
		new Player()
	)

	world.removeComponent(player, position)

	expect(player.hasComponent(Position)).toBe(false)
	expect(player.hasComponent(Player)).toBe(true)

	world.removeComponent(player, position)
	expect(player.hasComponent(Position)).toBe(false)
	expect(player.hasComponent(Player)).toBe(true)

})

test("querying components", () => {
	const world = new World();

	const positionA = new Position();
	
	const positionB = new Position();
	positionB.x = 5; positionB.y = 5;

	const positionC = new Position();
	positionC.x = 15; positionC.y = 10;

	const playerB = new Player();

	world.createEntity(positionA)
	world.createEntity(positionB, playerB)
	world.createEntity(positionC)

	const positions = world.query(Position)
	expect(positions).toEqual(expect.arrayContaining([positionA]))
	expect(positions).toEqual(expect.arrayContaining([positionB]))
	expect(positions).toEqual(expect.arrayContaining([positionC]))
	
	const players = world.query(Player)
	expect(players).toEqual(expect.arrayContaining([playerB]))

	const entities = world.query(Player, Position)
	expect(entities).toEqual([[playerB, positionB]])
})
