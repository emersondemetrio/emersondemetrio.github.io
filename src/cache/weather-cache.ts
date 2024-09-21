import { WeatherAPIResult } from '@/types';
// TODO remove this file and replace with useCache hook
const cacheKey = 'weather-app-cache';
const notWordsRegex = /[^a-zA-Z]+/g;

type WeatherCache = Record<string, WeatherAPIResult>;

export const getCache = (): WeatherCache => {
  const data = localStorage.getItem(cacheKey);
  if (!data || data === 'undefined' || data === 'null') {
    return {};
  }

  return JSON.parse(localStorage.getItem(cacheKey) || '{}');
};

const createCityCacheKey = (cityName: string, timestamp: number) =>
  `${cityName.replace(notWordsRegex, '_').toLowerCase()}-${timestamp}`;

export const get = (
  cityName: string,
  timestamp: number,
): WeatherAPIResult | null => {
  const cache = getCache();
  const cityKey = createCityCacheKey(cityName, timestamp);

  return cache[cityKey] || null;
};

export const invalidate = (cityKey: string) => {
  const cache = getCache();

  Object.keys(cache).forEach(key => {
    if (key.includes(cityKey)) {
      delete cache[key];
    }
  });

  localStorage.setItem(cacheKey, JSON.stringify(cache));
};

export const set = (
  cityName: string,
  timestamp: number,
  data: WeatherAPIResult,
) => {
  const cache = getCache();
  const cityKey = createCityCacheKey(cityName, timestamp);
  invalidate(cityKey);
  cache[cityKey] = data;
  localStorage.setItem(cacheKey, JSON.stringify(cache));
};

const getTodayAsDateForHour = (hour: number) => {
  const today = new Date();
  today.setHours(hour);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  return today;
};

// Hourly cache
export const dateToTimestamp = (date: Date) => {
  const hour = date.getHours();
  return getTodayAsDateForHour(hour).getTime();
};
