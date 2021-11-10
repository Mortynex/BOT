import { EventHandler, EventName } from "interfaces";
import { info } from "util/logger";
import { t } from "util/translator";

export const name: EventName = "ready";

export const run: EventHandler<typeof name> = client => {
	info(
		t("client.isReady", {
			clientTag: client.user!.tag,
		})
	);
};
