
import path from "path";
import { readdirSync } from "fs";
import Collection from "@discordjs/collection";
import { Event } from "../Interfaces";
import { Client } from "discord.js";
export class EventHandler {
    
    init(client: Client, collection: Collection<string, Event>){
        const eventsDirectory = path.join(process.cwd(), "src", "Events");
        const events = readdirSync(eventsDirectory).filter((event) => event.endsWith(".ts"));

        console.log(events);
        for(const event of events){
            const eventPath = path.join(eventsDirectory, event)
            const eventData = require(eventPath);
            const {name, run} = eventData.event;

            if(!name || !run){
                continue;
            }

            collection.set(name, eventData.event);
            client.on(name, run.bind(null, client))
            console.log({eventData})
        }

    }
}