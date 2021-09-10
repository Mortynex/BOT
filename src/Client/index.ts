import { ApplicationCommand, ApplicationCommandData, Client, ClientOptions, Collection } from 'discord.js';
import { Event, SlashCommand, Config } from "../Interfaces"
import configJson from "../config.json"
import { SlashCommandHandler, EventHandler } from '../Handlers';
import { Console } from 'console';


class Bot extends Client {
    public slashCommands: Collection<string, SlashCommand> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public aliases: Collection<string, SlashCommand> = new Collection();
    public config: Config = configJson;

    
    public async init(){
        this.login(process.env.TOKEN);
        console.log("logged in");

        console.log("start shcommand handler");
        const slashCommandHandler = new SlashCommandHandler();
        const slashCommandsData = slashCommandHandler.init(this.slashCommands);
        
        this.on("ready", async () => {
            for(const guildID of this.config.guildIDs){
                const guild = this.guilds.cache.get(guildID) || await this.guilds.fetch(guildID);
                
                if(!guild){
                    console.log("guild not found");
                    continue;
                }
                
                console.log("setting guild slash commands");
                
                await guild.commands.set(slashCommandsData);
            }
        })
        

        const eventHandler = new EventHandler();
        eventHandler.init(this, this.events);
        
    }
}

export default Bot;