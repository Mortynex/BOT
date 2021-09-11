import { Event } from "../Interfaces";

export const event: Event = {
	name: "ready",
	run(client) {
		console.log(`kittyhawk is ready, running as ${client.user?.tag}`);
	},
};
