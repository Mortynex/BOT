import { ClientEvents } from "discord.js";
import { Event, EventExecute } from "../typings/interfaces";

export default class KittyEvent<Name extends keyof ClientEvents> {
	public name: Name;
	public handler: EventExecute<Name>;

	constructor(name: Name) {
		this.name = name;
	}
	setName(name: Name) {
		return (this.name = name);
	}
	setHandler(handler: EventExecute<Name>) {
		return (this.handler = handler);
	}
	getEvent(): Event<Name> {
		return {
			name: this.name,
			execute: this.handler,
		};
	}
}
