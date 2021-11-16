import { createHash } from "node:crypto";

export function hashString(input: string): string {
	return createHash("md5").update(input).digest("hex");
}

export function hashObject(input: Object): string {
	return createHash("md5").update(JSON.stringify(input)).digest("hex");
}
