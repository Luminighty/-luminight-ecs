type Class<T> = new (...args: any[]) => T

type AtleastOne<T> = [T, ...T[]]
