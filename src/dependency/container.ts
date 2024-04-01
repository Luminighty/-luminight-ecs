export class DependencyContainer {
	dependencies: Record<string, Object> = {}

	add(dependency: Object) {
		this.dependencies[dependency.constructor.name] = dependency
	}

	get<T>(type: Class<T>): T {
		return this.dependencies[type.name] as T
	}

	getByKey(key: string) {
		return this.dependencies[key]
	}

}