import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, GuildMember } from "discord.js";
import { SlashCommand } from "../../Typings/Interfaces";

export const command: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("bans a user")
		.setDefaultPermission(false)
		.addUserOption((option) =>
			option.setName("target").setDescription("user to ban").setRequired(true)
		)
		.addStringOption((option) =>
			option.setName("reason").setDescription("reason for the ban").setRequired(false)
		),
	defaultPermissions: ["BAN_MEMBERS"],
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
				content: "Your hierarchical position doesnt allow you to ban this user",
			});
		}
		if (!target.bannable) {
			return interaction.followUp({
				content: "I dont have permissions to ban this user",
			});
		}

		interaction.followUp({
			content: `Succesfully banned the user <@${target.id}>`,
		});

		/*target.ban({
			reason: reason === null ? undefined : reason,
		});*/
	},
};
