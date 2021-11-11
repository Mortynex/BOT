import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
// "E" for Entity
export class ECommand {
	@PrimaryColumn()
	name: string;

	@Column()
	id: string;

	@Column()
	hash: string;
}
