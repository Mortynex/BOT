import {
	AwaitMessageComponentOptions,
	BaseGuildTextChannel,
	ButtonInteraction,
	DMChannel,
	Interaction,
	InteractionCollectorOptions,
	Message,
	MessageButton,
	MessageButtonOptions,
	MessageComponentCollectorOptions,
	MessageComponentInteraction,
	MessageComponentType,
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

type AwaitMessageCollectorOptionsParams<T extends MessageComponentInteraction> =
	| { componentType?: T } & Pick<
			InteractionCollectorOptions<T>,
			keyof AwaitMessageComponentOptions<any>
	  >;

type MessageCollectorOptionsParams<T extends MessageComponentInteraction> =
	| {
			componentType?: T;
	  } & MessageComponentCollectorOptions<T>;

export class KittyComponent<
	InteractionType extends MessageComponentInteraction,
	ComponentType extends Exclude<MessageComponentType, "ACTION_ROW">
> {
	public customId: string | null;

	createCollector(
		channel: channelsAllowed,
		options: MessageCollectorOptionsParams<InteractionType> = {}
	) {
		return channel.createMessageComponentCollector<ComponentType>(
			this._addFilterToOptions(options) as any
		);
	}

	awaitComponent(
		channel: channelsAllowed,
		options: AwaitMessageCollectorOptionsParams<InteractionType>
	) {
		return channel.awaitMessageComponent<ComponentType>(
			this._addFilterToOptions(options) as any // :(
		);
	}

	private _addFilterToOptions(
		options:
			| AwaitMessageCollectorOptionsParams<InteractionType>
			| MessageCollectorOptionsParams<InteractionType>
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
