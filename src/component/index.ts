import { EntityId } from "../entity/entity"
export { ComponentContainer, EntityQuery, ComponentTypeTuple } from "./container"

export interface IComponent {
	parent?: EntityId,
	[key: string]: any,
}

export interface ComponentClass<T = IComponent> {
	COMPONENT_ID?: string,
	new(...args: any[]): T
}


export const COMPONENT_ID = "COMPONENT_ID" as const;


export function Component(componentId: string) {
	return function<T extends Function>(constructor: T) {
		constructor[COMPONENT_ID] = componentId
		return constructor
	}
}
