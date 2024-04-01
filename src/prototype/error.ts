export class CyclicPrototypeIncludeError extends Error {
	constructor(public prototypes: string[]) {
		super(`Circular dependecy in entity prototype: ${JSON.stringify(prototypes)}`)
	}
}


export class MissingPrototype extends Error {
	constructor(public prototype: string) {
		super(`Prototype '${prototype}' not found!`)
	}
}
