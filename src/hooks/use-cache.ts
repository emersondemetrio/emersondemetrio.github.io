import { useState } from "react";

const notWordsRegex = /[^a-zA-Z]+/g;

export type Cache<T> = Record<string, T>;

export type UseCacheHook<T> = {
  key: string;
  data: Cache<T>;
  invalidate: (key: string) => void;
  set: (data: Cache<T>) => void;
  get: (key: string) => T | null;
  createKey: (key: string, timestamp?: number) => string;
};

export const useCache = <T>(key: string): UseCacheHook<T> => {
  const [data, setData] = useState<Cache<T>>(() => {
    const cache = localStorage.getItem(key);
    if (!cache || cache === "undefined" || cache === "null") {
      return {};
    }

    return JSON.parse(cache);
  });

  const set = (newData: Cache<T>) => {
    setData(newData);
    localStorage.setItem(key, JSON.stringify(newData));
  };

  const get = (key: string) => data[key] || null;

  const createKey = (key: string, timestamp?: number) =>
    `${key.replace(notWordsRegex, "_").toLowerCase()}${timestamp ? `-${timestamp}` : ""}`;

  const invalidate = (key: string) => {
    setData({});
    localStorage.removeItem(key);
  };

  return {
    key,
    data,
    createKey,
    invalidate,
    set,
    get,
  };
};
