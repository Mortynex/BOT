import { KittyClient } from "client";
import { EventHandler } from "interfaces";
import { KittyEventOptions } from "typings";

export class KittyEvent {
	private _name: string;
	private _handler: EventHandler<any>;
	private _subscribed: boolean;

	get name() {
		return this._name;
	}

	get subscribed() {
		return this._subscribed;
	}

	constructor({ handler, name }: KittyEventOptions) {
		this._handler = handler;
		this._name = name;
		this._subscribed = false;
	}

	subscribe(client: KittyClient): boolean {
		if (this._subscribed === true) {
			return false;
		}

		client.on(this._name, this._handler);

		this._subscribed = true;
		return true;
	}

	unsubcribe(client: KittyClient): boolean {
		if (!this._subscribed === false) {
			return false;
		}

		client.removeListener(this._name, this._handler);

		this._subscribed = false;
		return true;
	}
}
