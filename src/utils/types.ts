type Class<T> = new (...args: unknown[]) => T

type AtleastOne<T> = [T, ...T[]]
