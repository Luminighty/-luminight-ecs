import { COMPONENT_ID, IComponent, ComponentClass } from ".";
import { EntityContainer } from "../entity";
import { AtleastOne } from "../utils/types";
import { MissingComponentIdError } from "./error";


export type ComponentTypeTuple<T extends ComponentClass[]> = {
    [K in keyof T]: T[K] extends ComponentClass<infer V> ? (V & IComponent) : never;
};

export type EntityQuery = AtleastOne<ComponentClass>

export class ComponentContainer {
	components: {[key: string]: IComponent[]} = {};

	add(component: IComponent) {
		const id = component.constructor[COMPONENT_ID]
		if (!id)
			throw new MissingComponentIdError(component.constructor)
		if (!this.components[id])
			this.components[id] = []
		this.components[id].push(component)
		return component
	}

	remove(component: IComponent) {
		const id = component.constructor[COMPONENT_ID]
		if (!id)
			throw new MissingComponentIdError(component.constructor)
		if (!this.components[id])
			return
		const index = this.components[id].findIndex((c) => c === component)
		if (index < 0)
			return
		this.components[id].splice(index, 1)
	}

	query<T extends EntityQuery>(entities: EntityContainer, ...types: T): ComponentTypeTuple<T>[] {
		// [T1[], T2[], T3[], T4[], ...]
		const groups = types.map((c) => this.components[c[COMPONENT_ID]!] ?? []);

		if (groups.length === 1)
			return groups[0] as ComponentTypeTuple<T>[]

		// Start from the smallest group, we can't have more entities than that
		let smallestGroup = groups[0];
		for (const group of groups) {
			if (group.length < smallestGroup.length)
				smallestGroup = group;
		}
		if (smallestGroup.length === 0)
			return [];

		const possibleEntities = smallestGroup.map((component) => component.parent);
		const res = possibleEntities
			.map((entity) => types.map((type) => entities.get(entity!).getComponent(type)))
			.filter((components) => components.every((c) => c));
			
		if (res.length === 0)
			return [];
			
		return res as ComponentTypeTuple<T>[]
	}

}
