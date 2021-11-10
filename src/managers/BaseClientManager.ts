import { KittyClient } from "client";

export abstract class BaseClientManager {
	constructor(client: KittyClient) {
		this._client = client;
	}

	private _client: KittyClient;

	get client() {
		return this._client;
	}

	set client(client: KittyClient) {
		this._client = client;
	}
}
