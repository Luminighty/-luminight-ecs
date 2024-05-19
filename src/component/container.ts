import { COMPONENT_ID, IComponent, ComponentClass, Entities } from ".";
import { EntityContainer, EntityId } from "../entity";
import { filterInPlace } from "../utils/filter";
import { AtleastOne } from "../utils/types";
import { MissingComponentIdError } from "./error";

export type ComponentTypeTuple<T extends Array<ComponentClass | typeof Entities>> = {
    [K in keyof T]: (
			T[K] extends typeof Entities ? EntityId :
			T[K] extends ComponentClass<infer V> ? (V & IComponent) :
			never
    );
};

export type EntityQuery = AtleastOne<ComponentClass | typeof Entities>

export class ComponentContainer {
	components: {[key: string]: [EntityId, IComponent][]} = {};
	toDelete: Record<string, Set<IComponent>> = {};
	dirty = false;

	add(entity: EntityId, component: IComponent) {
		const id = component.constructor[COMPONENT_ID]
		if (!id)
			throw new MissingComponentIdError(component.constructor)
		if (!this.components[id])
			this.components[id] = []
		this.components[id].push([entity, component])
		return component
	}


	remove(component: IComponent) {
		const id = component.constructor[COMPONENT_ID]
		if (!id)
			throw new MissingComponentIdError(component.constructor)
		if (!this.components[id])
			return

		this.dirty = true;
		let deleteSet = this.toDelete[id]
		if (!deleteSet) {
			deleteSet = new Set();
			this.toDelete[id] = deleteSet
		}
		deleteSet.add(component)
	}

	query<T extends EntityQuery>(entities: EntityContainer, types: T): ComponentTypeTuple<T>[] {
		// [T1[], T2[], T3[], T4[], ...]
		const groups = types.map((c) => this.components[c[COMPONENT_ID]!] ?? []);

		if (groups.length === 1) {
			// Handle if we're only querying for entities
			if (types[0] === Entities)
				return Object.values(entities.entities).map((entity) => [entity.uuid]) as ComponentTypeTuple<T>[]
			return groups[0].map((g) => g[1]) as ComponentTypeTuple<T>[]
		}


		// Start from the smallest group, we can't have more entities than that
		let possibleEntities!: [EntityId, IComponent][];
		for (let i = 0; i < groups.length; i++) {
			if (types[i] !== Entities && (possibleEntities == null || groups[i].length < possibleEntities.length))
				possibleEntities = groups[i];
		}
		if (possibleEntities.length === 0)
			return [];

		const res: ComponentTypeTuple<T>[] = [];
		entityLoop: for (let i = 0, j = 0; i < possibleEntities.length; i++) {
			const entity = entities.get(possibleEntities[i][0])
			const components: Array<IComponent> = []

			for (let typeIdx = 0; typeIdx < types.length; typeIdx++) {
				const type = types[typeIdx]
				let component
				if (type === Entities) {
					component = entity.uuid
				} else {
					component = entity.getComponent(type)
				}
				if (!component) // break early if component not found
					continue entityLoop
				components[typeIdx] = component
			}
			
			res[j] = components as ComponentTypeTuple<T>
			j++
		}
		
		if (res.length === 0)
			return [];
			
		return res as ComponentTypeTuple<T>[]
	}

	maintain(entities: EntityContainer) {
		if (!this.dirty)
			return

		for (const id in this.toDelete) {
			const set = this.toDelete[id]
			if (set.size == 0)
				continue
			const removed = filterInPlace(this.components[id], (c) => !set.has(c[1]))
			
			for (let i = 0; i < removed.length; i++) {
				const entityId = removed[i][0];
				delete entities.entities[entityId].components[id]
			}

			set.clear()
		}
	}

}
