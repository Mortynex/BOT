import KittyEvent from "../Classes/Event";

export default new KittyEvent("ready").setHandler(client => {
	console.log(`kittyhawk is ready, running as ${client.user?.tag}`);
});
