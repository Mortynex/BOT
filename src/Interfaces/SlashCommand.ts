import { CommandInteraction } from "discord.js";
import Bot from "../Client";
import { genericSlashCommandBuilder, slashCommandArgument } from "../Types";

interface SlashCommandRun {
	(client: Bot, interaction: CommandInteraction, args: slashCommandArgument[]): void;
}

export interface SlashCommand {
	run: SlashCommandRun;
	data: genericSlashCommandBuilder;
	ephermal?: boolean;
}
