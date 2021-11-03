import { PermissionFlags } from "discord.js";
import { CommandInteraction, Inhibitor } from ".";
import { CommandPermissionFlag } from "..";
import Bot from "../../kittyclient";
import { CommandBuilder } from "../typings";

export interface Command {
	interaction: CommandBuilder | CommandInteractionFunction;
	execute: CommandExecute;
	options?: CommandOptions;
}

export interface CommandExecute {
	(client: Bot, interaction: CommandInteraction): any;
}

export interface CommandInteractionFunction {
	(client: Bot): CommandBuilder | Promise<CommandBuilder>;
}

export interface CommandOptions {
	ephemeral?: boolean;
	permissionFlags?: CommandPermissionFlag[];
	inhibitors?: Inhibitor[];
}
