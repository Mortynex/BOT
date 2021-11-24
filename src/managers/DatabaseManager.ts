import { createConnection } from "typeorm";
import { BaseClientManager } from "./BaseClientManager";

export class DatabaseManager extends BaseClientManager {
	async init() {
		await createConnection({
			type: "better-sqlite3",
			database: "./data/db.sqlite",
			entities: [],
			synchronize: process.env.NODE_ENV === "development",
		});
	}
}
