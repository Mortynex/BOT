import { EventHandler, EventName } from "interfaces";

export type KittyEventOptions = {
	handler: EventHandler<any>;
	name: EventName;
};
