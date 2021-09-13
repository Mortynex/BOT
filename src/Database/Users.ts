import { EntityTarget, getConnection, Repository } from "typeorm";
import { RepositoryBase } from "../Classes";
import { User } from "../Entities/User";

export class Users extends RepositoryBase<User> {}
