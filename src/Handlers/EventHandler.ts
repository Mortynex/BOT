import path from "path";
import { readdirSync } from "fs";
import { Event } from "../Interfaces";
import Bot from "../Client";
import { Base } from "../Classes";
export class EventHandler extends Base {
	init() {
		const eventsDirectory = path.join(process.cwd(), "src", "Events");
		const events = readdirSync(eventsDirectory).filter((event) => event.endsWith(".ts"));

		for (const event of events) {
			const eventPath = path.join(eventsDirectory, event);
			const eventData = require(eventPath);
			const { name, run }: Event = eventData.event;

			if (!name || !run) {
				console.warn(`Event ${event} is missing properties`);
				continue;
			}

			this.client.events.set(name, eventData.event);

			this.client.on(name, run.bind(null, this.client));
		}
	}
}
