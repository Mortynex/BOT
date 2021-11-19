import { CommandInteraction, EventHandler, EventName } from "interfaces";
import { error, info, debug } from "util/logger";
import { t } from "util/translator";

export const name: EventName = "interactionCreate";

export const execute: EventHandler<typeof name> = async (client, interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.store.get(interaction.commandName);

	console.log(client.commands.store);

	if (!command) {
		return interaction.reply(t("events.interactionCreate.commandInteraction.noCommand"));
	}

	await interaction.deferReply({ ephemeral: command.options.ephemeral }).catch(() => {});

	const guild = interaction.guild;

	if (!guild) {
		return interaction.followUp(t("events.interactionCreate.commandInteraction.noGuild"));
	}

	const member =
		interaction.guild?.members.cache.get(interaction.user.id) ||
		(await interaction.guild?.members.fetch(interaction.user.id));

	if (!member) {
		return interaction.followUp(
			t("events.interactionCreate.commandInteraction.noMember")
		);
	}

	interaction.member = member;
	const slashCommandInteraction = Object.assign(interaction, {
		member,
	}) as CommandInteraction;

	Object.defineProperty(slashCommandInteraction, "guild", {
		get: function () {
			return guild;
		},
	});

	try {
		command.execute(client, slashCommandInteraction);
	} catch (e) {
		debug(e);

		const message = t("events.interactionCreate.commandInteraction.errorWhileExecuting", {
			name: command.name,
		});

		error(message);
		interaction.followUp(message);
	}
};
