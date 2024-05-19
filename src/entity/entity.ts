import { IComponent, ComponentClass } from "../component";

export type EntityId = number

export class Entity {
	public components: {[key: string]: IComponent} = {}
	public meta: object = {}

	constructor(
		public uuid: EntityId,
	) {}

	getComponent<T>(componentType: ComponentClass<T>): T {
		return this.components[componentType.COMPONENT_ID!] as T
	}
	
	getComponentByTypeId<T>(componentTypeId: string): T {
		return this.components[componentTypeId] as T
	}

	hasComponent(componentType: ComponentClass) {
		return Boolean(this.components[componentType.COMPONENT_ID!])
	}

	removeComponent(componentTypeId: string) {
		delete this.components[componentTypeId]
	}

}
