import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, GuildMember, Permissions, Role } from "discord.js";
import { DynamicSlashCommand, SlashCommand, SlashCommandInteraction } from "../../Interfaces";
import { slashCommandArgument } from "../../Types";

export const command: DynamicSlashCommand = {
	dynamicData: (client, commands, categories) => {
        const choices = [...commands
        .filter((command) => 
            command.defaultPermissions !== undefined && command.defaultPermissions.length !== 0
        ) 
        .map(({ data })=> ({
            key: `/${data.name}`,
            value: `command_${data.name}`,
        }))/*, ...categories.map(( category )=> ({
            key: `category ${category}`,
            value: `category_${category}`,
        }))*/];

        return new SlashCommandBuilder()
		.setName("permissions")
		.setDescription("idk")
        .setDefaultPermission(false)
        .addSubcommandGroup((subcommands)=>
            subcommands.setName('action')
            .setDescription('idk')
            .addSubcommand(subcommand => 
                subcommand.setName('list')
                .setDescription('list all configurable commands and their roles')
            ).addSubcommand(subcommand => 
                subcommand.setName('add') 
                .setDescription('add a role to a command')
                .addRoleOption(role =>
                    role.setName('role')
                    .setRequired(true)
                    .setDescription('role to allow a command')
                )
                .addStringOption(role => {
                    for(const {key, value} of choices){
                        role.addChoice(key, value);
                    }
                    return role.setName("command")
                    .setDescription('Command to add a permissio role')
                    .setRequired(true);
                })
            ).addSubcommand(subcommand => 
                subcommand.setName('remove')
                .setDescription('remove an role from a command')
                .addStringOption(role => {
                    for(const {key, value} of choices){
                        role.addChoice(key, value);
                    }
                    return role.setName("command")
                    .setDescription('Command to remove a permissio role')
                    .setRequired(true);
                })
                .addRoleOption(role =>
                    role.setName('role')
                    .setRequired(true)
                    .setDescription('role to allow a command')
                )
            )
        )
    },
	defaultPermissions: ['ADMINISTRATOR'],
	async run(
		client: Client,
		interaction: SlashCommandInteraction,
		args: slashCommandArgument[]
	) {
        if(!interaction.guild){
            return interaction.followUp('invalid guild')
        }
        const action = interaction.options.getSubcommand();
        const data = await interaction.guild.commands.permissions.fetch({});
        if(!data){
            return interaction.followUp('nodata')
        }
        const listings: object[] = [];

        data.forEach((permissions, commandId)=>{
            const command = interaction.guild?.commands.resolve(commandId)?.name;
            const roles: string[] = [];
            permissions.filter(async ({type,permission})=> 
                type === "ROLE" && permission === true
            ).forEach(async ({id})=> {
                const role = interaction.guild?.roles.resolve(id);
                if(role) roles.push(role.name);
            })
            listings.push([command, roles]);
        })

        if(action === 'list'){
            interaction.followUp("k");
            console.log(listings);
        }
    },
};
