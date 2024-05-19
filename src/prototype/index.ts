import { ComponentClass } from "../component"
import { World } from "../world"
import { CyclicPrototypeIncludeError, MissingPrototype } from "./error"
export { XmlPrototypeParser } from "./parser"

export interface ComponentPrototype {
	typeId: TypeId,
	props: object
}


export type PrototypeKey = string
export type TypeId = string

export class PrototypeRegistry {
	prototypes: Record<PrototypeKey, ComponentPrototype[]> = {}
	components: Record<TypeId, ComponentClass> = {}
	world!: World
	includeId = "Include" as const

	registerPrototype(key: PrototypeKey, ...components: ComponentPrototype[]) {
		this.prototypes[key] = components
	}

	registerComponent(typeId: TypeId, componentClass: ComponentClass) {
		this.components[typeId] = componentClass
	}

	createEntity(prototype: PrototypeKey, overrideProps = {}) {
		if (!this.prototypes[prototype])
			throw new MissingPrototype(prototype)
		
		const componentPrototypes = this.unwrapComponents(prototype, {})

		const components = componentPrototypes.map(({typeId, props}) => {
			const override = overrideProps[typeId] ?? {}
			const component = new this.components[typeId]()
			for (const key in props)
				component[key] = props[key]
			for (const key in override)
				component[key] = override[key]
			return component
		})

		const entity = this.world.createEntity(...components)
		return entity
	}

	/**
	 * Unwraps a prototype, including the "Include" prototype components, and saves it, 
	 * therefore we only have to unwrap once per entity
	 * @param prototype 
	 * @param currentlyUnwrapping Keeps track of the circular dependencies
	 * @returns 
	 */
	private unwrapComponents(prototype: PrototypeKey, currentlyUnwrapping = {}): ComponentPrototype[] {
		if (currentlyUnwrapping[prototype])
			throw new CyclicPrototypeIncludeError(Object.keys(currentlyUnwrapping).filter((key) => currentlyUnwrapping[key]))
		
		currentlyUnwrapping[prototype] = true;
		const actualComponents = this.prototypes[prototype].filter(({typeId}) => typeId !== this.includeId);
		const includes = this.prototypes[prototype].filter(({typeId}) => typeId === this.includeId)

		for (const include of includes) {
			const includeComponents = this.unwrapComponents(include.props["from"], currentlyUnwrapping)
	
			for (const component of includeComponents) {
				const index = actualComponents.findIndex((actual) => actual.typeId === component.typeId)
				if (index === -1) {
					actualComponents.push(component)
					continue;
				}
				// Original props should take precedence
				actualComponents[index].props = {
					...component.props,
					...actualComponents[index].props
				}
			}
		}
		currentlyUnwrapping[prototype] = false;
		// Save the unwrapped value
		this.prototypes[prototype] = actualComponents;
		return actualComponents
	}

}
