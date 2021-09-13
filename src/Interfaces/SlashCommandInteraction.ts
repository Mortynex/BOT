import { CommandInteraction, GuildMember } from "discord.js";

export interface SlashCommandInteraction extends CommandInteraction {
	member: GuildMember;
}
