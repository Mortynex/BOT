import {
	ApplicationCommand,
	ApplicationCommandData,
	Client,
	ClientOptions,
	Collection
} from 'discord.js';
import { Event, SlashCommand, Config } from '../Interfaces';
import configJson from '../config.json';
import { SlashCommandHandler, EventHandler } from '../Handlers';
import { Console } from 'console';

class Bot extends Client {
	public slashCommands: Collection<string, SlashCommand> = new Collection();
	public events: Collection<string, Event> = new Collection();
	public aliases: Collection<string, SlashCommand> = new Collection();
	public config: Config = configJson;

	public async init() {
		this.login(process.env.DISCORD_API_TOKEN);

		console.log('start shcommand handler');
		const slashCommandHandler = new SlashCommandHandler();
		slashCommandHandler.init(this);

		const eventHandler = new EventHandler();
		eventHandler.init(this, this.events);
	}
}

export default Bot;
