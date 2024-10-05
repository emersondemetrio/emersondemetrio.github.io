import { useEffect, useState } from "react";
import { WeatherAPIResult } from "@/types";
import { useCache } from "@/hooks/use-cache";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.weatherapi.com/v1/current.json";
const DEFAULT_PLACE = "Florianópolis, Santa Catarina, Brazil";
const CACHE_KEY = "weather-app-cache";

const fetchJson = async (url: string, options: RequestInit) => {
  try {
    return await fetch(url, options).then((d) => d.json());
  } catch (error) {
    return { error };
  }
};

export const getSearchString = (place: string) => {
  if (!API_KEY) {
    throw new Error("API Key not provided");
  }

  return `${BASE_URL}?key=${API_KEY}&q=${
    encodeURIComponent(
      place || DEFAULT_PLACE,
    )
  }&aqi=yes`;
};

const fetchWeather = async (place: string) => {
  const searchURL = getSearchString(place);

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return (await fetchJson(searchURL, options)) as WeatherAPIResult;
};

type UseWeatherApiHook = {
  data: WeatherAPIResult | null;
  isLoading: boolean;
  error: unknown;
  refetch: (cityName: string) => void;
};

export const useWeather = (placeName: string): UseWeatherApiHook => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<WeatherAPIResult | null>(null);
  const [error, setError] = useState<unknown>(null);
  const { get, set, createItemKey } = useCache<WeatherAPIResult>(CACHE_KEY);

  const getWeather = async (cityName: string, force: boolean) => {
    setIsLoading(true);
    if (!force) {
      const itemKey = createItemKey(cityName, new Date().getTime());
      const cache = get(itemKey);

      if (cache) {
        const newData: WeatherAPIResult = {
          ...cache,
          source: "cache",
        };

        setData(newData);
        setIsLoading(false);
        return;
      }
    }

    fetchWeather(cityName)
      .then((weatherData) => {
        if (!weatherData.error) {
          setData({
            ...weatherData,
            source: "api",
          });
          const itemKey = createItemKey(cityName, new Date().getTime());

          set(itemKey, weatherData);
        }

        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getWeather(placeName, false);
  }, [placeName]);

  return {
    data,
    isLoading,
    error,
    refetch: (cityName) => getWeather(cityName, true),
  };
};
