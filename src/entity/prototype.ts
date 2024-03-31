export interface ComponentPrototype {
	type: string,
	props: object
}

export interface EntityPrototype {
	id: string,
	components: ComponentPrototype[]
}
