import { createConnection } from "typeorm";
import { MembersManager } from "../database";
import { Member } from "../entities";
import { ClientManager } from "./ClientManager";

export class DatabaseManager extends ClientManager {
	public members: MembersManager;

	async init() {
		await createConnection({
			type: "better-sqlite3",
			database: "./db.sqlite",
			entities: [Member],
		});

		this.members = new MembersManager(Member);
	}
}
