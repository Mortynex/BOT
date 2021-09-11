import { ButtonInteraction, MessageButton } from "discord.js";
import { getClientInstance } from "..";
import Bot from "../Client";

export class BotMessageButton extends MessageButton {
	private client: Bot;
	private buttonCustomId: string;
	constructor() {
		super();

		this.client = getClientInstance();

		// generate random string as button id
		this.buttonCustomId = String(Math.floor(100000 + Math.random() * 999999));
		this.customId = this.buttonCustomId;
	}
	click(handler: (buttonInteraction: ButtonInteraction) => any) {
		this.client.on("interactionCreate", (interaction) => {
			if (!interaction.isButton()) return;

			// return if the button doesnt match our buttons id
			if (interaction.customId !== this.buttonCustomId) return;

			handler(interaction);
		});
        return this;
	}
}
