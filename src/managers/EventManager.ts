import globRead from "tiny-glob";
import { mix } from "ts-mixer";
import { Event } from "interfaces";
import { KittyEvent } from "structures/KittyEvent";
import { EVENTS_DIR } from "paths";
import { BaseStoreManager } from "managers/BaseStoreManager";
import { BaseClientManager } from "managers/BaseClientManager";
import { info, warn } from "util/logger";
import { t } from "util/translator";
import { parse } from "path";

export interface EventManager
	extends BaseStoreManager<string, KittyEvent>,
		BaseClientManager {}

@mix(BaseStoreManager)
export class EventManager extends BaseClientManager {
	async loadAll() {
		const events = await globRead(EVENTS_DIR, { absolute: true });

		for (const eventPath of events) {
			const event = (await import(eventPath)) as Event<any>;
			const { name, execute } = event;

			if (!name || !execute) {
				warn(
					t("managers.event.eventMissingProperties", {
						eventName: parse(eventPath).base,
					})
				);

				continue;
			}

			const kittyEvent = new KittyEvent({
				name,
				handler: execute.bind(null, this.client),
			});

			this.add(kittyEvent);
		}

		info(
			t("managers.event.loadedAll", {
				eventsCount: this.store.size,
			})
		);
	}

	add(event: KittyEvent) {
		this.store.set(event.name, event);

		event.subscribe(this.client);

		info(
			t("managers.event.addedEvent", {
				eventName: event.name,
			})
		);
	}

	remove(event: KittyEvent): boolean {
		const removedFromStore = this.store.delete(event.name);

		const unsubscribed = event.unsubcribe(this.client);

		return unsubscribed && removedFromStore;
	}
}
