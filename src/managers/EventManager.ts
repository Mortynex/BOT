import globRead from "tiny-glob";
import { ClientManager } from "./ClientManager";
import { CacheManager } from "./CacheManager";
import { mix } from "ts-mixer";
import { Event } from "../typings/interfaces";
import { KittyEvent } from "../structures/KittyEvent";
import { EVENTS_DIR } from "../paths";

export interface EventManager extends CacheManager<string, KittyEvent>, ClientManager {}

@mix(CacheManager)
export class EventManager extends ClientManager {
	async load() {
		const events = await globRead(EVENTS_DIR, { absolute: true });

		for (const eventPath of events) {
			const event = (await import(eventPath)) as Event<any>;
			const { name, execute } = event;

			if (!name || !execute) {
				console.warn(`Event ${name} is missing properties`);
				continue;
			}

			const kittyEvent = new KittyEvent({
				name,
				handler: execute.bind(null, this.client),
			});

			this.add(kittyEvent);
		}
	}

	add(event: KittyEvent) {
		this.cache.set(event.name, event);

		console.log(event.subscribe(this.client));
	}

	remove(event: KittyEvent): boolean {
		const deletedInCache = this.cache.delete(event.name);

		const unsubscribedFromEvent = event.unsubcribe(this.client);

		return unsubscribedFromEvent && deletedInCache;
	}
}
