import { ECommand } from "entities";
import { KittyCommand } from "structures";
import { hashString } from "util/crypto";
import { BaseRepositoryManager } from "./BaseRepositoryManager";

export class ECommandsManager extends BaseRepositoryManager<ECommand> {
	async saveCommands(commands: KittyCommand<true>[]) {
		const ecommands = commands.map(command => this.createEntity(command));

		return this.repository.save(ecommands);
	}

	async saveCommand(command: KittyCommand<true>) {
		return this.repository.save([this.createEntity(command)]);
	}

	async getCommandByName(name: string) {
		return this.repository.findOne(name);
	}

	async getCommandById(id: string) {
		return this.repository.findOne({ id });
	}

	async getAllComands() {
		return this.repository.find();
	}

	createEntity(command: KittyCommand<true>): ECommand {
		return this.repository.create({
			hash: command.getHash(),
			name: command.name,
			id: command.id,
		});
	}
}
