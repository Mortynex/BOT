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
		});

		this.commands = new ECommandsManager(ECommand);
	}
}
