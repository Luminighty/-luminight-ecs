export class DependencyHandler {
	dependencies: Record<string, Object> = {}

	add(dependency: Object, key?: string) {
		this.dependencies[key ?? dependency.constructor.name] = dependency
	}

	get<T>(type: Class<T>) {
		return this.dependencies[type.name]
	}

	getByKey(key: string) {
		return this.dependencies[key]
	}

}