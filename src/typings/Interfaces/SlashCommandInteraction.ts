import { CommandInteraction, Guild, GuildMember } from "discord.js";

export interface SlashCommandInteraction extends CommandInteraction {
	member: GuildMember;
	guild: Guild;
}
