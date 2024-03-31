import { Component } from "../component";

export class Entity {
	public components: Component[] = []

	constructor(
		public uuid: number
	) {

	}

	emit(event, context = {}) {
		for (const component of this.components) {
			component[event]?.(context)
		}
	}

	getComponent<T>(componentType: Class<T>): T {
		return this.components.find((component) => 
			componentType["COMPONENT_ID"] === component.constructor["COMPONENT_ID"]
		) as T;
	}
	
	getComponentByTypeId<T>(componentTypeId: string): T {
		return this.components.find((component) => 
			componentTypeId === component.constructor["COMPONENT_ID"]
		) as T;
	}

}