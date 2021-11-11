import { Repository, EntityTarget, getConnection } from "typeorm";

export abstract class BaseRepositoryManager<T> {
	public repository: Repository<T>;
	constructor(entity: EntityTarget<T>) {
		this.repository = getConnection().getRepository(entity);
	}
}
