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
	extends BaseStoreManager<string, KittyCommand<true>>,
		BaseClientManager {}

@mix(BaseStoreManager)
export class CommandManager extends BaseClientManager {
	private _categories: Set<string> = new Set();

	get categories() {
		return this._categories;
	}

	async load() {
		const commandData = new Map<string, Command>();

		// get all commands
		const categories = await globRead(COMMANDS_CATEGORIES_DIR);

		for (const category of categories) {
			// loop through all command categories
			const commandPaths = await globRead(COMMANDS_DIR, { absolute: true });

			if (commandPaths.length > 0) {
				this._categories.add(category);
			}

			for (const commandPath of commandPaths) {
				let command: Command = (await import(commandPath)) as Command;
				let {
					data: { name },
					options,
				} = command;

				commandData.set(name, {
					...command,
					options: { ...CommandOptionDefaults, ...(options ?? {}) },
				});
			}
		}

		let applicationCommands = await this.fetch(process.env.GUILD_ID);
		const appCommandsHash = hashObject(applicationCommands);

		const lastHash = this.client.localStorage.getItem(LOCALSTORAGE_APPCOMMAND_HASH);

		if (appCommandsHash === lastHash) {
			applicationCommands = ( // not really readable
				await this._put(
					this.client.user.id,
					[...commandData].map(([_, { data }]) => data.toJSON()), // ugly
					process.env.GUILD_ID
				)
			).commands.reduce((collection, command) => {
				return collection.set(command.name, command);
			}, new Collection<string, ApplicationCommand>());
		}

		// TODO: create KittyCommand instances with ids from applicationCommands var
	}

	put(guildId?: string) {
		info(t("managers.command.updatingCommands"));
		return this._put(
			this.client.user.id,
			this._getAllRESTApplicationCommandBody(),
			guildId
		);
	}

	clear(guildId?: string) {
		info(t("managers.command.clearingCommands"));
		return this._put(this.client.user.id, [], guildId);
	}

	async fetch(guildId: string) {
		const aCommandManager = guildId
			? (await this.client.guilds.fetch(guildId)).commands
			: this.client.application.commands;

		if (!aCommandManager) {
			throw error(`invalid guild id`);
		}

		return aCommandManager.fetch({});
	}

	private _getAllRESTApplicationCommandBody(): RawCommand[] {
		return this.store.map(kittyCommand => {
			return kittyCommand.getRESTApplicationCommandBody();
		});
	}

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
	}
}

function transformCommandsToREST(commands: Collection<string, KittyCommand>) {
	return commands.map(command => command.getRESTApplicationCommandBody());
}
