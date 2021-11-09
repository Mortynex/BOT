import { Logger } from "interfaces";
import {
	gray,
	bgYellowBright,
	bgGreenBright,
	bgCyanBright,
	bgRed,
	bgMagenta,
} from "chalk";
import { format } from "light-date";

export const createLogger = (env: string = "GLOBAL"): Logger => {
	const print = (typePrefix: string, ...args: any[]) => {
		console.log(
			bgMagenta(`[${env.toUpperCase()}]`),
			gray(format(new Date(), "at {HH}:{mm}:{ss}")),
			typePrefix,
			...args
		);
	};

	return {
		info: (...args: any[]) => print(` ` + bgCyanBright.black("[INFO]"), ...args),
		error: (...args: any[]) => print(bgRed("[ERROR]"), ...args),
		warn: (...args: any[]) => print(` ` + bgYellowBright.black("[WARN]"), ...args),
		debug: (...args: any[]) => print(bgGreenBright.black("[DEBUG]"), ...args),
	};
};

export const { info, error, warn, debug } = createLogger();
