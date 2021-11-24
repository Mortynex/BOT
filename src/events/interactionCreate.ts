import { EventHandler, EventName, CommandInteraction } from "interfaces";
import { CommandInteraction as DiscordCommandInteraction } from "discord.js";
import { error, info, debug } from "util/logger";
import { t } from "util/translator";
import { KittyClient } from "client";

export const name: EventName = "interactionCreate";

export const execute: EventHandler<typeof name> = async (client, interaction) => {
	if (interaction.isCommand()) {
		const errorMessage = await handleCommandInteraction(client, interaction);

		if (typeof errorMessage === "string") {
			interaction.followUp({ ephemeral: true, content: errorMessage });
		}
	}
};

async function handleCommandInteraction(
	client: KittyClient,
	interaction: DiscordCommandInteraction
) {
	const command = client.commands.store.get(interaction.commandName);

	if (!command) {
		return t("events.interactionCreate.commandInteraction.noCommand");
	}

	await interaction.deferReply({ ephemeral: command.options.ephemeral }).catch(() => {});

	if (!interaction.guild) {
		return t("events.interactionCreate.commandInteraction.noGuild");
	}

	const member =
		interaction.guild?.members.cache.get(interaction.user.id) ||
		(await interaction.guild?.members.fetch(interaction.user.id));

	if (!member) {
		return t("events.interactionCreate.commandInteraction.noMember");
	}

	const fullCommandInteraction = Object.assign(interaction, {
		member,
	}) as CommandInteraction;

	try {
		command.execute(client, fullCommandInteraction);

		return null;
	} catch (e) {
		debug(e);

		const message = t("events.interactionCreate.commandInteraction.errorWhileExecuting", {
			name: command.name,
		});

		error(message);
		return message;
	}
}
