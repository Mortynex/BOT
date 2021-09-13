import { createConnection } from "typeorm";
import { Users } from ".";
import { Base } from "../Classes";
import { User } from "../Entities";

export class Database extends Base {
	public users: Users;

	async init() {
		await createConnection({
			type: "better-sqlite3",
			database: "./db.sqlite",
			entities: [User],
		});

		this.users = new Users(User);
	}
}
