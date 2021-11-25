import { APIMessage } from "discord-api-types";
import Discord, { Guild, GuildMember, Message } from "discord.js";

export interface CommandInteraction extends Discord.CommandInteraction {
	member: GuildMember;
	guild: Guild;
	error: (message: string) => Promise<APIMessage | Message<true> | Message<boolean>>;
}
