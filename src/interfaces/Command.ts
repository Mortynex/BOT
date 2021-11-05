import {
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { KittyClient } from "client";
import { PermissionFlags } from "discord.js";
import { CommandInteraction, Inhibitor } from ".";

export interface Command {
	interaction: CommandBuilder;
	execute: CommandExecute;
	options?: CommandOptions;
}

export type CommandBuilder =
	| SlashCommandBuilder
	| SlashCommandOptionsOnlyBuilder
	| SlashCommandSubcommandsOnlyBuilder
	| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

export interface CommandExecute {
	(client: KittyClient, interaction: CommandInteraction): any;
}

export interface CommandOptions {
	ephemeral?: boolean;
	inhibitors?: Inhibitor[];
}
