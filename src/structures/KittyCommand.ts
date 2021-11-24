import { KittyClient } from "client";
import {
	CommandExecute,
	CommandOptions,
	CommandInteraction,
	CommandBuilder,
} from "interfaces";
import { isPromise } from "util/types";
import { RawCommand } from "typings";
import { hashString } from "util/crypto";
import { CommandOptionDefaults } from "defaults";

type KittyCommandOptions = {
	builder: CommandBuilder;
	id: string;
	execute: CommandExecute;
	options: CommandOptions;
};

export class KittyCommand {
	private _id: string;
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

	getRESTApplicationCommandBody(): RawCommand {
		return this._builder.toJSON();
	}

	constructor(data: KittyCommandOptions) {
		const { builder, options, execute } = data;
		this._builder = builder;
		this._name = builder.toJSON().name;
		// TODO: make default command options configurable with db
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
}
