import { EventExecute, EventName, SlashCommandInteraction } from "../typings/interfaces";
import { ClientEvents, Interaction } from "discord.js";

export const name: EventName = "interactionCreate";

export const execute: EventExecute<typeof name> = async (client, interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.cache.get(interaction.commandName);
	if (!command) {
		return interaction.reply({
			content: "Whoops... we cant find this command :/",
		});
	}

	await interaction.deferReply({ ephemeral: command.options.ephemeral }).catch(() => {});

	const guild = interaction.guild;

	if (!guild) {
		return interaction.followUp({
			content: "Huh? I cant find this guild",
		});
	}

	const member =
		interaction.guild?.members.cache.get(interaction.user.id) ||
		(await interaction.guild?.members.fetch(interaction.user.id));

	if (!member) {
		return interaction.followUp({
			content: "Yikes... we couldnt find your indentity on this server.",
		});
	}

	interaction.member = member;
	const slashCommandInteraction: SlashCommandInteraction = Object.assign(interaction, {
		member,
	}) as SlashCommandInteraction;
	Object.defineProperty(slashCommandInteraction, "guild", {
		get: function () {
			return guild;
		},
	});
	try {
		command.execute(client, slashCommandInteraction);
	} catch (e) {
		console.error(e);
		console.warn(`Command ${command.name} had an error while executing`);
		interaction.followUp("Command had an error while executing");
	}
};
