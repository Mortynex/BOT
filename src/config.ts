import { Config } from "./typings/interfaces";

export const config: Config = {
	ephermalAsDefault: false,
	handlerLifespan: "24h",
	defaultCommandOptions: {
		ephemeral: false,
		permissionFlags: [],
		ownerOnly: false,
	},
};
