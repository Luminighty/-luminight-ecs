export class MissingComponentIdError extends Error {
	constructor(public component: any) {
		super(`Component Id not found on ${component.name}!`)
	}
}
