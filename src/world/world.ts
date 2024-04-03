import { IComponent, ComponentClass, ComponentContainer } from "../component";
import { EntityQuery } from "../component/container";
import { Entity, EntityContainer } from "../entity";
import { EventContext, EventHandler, System, SystemContainer } from "../system";
import { DependencyContainer } from "../dependency";
import { EntityId } from "../entity/entity";

export class World {
	dependencies = new DependencyContainer()
	components = new ComponentContainer()
	entities = new EntityContainer()
	systems = new SystemContainer()

	// ***** Entities *****

	createEntity(...components: IComponent[]) {
		for (const component of components)
			this.components.add(component)
		const entity = this.entities.create(components)
		this.emit("onEntityCreated", { entity })
		return entity
	}

	deleteEntity(entity: Entity) {
		this.emit("onEntityDeleted", { entity })
		for (const component of Object.values(entity.components))
			this.components.remove(component)
		this.entities.delete(entity)
	}

	getEntity(entity: EntityId): Entity {
		return this.entities.get(entity)
	}

	// ***** Components *****

	/**
	 * @param target The entity the component is being added to
	 * @param component Component to add
	 * @returns The newly added component, or the already existing one, if the entity already had one
	 */
	addComponent(target: Entity, component: IComponent) {
		const targetComponent = target.getComponent(component.constructor as ComponentClass)
		if (targetComponent)
			return targetComponent
		const id = (component.constructor as ComponentClass).COMPONENT_ID
		target.components[id!] = component
		return this.components.add(component)
	}

	removeComponent(target: Entity, component: IComponent) {
		const id = (component.constructor as ComponentClass).COMPONENT_ID as string
		if (!target.components[id])
			return
		delete target.components[id]
		this.components.remove(component)
	}

	hasComponent(target: Entity, componentClass: ComponentClass<IComponent>) {
		return target.hasComponent(componentClass)
	}

	query<T extends EntityQuery>(...types: T) {
		return this.components.query(this.entities, ...types)
	}

	// ***** Systems *****

	addSystem(system: System) {
		if (typeof(system) == "function")
			return system(this)
		system["world"] = this
		system["setup"](this)
	}

	listen(event: string, handler: EventHandler) {
		this.systems.listen(event, handler)
	}

	emit(event: string, props: EventContext = {}) {
		this.systems.emit(event, props)
	}

	// ***** Dependencies *****

	injectDependency<T extends Object>(dependency: T): T {
		return this.dependencies.add(dependency)
	}

	getDependency<T>(key: (new (...args: unknown[]) => T) | string): T {
		if (typeof(key) === "string")
			return this.dependencies.getByKey(key) as T
		return this.dependencies.get(key)
	}
}
