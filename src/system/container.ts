import { Entity } from "../entity"
import { System } from "./system"

type EventSystems = Record<string, System[]>

type EventContext = {
	entity: Entity,
}

type EventHandler = (context: EventContext, ...components: unknown[]) => void

export class SystemContainer {
	events: EventSystems = {}

	listen(handler: EventHandler) {

	}

	emit(event, context={}) {
		
	}

}