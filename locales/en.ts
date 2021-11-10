export const en = {
	// CONSOLE
	main: {
		starting: "Initializating bot...",
	},
	client: {
		isReady: "Client is ready and logged in as {clientTag}",
	},
	managers: {
		event: {
			eventMissingProperties:
				"Event {eventName} has missing properties and couldn't be loaded",
			loadedAll: `Succesfully loaded {eventsCount} events`,
			addedEvent: `Succesfully Loaded "{eventName}" event`,
		},
	},
	// DISCORD
} as const;
