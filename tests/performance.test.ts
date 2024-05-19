import * as fs from "node:fs";
import { AssertPerformance, Performance } from "./utils";
import { Component, Entity, World } from "../src";
import { EntityId } from "../src/entity/entity";

const TARGET_REPORT_FILE = "./tests/performance-report.target.json"
const OUT_REPORT_FILE = "./tests/performance-report.out.json"


@Component("Position")
class Position { x = 0; y = 0 }
@Component("Player")
class Player { }
@Component("Dummy")
class Dummy { 
	data: number; 
	constructor() { this.data = Math.random() * 100000 }
}
@Component("Sprite")
class Sprite { 
	sprite: string
	constructor() { this.sprite = `sprite-${Math.random() * 100000}.png` }
}

describe("performance tests", () => {

	let targetReport
	let currentReport = {
		date: new Date().toISOString()
	}
	beforeAll(() => {
		try {
			const buffer = fs.readFileSync(TARGET_REPORT_FILE)
			const content = JSON.parse(buffer.toString())
			targetReport = content;
		} catch(_err) {
			console.warn("Target report file not found!");
		}
	})

	afterAll(() => {
		const reportTable = {}
		for (const key in currentReport) {
			const report = currentReport[key];
			if (typeof(report) !== "object")
				continue
			reportTable[key] = {
				min: parseFloat(report.min.toFixed(4)),
				max: parseFloat(report.max.toFixed(4)),
				avg: parseFloat(report.avg.toFixed(4)),
				expected: parseFloat(targetReport?.[key]?.avg?.toFixed(4)),
				delta: parseFloat((report.avg - targetReport?.[key]?.avg)?.toFixed(4))
			}
		}
		console.table(reportTable)
		fs.writeFileSync(OUT_REPORT_FILE, JSON.stringify(currentReport, null, 2))
	})

	test("creating multiple entities", () => {
		const key = "ENTITIES_CREATE"
		const entityAmount = 1000

		const actual = Performance('creating-entities', (start, end) => {
			const world = new World()
			start()
			for (let i = 0; i < entityAmount; i++) {
				world.createEntity(new Position(), new Player())
			}
			end()
		})

		currentReport[key] = {params: { entityAmount }, ...actual, }
		AssertPerformance(targetReport?.[key], actual, 0.3)
	})


	test("deleting multiple entities", () => {
		const key = "ENTITIES_DELETE"
		const entityAmount = 1000

		const actual = Performance('deleting-entities', (start, end) => {
			
			const world = new World()
			const entities: EntityId[] = []
			for (let i = 0; i < entityAmount; i++)
				entities.push(world.createEntity(
					new Position(), new Player(),
					new Dummy(), new Sprite()
				))

			entities.sort((l, r) => world.getComponent(l, Dummy).data - world.getComponent(r, Dummy).data)

			start()
			for (const entity of entities) {
				world.deleteEntity(entity)
			}
			end()
		})
		currentReport[key] = {params: { entityAmount }, ...actual, }
		AssertPerformance(targetReport?.[key], actual, 0.5)
	})

	test("querying from a lot of entities", () => {
		const key = "ENTITIES_QUERY"
		const entityAmount = 1000

		const actual = Performance('querying-entities', (start, end) => {
			
			const world = new World()
			const entities: EntityId[] = []
			for (let i = 0; i < entityAmount; i++) {
				const components: any[] = [new Position()]
				if (i % 2 == 0)
					components.push(new Dummy())
				if (i % 5 != 0)
					components.push(new Sprite())
				if (i % 13 == 0)
					components.push(new Player())

				entities.push(world.createEntity(...components))
			}

			start()
			let i = 0
			for (const [] of world.query(Position, Sprite, Player)) {
				i++
			}
			end()
		})
		currentReport[key] = {params: { entityAmount }, ...actual, }
		AssertPerformance(targetReport?.[key], actual, 0.5)
	})
})