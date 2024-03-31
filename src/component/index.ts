import { Entity } from "../entity/entity"
export { ComponentContainer } from "./container"

export type Component = {
	parent: Entity,
	[key: string]: any,
}