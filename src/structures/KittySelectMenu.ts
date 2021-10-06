import {
	ButtonInteraction,
	MessageButton,
	MessageButtonOptions,
	MessageSelectMenu,
	MessageSelectMenuOptions,
	SelectMenuInteraction,
} from "discord.js";
import { mix } from "ts-mixer";
import { KittyComponent } from "./KittyComponent";

export interface KittySelectMenu
	extends KittyComponent<SelectMenuInteraction>,
		MessageSelectMenu {}

@mix(KittyComponent)
export class KittySelectMenu extends MessageSelectMenu {
	constructor(data?: MessageSelectMenu | MessageSelectMenuOptions) {
		super(data);

		this.customId = `selectmenu_${Math.floor(9999 + Math.random() * 9999999)}`;
	}
}
