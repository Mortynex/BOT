import { BaseStoreManager } from "./BaseStoreManager";
import { BaseClientManager } from "./BaseClientManager";
import globRead from "tiny-glob";
import { COMMANDS_CATEGORIES_DIR, COMMANDS_DIR } from "../paths";
import { mix } from "ts-mixer";
import { Command, CommandBuilder, CommandExecute } from "interfaces";
import { KittyCommand } from "structures";
import { CommandOptionDefaults } from "defaults";
import { RawCommand } from "typings";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { ApplicationCommand, Collection } from "discord.js";
import { error, info } from "util/logger";
import { t } from "util/translator";
import { hashObject } from "util/crypto";
import { LOCALSTORAGE_APPCOMMAND_HASH } from "../constants";
import { CommandOptions } from "typeorm";
export interface CommandManager
	extends BaseStoreManager<string, KittyCommand>,
		BaseClientManager {}

@mix(BaseStoreManager)
export class CommandManager extends BaseClientManager {
	private _categories: Set<string> = new Set();

	get categories() {
		return this._categories;
	}

	async load() {
		const commandsData = new Map<string, Command>();

		// get all commands
		const categories = await globRead(COMMANDS_CATEGORIES_DIR);

		for (const category of categories) {
			// loop through all command categories
			const commandPaths = await globRead(COMMANDS_DIR, { absolute: true });

			if (commandPaths.length > 0) {
				this._categories.add(category);
			}

			for (const commandPath of commandPaths) {
				const command: Command = (await import(commandPath)) as Command;
				const {
					data: { name },
				} = command;

				commandsData.set(name, command);
			}
		}
		const localStorage = this.client.localStorage;

		const commandsDataInJSON = [...commandsData].map(([_, { data }]) => data.toJSON());
		const commandsDataHash = hashObject(commandsDataInJSON);

		let applicationCommands = await this.fetch(process.env.GUILD_ID);

		const currentHash = commandsDataHash; // current commands hash
		const previousHash = localStorage.getItem(LOCALSTORAGE_APPCOMMAND_HASH); // previus commnads hash

		// updating outdated commands through discord api
		if (previousHash !== currentHash) {
			info("updating commands...");
			applicationCommands = await this._put(commandsDataInJSON, process.env.GUILD_ID);

			localStorage.setItem(LOCALSTORAGE_APPCOMMAND_HASH, commandsDataHash);
		}

		// loading commands data into kitty command instances
		for (const { name, id } of applicationCommands.values()) {
			const command = commandsData.get(name);

			if (!command) {
				throw new Error("TODO: properly handle this error");
			}

			info(`loaded command "${name}"`);

			const { data, execute, options } = command;

			const kittyCommand = new KittyCommand({
				id,
				builder: data,
				execute,
				options: options ?? {},
			});

			this.store.set(name, kittyCommand);
		}
	}

	put(guildId?: string) {
		info(t("managers.command.updatingCommands"));
		return this._put(
			//this.client.user.id,
			this._getAllRESTApplicationCommandBody(),
			guildId
		);
	}

	clear(guildId?: string) {
		info(t("managers.command.clearingCommands"));
		return this._put(/*this.client.user.id,*/ [], guildId);
	}

	async fetch(guildId: string) {
		const applicationCommandManager = await this.getApplicationCommandManager();

		if (!applicationCommandManager) {
			throw error(`invalid guild id`);
		}

		return applicationCommandManager.fetch({});
	}

	async getApplicationCommandManager(guildId?: string) {
		return guildId
			? (await this.client.guilds.fetch(guildId)).commands
			: this.client.application.commands;
	}

	private _getAllRESTApplicationCommandBody(): RawCommand[] {
		return this.store.map(kittyCommand => {
			return kittyCommand.getRESTApplicationCommandBody();
		});
	}

	private async _put(commandsData: RawCommand[], guildId?: string) {
		const applicationCommandManager = await this.getApplicationCommandManager();

		return applicationCommandManager.set(commandsData);
	}

	/*
	private async _put(
		clientId: string,
		data: RawCommand[],
		guildId?: string
	): Promise<{
		succesfull: boolean;
		commands: ApplicationCommand[];
	}> {
		const unsuccesfull = {
			succesfull: false,
			commands: [],
		};

		const clientUser = this.client.user;

		if (process.env.DISCORD_BOT_TOKEN === undefined) {
			return unsuccesfull;
		}

		if (!clientUser) {
			return unsuccesfull;
		}

		const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_BOT_TOKEN);

		try {
			const route = guildId
				? Routes.applicationGuildCommands(clientId, guildId)
				: Routes.applicationCommands(clientId);

			const res = await rest.put(route, { body: data });

			if (res) {
				return {
					commands: res as ApplicationCommand[],
					succesfull: true,
				};
			} else {
				return unsuccesfull;
			}
		} catch (err) {
			return unsuccesfull;
		}
	}*/
}

function transformCommandsToREST(commands: Collection<string, KittyCommand>) {
	return commands.map(command => command.getRESTApplicationCommandBody());
}
