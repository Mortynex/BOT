import { Client, ClientOptions } from "discord.js";
import { DatabaseManager, EventManager } from "managers";
import { CommandManager } from "managers";
import { LocalStorage } from "node-localstorage";
import { LOCALSTORAGE_PATH } from "paths";
import { debug } from "util/logger";

export class KittyClient extends Client<true> {
	public events: EventManager;
	public localStorage: LocalStorage = new LocalStorage(LOCALSTORAGE_PATH);
	public database: DatabaseManager;
	public commands: CommandManager;

	constructor(options: ClientOptions) {
		super(options);

		this.events = new EventManager(this);
		this.database = new DatabaseManager(this);
		this.commands = new CommandManager(this);
	}

	public async init() {
		await this.database.init();

		await this.events.loadAll();

		await this.login(process.env.DISCORD_BOT_TOKEN);

		await this.commands.load();
	}
}
