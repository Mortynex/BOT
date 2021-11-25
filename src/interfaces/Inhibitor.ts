import { KittyClient } from "client";
import { CommandInteraction } from ".";

type AllowedReturnTypes = string | true;

export interface Inhibitor {
	(client: KittyClient, interaction: CommandInteraction):
		| AllowedReturnTypes
		| Promise<AllowedReturnTypes>;
}
