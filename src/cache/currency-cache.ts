import { Currency } from '../types';
// TODO remove this file and replace with useCache hook
const cacheKey = 'currency-app-cache';

type CurrencyCache = Record<string, Currency>;

export const getCache = (): CurrencyCache => {
  const data = localStorage.getItem(cacheKey);
  if (!data || data === 'undefined' || data === 'null') {
    return {};
  }

  return JSON.parse(localStorage.getItem(cacheKey) || '{}');
};

export const get = (key: string) => {
  const cache = getCache();

  return cache[key] || null;
};

export const set = (key: string, data: Currency, asJson?: boolean) => {
  if (asJson) {
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return;
  }

  const cache = getCache();
  cache[key] = data;
  localStorage.setItem(cacheKey, JSON.stringify(cache));
};

export const dateToTimestamp = (date: Date) => {
  const dateStr = date.toISOString().split('T')[0];

  return new Date(dateStr).getTime();
};

export const invalidate = (key: string) => {
  const currentCache = get(key);

  set(key, currentCache, true);
};
