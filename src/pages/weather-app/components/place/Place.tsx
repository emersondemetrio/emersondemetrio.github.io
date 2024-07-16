import { memo } from 'react';
import { useWeather } from '../../hooks/useWeather';
import { getNewsURL } from '../../utils';
import Clock from '../clock';
import { Info } from '../icons/Info';
import { Reload } from '../icons/Reload';
import { WeatherAPIResult } from '@/types';

type PlaceProps = {
  name: string;
  timeZone: string;
  city: string;
  current: boolean;
};

const openNews = (newsUrl: string) => window.open(newsUrl);
const dateDiffInHours = (timeZone: string, relativeTo = new Date()) => {
  const diff =
    new Date(
      relativeTo.toLocaleString('en-US', {
        timeZone,
      }),
    ).getHours() - relativeTo.getHours();

  if (diff === 0) {
    return 'Same as local';
  }
  if (diff > 0) {
    return `${diff}h ahead`;
  }

  return `${-diff}h behind`;
};

const feelsLike = (current: WeatherAPIResult['current']) => {
  let feelsLike = '';

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

  const flexDir = isMobile ? 'flex-col' : 'flex-row';
  const justify = isMobile ? 'justify-items-start' : 'justify-between';
  const itemWidth = isMobile ? 'w-full' : 'w-1/3';
  const spacing = isMobile ? 'mb-4' : 'mb-0';

  const merge = (...a: string[]) => a.join(' ');
  const showWeather = weather && weather.current && !isLoading && !error;

  const classList = [
    `${isMobile ? 'h-full' : 'h-40'}`,
    'w-full',
    'border-2',
    'flex',
    flexDir,
    justify,
    `${isMobile ? 'p-10' : 'p-1'}`,
    'my-4',
    'rounded-lg',
    'items-center',
    'bg-slate-600',
    'shadow-lg',
    `${current ? 'border-amber-50' : 'border-transparent'}`,
  ].join(' ');

  return (
    <div className={classList}>
      <div className={merge('ml-2', itemWidth, spacing)}>
        <h3>
          {name} {isLoading ? 'Loading...' : ''}
        </h3>
      </div>
      <div
        className={merge(itemWidth, spacing, 'flex-col flex justify-between')}
      >
        <Clock timeZone={timeZone} />
        <span>
          {dateDiffInHours(timeZone, new Date())}
          {current && ', Current'}
        </span>
      </div>
      {!!error && (
        <div className="info">
          <p>Unable to get weather info</p>
          <button
            style={{
              border: 'solid 1px #ddd',
              padding: 10,
            }}
            onClick={() => refetch(city)}
          >
            Try again
          </button>
        </div>
      )}
      {!showWeather && (
        <div className={merge(itemWidth, spacing)}>
          <div className="bg-slate-600 skeleton h-32 w-full" />
        </div>
      )}
      {showWeather && (
        <div className={merge(itemWidth, spacing, 'p-4')}>
          <h3 className="text-gray-50 flex justify-start lg:justify-end md:justify-end">
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
                className="btn btn-circle btn-info"
                disabled={isLoading}
                onClick={() => refetch(city)}
              >
                <Reload />
              </button>
              <button
                className="btn btn-circle btn-info"
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
