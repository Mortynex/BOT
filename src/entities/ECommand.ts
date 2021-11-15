import { Column, Entity, PrimaryColumn, Unique } from "typeorm";

@Entity()
// "E" for Entity
export class ECommand {
	@PrimaryColumn({
		unique: true,
	})
	name: string;

	@Column({ unique: true })
	id: string;

	@Column()
	hash: string;
}
