import path from "path";
import { readdirSync } from "fs";
import { DynamicSlashCommand, SlashCommand } from "../Interfaces";
import { Base } from "../Classes";
import { ApplicationCommandPermissionData, GuildApplicationCommandPermissionData } from "discord.js";

function commandIsDynamicSlashCommand(slashCommand: SlashCommand | DynamicSlashCommand): slashCommand is DynamicSlashCommand {
	return (slashCommand as DynamicSlashCommand).dynamicData !== undefined;

}

export class SlashCommandHandler extends Base {
	init() {
		// get all commands
		const { config, slashCommands } = this.client;
		const categoriesDirectory = path.join(process.cwd(), "src", "SlashCommands");
		const categories = readdirSync(categoriesDirectory);

		const slashCommandsRawData: object[] = [];
		const configurableSlashCommands: SlashCommand[] = [];
		const slashCommandsPreprocessed: SlashCommand[] = [];
		const slashCommandsDynamic: DynamicSlashCommand[] = [];

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
				const commandData: SlashCommand | DynamicSlashCommand  = commandExport.command;
				
				if(commandIsDynamicSlashCommand(commandData)){
					slashCommandsDynamic.push(commandData);
				}
				else{
					

					slashCommandsPreprocessed.push(commandData)
				}
				


				

				
			}
		}

		
		for(const dynamicSlashCommand of slashCommandsDynamic){
			const data = dynamicSlashCommand.dynamicData(this.client, slashCommandsPreprocessed, categories)
			const slashCommand: SlashCommand = {
				...dynamicSlashCommand,
				data: data
			}

			slashCommandsPreprocessed.push(slashCommand);
		}
		for(const slashCommand of slashCommandsPreprocessed){
			const { data } = slashCommand;

			const dataInJSON: object & { defaultPermission?: boolean | undefined} = data.toJSON();

			if(slashCommand.defaultPermissions !== undefined && slashCommand.defaultPermissions.length !== 0){
				dataInJSON.defaultPermission = false;
				configurableSlashCommands.push(slashCommand);
			}
			else{
				dataInJSON.defaultPermission = true;
			}

			
			console.log(dataInJSON);
			if (dataInJSON) {
				slashCommandsRawData.push(dataInJSON);
			}

			slashCommands.set(slashCommand.data.name, slashCommand);
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
				

				const configurableSlashCommandNames = configurableSlashCommands.map((slashCommand) =>
					slashCommand.data.name
				);
				// filter slashCommands to only these which permissions can be configured
				const slashCommands = slashCommandsDirty.filter((slashCommand) => {
					return configurableSlashCommandNames.includes(slashCommand.name);
				})
				
				const fullPermissionsPromise: Promise<GuildApplicationCommandPermissionData>[]  = [...slashCommands].map(async ([commandName, command]) => {
					const roleDefaultPermissions = configurableSlashCommands.find((slashCommand) => 
					slashCommand.data.name === command.name)?.defaultPermissions || [];

					const roles = await (await guild.roles.fetch())
						.filter((role) => role.permissions.has(roleDefaultPermissions));
					
					const permissions: ApplicationCommandPermissionData[] = [...roles].map(([roleName, role]) => ({
						id: role.id,
						type: 'ROLE',
						permission: true
					} ));
					
					
					return {
						id: command.id,
						permissions
					}
						
				});

				const fullPermissions = await Promise.all(fullPermissionsPromise);
				console.log(fullPermissions, JSON.stringify(fullPermissions))
				await guild.commands.permissions.set({
					fullPermissions
				});
			}
		});
		
	}
}
