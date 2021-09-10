import { SlashCommandBuilder } from '@discordjs/builders';
import { Message, Client, CommandInteraction } from 'discord.js';
import { SlashCommand } from '../../Interfaces';
import { slashCommandArgument } from '../../Types';

export const command: SlashCommand = {
	slashData: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('pings me you back')
		.setDefaultPermission(true)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('subcommand_name')
				.setDescription('subcommand_description')
				.addStringOption((option) =>
					option.setName('subcommand_string_name').setDescription('subcommand_string_description')
				)
		),
	run(client: Client, interaction: CommandInteraction, args: slashCommandArgument[]) {
		interaction.followUp({
			content: 'Pong!'
		});
		console.log(args);
	}
};
