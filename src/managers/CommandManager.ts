import { BaseStoreManager } from "./BaseStoreManager";
import { BaseClientManager } from "./BaseClientManager";
import globRead from "tiny-glob";
import { COMMANDS_CATEGORIES_DIR, COMMANDS_DIR } from "../paths";
import { mix } from "ts-mixer";
import { Command } from "interfaces";
import { KittyCommand } from "structures";
import { CommandOptionDefaults } from "defaults";
import { RawCommand } from "typings";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Application, ApplicationCommand, Collection } from "discord.js";
import { debug } from "util";
import { error, info } from "util/logger";
import { t } from "util/translator";
import { Console } from "console";
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
		const IDlessCommands: Collection<string, KittyCommand<false>> = new Collection();

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
				let { data, options, execute } = command;

				options = { ...CommandOptionDefaults, ...(options ?? {}) };

				const kittyCommand = new KittyCommand<false>({
					builder: data,
					execute,
					options,
				});

				IDlessCommands.set(data.name, kittyCommand);
			}
		}

		const eCommandsManager = this.client.database.commands;

		for (const [name, idlessCommand] of IDlessCommands) {
			const ecommand = await eCommandsManager.getCommandByName(name);

			const needsUpdating = !ecommand || ecommand.hash !== idlessCommand.getHash();

			const guildId = process.env.GUILD_ID;

			if (needsUpdating && guildId) {
				info(t("managers.command.automaticCommandUpdate"));

				const { commands, succesfull } = await this._put(
					this.client.user.id,
					IDlessCommands.map(cmd => cmd.getRESTApplicationCommandBody()),
					guildId
				);

				if (!succesfull) {
					return error(t("managers.command.failedUpdating"));
				}

				for (const acommand of commands) {
					const kittyCommand = new KittyCommand<true>({
						builder: idlessCommand.builder,
						execute: idlessCommand.execute,
						options: idlessCommand.options,
						id: acommand.id,
					});

					this.store.set(kittyCommand.name, kittyCommand);
				}

				const eCommands = await eCommandsManager.getAllComands();

				for (const [name, kittyCommand] of this.store) {
					const entity = eCommands.find(e => e.name === name);
					if (entity?.hash !== kittyCommand.getHash()) {
						eCommandsManager.saveCommand(kittyCommand);
					}
				}

				break;
			} else if (needsUpdating && !guildId) {
				error(t("general.notImplemented"));
			}
		}
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

	fetch() {}

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
