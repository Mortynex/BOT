import {
	SelectMenuInteraction,
	MessageSelectMenu,
	MessageSelectMenuOptions,
	Interaction,
} from "discord.js";
import { getClientInstance } from "..";
import Bot from "../Client";
import ms from "ms";
import { BotHandlerOptions } from "../Types";

export class BotMessageSelectMenu extends MessageSelectMenu {
	private client: Bot;
	private interactionHandler: ((...args: any[]) => any) | null = null;
	constructor(data?: MessageSelectMenu | MessageSelectMenuOptions | undefined) {
		super(data);

		this.client = getClientInstance();

		this.customId = "selectmenu_" + Math.floor(9999 + Math.random() * 9999999);
	}
	onSelect(
		selectHandler: (selectMenuInteraction: SelectMenuInteraction) => any,
		options: BotHandlerOptions = {}
	) {
		const { ephermalReply, keepAlive, lifespan } = options;

		const interactionHandler = async (interaction: Interaction) => {
			if (!interaction.isSelectMenu()) return;
			await interaction
				.deferReply({
					ephemeral: ephermalReply || this.client.config.ephermalAsDefault,
				})
				.catch(() => {});
			// return if the select menu doesnt match our buttons id
			if (interaction.customId !== this.customId) return;

			selectHandler(interaction);
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
