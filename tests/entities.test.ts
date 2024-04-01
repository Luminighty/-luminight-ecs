import { World, Component } from "../src"

@Component("Player")
class Player { }

@Component("Position")
class Position { x = 0; y = 0 }


test("creating entity", () => {
	const world = new World()

	const playerComponent = new Player()
	const positionComponent = new Position()

	const player = world.createEntity(playerComponent, positionComponent)
	expect(player.getComponent(Player)).toBe(playerComponent)
	expect(player.getComponent(Position)).toBe(positionComponent)

})


test("creating multiple entities", () => {
	const world = new World()

	const playerComponent = new Player()
	const positionComponent = new Position()
	const otherPositionComponent = new Position()
	otherPositionComponent.x = 5
	otherPositionComponent.y = 10

	const player = world.createEntity(playerComponent, positionComponent)
	const other = world.createEntity(otherPositionComponent)

	expect(player.getComponent(Position)).toBe(positionComponent)
	expect(other.getComponent(Position)).toBe(otherPositionComponent)
})


test("same component reference", () => {
	const world = new World()

	const position = new Position()
	const player = world.createEntity(position)

	const change = player.getComponent(Position)
	change.x = 2
	change.y = 3

	expect(position.x).toBe(2)
	expect(position.y).toBe(3)
})

test("deleting entity", () => {
	const world = new World()

	@Component("Foo")
	class Foo {}
	
	const player = world.createEntity(new Position(), new Player())
	world.createEntity(new Position, new Player())
	world.createEntity(new Position())
	world.createEntity(new Foo())

	expect(world.entities.length()).toBe(4)
	expect(world.query(Player)).toHaveLength(2)
	expect(world.query(Position)).toHaveLength(3)
	expect(world.query(Foo)).toHaveLength(1)

	world.deleteEntity(player)

	expect(world.entities.length()).toBe(3)
	expect(world.query(Player)).toHaveLength(1)
	expect(world.query(Position)).toHaveLength(2)
	expect(world.query(Foo)).toHaveLength(1)
})


test("One component per type", () => {
	const world = new World()

	const position = new Position()
	const other = new Position()

	const player = world.createEntity()

	expect(world.addComponent(player, position)).toBe(position)
	expect(world.addComponent(player, other)).toBe(position)
})

