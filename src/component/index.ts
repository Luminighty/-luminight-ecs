import { Entity, EntityId } from "../entity/entity"
export { ComponentContainer, EntityQuery } from "./container"

export interface IComponent {
	parent?: EntityId,
	[key: string]: any,
}

export interface ComponentClass<T = IComponent> {
	COMPONENT_ID?: string,
	new(...args: any[]): T
}


export const COMPONENT_ID = "COMPONENT_ID" as const;
