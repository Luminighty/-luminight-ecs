/**
 * @param array Array to filter the elements on
 * @param predicate The predicate to match against
 * @returns Removed elements
 */
export function filterInPlace<T>(array: Array<T>, predicate: (value: T) => boolean): Array<T> {
	let j = 0
	const removed: Array<T> = []

	for (let i = 0; i < array.length; i++) {
		if (predicate(array[i])) {
			array[j] = array[i]
			j++
		} else {
			removed[removed.length] = array[i]
		}
	}
	while (j < array.length) {
		array.pop()!;
	}
	return removed
}
