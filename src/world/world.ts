import { IComponent, ComponentClass, ComponentContainer } from "../component";
import { EntityQuery } from "../component/container";
import { EntityContainer, EntityId } from "../entity";
import { EventContext, EventHandler, System, SystemContainer } from "../system";
import { DependencyContainer } from "../dependency";

export class World {
	dependencies = new DependencyContainer()
	components = new ComponentContainer()
	entities = new EntityContainer()
	systems = new SystemContainer()


	// ********************
	// ***** Entities *****
	// ********************
	
	createEntity(...components: IComponent[]): EntityId {
		const entity = this.entities.create(components).uuid
		for (const component of components)
			this.components.add(entity, component)
		this.emit("onEntityCreated", { entity })
		return entity
	}

	
	deleteEntity(entity: EntityId) {
		this.emit("onEntityDeleted", { entity })
		const components = Object.values(this.entities.get(entity).components)
		for (let i = 0; i < components.length; i++)
			this.components.remove(components[i])
		this.entities.delete(entity)
	}

	// **********************
	// ***** Components *****
	// **********************

	/**
	 * @param target The entity the component is being added to
	 * @param component Component to add
	 * @returns The newly added component, or the already existing one, if the entity already had one
	 */
	addComponent<T>(target: EntityId, component: T & IComponent): T {
		const targetEntity = this.entities.get(target)
		const targetComponent = targetEntity.getComponent(component.constructor as ComponentClass)
		if (targetComponent)
			return targetComponent as T
		const id = (component.constructor as ComponentClass).COMPONENT_ID
		targetEntity.components[id!] = component
		return this.components.add(target, component) as T
	}


	/**
	 * Removes a component from the world and entity.
	 * @note It is deferred until the next maintain cycle
	 * @param component 
	 * @returns 
	 */
	removeComponent(component: IComponent): void {
		this.components.remove(component)
	}

	
	hasComponent(target: EntityId, componentClass: ComponentClass<IComponent>): boolean {
		return this.entities.get(target).hasComponent(componentClass)
	}

	
	getComponent<T>(target: EntityId, componentClass: ComponentClass<T>): T {
		return this.entities.get(target).getComponent(componentClass)
	}


	query<T extends EntityQuery>(...types: T) {
		return this.components.query(this.entities, types)
	}

	
	// *******************
	// ***** Systems *****
	// *******************

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

	// ************************
	// ***** Dependencies *****
	// ************************

	injectDependency<T extends Object>(dependency: T): T {
		return this.dependencies.add(dependency)
	}


	getDependency<T>(key: (new (...args: unknown[]) => T) | string): T {
		if (typeof(key) === "string")
			return this.dependencies.getByKey(key) as T
		return this.dependencies.get(key)
	}


	// ********************
	// ***** Maintain *****
	// ********************

	maintain() {
		this.components.maintain(this.entities)
		this.entities.maintain()
	}
}
