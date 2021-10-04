import { ClientEvents } from "discord.js";
import KittyClient from "../../kittyclient";

export interface EventExecute<Name extends keyof ClientEvents> {
	(client: KittyClient, ...args: ClientEvents[Name]): any;
}

export type EventName = keyof ClientEvents;

export interface Event<Name extends keyof ClientEvents> {
	name: Name;
	execute: (client: KittyClient, ...args: ClientEvents[Name]) => any;
}
