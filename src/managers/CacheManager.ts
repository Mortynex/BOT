import Collection from "@discordjs/collection";

export abstract class CacheManager<K, V> {
	private _cache: Collection<K, V> = new Collection();

	get cache() {
		return this._cache;
	}
}
