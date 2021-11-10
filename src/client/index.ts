import { Client, ClientOptions } from "discord.js";
import { EventManager } from "managers";
import { info } from "util/logger";
import { t } from "util/translator";

export class KittyClient extends Client {
	public events: EventManager;

	constructor(options: ClientOptions) {
		super(options);

		this.events = new EventManager(this);
	}

	public async init() {
		await this.events.loadAll();

		await this.login(process.env.DISCORD_BOT_TOKEN);
	}
}
