import { CommandInteraction } from "discord.js";

export class CommandInteractionManager {
	public interaction: CommandInteraction;

	constructor(interaction: CommandInteraction) {
		this.interaction = interaction;
	}
}
