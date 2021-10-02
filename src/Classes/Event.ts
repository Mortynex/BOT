import { ClientEvents } from "discord.js";
import { Event, EventExecute } from "../Typings/Interfaces";

export default class KittyEvent<Name extends keyof ClientEvents> {
	public name: Name;
	public handler: EventExecute<Name>;

	constructor({ name, execute }: Event<Name>) {
		this.name = name;
		this.handler = execute;
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
