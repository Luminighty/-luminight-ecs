import { EventContext, EventHandler, System } from "./system"

type EventSystem = Record<string, EventHandler[]>

export class SystemContainer {
	events: EventSystem = {}

	listen(key: string, handler: EventHandler) {
		if (!this.events[key])
			this.events[key] = [];
		this.events[key].push(handler)
	}

	emit(event: string, context: EventContext = {}) {
		for (const listener of this.events[event] ?? []) {
			listener(context);
		}
	}

}
