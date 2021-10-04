import { Client, Collection } from "discord.js";
import { Config } from "../typings/interfaces";
import { config } from "../config";
import { EventManager, DatabaseManager } from "../managers";
import { EVENTS_DIR } from "../paths";
import { CommandManager } from "../managers";

export default class KittyClient extends Client {
	public events: EventManager;
	public config: Config = config;
	public database: DatabaseManager;
	public environment: "production" | "development";
	public commands: CommandManager;

	public async init() {
		const { DISCORD_API_TOKEN, NODE_ENV } = process.env;
		if (NODE_ENV === "production") {
			this.environment = "production";
		} else {
			this.environment = "development";
		}

		this.login(DISCORD_API_TOKEN);

		this.commands = new CommandManager(this);
		this.commands.load();

		this.events = new EventManager(this);
		this.events.load(EVENTS_DIR + "*.ts");

		this.database = new DatabaseManager(this);
	}
}
