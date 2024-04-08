import { ICachable, ICachingStrategy } from "@spotify/web-api-ts-sdk";

class LocalStorageCachingStrategy implements ICachingStrategy {
  private static readonly CACHE_PREFIX = "spotify-sdk-cache-";

  async getOrCreate<T>(
    cacheKey: string,
    createFunction: () => Promise<T & ICachable & object>,
    updateFunction?: (item: T) => Promise<T & ICachable & object>
  ): Promise<T & ICachable> {
    const cachedItem = await this.get<T>(cacheKey);
    if (cachedItem) {
      if (updateFunction) {
        const updatedItem = await updateFunction(cachedItem);
        this.setCacheItem(cacheKey, updatedItem);
        return updatedItem;
      }
      return cachedItem;
    }

    const newItem = await createFunction();
    this.setCacheItem(cacheKey, newItem);
    return newItem;
  }

  async get<T>(cacheKey: string): Promise<(T & ICachable) | null> {
    const item = localStorage.getItem(this.getCacheKey(cacheKey));
    if (item) {
      const parsedItem = JSON.parse(item) as T & ICachable;
      if (!parsedItem.expires || parsedItem.expires > Date.now()) {
        return parsedItem;
      } else {
        this.remove(cacheKey);
        return null;
      }
    }
    return null;
  }

  setCacheItem<T>(cacheKey: string, item: T & ICachable): void {
    localStorage.setItem(this.getCacheKey(cacheKey), JSON.stringify(item));
  }

  remove(cacheKey: string): void {
    localStorage.removeItem(this.getCacheKey(cacheKey));
  }

  private getCacheKey(cacheKey: string): string {
    return `${LocalStorageCachingStrategy.CACHE_PREFIX}${cacheKey}`;
  }
}

export default LocalStorageCachingStrategy;
