import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandBuilder } from "../../typings";
import { CommandExecute } from "../../typings/interfaces";

export const interaction: CommandBuilder = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("pings you back")
	.setDefaultPermission(true);

export const options = {
	epheremal: true,
};

export const execute: CommandExecute = (client, interaction) => {
	interaction.followUp("pong!");
};
