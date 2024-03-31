import { IdGenerator } from "../utils/id";
import { Entity } from "./entity";

export class EntityContainer {
	nextId = IdGenerator();
	entities: Set<Entity> = new Set()

	createEntity(...components) {
		const id = this.nextId();
		const entity = new Entity(id);
		entity.components = components;

		this.entities.add(entity);

		entity.emit("onInit")
		entity.emit("onLateInit")
		return entity
	}
}
