import { IComponent, ComponentClass, ComponentContainer } from "../component";
import { EntityQuery } from "../component/container";
import { Entity, EntityContainer } from "../entity";
import { EventContext, EventHandler, System, SystemContainer } from "../system";
import { DependencyContainer } from "../dependency";

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
		target.components.push(component)
		return this.components.add(component)
	}

	removeComponent(target: Entity, component: IComponent) {
		const index = target.components.findIndex((c) => c === component)
		if (index < 0)
			return
		target.components.splice(index, 1)
		this.components.remove(component)
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

	injectDependency(dependency: Object) {
		this.dependencies.add(dependency);
	}

	getDependency<T>(key: (new (...args: unknown[]) => T)): T {
		return this.dependencies.get(key)
	}
}
