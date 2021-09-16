import { Client, Collection } from "discord.js";
import { Event, SlashCommand, Config } from "../Interfaces";
import configJson from "../config.json";
import { SlashCommandHandler, EventHandler } from "../Handlers";
import { Database } from "../Database";

class Bot extends Client {
	public slashCommands: Collection<string, SlashCommand> = new Collection();
	public events: Collection<string, Event> = new Collection();
	public aliases: Collection<string, SlashCommand> = new Collection();
	public config: Config = configJson;
	public database: Database;

	public async init() {
		this.login(process.env.DISCORD_API_TOKEN);

		const slashCommandHandler = new SlashCommandHandler(this);
		slashCommandHandler.init();

		const eventHandler = new EventHandler(this);
		eventHandler.init();

		const database = new Database(this);
		database.init();
		this.database = database;
	}
}

export default Bot;
