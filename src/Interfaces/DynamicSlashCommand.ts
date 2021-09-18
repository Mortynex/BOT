import { PermissionFlags, Permissions } from "discord.js";
import { SlashCommand, SlashCommandInteraction } from ".";
import Bot from "../Client";
import { genericSlashCommandBuilder, slashCommandArgument } from "../Types";

interface SlashCommandRun {
	(client: Bot, interaction: SlashCommandInteraction, args: slashCommandArgument[]): void;
}

export interface DynamicSlashCommand {
	run: SlashCommandRun;
	dynamicData: (client: Bot, commands: SlashCommand[], categories: string[]) => genericSlashCommandBuilder;
	ephermal?: boolean;
	defaultPermissions?: (keyof PermissionFlags)[];
}
