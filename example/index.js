import { PlayerComponent } from "./components/Player.component";
import { PositionComponent } from "./components/Position.component";
import { SpriteComponent } from "./components/Sprite.component";

const world = new World();

world.addDependency(new Controls())
world.addDependency(new Time())

const entity = world.addEntity(
	new PlayerComponent(),
	new PositionComponent(),
	new SpriteComponent(),
)

world.emit("onUpdate")
