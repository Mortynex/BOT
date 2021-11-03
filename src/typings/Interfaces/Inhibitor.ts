import { CommandInteraction } from ".";

export interface Inhibitor {
	(interaction: CommandInteraction): boolean;
}
