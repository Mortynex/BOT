import { SlashCommandBuilder } from "@discordjs/builders";
import {
	ApplicationCommand,
	ApplicationCommandPermissionData,
	ApplicationCommandPermissions,
	EmbedFieldData,
	GuildApplicationCommandPermissionData,
	MessageEmbed,
	Role,
} from "discord.js";
import Bot from "../../Client";
import {
	DynamicSlashCommand,
	SlashCommand,
	SlashCommandInteraction,
} from "../../Interfaces";
import { slashCommandArgument } from "../../Types";

type CommandRoles = [SlashCommand, Role[]][];

export const command: DynamicSlashCommand = {
	dynamicData: (client, commands, categories) => {
		const choices = [
			...commands
				.filter(
					(command) =>
						command.defaultPermissions !== undefined &&
						command.defaultPermissions.length !== 0
				)
				.map(({ data }) => ({
					key: `/${data.name}`,
					value: `${data.name}`,
				})) /*, ...categories.map(( category )=> ({
            key: `category ${category}`,
            value: `category_${category}`,
        }))*/,
		];

		return new SlashCommandBuilder()
			.setName("permissions")
			.setDescription("idk")
			.setDefaultPermission(false)
			.addSubcommandGroup((subcommands) =>
				subcommands
					.setName("action")
					.setDescription("idk")
					.addSubcommand((subcommand) =>
						subcommand
							.setName("list")
							.setDescription("list all configurable commands and their roles")
					)
					.addSubcommand((subcommand) =>
						subcommand
							.setName("add")
							.setDescription("add a role to a command")
							.addRoleOption((role) =>
								role
									.setName("role")
									.setRequired(true)
									.setDescription("role to allow a command")
							)
							.addStringOption((command) => {
								for (const { key, value } of choices) {
									command.addChoice(key, value);
								}
								return command
									.setName("command")
									.setDescription("Command to add a permissio role")
									.setRequired(true);
							})
					)
					.addSubcommand((subcommand) =>
						subcommand
							.setName("remove")
							.setDescription("remove an role from a command")
							.addStringOption((role) => {
								for (const { key, value } of choices) {
									role.addChoice(key, value);
								}
								return role
									.setName("command")
									.setDescription("Command to remove a permissio role")
									.setRequired(true);
							})
							.addRoleOption((role) =>
								role
									.setName("role")
									.setRequired(true)
									.setDescription("role to allow a command")
							)
					)
			);
	},
	defaultPermissions: ["ADMINISTRATOR"],
	async run(
		client: Bot,
		interaction: SlashCommandInteraction,
		args: slashCommandArgument[]
	) {
		const { guild } = interaction;
		const action = interaction.options.getSubcommand();

		const commandPermissions = await interaction.guild.commands.permissions.fetch({});
		if (!commandPermissions) {
			return interaction.followUp("Cant find permissions for this guild");
		}
		const fullPermissions: GuildApplicationCommandPermissionData[] = [
			...commandPermissions,
		].map(([commandId, commandPermissions]) => ({
			id: commandId,
			permissions: commandPermissions,
		}));

		const commands = proccesCommandPermissions(interaction, client, [
			...commandPermissions,
		]);

		if (action === "list") {
			const fields: EmbedFieldData[] = commandRolesToFields(commands);

			const embed1 = new MessageEmbed().setTitle("Permissions").setFields(fields);

			interaction.followUp({
				embeds: [embed1],
			});

			return;
		}

		const roleOption = interaction.options.getRole("role");
		const commandNameOption = interaction.options.getString("command");

		if (!roleOption || !commandNameOption) {
			return interaction.followUp("Invalid arguments");
		}
		const applicationCommmand = guild.commands.cache.find(
			(command) => command.name === commandNameOption
		);

		if (!applicationCommmand) {
			return interaction.followUp("Cant find this command");
		}

		if (action === "add") {
			let updatedCommandRole: CommandRoles = [];
			const newFullPermissions = fullPermissions.map((permissionData) => {
				const { id, permissions } = permissionData;
				const permissionCommand = interaction.guild.commands.resolve(id);

				if (!permissionCommand || permissionCommand.name !== commandNameOption) {
					return permissionData;
				}

				permissions.push({
					permission: true,
					type: "ROLE",
					id: roleOption.id,
				});

				updatedCommandRole = proccesCommandPermissions(interaction, client, [
					[id, permissions],
				]);

				return {
					id,
					permissions,
				};
			});

			await interaction.guild.commands.permissions.set({
				fullPermissions: newFullPermissions,
			});

			interaction.followUp(
				`Succesfully added ${roleOption.toString()} to command /${commandNameOption}!`
			);
			const [command, roles] = updatedCommandRole[0];

			const newCommandRolesEmbed = new MessageEmbed()
				.setTitle(`/${command.data.name}`)
				.setDescription(roles.join(", "));

			interaction.followUp({
				embeds: [newCommandRolesEmbed],
			});
		} else if (action === "remove") {
			let updatedCommandRole: CommandRoles = [];
			const newFullPermissions = fullPermissions.map((permissionData) => {
				const { id, permissions } = permissionData;
				const permissionCommand = interaction.guild.commands.resolve(id);

				if (!permissionCommand || permissionCommand.name !== commandNameOption) {
					return permissionData;
				}

				const newPermissions = permissions.filter(
					(permission) => permission.id !== roleOption.id
				);

				updatedCommandRole = proccesCommandPermissions(interaction, client, [
					[id, newPermissions],
				]);

				return {
					id,
					permissions: newPermissions,
				};
			});

			await interaction.guild.commands.permissions.set({
				fullPermissions: newFullPermissions,
			});

			interaction.followUp(
				`Succesfully removed ${roleOption.toString()} from command /${commandNameOption}!`
			);

			const [command, roles] = updatedCommandRole[0];

			const newCommandRolesEmbed = new MessageEmbed()
				.setTitle(`/${command.data.name}`)
				.setDescription(roles.join(", "));
			interaction.followUp({
				embeds: [newCommandRolesEmbed],
			});
		} else {
			return interaction.followUp("Invalid action");
		}
	},
};

function commandRolesToFields(commandRoles: CommandRoles): EmbedFieldData[] {
	return commandRoles.map(([command, roles]) => ({
		name: "/" + command.data.name,
		value: roles.map((role) => role.toString()).join(", "),
	}));
}

function proccesCommandPermissions(
	interaction: SlashCommandInteraction,
	client: Bot,
	commandPermissions: [
		string,
		(ApplicationCommandPermissions | ApplicationCommandPermissionData)[]
	][]
) {
	const commands: CommandRoles = [];

	for (const [commandId, permissions] of commandPermissions) {
		const commandName = interaction.guild.commands.resolve(commandId)?.name;
		if (!commandName) {
			// if command doesnt exit continue on to the next command
			continue;
		}
		const command = client.slashCommands.get(commandName);
		if (!command) {
			// if command doesnt exit continue on to the next command
			continue;
		}
		const roles: Role[] = permissions
			.filter(
				async (
					{ type, permission } // filter all non role related permissions
				) => type === "ROLE" && permission === true
			)
			.map(({ id }) => {
				return interaction.guild?.roles.resolve(id); // get the actual role objects
			})
			.filter((role): role is Role => role !== null); // filter invalid roles

		commands.push([command, roles]);
	}

	return commands;
}
