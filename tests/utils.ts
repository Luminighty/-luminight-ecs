
type PerformanceCallback = (start: () => void, end: () => void, id: number) => void
export function Performance(id, callback: PerformanceCallback, sampleSize = 100) {
	const result: PerformanceMeasure[] = []

	for (let i = 0; i < sampleSize; i++) {
		
		let startTime = 0
		let endTime = 0
		callback(
			() => { startTime = performance.now() },
			() => { endTime = performance.now() },
			i
		)

		if (startTime == 0)
			throw new Error("start() was not called!")
		if (endTime == 0)
			throw new Error("end() was not called!")

		const measure = performance.measure(`${id}-${i}`, {
			start: startTime,
			end: endTime,
		})
		result.push(measure)
	}


	const durations = result.map((v) => v.duration)
	const duration = durations.reduce((prev, cur) => prev + cur)
	const avg = duration / sampleSize
	const min = Math.min(...durations)
	const max = Math.max(...durations)
	const maxIndex = durations.findIndex((v) => v == max)
	const minIndex = durations.findIndex((v) => v == min)
	return {avg, min, minIndex, max, maxIndex, report: result}
}

export function AssertPerformance(expected, actual, allowedError = 0.5) {
	if (!expected) return
	expect(actual.avg - expected.avg).toBeLessThanOrEqual(allowedError)
}
