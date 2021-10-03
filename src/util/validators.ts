import { ID_REGEX } from "../constants";

export function isFunction(input: any): input is Function {
	return typeof input === "function";
}

export function isValidId(snowflake: any): boolean {
	return ID_REGEX.test(snowflake);
}
