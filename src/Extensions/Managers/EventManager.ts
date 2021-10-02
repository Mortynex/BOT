import { Event } from "../../Typings/Interfaces";
import globRead from "tiny-glob";
import { Collection } from "discord.js";
import { BaseClientManager } from "../../Classes";
import KittyEvent from "../../Classes/Event";

export class EventManager extends BaseClientManager {
	public cache: Collection<string, KittyEvent<any>> = new Collection();

	async load(glob: string) {
		const events = await globRead(glob, { absolute: true });

		for (const eventPath of events) {
			const event = (await import(eventPath)) as KittyEvent<any>;
			const { name, handler } = event;

			if (!name || !handler) {
				console.warn(`Event ${name} is missing properties`);
				continue;
			}

			this.add(event);
		}
	}

	add(event: KittyEvent<any>) {
		const { name, handler } = event;

		this.cache.set(name, event);
		this.client.on(name, handler.bind(null, this.client));
	}

	/* remove(){

	} */
}
