import { COMPONENT_ID, IComponent } from "../component";
import { IdGenerator } from "../utils/id";
import { Entity, EntityId } from "./entity";

export class EntityContainer {
	nextId = IdGenerator();
	entities: Record<EntityId, Entity> = {}
	toDelete: EntityId[] = []

	create(components: IComponent[]) {
		const id = this.nextId();
		const entity = new Entity(id);

		for (let i = 0; i < components.length; i++) {
			const component = components[i];
			entity.components[component.constructor[COMPONENT_ID]] = component
		}

		this.entities[id] = entity;

		return entity
	}

	get(id: EntityId) {
		return this.entities[id]
	}

	delete(entity: EntityId) {
		this.toDelete.push(entity)
	}

	length() {
		return Object.values(this.entities).length
	}

	maintain() {
		for (let i = 0; i < this.toDelete.length; i++) {
			const id = this.toDelete[i];
			delete this.entities[id]
		}
		this.toDelete = []
	}
	
}
