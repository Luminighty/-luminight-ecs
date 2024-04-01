import { MissingDependencyError } from "./error"

export class DependencyContainer {
	dependencies: Record<string, Object> = {}

	add(dependency: Object) {
		this.dependencies[dependency.constructor.name] = dependency
	}

	get<T>(type: Class<T>): T {
		const dependency = this.dependencies[type.name]
		if (!dependency)
			throw new MissingDependencyError(type, type.name)
		return this.dependencies[type.name] as T
	}

	getByKey(key: string) {
		const dependency = this.dependencies[key]
		if (!dependency)
			throw new MissingDependencyError(key, key)
		return dependency
	}

}
