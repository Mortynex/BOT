import KittyClient from "../Client";

export abstract class BaseClientManager {
	constructor(client: KittyClient) {
		this.client = client;
	}

	public readonly client: KittyClient;
}
