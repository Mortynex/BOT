import Collection from "@discordjs/collection";
import { Inhibitor } from "interfaces";
import { t } from "util/translator";
import prettyMilliseconds from "pretty-ms";

class CooldownStore {
	private store = new Collection<string, number>();

	constructor(private cooldownTime: number) {}

	getCooldown(userId: string): false | number {
		const lastTimestamp = this.store.get(userId);

		if (!lastTimestamp || lastTimestamp < Date.now()) return false;

		return lastTimestamp - Date.now();
	}

	putOnCooldown(userId: string) {
		this.store.set(userId, Date.now() + this.cooldownTime);
	}
}

export const createCooldownInhibitor = (ms: number): Inhibitor => {
	const cooldownStore = new CooldownStore(ms);

	return (client, interaction) => {
		const { id } = interaction.member;

		const userCooldown = cooldownStore.getCooldown(id);

		if (userCooldown) {
			const roughCooldownTime = prettyMilliseconds(userCooldown, {
				verbose: true,
				compact: true,
			});

			return t("commands.inhibitors.cooldown.userOnCooldown", {
				time: roughCooldownTime,
			});
		}

		cooldownStore.putOnCooldown(id);

		return true;
	};
};
