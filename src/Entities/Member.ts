import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Member {
	@PrimaryColumn()
	id: string;
}
