import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { CommandInteraction, Message } from "discord.js";
import Bot from "../Client";
import { slashCommandArgument } from "../Types";

interface SlashCommandRun {
    (client: Bot, interaction: CommandInteraction, args: slashCommandArgument[]): void
}

interface toJSONFunction {
    (): object
}

type genericSlashCommandBuilder = {
    toJSON: toJSONFunction;
    name: string;
    description: string;
} & {
    [prop: string | number | symbol]: any
}

export interface SlashCommand {
    run: SlashCommandRun;
    slashData: genericSlashCommandBuilder;
}