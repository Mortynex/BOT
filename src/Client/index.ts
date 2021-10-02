import { Client, Collection } from "discord.js";
import { Event, SlashCommand, Config } from "../Typings/Interfaces";
import configJson from "../config.json";
import { CommandHandler } from "../Handlers";
import { Database } from "../Database";
import { DatabaseManager } from "../Extensions/Managers/DatabaseManager";
import { EventManager } from "../Extensions/Managers/EventManager";
import { EVENTS_DIR } from "../paths";

export default class KittyClient extends Client {
	public slashCommands: Collection<string, SlashCommand> = new Collection();
	public events: EventManager;
	public aliases: Collection<string, SlashCommand> = new Collection();
	public config: Config = configJson;
	public database: Database;
	public commandCategories: string[] = [];

	public async init() {
		this.login(process.env.DISCORD_API_TOKEN);

		const slashCommandHandler = new CommandHandler(this);

		this.events = new EventManager(this);
		this.events.load(EVENTS_DIR + "*.ts");

		this.database = new DatabaseManager(this);
	}
}
