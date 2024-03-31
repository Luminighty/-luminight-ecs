import { Component } from ".";
import { Entity } from "../entity/entity";

type ComponentTypeTuple<T extends Class<unknown>[]> = {
  [K in keyof T]: T[K] extends Class<infer V> ? V[] : never
};

export class ComponentContainer {
	components: {[key: string]: Component[]} = {};

	query<T extends AtleastOne<Class<unknown>>>(...types: T): ComponentTypeTuple<T> {

		// [T1[], T2[], T3[], T4[], ...]
		const groups = types.map((c) => this.components[c["COMPONENT_ID"]] ?? []);

		if (groups.length === 0)
			return [...types.map(() => [])] as ComponentTypeTuple<T>;
		if (groups.length === 1)
			return groups as ComponentTypeTuple<T>;

		// Start from the smallest group, we can't have more entities than that
		let smallestGroup = groups[0];
		for (const group of groups) {
			if (group.length < smallestGroup.length)
				smallestGroup = group;
		}
		if (smallestGroup.length === 0)
			return [...types.map(() => [])] as ComponentTypeTuple<T>;

		const possibleEntities = smallestGroup.map((component) => component.parent);
		const res = possibleEntities
			.map((entity) => types.map((type) => entity!.getComponent(type)))
			.filter((components) => components.every((c) => c));
			
		if (res.length === 0)
			return [...types.map(() => [])] as ComponentTypeTuple<T>;
			
		return transpose(res) as ComponentTypeTuple<T>;
	}

}

function transpose(arr) {
  return arr[0].map((_, i) => arr.map(row => row[i]));
}
