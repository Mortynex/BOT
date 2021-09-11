import path from "path";
import { readdirSync } from "fs";
import { SlashCommand } from "../Interfaces";
import { Base } from "../Classes";

export class SlashCommandHandler extends Base {
	init() {
		// get all commands
		const { config, slashCommands } = this.client;
		const categoriesDirectory = path.join(process.cwd(), "src", "SlashCommands");
		const categories = readdirSync(categoriesDirectory);

		const slashCommandsData: object[] = [];

		for (const category of categories) {
			// loop through all command categories
			const commandsPath = path.join(categoriesDirectory, category);
			const commands = readdirSync(commandsPath).filter((command) =>
				command.endsWith(".ts")
			);

			for (const command of commands) {
				// loop through all commands in the category
				const commandPath = path.join(commandsPath, command);
				const commandExport = require(commandPath);
				const commandData: SlashCommand = commandExport.command;
				const { data } = commandData;

				if (!data) {
					console.warn(`Invalid command ${command}`);
					continue;
				}

				slashCommands.set(data.name, commandData);

				const dataInJSON = data.toJSON();
				if (dataInJSON) {
					slashCommandsData.push(dataInJSON);
				}
			}
		}

		// register the commands in configured guilds
		this.client.on("ready", async () => {
			for (const guildID of config.slashCommandGuildIDs) {
				const guild =
					this.client.guilds.cache.get(guildID) ||
					(await this.client.guilds.fetch(guildID));

				if (!guild) {
					console.error(`couldnt update slash commands for guild ${guildID}`);
					continue;
				}

				await guild.commands.set(slashCommandsData as any); // :/
			}
		});
	}
}
