import { t } from "./util/translator";
import { info, warn, error, debug } from "./util/logger";
import { KittyClient } from "client";
import { Intents } from "discord.js";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

info(t("main.starting"));

const client = new KittyClient({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.init();
