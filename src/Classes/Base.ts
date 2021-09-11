import Bot from "../Client";

export abstract class Base {
	constructor(client: Bot) {
		this.client = client;
	}
	public readonly client: Bot;
}
