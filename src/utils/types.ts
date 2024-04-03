export type Class<T> = new (...args: unknown[]) => T

export type AtleastOne<T> = [T, ...T[]]
