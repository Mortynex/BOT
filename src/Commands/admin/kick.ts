import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, GuildMember } from "discord.js";
import { SlashCommand, SlashCommandInteraction } from "../../typings/interfaces";

export const command: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName("kick")
		.setDescription("kicks a user")
		.setDefaultPermission(false)
		.addUserOption(option =>
			option.setName("target").setDescription("user to kick").setRequired(true)
		)
		.addStringOption(option =>
			option.setName("reason").setDescription("reason for the kick").setRequired(false)
		),
	defaultPermissions: ["KICK_MEMBERS"],
	run(client, interaction, args) {
		const { member, options } = interaction;
		const target = options.getMember("target");
		const reason = options.getString("reason");

		if (!(target instanceof GuildMember)) {
			return interaction.followUp({
				content: "Invalid target",
			});
		}

		if (
			target.roles.highest.position >= member.roles.highest.position &&
			!member.permissions.has("ADMINISTRATOR")
		) {
			return interaction.followUp({
				content: "Your hierarchical position doesnt allow you to kick this user",
			});
		}
		if (!target.kickable) {
			return interaction.followUp({
				content: "I dont have permissions to kick this user",
			});
		}

		interaction.followUp({
			content: `Succesfully kicked the user <@${target.id}>`,
		});

		//target.kick(reason === null ? undefined : reason);
	},
};
