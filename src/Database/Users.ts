import { getConnection, Repository } from "typeorm";
import { User } from "../Entities/User";

export class Users {
	public repository: Repository<User>;
	constructor() {
		this.repository = getConnection().getRepository(User);
	}
}
