import { World } from "../src"

test("function-type system setup", () => {
	const world = new World()
	const systemFn = jest.fn()

	world.addSystem(systemFn)

	expect(systemFn).toHaveBeenCalledWith(world)
})


test("class-type system setup", () => {
	const world = new World()
	const setupFn = jest.fn()

	class System { setup(...args) { setupFn(...args) } }

	world.addSystem(new System())

	expect(setupFn).toHaveBeenCalledWith(world)
})


test("event listening", () => {
	const world = new World()
	const updateFn = jest.fn()

	world.addSystem((world) => {
		world.listen("onUpdate", updateFn)
	})

	expect(updateFn).not.toHaveBeenCalled()
	world.emit("otherEvent")
	expect(updateFn).not.toHaveBeenCalled()
	world.emit("onUpdate")
	expect(updateFn).toHaveBeenCalledWith({})
})


test("system communication through events", () => {
	const world = new World();

	const renderFn = jest.fn()
	const otherRenderFn = jest.fn()
	const physicsFn = jest.fn()

	world.addSystem((world) => {
		world.listen("render", renderFn)

		world.listen("update", () => {
			world.emit("physics", {data: 123})
		})
	})

	world.addSystem((world) => {
		world.listen("render", otherRenderFn)

		world.listen("physics", (context) => {
			physicsFn(context)
			world.emit("render", {data: context.data * 2})
		})
	})

	world.emit("update")
	expect(physicsFn).toHaveBeenCalledWith({data: 123})
	expect(renderFn).toHaveBeenCalledWith({data: 246})
	expect(otherRenderFn).toHaveBeenCalledWith({data: 246})
})