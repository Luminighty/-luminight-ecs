import { DEPENDENCY_ID } from "."
import { Class } from "../utils/types"
import { MissingDependencyError } from "./error"

export class DependencyContainer {
	dependencies: Record<string, Object> = {}

	add<T extends Object>(dependency: T): T {
		const key = dependency.constructor[DEPENDENCY_ID] ?? dependency.constructor.name
		if (this.dependencies[key])
			return this.dependencies[key] as T
		this.dependencies[key] = dependency
		return dependency
	}

	get<T>(type: Class<T>): T {
		return this.getByKey(type[DEPENDENCY_ID] ?? type.name) as T
	}

	getByKey(key: string) {
		const dependency = this.dependencies[key]
		if (!dependency)
			throw new MissingDependencyError(key, key)
		return dependency
	}

}
