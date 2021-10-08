import { PermissionManager } from "./PermissionsManager";
import { CacheManager } from "./CacheManager";
import { ClientManager } from "./ClientManager";
import {
	ApplicationCommandData,
	ApplicationCommandManager,
	ApplicationCommandPermissionData,
	BaseFetchOptions,
	GuildApplicationCommandManager,
	GuildApplicationCommandPermissionData,
} from "discord.js";
import globRead from "tiny-glob";
import { COMMANDS_CATEGORIES_DIR, COMMANDS_DIR } from "../paths";
import { mix } from "ts-mixer";
import { Command } from "../typings/interfaces";
import { isPromise } from "util/types";
import { isFunction, isValidId } from "../util/validators";
import KittyClient from "../kittyclient";
import { CommandBuilder } from "../typings";
import { KittyCommand } from "../structures";

export interface CommandManager
	extends CacheManager<string, KittyCommand>,
		ClientManager {}

@mix(CacheManager, ClientManager)
export class CommandManager {
	private _permissions: PermissionManager;
	private _categories: Set<string> = new Set();
	private _applicationManager: ApplicationCommandManager | GuildApplicationCommandManager;

	constructor(client: KittyClient) {
		this.client = client;

		this._permissions = new PermissionManager(this.client);

		const { DEV_TESTING_GUILD_ID } = process.env;

		//get the client/testing guild application command manager
		if (client.environment === "production" && client.application !== null) {
			this._applicationManager = client.application.commands;
		} else if (
			client.environment === "development" &&
			DEV_TESTING_GUILD_ID !== undefined
		) {
			(async () => {
				this._applicationManager = (
					await client.guilds.fetch(DEV_TESTING_GUILD_ID)
				).commands;
			})();
		}
	}

	get categories() {
		return this._categories;
	}

	get permissions() {
		return this._permissions;
	}

	async load() {
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
				let { interaction, options, execute } = command;

				let cleanedInteraction: CommandBuilder;

				if (isFunction(interaction)) {
					const newInteractionBuilder = interaction(this.client);

					cleanedInteraction = isPromise(newInteractionBuilder)
						? await newInteractionBuilder
						: newInteractionBuilder;
				} else {
					cleanedInteraction = interaction;
				}

				const defaultOptions = this.client.config.defaultCommandOptions;
				options = options ? { ...defaultOptions, ...options } : defaultOptions;

				const kittyCommand = new KittyCommand({
					builder: cleanedInteraction,
					execute,
					options,
				});

				this.cache.set(cleanedInteraction.name, kittyCommand);
			}
		}

		const commands = await this.fetch();
		const commandsNeedsUpdate = commands?.reduce<boolean>((state, { id, name }) => {
			const kittyCommand = this.cache.find(kcommand => kcommand.name === name);

			if (!kittyCommand) {
				return true;
			}

			if (kittyCommand.hasId() && kittyCommand.id !== id) {
				return true;
			}

			if (!kittyCommand.hasId()) {
				kittyCommand.setId(id);
			}

			return state === false ? false : true;
		}, false);

		if (this.client.environment === "development" && commandsNeedsUpdate) {
			this.put();
		} else if (this.client.environment === "production" && commandsNeedsUpdate) {
			console.log("COMMANDS ARE OUT OF DATE, UPDATE THEM IF POSSIBLE");
		}
		// register the commands in configured guilds
	}

	fetch(id?: string, options?: BaseFetchOptions) {
		const isGuildManager = (manager: any): manager is GuildApplicationCommandManager =>
			Boolean(manager?.guild);

		return isGuildManager(this._applicationManager)
			? this._applicationManager?.fetch(undefined, options)
			: this._applicationManager?.fetch(id, options);
	}

	put() {
		console.log("Updating commands...");
		return this._put();
	}

	clear() {
		console.log("Clearing commands...");
		return this._put(true);
	}

	private _getApplicationCommandData(): ApplicationCommandData[] {
		return this.cache.map(kittyCommand => {
			return kittyCommand.getApplicationCommandData();
		});
	}

	private async _put(clear: boolean = false): Promise<boolean> {
		const clientUser = this.client.user;

		if (process.env.DISCORD_API_TOKEN === undefined) {
			return false;
		}

		if (!clientUser) {
			return false;
		}

		try {
			const applicationCommands = await this._applicationManager.set(
				clear ? [] : this._getApplicationCommandData()
			);

			applicationCommands.forEach(applicationCommand => {
				const kittyCommand = this.cache.find(
					kittyCommand => kittyCommand.name === applicationCommand.name
				);

				kittyCommand?.setId(applicationCommand.id);
			});

			return true;
		} catch (err) {
			return false;
		}
	}
}
