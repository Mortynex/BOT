import { Client, Collection } from "discord.js";
import { Event, SlashCommand, Config } from "../Interfaces";
import configJson from "../config.json";
import { SlashCommandHandler, EventHandler } from "../Handlers";

class Bot extends Client {
	public slashCommands: Collection<string, SlashCommand> = new Collection();
	public events: Collection<string, Event> = new Collection();
	public aliases: Collection<string, SlashCommand> = new Collection();
	public config: Config = configJson;

	public async init() {
		this.login(process.env.DISCORD_API_TOKEN);

		const slashCommandHandler = new SlashCommandHandler(this);
		slashCommandHandler.init();

		const eventHandler = new EventHandler(this);
		eventHandler.init();
	}
}

export default Bot;
