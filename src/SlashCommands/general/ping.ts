import { SlashCommandBuilder } from "@discordjs/builders";
import { Client } from "discord.js";
import { SlashCommand, SlashCommandInteraction } from "../../Interfaces";
import { slashCommandArgument } from "../../Types";

export const command: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("pings you back")
		.setDefaultPermission(true),
	run(
		client: Client,
		interaction: SlashCommandInteraction,
		args: slashCommandArgument[]
	) {
		interaction.followUp({
			content: "Pong!",
		});
	},
};
