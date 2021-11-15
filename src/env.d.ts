declare module NodeJS {
	interface ProcessEnv {
		DISCORD_BOT_TOKEN: string;
		NODE_ENV: "production" | "development";
		GUILD_ID: string;
	}
}
