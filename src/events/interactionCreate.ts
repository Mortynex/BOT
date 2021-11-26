import { EventHandler, EventName, CommandInteraction } from "interfaces";
import { CommandInteraction as DiscordCommandInteraction } from "discord.js";
import { error, info, debug } from "util/logger";
import { t } from "util/translator";
import { KittyClient } from "client";

export const name: EventName = "interactionCreate";

export const execute: EventHandler<typeof name> = async (client, interaction) => {
	if (interaction.isCommand()) {
		await handleCommandInteraction(client, interaction);
	}
};

async function handleCommandInteraction(
	client: KittyClient,
	interaction: DiscordCommandInteraction
) {
	const errorInteraction = (message: string) => {
		return interaction.followUp({ ephemeral: true, content: message });
	};

	// get command info
	const command = client.commands.store.get(interaction.commandName);

	if (!command) {
		return errorInteraction(t("events.interactionCreate.commandInteraction.noCommand"));
	}

	// defer the command so it doesnt error
	await interaction.deferReply({ ephemeral: command.options.ephemeral }).catch(() => {});

	// check guild
	if (!interaction.guild) {
		return errorInteraction(t("events.interactionCreate.commandInteraction.noGuild"));
	}

	// fetch and check the member
	const member =
		interaction.guild?.members.cache.get(interaction.user.id) ||
		(await interaction.guild?.members.fetch(interaction.user.id));

	if (!member) {
		return errorInteraction(t("events.interactionCreate.commandInteraction.noMember"));
	}

	// assign custom properties
	const commandInteraction = Object.assign(interaction, {
		member,
	}) as CommandInteraction;

	Object.defineProperty(commandInteraction, "error", {
		get: () => errorInteraction,
	});

	// execute
	try {
		await command.execute(client, commandInteraction);
	} catch (e) {
		debug(e);

		const errorMessage = t(
			"events.interactionCreate.commandInteraction.errorWhileExecuting",
			{
				name: command.name,
			}
		);

		error(errorMessage);
		errorInteraction(errorMessage);
	}
}
