export class MissingDependencyError extends Error {
	constructor(public key, name: string) {
		super(`Dependency ${name} not found! Have you initialized it?`)
	}
}
