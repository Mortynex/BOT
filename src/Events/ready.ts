import KittyEvent from "../Classes/Event";
import { Event } from "../typings/interfaces";

export default new KittyEvent({
	name: "ready",
	execute(client) {
		console.log(`kittyhawk is ready, running as ${client.user?.tag}`);
	},
});
