import { ButtonInteraction, MessageButton, MessageButtonOptions } from "discord.js";
import { mix } from "ts-mixer";
import { KittyComponent } from "./KittyComponent";

export interface KittyButton
	extends KittyComponent<ButtonInteraction, "BUTTON">,
		MessageButton {}

@mix(KittyComponent)
export class KittyButton extends MessageButton {
	constructor(data?: MessageButton | MessageButtonOptions) {
		super(data);

		this.customId = `button_${Math.floor(9999 + Math.random() * 9999999)}`;
	}
}
