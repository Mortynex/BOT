import { SlashCommandBuilder } from "@discordjs/builders";
import { Client } from "discord.js";
import { SlashCommand } from "../../typings/interfaces";

export const command: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("pings you back")
		.setDefaultPermission(true),
	run(client, interaction, args) {
		interaction.followUp({
			content: "Pong!",
		});
	},
};