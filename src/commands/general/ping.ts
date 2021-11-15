import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandExecute, CommandOptions } from "interfaces";
import { t } from "util/translator";

export const data = new SlashCommandBuilder()
	.setName("ping")
	.setDescription(t("commands.ping.description"));

export const execute: CommandExecute = (client, interaction) => {
	interaction.followUp(t("commands.ping.succes"));
};

export const options: CommandOptions = {
	ephemeral: true,
};
