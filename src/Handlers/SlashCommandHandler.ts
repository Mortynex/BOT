
import path from "path";
import { readdirSync } from "fs";
import Collection from "@discordjs/collection";
import { SlashCommand } from "../Interfaces";
import { SlashCommandBuilder } from "@discordjs/builders";
import {ApplicationCommandData} from "discord.js"
export class SlashCommandHandler {
    
    init(collection: Collection<string, SlashCommand>){
        const categoriesDirectory = path.join(process.cwd(), "src", "SlashCommands");
        const categories = readdirSync(categoriesDirectory);

        const slashCommands: any[] = [];
        console.log(categories);
        for(const category of categories){
            const commandsPath = path.join(categoriesDirectory, category);
            const commands = readdirSync(commandsPath).filter((command) => command.endsWith(".ts"));
            console.log(commands);
            for(const command of commands){
                const commandPath = path.join(commandsPath, command);
                const commandExport = require(commandPath);
                const commandData: SlashCommand = commandExport.command;
                const { slashData } = commandData;
                if(!slashData || !slashData.toJSON || !slashData.name){
                    console.log("EROR",{slashData})
                    continue;
                }
                console.log(commandData)
                collection.set(slashData.name, commandData);
                const slashDataInJSON = slashData.toJSON();
                slashDataInJSON ? 
                    slashCommands.push(slashDataInJSON)
                :null;
                

            }

        }

        return slashCommands;
    }
}