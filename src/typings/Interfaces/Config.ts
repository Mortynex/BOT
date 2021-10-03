import { CommandOptions } from ".";

export interface Config {
	ephermalAsDefault: boolean;
	handlerLifespan: string;
	defaultCommandOptions: CommandOptions;
}
