import { ClientEvents } from "discord.js";
import KittyClient from "../../Client";

export interface EventExecute<Name extends keyof ClientEvents> {
	(client: KittyClient, ...args: ClientEvents[Name]): any;
}

export interface Event<Name extends keyof ClientEvents> {
	name: Name;
	execute: (client: KittyClient, ...args: ClientEvents[Name]) => any;
}
