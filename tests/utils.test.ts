import { filterInPlace } from "../src/utils/filter";

test("RemoveAll", () => {
	const array = [1, 5, 3, 8, 2, 10, 21]
	filterInPlace(array, (v) => v < 5)

	expect(array).not.toContain(5)
	expect(array).not.toContain(8)
	expect(array).not.toContain(10)
	expect(array).not.toContain(21)

	expect(array).toContain(1)
	expect(array).toContain(3)
	expect(array).toContain(2)
})