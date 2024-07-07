import { Currency } from "../types";

const cacheKey = "currency-app-cache";

export const getFromCache = (timestamp: number) => {
  const cache = JSON.parse(localStorage.getItem(cacheKey) || "{}");

  return cache[timestamp] || null;
}

export const setCache = (timestamp: number, data: Currency) => {
  const cache = JSON.parse(localStorage.getItem(cacheKey) || "{}");
  cache[timestamp] = data;
  localStorage.setItem(cacheKey, JSON.stringify(cache));
}

export const dateToTimestamp = (date: Date) => {
  const dateStr = date.toISOString().split("T")[0];

  return new Date(dateStr).getTime();
}
