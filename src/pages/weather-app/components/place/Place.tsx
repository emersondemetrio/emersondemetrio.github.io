import { memo } from "react";
import { useWeather } from "../../hooks/useWeather";
import { getNewsURL } from "../../utils";
import Clock from "../clock";
import { Info } from "../icons/Info";
import { Reload } from "../icons/Reload";
import { WeatherAPIResult } from "@/types";

type PlaceProps = {
  name: string;
  timeZone: string;
  city: string;
  current: boolean;
};

const openNews = (newsUrl: string) => window.open(newsUrl);
const dateDiffInHours = (timeZone: string) => {
  const localTime = new Date();
  const targetTime = new Date(new Date().toLocaleString("en-US", { timeZone }));
  const diffInMillis = targetTime.getTime() - localTime.getTime();

  const diffInHours = Math.round(diffInMillis / (1000 * 60 * 60));

  if (diffInHours === 0) {
    return "Same as local";
  }

  return `${diffInHours}h ${diffInHours > 0 ? "ahead" : "behind"}`;
};

const feelsLike = (current: WeatherAPIResult["current"]) => {
  let feelsLike = "";

  if (current?.condition?.text) {
    feelsLike += current.condition.text;
  }

  if (current?.temp_c) {
    feelsLike += `, ${current.temp_c}°C`;
  }

  if (current?.feelslike_c) {
    feelsLike += `, Feels like ${current.feelslike_c}°C`;
  }

  return feelsLike;
};

const Place = ({ name, timeZone, city, current }: PlaceProps) => {
  const { data: weather, isLoading, error, refetch } = useWeather(city);

  const isMobile = window.innerWidth < 768;

  const flexDir = isMobile ? "flex-col" : "flex-row";
  const justify = isMobile ? "justify-items-start" : "justify-between";
  const itemWidth = isMobile ? "w-full" : "w-1/3";
  const spacing = isMobile ? "mb-4" : "mb-0";

  const merge = (...a: string[]) => a.join(" ");
  const showWeather = weather && weather.current && !isLoading && !error;

  return (
    <div className={`border border-[var(--mx-line)] rounded-xl p-4 my-3 flex ${flexDir} ${justify} items-center w-full ${isMobile ? "h-full" : "h-40"} ${current ? "border-[var(--mx-accent)]" : ""}`}>
      <div className={merge("ml-2", itemWidth, spacing)}>
        <h3>
          {name} {isLoading ? "Loading..." : ""}
        </h3>
      </div>
      <div
        className={merge(itemWidth, spacing, "flex-col flex justify-between")}
      >
        <Clock timeZone={timeZone} />
        <span>
          {dateDiffInHours(timeZone)}
          {current && ", Current"}
        </span>
      </div>
      {!!error && (
        <div className={merge(itemWidth, spacing)}>
          <p>Unable to get weather info</p>
          <button
            style={{
              border: "solid 1px #ddd",
              padding: 10,
            }}
            onClick={() => refetch(city)}
          >
            Try again
          </button>
        </div>
      )}
      {!showWeather && !error && (
        <div className={merge(itemWidth, spacing)}>
          <div className="h-32 w-full rounded-lg bg-[var(--mx-hover)] animate-pulse" />
        </div>
      )}
      {showWeather && (
        <div className={merge(itemWidth, spacing, "p-4")}>
          <h3 className="text-[var(--mx-ink)] flex justify-start lg:justify-end md:justify-end">
            {feelsLike(weather.current)}
          </h3>
          <div className="flex flex-row items-center justify-end">
            <div>
              {weather?.current?.condition?.icon && (
                <img
                  className="condition-img"
                  src={weather.current.condition.icon}
                  alt={weather.current.condition.text}
                />
              )}
            </div>
            <div className="left-40 ml-5">
              <button
                className="w-8 h-8 rounded-full border border-[var(--mx-line)] bg-transparent text-[var(--mx-muted)] hover:border-[var(--mx-accent)] hover:text-[var(--mx-accent)] transition-colors cursor-pointer flex items-center justify-center"
                disabled={isLoading}
                onClick={() => refetch(city)}
              >
                <Reload />
              </button>
              <button
                className="w-8 h-8 rounded-full border border-[var(--mx-line)] bg-transparent text-[var(--mx-muted)] hover:border-[var(--mx-accent)] hover:text-[var(--mx-accent)] transition-colors cursor-pointer flex items-center justify-center"
                onClick={() => openNews(getNewsURL(city))}
              >
                <Info />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default memo(Place);
