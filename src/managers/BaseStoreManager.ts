import Collection from "@discordjs/collection";

export abstract class BaseStoreManager<K, V> {
	public store: Collection<K, V> = new Collection();
}
