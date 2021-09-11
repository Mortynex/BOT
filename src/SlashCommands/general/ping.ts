import { SlashCommandBuilder } from "@discordjs/builders";
import { Message, Client, CommandInteraction } from "discord.js";
import { SlashCommand } from "../../Interfaces";
import { slashCommandArgument } from "../../Types";

export const command: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("pings you back")
		.setDefaultPermission(true),
	run(client: Client, interaction: CommandInteraction, args: slashCommandArgument[]) {
		interaction.followUp({
			content: "Pong!",
		});
	},
};
