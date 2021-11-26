import { KittyClient } from "client";
import { CommandInteraction } from ".";

export interface Inhibitor {
	(client: KittyClient, interaction: CommandInteraction): boolean | Promise<boolean>;
}
