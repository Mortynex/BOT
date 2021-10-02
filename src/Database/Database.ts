import { createConnection } from "typeorm";
import { Members } from ".";
import { Base } from "../Classes";
import { Member } from "../entities";

export class Database extends Base {
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
