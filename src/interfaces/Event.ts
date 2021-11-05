import { KittyClient } from "client";
import { ClientEvents } from "discord.js";

export type EventName = keyof ClientEvents;

export interface EventHandler<Name extends EventName> {
	(client: KittyClient, ...args: ClientEvents[Name]): any;
}

export interface Event<Name extends EventName> {
	name: Name;
	run: (client: KittyClient, ...args: ClientEvents[Name]) => any;
}
