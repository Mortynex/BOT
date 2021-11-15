import { ECommand } from "entities";
import { createConnection } from "typeorm";
import { BaseClientManager } from "./BaseClientManager";
import { ECommandsManager } from "./ECommandsManager";

export class DatabaseManager extends BaseClientManager {
	public commands: ECommandsManager;

	async init() {
		await createConnection({
			type: "better-sqlite3",
			database: "./data/db.sqlite",
			entities: [ECommand],
			synchronize: process.env.NODE_ENV === "development",
		});

		this.commands = new ECommandsManager(ECommand);
	}
}
