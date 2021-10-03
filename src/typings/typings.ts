import {
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { PermissionFlags } from "discord.js";

export type BotHandlerOptions = Partial<{
	ephermalReply: boolean;
	keepAlive: boolean;
	lifespan: number;
}>;

export type CommandBuilder =
	| SlashCommandBuilder
	| SlashCommandOptionsOnlyBuilder
	| SlashCommandSubcommandsOnlyBuilder
	| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

export type CommandPermissionFlag = keyof PermissionFlags;
