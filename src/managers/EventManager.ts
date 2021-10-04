import globRead from "tiny-glob";
import { CacheManager, ClientManager } from ".";
import { mix } from "ts-mixer";
import { Event } from "../typings/interfaces";
import { KittyEvent } from "../structures/KittyEvent";

export interface EventManager extends CacheManager<string, KittyEvent>, ClientManager {}

@mix(CacheManager)
export class EventManager extends ClientManager {
	async load(glob: string) {
		const events = await globRead(glob, { absolute: true });

		for (const eventPath of events) {
			const event = (await import(eventPath)) as Event<any>;
			const { name, execute } = event;

			if (!name || !execute) {
				console.warn(`Event ${name} is missing properties`);
				continue;
			}

			const kittyEvent = new KittyEvent({
				name,
				handler: execute,
			});

			this.add(kittyEvent);
		}
	}

	add(event: KittyEvent) {
		this.cache.set(event.name, event);

		event.subscribe(this.client);
	}

	remove(event: KittyEvent): boolean {
		const deletedInCache = this.cache.delete(event.name);

		const unsubscribedFromEvent = event.unsubcribe(this.client);

		return unsubscribedFromEvent && deletedInCache;
	}
}
