import { Event, SlashCommandInteraction } from "../typings/interfaces";
import { ClientEvents, Interaction } from "discord.js";
import { CommandArguments } from "../typings";
import KittyEvent from "../Classes/Event";

export default new KittyEvent({
	name: "interactionCreate",
	async execute(client, interaction) {
		if (!interaction.isCommand()) return;

		const command = client.slashCommands.get(interaction.commandName);
		if (!command) {
			return interaction.reply({
				content: "Whoops... we cant find this command :/",
			});
		}

		await interaction
			.deferReply({ ephemeral: command.ephemeral || client.config.ephermalAsDefault })
			.catch(() => {});

		const args: CommandArguments = [];

		for (let option of interaction.options.data) {
			if (option.type === "SUB_COMMAND") {
				option.name ? args.push(option.name) : null;

				option.options?.forEach(subOption => {
					subOption.value ? args.push(subOption.value) : null;
				});
			} else if (option.value) {
				args.push(option.value);
			}
		}

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
			command.run(client, slashCommandInteraction, args);
		} catch (e) {
			console.error(e);
			console.warn(`Command ${command.data.name} had an error while executing`);
			interaction.followUp("Command had an error while executing");
		}
	},
});
