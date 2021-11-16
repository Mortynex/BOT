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
import { ApplicationCommand, Collection } from "discord.js";
import { error, info } from "util/logger";
import { t } from "util/translator";
import { hashObject } from "util/crypto";
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

		// check if some commands changed
		const commandsDataHash = hashObject(transformCommandsToREST(IDlessCommands));
		const lastDataHash = this.client.localStorage.getItem("COMMANDS_DATA_HASH") ?? "";

		if (commandsDataHash === lastDataHash) {
			// no need for command update so exit
			return;
		}

		const guildId = process.env.GUILD_ID;

		if (guildId) {
			await this.update(IDlessCommands, guildId);
		} else {
			error(t("general.notImplemented"));
		}
	}

	async update(input: Collection<string, KittyCommand>, guildId?: string) {
		info(t("managers.command.automaticCommandUpdate"));

		const eCommandsManager = this.client.database.commands;

		const restCommandData = transformCommandsToREST(input);

		const { commands: appCommands, succesfull } = await this._put(
			this.client.user.id,
			restCommandData,
			guildId
		);

		if (!succesfull) {
			return error(t("managers.command.failedUpdating"));
		}

		const newCommandsDataHash = hashObject(restCommandData);

		this.client.localStorage.setItem("COMMANDS_DATA_HASH", newCommandsDataHash);

		for (const [kcName, kittyCommand] of input) {
			const id = appCommands.find(({ name: acName }) => acName === kcName)?.id;

			if (!id) {
				return error(
					t("general.fatal", {
						message:
							"Couldnt map an application command to its corresponding kittycommand",
					})
				);
			}

			const newKittyCommand = new KittyCommand<true>({
				builder: kittyCommand.builder,
				execute: kittyCommand.execute,
				options: kittyCommand.options,
				id: id,
			});

			this.store.set(newKittyCommand.name, newKittyCommand);
		}

		const eCommands = await eCommandsManager.getAllComands();

		const commandsToUpdate: KittyCommand<true>[] = [];

		for (const [name, kittyCommand] of this.store) {
			const entity = eCommands.find(e => e.name === name);
			if (entity?.hash !== kittyCommand.getHash()) {
				commandsToUpdate.push(kittyCommand);
			}
		}

		if (commandsToUpdate.length > 0) {
			eCommandsManager.saveCommands(commandsToUpdate);
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

function transformCommandsToREST(commands: Collection<string, KittyCommand>) {
	return commands.map(command => command.getRESTApplicationCommandBody());
}
