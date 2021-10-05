import { ApplicationCommandData } from "discord.js";
import { getClientInstance } from "..";
import KittyClient from "../kittyclient";
import { CommandBuilder } from "../typings";
import {
	CommandExecute,
	CommandOptions,
	SlashCommandInteraction,
} from "../typings/interfaces";

type KittyCommandOptions = {
	builder: CommandBuilder;
	id?: string;
	execute: CommandExecute;
	options: CommandOptions;
};

export class KittyCommand {
	private _id: string | null = null;
	private _name: string;
	private _description: string;
	private _options: Required<CommandOptions>;
	private _data: ApplicationCommandData;
	private _execute: CommandExecute;

	get id() {
		return this._id;
	}

	get name() {
		return this._name;
	}

	get description() {
		return this._description;
	}

	get options() {
		return this._options;
	}

	getApplicationCommandData(): ApplicationCommandData {
		return this._data;
	}

	constructor({ builder, id, options, execute }: KittyCommandOptions) {
		const jsonBuilder = builder.toJSON();
		const { name, description, default_permission } = jsonBuilder;

		this._data = {
			name,
			description,
			options: jsonBuilder.options as any, // ehh
			defaultPermission: default_permission,
		};

		this._name = name;
		this._description = description;
		this._options = { ...getClientInstance().config.defaultCommandOptions, ...options };
		this._execute = execute;

		if (id) {
			this._id = id;
		}
	}

	hasId() {
		return Boolean(this._id);
	}

	setId(newId: string) {
		this._id = newId;
	}

	isOwnerOnly(): boolean {
		return this.options.ownerOnly;
	}

	execute(client: KittyClient, interaction: SlashCommandInteraction) {
		this._execute(client, interaction);
	}
}
