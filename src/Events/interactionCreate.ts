import { Event, SlashCommandInteraction } from "../Interfaces";
import { Interaction } from "discord.js";
import { slashCommandArgument } from "../Types";

export const event: Event = {
	name: "interactionCreate",
	async run(client, interaction: Interaction) {
		if (!interaction.isCommand()) return;

		const command = client.slashCommands.get(interaction.commandName);
		if (!command) {
			return interaction.reply({
				content: "Whoops... we cant find this command :/",
			});
		}

		await interaction
			.deferReply({ ephemeral: command.ephermal || client.config.ephermalAsDefault })
			.catch(() => {});

		const args: slashCommandArgument[] = [];

		for (let option of interaction.options.data) {
			if (option.type === "SUB_COMMAND") {
				option.name ? args.push(option.name) : null;

				option.options?.forEach((subOption) => {
					subOption.value ? args.push(subOption.value) : null;
				});
			} else if (option.value) {
				args.push(option.value);
			}
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
		});
		try {
			command.run(client, slashCommandInteraction, args);
		} catch (e) {
			console.error(e);
			console.warn(`Command ${command.data.name} had an error while executing`);
		}
	},
};
