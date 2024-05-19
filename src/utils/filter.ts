/**
 * @param array Array to filter the elements on
 * @param predicate The predicate to match against
 * @returns Removed elements
 */
export function filterInPlace<T>(array: Array<T>, predicate: (value: T) => boolean): Array<T> {
	let j = 0

	for (let i = 0; i < array.length; i++) {
		if (predicate(array[i])) {
			array[j] = array[i]
			j++
		}
	}
	
	let removed: Array<T> = Array(array.length - j)
	let i = 0
	while (j < array.length) {
		removed[i++] = array.pop()!
	}
	return removed
}
