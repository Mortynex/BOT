import { EventHandler, EventName } from "interfaces";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types";

export type KittyEventOptions = {
	handler: EventHandler<any>;
	name: EventName;
};

export type RawCommand = RESTPostAPIApplicationCommandsJSONBody;
