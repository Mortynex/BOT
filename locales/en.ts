export const en = {
	// CONSOLE
	general: {
		notImplemented: `THIS FEAUTRE IS NOT YET IMPLEMENTED`,
		fatal: `FATAL ERROR OCCURED: {message}`,
	},
	main: {
		starting: "Initializating bot...",
	},
	client: {
		ready: "Client is ready and logged in as {clientTag}",
	},
	managers: {
		event: {
			eventMissingProperties:
				"Event {eventName} has missing properties and couldn't be loaded",
			loadedAll: `Succesfully loaded {eventsCount} events`,
			addedEvent: `Succesfully Loaded "{eventName}" event`,
		},
		command: {
			failedUpdating: `Failed updating commands`,
			updatingCommands: `Updating commands...`,
			clearingCommands: `Clearing commands...`,
			automaticCommandUpdate: `Detected commands change, updating commands...`,
		},
	},
	commands: {
		inhibitors: {
			cooldown: {
				userOnCooldown: `You cannot use this command for another {time}!`,
			},
		},
		ping: {
			description: "Sends you a pong",
			succes: "Pong!",
		},
	},
	events: {
		interactionCreate: {
			commandInteraction: {
				noGuild: `Guild not found`,
				noMember: `No member found`,
				noCommand: `Couldn't find this command`,
				errorWhileExecuting: `Command {name} had an error while executing`,
			},
		},
	},
	// DISCORD
} as const;
