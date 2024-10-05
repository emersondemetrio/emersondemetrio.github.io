const notWordsRegex = /[^a-zA-Z]+/g;

export type Cache<T> = Record<string, T>;

export type UseCacheHook<T> = {
  cacheKey: string;
  data: Cache<T>;
  invalidate: () => void;
  set: (itemKey: string, data: T) => void;
  get: (itemKey: string) => T | null;
  createItemKey: (key: string, timestamp?: number) => string;
};

type CacheInvalidation = "DAILY" | "WEEKLY" | "MONTHLY";

export const useCache = <T>(
  cacheKey: string,
  policy: CacheInvalidation = `WEEKLY`,
): UseCacheHook<T> => {
  const getCache = <T>(): Cache<T> => {
    const cache = localStorage.getItem(cacheKey);
    if (!cache || cache === "undefined" || cache === "null") {
      return {};
    }

    return JSON.parse(cache);
  };

  const setCache = <T>(data: Cache<T>) => {
    localStorage.setItem(cacheKey, JSON.stringify(data));
  };

  const setItem = <T>(itemKey: string, newData: T) => {
    const cache = getCache<T>();
    cache[itemKey] = newData;
    setCache(cache);
  };

  const set = (itemKey: string, newData: T) => {
    setItem(itemKey, newData);
  };

  const get = (itemKey: string) => {
    const cache = getCache<T>();

    return cache[itemKey] || null;
  };

  const createItemKey = (key: string, timestamp?: number) => {
    const keyPart = `${key.replace(notWordsRegex, "_").toLowerCase()}`;

    if (!timestamp) {
      return keyPart;
    }

    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${keyPart}-${year}-${month}-${day}`;
  };

  const invalidate = () => {
    setCache({});
    localStorage.removeItem(cacheKey);
  };

  const initialize = () => {
    const expiresAt = get("expiresAt");

    if (expiresAt) {
      const now = new Date().getTime();
      const expiresAtDate = new Date(expiresAt as string);
      if (now > expiresAtDate.getTime()) {
        return setCache({});
      }
    }

    if (!expiresAt) {
      const now = new Date();
      if (policy === "DAILY") {
        now.setDate(now.getDate() + 1);
      }

      if (policy === "WEEKLY") {
        now.setDate(now.getDate() + 7);
      }

      if (policy === "MONTHLY") {
        now.setMonth(now.getMonth() + 1);
      }

      set("expiresAt", `${now.getTime()}` as T);
    }
  };

  initialize();

  return {
    cacheKey,
    data: getCache(),
    createItemKey,
    invalidate,
    set,
    get,
  };
};
