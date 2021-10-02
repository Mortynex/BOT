import { PermissionFlags } from "discord.js";
import { SlashCommandInteraction } from ".";
import Bot from "../../Client";
import { CommandArguments, CommandBuilder } from "../typings";

interface CommandExecute {
	(client: Bot, interaction: SlashCommandInteraction, args: CommandArguments): any;
}

interface CommandDataFunction {
	(client: Bot): CommandBuilder;
}

export interface SlashCommand {
	run: CommandExecute;
	data: CommandBuilder | CommandDataFunction;
	ephemeral?: boolean;
	defaultPermissions?: (keyof PermissionFlags)[];
}
