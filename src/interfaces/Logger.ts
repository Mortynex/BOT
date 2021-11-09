export type LoggerFunction = (...args: any[]) => void;
export type Logger = {
	info: LoggerFunction;
	error: LoggerFunction;
	warn: LoggerFunction;
	debug: LoggerFunction;
};
