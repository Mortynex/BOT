import { PermissionFlags, Permissions } from "discord.js";
import { SlashCommandInteraction } from ".";
import Bot from "../Client";
import { genericSlashCommandBuilder, slashCommandArgument } from "../Types";

interface SlashCommandRun {
	(client: Bot, interaction: SlashCommandInteraction, args: slashCommandArgument[]): void;
}

interface SlashCommandDataFunction{
	(client: Bot): genericSlashCommandBuilder
}

export interface SlashCommand {
	run: SlashCommandRun;
	data: genericSlashCommandBuilder | SlashCommandDataFunction;
	ephermal?: boolean;
	defaultPermissions?: (keyof PermissionFlags)[];
}
