export { DependencyContainer } from "./container"

export const DEPENDENCY_ID = "DEPENDENCY_ID" as const;

export function Dependency(dependencyId: string) {
	return function<T extends Function>(constructor: T) {
		constructor[DEPENDENCY_ID] = dependencyId
		return constructor
	}
}
