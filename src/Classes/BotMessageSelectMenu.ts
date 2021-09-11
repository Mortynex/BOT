import {
	SelectMenuInteraction,
	MessageSelectMenu,
	MessageSelectMenuOptions,
} from "discord.js";
import { getClientInstance } from "..";
import Bot from "../Client";

export class BotMessageSelectMenu extends MessageSelectMenu {
	private client: Bot;
	constructor(data?: MessageSelectMenu | MessageSelectMenuOptions | undefined) {
		super(data);

		this.client = getClientInstance();

		// generate random string for the customId
		this.customId = "selectmenu_" + String(Math.floor(100000 + Math.random() * 899999));
	}
	onSelect(selectHandler: (selectMenuInteraction: SelectMenuInteraction) => any) {
		this.client.on("interactionCreate", (interaction) => {
			if (!interaction.isSelectMenu()) return;

			// return if the select menu doesnt match our buttons id
			if (interaction.customId !== this.customId) return;

			selectHandler(interaction);
		});

		return this;
	}
}
