import path from "path";
import { readdirSync } from "fs";
import { SlashCommand } from "../Typings/Interfaces";
import { BaseClientManager } from "../Classes";
import {
	ApplicationCommandPermissionData,
	GuildApplicationCommandPermissionData,
} from "discord.js";

function isFunction(input: any): input is Function {
	return typeof input === "function";
}

export class CommandHandler extends BaseClientManager {
	async init() {
		// get all commands
		const { config, slashCommands, commandCategories } = this.client;
		const categoriesDirectory = path.join(process.cwd(), "src", "Commands");
		console.log({ categoriesDirectory });
		//throw new Error();
		const categories = readdirSync(categoriesDirectory);

		const slashCommandsRawData: object[] = [];
		const slashCommandsWithPermissions: SlashCommand[] = [];
		const slashCommandsPreprocessed: SlashCommand[] = [];

		for (const category of categories) {
			// loop through all command categories
			const commandsPath = path.join(categoriesDirectory, category);
			const commands = readdirSync(commandsPath).filter((command) =>
				command.endsWith(".ts")
			);

			if (commands.length > 0) {
				commandCategories.push(category);
			}
			for (const command of commands) {
				// loop through all commands in the category
				const commandPath = path.join(commandsPath, command);
				const commandExport = await import(commandPath);
				const commandData: SlashCommand = commandExport.command;

				slashCommandsPreprocessed.push(commandData);
			}
		}
		for (let slashCommand of slashCommandsPreprocessed) {
			let { data } = slashCommand;

			if (isFunction(data)) {
				data = data(this.client);
				slashCommand = { ...slashCommand, data };
			}

			const dataInJSON: object & { defaultPermission?: boolean | undefined } =
				data.toJSON();

			if (
				slashCommand.defaultPermissions !== undefined &&
				slashCommand.defaultPermissions.length !== 0
			) {
				dataInJSON.defaultPermission = false;
				slashCommandsWithPermissions.push(slashCommand);
			} else {
				dataInJSON.defaultPermission = true;
			}

			if (dataInJSON) {
				slashCommandsRawData.push(dataInJSON);
			}

			slashCommands.set(data.name, slashCommand);
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

				const slashCommandsDirty = await guild.commands.set(slashCommandsRawData as any); // :/

				const guildPermissions = await guild.commands.permissions.fetch({});

				const commandsWithPermissionsNames = slashCommandsWithPermissions.map(
					(slashCommand) => slashCommand.data.name
				);
				// filter slashCommands to only these which permissions can be configured
				const slashCommands = slashCommandsDirty.filter((slashCommand) => {
					return commandsWithPermissionsNames.includes(slashCommand.name);
				});

				const fullPermissionsPromise: Promise<GuildApplicationCommandPermissionData>[] = [
					...slashCommands,
				].map(async ([commandName, command]) => {
					const guildPermissionsForCommand = guildPermissions.get(command.id);
					if (guildPermissionsForCommand) {
						return {
							id: command.id,
							permissions: guildPermissionsForCommand,
						};
					}

					const roleDefaultPermissions =
						slashCommandsWithPermissions.find(
							(slashCommand) => slashCommand.data.name === command.name
						)?.defaultPermissions || [];

					const roles = await (
						await guild.roles.fetch()
					).filter((role) => role.permissions.has(roleDefaultPermissions));

					const permissions: ApplicationCommandPermissionData[] = [...roles].map(
						([roleName, role]) => ({
							id: role.id,
							type: "ROLE",
							permission: true,
						})
					);

					return {
						id: command.id,
						permissions,
					};
				});

				const fullPermissions = await Promise.all(fullPermissionsPromise);

				await guild.commands.permissions.set({
					fullPermissions,
				});
			}
		});
	}
}
