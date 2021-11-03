import Discord, { Guild, GuildMember } from "discord.js";

export interface CommandInteraction extends Discord.CommandInteraction {
	member: GuildMember;
	guild: Guild;
}
