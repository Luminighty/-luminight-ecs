import { COMPONENT_ID, IComponent } from "../component";
import { IdGenerator } from "../utils/id";
import { Entity, EntityId } from "./entity";

export class EntityContainer {
	nextId = IdGenerator();
	entities: Record<EntityId, Entity> = {}

	create(components: IComponent[]) {
		const id = this.nextId();
		const entity = new Entity(id);

		components.forEach((c) => {
			c.parent = id
			entity.components[c.constructor[COMPONENT_ID]] = c
		})

		this.entities[id] = entity;

		return entity
	}

	get(id: EntityId) {
		return this.entities[id]
	}

	delete(entity: Entity) {
		delete this.entities[entity.uuid]
	}

	length() {
		return Object.values(this.entities).length
	}
}
