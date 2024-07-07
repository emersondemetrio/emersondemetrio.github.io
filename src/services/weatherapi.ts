const API_KEY = import.meta.env.VITE_API_KEY
const BASE_URL = 'https://api.weatherapi.com/v1/current.json';
const DEFAULT_PLACE = 'Florianópolis, Santa Catarina, Brazil';

const fetchJson = async (url: string, options: RequestInit) => {
  return await fetch(url, options).then((d) => d.json());
}

export const getSearchString = (place: string) => {
  if (!API_KEY) {
    throw new Error('API Key not provided');
  }

  return `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
    place || DEFAULT_PLACE
  )}&aqi=yes`;
};

export type WeatherAPIResult = {
  current: {
    condition: {
      text: string;
      icon: string;
    };
    temp_c: number;
    feelslike_c: number;
  };
};

const createHourlyCacheForWeatherUsingLocalStorage = (weather: WeatherAPIResult) => {
  const hourlyCache: Record<string, WeatherAPIResult> = JSON.parse(
    localStorage.getItem('hourlyCache') || '{}'
  );

  hourlyCache[Date.now().toString()] = weather;

  localStorage.setItem('hourlyCache', JSON.stringify(hourlyCache));
}

export const getWeatherOf = async <T>(place: string) => {
  const searchURL = getSearchString(place);

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return await fetchJson(searchURL, options) as T;
};

export const getNewsURL = (city: string) =>
  `https://www.google.com/search?q=${encodeURI(city)}&source=lnms&tbm=nws`;
