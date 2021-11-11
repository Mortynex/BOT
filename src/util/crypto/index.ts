import { createHash } from "node:crypto";

export function hashString(input: string): string {
	return createHash("md5").update(input).digest("hex");
}
