import { World } from "../src"

class Time { dt = 0 }
class Renderer { stage = "idle" }

test("injecting dependencies", () => {
	const world = new World()

	const time = new Time()
	world.injectDependency(time)

	time.dt++;

	expect(world.getDependency(Time)).toBe(time)
	expect(world.getDependency(Time).dt).toBe(1)
})


test("multiple dependencies", () => {
	const world = new World()

	const time = new Time()
	const renderer = new Renderer()
	world.injectDependency(time)
	world.injectDependency(renderer)

	expect(world.getDependency(Renderer)).toBe(renderer)
	expect(world.getDependency(Time)).toBe(time)
})


test("dependencies inside systems", () => {
	const world = new World()

	const time = new Time()
	world.injectDependency(time)

	world.addSystem((world) => {
		const time = world.getDependency(Time);

		world.listen("update", () => { time.dt++; })
	})

	expect(time.dt).toBe(0)
	world.emit("update")
	world.emit("update")
	world.emit("update")
	expect(time.dt).toBe(3)
})


test("same typed dependency gets ignored", () => {
	const world = new World()

	const time = world.injectDependency(new Time())
	const other = new Time()
	const returnValue = world.injectDependency(other)

	time.dt = 5
	other.dt = 10

	expect(world.getDependency(Time)).toBe(time)
	expect(world.getDependency(Time)).not.toBe(other)
	expect(returnValue).toBe(time)
})
