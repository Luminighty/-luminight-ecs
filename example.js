const { World, PrototypeRegistry, XmlPrototypeParser } = require("./dist")

const world = new World()

class PlayerComponent { static COMPONENT_ID = "PlayerComponent" }
class PositionComponent { static COMPONENT_ID = "PositionComponent"; 
	x = 0; y = 0 ;
	get position() { return { x: this.x, y: this.y }}
}

// Creating entities from components
const entity = world.createEntity(
	new PlayerComponent(),
	new PositionComponent()
)
console.log(entity)


const prototypes = new PrototypeRegistry();

prototypes.registerComponent("PlayerComponent", PlayerComponent)
prototypes.registerComponent("PositionComponent", PositionComponent)
prototypes.registerPrototype("Player", 
	{ typeId: "PlayerComponent", props: {} },
	{ typeId: "PositionComponent", props: { x: 10, y: 5 } },
)

const parser = new XmlPrototypeParser();
prototypes.registerPrototype(
	parser.parse(`
		<Entity id="Dummy">
			<PlayerComponent />
			<PositionComponent x="2" y="4! />
		</Entity>
	`)
)
world.injectDependency(prototypes)
prototypes.world = world
const player = prototypes.createEntity("Player")
console.log(player)
console.log(prototypes.createEntity("Dummy"))


world.injectDependency(deltaTime)
// function type system
world.addSystem((world) => {
	const time = world.getDependency(DeltaTime)

	world.listen("onUpdate", (context) => {
		console.log("Elapsed time:", time.dt)
		console.log(world.query(PlayerComponent))

		for (const players of world.query(PlayerComponent)) {
			console.log("function type")
		}
	})
})

// class type system
class PlayerUpdateSystem {
	/** @type {World} */
	world

	/** @param {World} world */
	setup(world) {
		world.listen("onUpdate", this.onUpdate.bind(this))
	}

	onUpdate() {
		const entities = this.world.query(PlayerComponent, PositionComponent)
		for (const [_, position] of entities) {
			console.log("Class type: ", position.position)
		}
	}
}
world.addSystem(new PlayerUpdateSystem())

class DeltaTime { dt = 0 }
const deltaTime = new DeltaTime()
deltaTime.dt += 1;

world.emit("onUpdate")