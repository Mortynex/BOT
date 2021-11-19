import { ApplicationCommandData } from "discord.js";
import { KittyClient } from "client";
import {
	CommandExecute,
	CommandOptions,
	CommandInteraction,
	CommandBuilder,
} from "interfaces";
import { isPromise } from "util/types";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types";
import { RawCommand } from "typings";
import { hashString } from "util/crypto";
import { CommandOptionDefaults } from "defaults";

type KittyCommandOptions = {
	builder: CommandBuilder;
	id?: string;
	execute: CommandExecute;
	options: CommandOptions;
};

export class KittyCommand<hasId extends Boolean = false> {
	private _id: hasId extends true ? string : null | string;
	private _name: string;
	private _options: Required<CommandOptions>;
	private _builder: CommandBuilder;
	private _execute: CommandExecute;

	get id() {
		return this._id;
	}

	get name() {
		return this._name;
	}

	get options() {
		return this._options;
	}

	get handler() {
		return this._execute;
	}

	get builder() {
		return this._builder;
	}

	getHash() {
		return hashString(JSON.stringify(this.getRESTApplicationCommandBody()));
	}

	getRESTApplicationCommandBody(): RawCommand {
		return this._builder.toJSON();
	}

	constructor(data: KittyCommandOptions) {
		const { builder, options, execute } = data;
		this._builder = builder;
		this._name = builder.toJSON().name;
		// TODO: make default command options changable via commands
		this._options = { ...CommandOptionDefaults, ...options };
		this._execute = execute;

		if (data.id) {
			this._id = data.id;
		}
	}

	hasId() {
		return Boolean(this._id);
	}

	setId(newId: string) {
		this._id = newId;
	}

	async execute(client: KittyClient, interaction: CommandInteraction): Promise<boolean> {
		for (const inhibitor of this.options.inhibitors) {
			let result = inhibitor(client, interaction);

			if (isPromise(result)) {
				result = await result;
			}

			if (result === false) {
				return false;
			}
		}

		this._execute(client, interaction);

		return true;
	}

	createInstanceWithId(id: string): KittyCommand<true> {
		return new KittyCommand<true>({
			execute: this._execute,
			builder: this._builder,
			options: this._options,
			id,
		});
	}
}
