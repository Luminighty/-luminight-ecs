import { PlayerComponent } from "../components/Player.component";
import { PositionComponent } from "../components/Position.component";

export class PlayerMovementSystem {
	constructor(world) {
		super()
		this.controls = world.getDependency(Controls);
		this.time = world.getDependency(Time);

		world.listen(this.onUpdate, [
			PlayerComponent, PositionComponent
		])
	}

	onUpdate({entity}, player, position) {
		position.x += controls.x * this.time.dt
		position.y += controls.y * this.time.dt

		entity.emit("onMoved", {position})
	}
}
