declare module NodeJS {
	interface ProcessEnv {
		DISCORD_API_TOKEN: string;
		NODE_ENV: "production" | "development";
		GUILD_ID: string;
	}
}
