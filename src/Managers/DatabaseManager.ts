import { createConnection } from "typeorm";
import { Members } from "../Database";
import { BaseClientManager } from "../Classes";
import { Member } from "../entities";

export class DatabaseManager extends BaseClientManager {
	public members: Members;

	async init() {
		await createConnection({
			type: "better-sqlite3",
			database: "./db.sqlite",
			entities: [Member],
		});

		this.members = new Members(Member);
	}
}
