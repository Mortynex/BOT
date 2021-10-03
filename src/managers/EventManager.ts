import globRead from "tiny-glob";
import { CacheManager, ClientManager } from ".";
import { mix } from "ts-mixer";
import { Event } from "../typings/interfaces";

export interface EventManager extends CacheManager<string, any>, ClientManager {}

type KittyEvent = Event<any>;

@mix(CacheManager)
export class EventManager extends ClientManager {
	async load(glob: string) {
		const events = await globRead(glob, { absolute: true });

		for (const eventPath of events) {
			const event = (await import(eventPath)).default as KittyEvent;
			const { name, execute } = event;

			if (!name || !execute) {
				console.warn(`Event ${name} is missing properties`);
				continue;
			}

			this.add(event);
		}
	}

	add(event: KittyEvent) {
		const { name, execute } = event;

		this.cache.set(name, event);
		this.client.on(name, execute.bind(null, this.client));
	}

	/* remove(){

	} */
}
