import { EventExecute, EventName } from "../typings/interfaces";

export const name: EventName = "ready";

export const execute: EventExecute<typeof name> = client => {
	console.log(`kittyhawk is ready, running as ${client.user?.tag}`);
};
