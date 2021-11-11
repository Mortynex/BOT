import { Client, ClientOptions } from "discord.js";
import { EventManager } from "managers";
import { LocalStorage } from "node-localstorage";
import { LOCALSTORAGE_PATH } from "paths";

export class KittyClient extends Client {
	public events: EventManager;
	public localStorage: LocalStorage = new LocalStorage(LOCALSTORAGE_PATH);

	constructor(options: ClientOptions) {
		super(options);

		this.events = new EventManager(this);
	}

	public async init() {
		await this.events.loadAll();

		await this.login(process.env.DISCORD_BOT_TOKEN);
	}
}
