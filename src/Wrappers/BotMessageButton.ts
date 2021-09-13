import {
	ButtonInteraction,
	Interaction,
	MessageButton,
	MessageButtonOptions,
} from "discord.js";
import ms from "ms";
import { getClientInstance } from "..";
import Bot from "../Client";
import { BotHandlerOptions } from "../Types";

export class BotMessageButton extends MessageButton {
	private client: Bot;
	private interactionHandler: ((...args: any[]) => any) | null = null;
	constructor(data?: MessageButton | MessageButtonOptions | undefined) {
		super(data);

		this.client = getClientInstance();

		this.customId = "button_" + Math.floor(9999 + Math.random() * 9999999);
	}
	onClick(
		clickHandler: (buttonInteraction: ButtonInteraction) => any,
		options: BotHandlerOptions = {}
	) {
		const { ephermalReply, keepAlive, lifespan } = options;

		const interactionHandler = async (interaction: Interaction) => {
			if (!interaction.isButton()) return;
			await interaction
				.deferReply({
					ephemeral: ephermalReply || this.client.config.ephermalAsDefault,
				})
				.catch(() => {});
			// return if the select menu doesnt match our buttons id
			if (interaction.customId !== this.customId) return;

			clickHandler(interaction);
		};

		if (!keepAlive) {
			setTimeout(() => {
				this.unsubscribe();
			}, lifespan || ms(this.client.config.handlerLifespan));
		}

		this.client.on("interactionCreate", interactionHandler);
		this.interactionHandler = interactionHandler;

		return this;
	}
	unsubscribe() {
		if (this.interactionHandler === null) return;

		this.client.removeListener("interactionCreate", this.interactionHandler);
	}
}
