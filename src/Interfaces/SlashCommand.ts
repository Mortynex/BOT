import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { CommandInteraction, Message } from "discord.js";
import Bot from "../Client";
import { genericSlashCommandBuilder, slashCommandArgument } from "../Types";

interface SlashCommandRun {
    (client: Bot, interaction: CommandInteraction, args: slashCommandArgument[]): void
}

export interface SlashCommand {
    run: SlashCommandRun;
    data: genericSlashCommandBuilder;
}