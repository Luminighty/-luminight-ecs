import { IComponent } from "../component";
import { IdGenerator } from "../utils/id";
import { Entity, EntityId } from "./entity";

export class EntityContainer {
	nextId = IdGenerator();
	entities: Record<EntityId, Entity> = {}

	create(components: IComponent[]) {
		const id = this.nextId();
		const entity = new Entity(id);
		entity.components = components;
		components.forEach((c) => {c.parent = id});

		this.entities[id] = entity;

		return entity
	}

	get(id: EntityId) {
		return this.entities[id]
	}
}
