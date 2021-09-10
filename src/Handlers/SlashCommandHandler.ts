import path from 'path';
import { readdirSync } from 'fs';
import { SlashCommand } from '../Interfaces';
import Bot from '../Client';

export class SlashCommandHandler {
	init(client: Bot) {
		const categoriesDirectory = path.join(process.cwd(), 'src', 'SlashCommands');
		const categories = readdirSync(categoriesDirectory);

		const slashCommands: object[] = [];
		console.log(categories);
		for (const category of categories) {
			const commandsPath = path.join(categoriesDirectory, category);
			const commands = readdirSync(commandsPath).filter((command) =>
				command.endsWith('.ts')
			);
			console.log(commands);
			for (const command of commands) {
				const commandPath = path.join(commandsPath, command);
				const commandExport = require(commandPath);
				const commandData: SlashCommand = commandExport.command;
				const { data } = commandData;
				if (!data) {
					console.warn(`Invalid command ${command}`);
					continue;
				}

				client.slashCommands.set(data.name, commandData);
				const dataInJSON = data.toJSON();
				dataInJSON ? slashCommands.push(dataInJSON) : null;
			}
		}

		client.on('ready', async () => {
			for (const guildID of client.config.guildIDs) {
				const guild =
					client.guilds.cache.get(guildID) ||
					(await client.guilds.fetch(guildID));

				if (!guild) {
					console.log(`guild ${guildID} not found`);
					continue;
				}

				await guild.commands.set(slashCommands as any); // :/
			}
		});

		return slashCommands;
	}
}
