import { createTranslator } from "schummar-translate-sync";
import { en } from "../../locales/en";

const { getTranslator } = createTranslator({
	sourceLocale: "en",
	sourceDictionary: en,
});

export const t = getTranslator("en");
