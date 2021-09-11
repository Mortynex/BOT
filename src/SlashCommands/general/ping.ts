import { SlashCommandBuilder } from "@discordjs/builders";
import {
	ButtonInteraction,
	Client,
	CommandInteraction,
	MessageActionRow,
	MessageButton,
} from "discord.js";
import { BotMessageButton } from "../../Classes";
import { SlashCommand } from "../../Interfaces";
import { slashCommandArgument } from "../../Types";

export const command: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("pings you back")
		.setDefaultPermission(true),
	run(client: Client, interaction: CommandInteraction, args: slashCommandArgument[]) {
		const getcustomid = (interaction: ButtonInteraction) => {
			interaction.followUp({
				content: interaction.customId,
			});
		};
		interaction.followUp({
			content: "Pong!",
			components: [
				new MessageActionRow().addComponents(
					new BotMessageButton()
						.setLabel("hello")
						.setStyle("PRIMARY")
						.onClick(getcustomid),
					new BotMessageButton().setLabel("hi").setStyle("PRIMARY").onClick(getcustomid)
				),
			],
		});
	},
};
