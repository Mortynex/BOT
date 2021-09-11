import { ButtonInteraction, MessageButton, MessageButtonOptions } from "discord.js";
import { getClientInstance } from "..";
import Bot from "../Client";

export class BotMessageButton extends MessageButton {
	private client: Bot;
	constructor(data?: MessageButton | MessageButtonOptions | undefined) {
		super(data);

		this.client = getClientInstance();

		// generate random string for the customId
		this.customId = "button_" + String(Math.floor(100000 + Math.random() * 899999));
	}
	onClick(clickHandler: (buttonInteraction: ButtonInteraction) => any) {
		this.client.on("interactionCreate", (interaction) => {
			if (!interaction.isButton()) return;

			// return if the button doesnt match our buttons id
			if (interaction.customId !== this.customId) return;

			clickHandler(interaction);
		});

		return this;
	}
}
