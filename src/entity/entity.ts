import { COMPONENT_ID, Component, ComponentClass } from "../component";

export type EntityId = number

export class Entity {
	public components: Component[] = []
	public meta: object = {}

	constructor(
		public uuid: EntityId,
	) {}

	getComponent<T>(componentType: ComponentClass<T>): T {
		return this.components.find((component) => 
			componentType.COMPONENT_ID === component.constructor[COMPONENT_ID]
		) as T;
	}
	
	getComponentByTypeId<T>(componentTypeId: string): T {
		return this.components.find((component) => 
			componentTypeId === component.constructor[COMPONENT_ID]
		) as T;
	}

	hasComponent(componentType: ComponentClass) {
		return this.components.findIndex((component) => 
		componentType.COMPONENT_ID === component.constructor[COMPONENT_ID]
		) >= 0
	}

}