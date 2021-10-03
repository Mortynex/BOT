import {
	ApplicationCommandData,
	ApplicationCommandPermissionData,
	Collection,
	Guild,
	GuildApplicationCommandPermissionData,
	Role,
} from "discord.js";
import { ClientManager } from "./ClientManager";
import { KittyCommand } from "../structures";

export class PermissionManager extends ClientManager {
	async setDefaultGuildPermissions(guild: Guild): Promise<boolean> {
		const permissionManager = guild.commands.permissions;
		const { cache } = this.client.commands;

		const commands = cache.filter(
			kittyCommand =>
				kittyCommand.getApplicationCommandData().defaultPermission === false &&
				kittyCommand.hasId() === true
		);

		const roles = await guild.roles.fetch();

		const fullPermissions: GuildApplicationCommandPermissionData[] = cache.map(
			({ name, id, options }) => {
				const commandRoles = roles.filter(role =>
					role.permissions.has(options.permissionFlags)
				);

				return {
					id: id as string, // line 13
					permissions: this._rolesToPermissionData(commandRoles),
				};
			}
		);

		try {
			permissionManager.set({
				fullPermissions,
			});

			return true;
		} catch (err) {
			return false;
		}
	}

	async setDefaultCommandPermission(
		guild: Guild,
		{ id, options }: KittyCommand
	): Promise<boolean> {
		if (!id) {
			return false;
		}

		const commandRoles = (await guild.roles.fetch()).filter(role =>
			role.permissions.has(options.permissionFlags)
		);

		try {
			guild.commands.permissions.set({
				command: id,
				permissions: this._rolesToPermissionData(commandRoles),
			});

			return true;
		} catch (err) {
			return false;
		}
	}

	private _rolesToPermissionData(
		roles: Collection<string, Role>,
		permission: boolean = true
	): ApplicationCommandPermissionData[] {
		return roles.map(({ id }) => ({
			id: id,
			type: "ROLE",
			permission,
		}));
	}
}
