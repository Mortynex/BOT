import dotenv from "dotenv"
import Bot from "./Client"
import { Intents } from "discord.js"
dotenv.config();

const botClient = new Bot({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

botClient.init();