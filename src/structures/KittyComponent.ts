import {
	AwaitMessageComponentOptions,
	BaseGuildTextChannel,
	ButtonInteraction,
	DMChannel,
	Interaction,
	Message,
	MessageButton,
	MessageButtonOptions,
	MessageComponentCollectorOptions,
	MessageComponentInteraction,
	NewsChannel,
	TextChannel,
	ThreadChannel,
} from "discord.js";

type channelsAllowed =
	| TextChannel
	| Message
	| DMChannel
	| ThreadChannel
	| NewsChannel
	| BaseGuildTextChannel;

export class KittyComponent<InteractionType extends MessageComponentInteraction> {
	public customId: string | null;

	createCollector(
		channel: channelsAllowed,
		options: MessageComponentCollectorOptions<InteractionType> = {}
	) {
		return channel.createMessageComponentCollector<InteractionType>(
			this._addFilterToOptions(options)
		);
	}

	awaitComponent(
		channel: channelsAllowed,
		options: AwaitMessageComponentOptions<InteractionType>
	) {
		return channel.awaitMessageComponent<InteractionType>(
			this._addFilterToOptions(options)
		);
	}

	private _addFilterToOptions(
		options:
			| AwaitMessageComponentOptions<InteractionType>
			| MessageComponentCollectorOptions<InteractionType>
	) {
		if (!this.customId) {
			return options;
		}

		const thisCustomId = this.customId;

		const optionsWithFilter:
			| AwaitMessageComponentOptions<InteractionType>
			| MessageComponentCollectorOptions<InteractionType> = {
			...options,
			filter: interaction =>
				interaction.customId === thisCustomId &&
				(options.filter ? options.filter(interaction) : true),
		};

		return optionsWithFilter;
	}
}
