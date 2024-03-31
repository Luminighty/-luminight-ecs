import { ComponentContainer } from "../component";
import { Entity, EntityContainer } from "../entity";
import { DependencyHandler } from "./dependency";

export class World {
	dependencies = new DependencyHandler()
	components = new ComponentContainer()
	entities = new EntityContainer()

	inject(dependency, key?) {
		this.dependencies.add(dependency, key);
	}

	createEntity(...components) {
	}

	addSystem(system) {

	}

	emit(event: string, props = {}) {

	}
}