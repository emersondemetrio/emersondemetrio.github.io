import { Currency } from '../types';
// TODO remove this file and replace with useCache hook
const cacheKey = 'currency-app-cache';

type CurrencyCache = Record<number, Currency>;

export const getCache = (): CurrencyCache => {
  const data = localStorage.getItem(cacheKey);
  if (!data || data === 'undefined' || data === 'null') {
    return {};
  }

  return JSON.parse(localStorage.getItem(cacheKey) || '{}');
};

export const get = (timestamp: number) => {
  const cache = getCache();

  return cache[timestamp] || null;
};

export const set = (timestamp: number, data: Currency, asJson?: boolean) => {
  if (asJson) {
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return;
  }

  const cache = getCache();
  cache[timestamp] = data;
  localStorage.setItem(cacheKey, JSON.stringify(cache));
};

export const dateToTimestamp = (date: Date) => {
  const dateStr = date.toISOString().split('T')[0];

  return new Date(dateStr).getTime();
};

export const invalidate = () => {
  const now = dateToTimestamp(new Date());
  const currentCache = get(now);

  set(now, currentCache, true);
};
