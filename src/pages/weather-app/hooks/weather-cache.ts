const cacheKey = 'weather-app-cache';

const notWordsRegex = /[^a-zA-Z]+/g;

const cityKey = (cityName: string, timestamp: number) =>
  `${cityName.replace(notWordsRegex, '_').toLowerCase()}-${timestamp}`;

export const getFromCache = (cityName: string, timestamp: number) => {
  const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');

  return cache[cityKey(cityName, timestamp)] || null;
};

export const setCache = <T>(cityName: string, timestamp: number, data: T) => {
  const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
  cache[cityKey(cityName, timestamp)] = data;
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

export const clearCache = () => {
  localStorage.removeItem(cacheKey);
};
