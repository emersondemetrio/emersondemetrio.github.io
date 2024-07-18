import 'react';
import { Page } from '@/components/page/page';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Link, useParams } from 'react-router-dom';
import { dateToQueryParam, getIntervalFromId } from './utils';
import { ViewCountdown } from './view-countdown';
import { replaceNotHexDecimal } from '@/regex';
import { limitString } from '@/utils/utils';

const sanitize = (str?: string) => {
  if (!str) return '';

  return limitString(replaceNotHexDecimal(str), 30);
};

export const Countdown = () => {
  const { id, countdownName } = useParams();

  const [end, setEnd] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('10:00');
  const [name, setName] = useState(countdownName);

  if (id) {
    const [d1, d2, description] = getIntervalFromId(id);
    if (!d1 || !d2) {
      return (
        <Page name="View Countdown" description="Invalid countdown">
          <Link to="/labs/countdown" className="btn btn-black text-blue-600">
            Create one here.
          </Link>
        </Page>
      );
    }

    return (
      <ViewCountdown
        end={d2}
        name={sanitize(countdownName)}
        description={description}
      />
    );
  }

  const createCountdown = () => {
    if (!end) return;

    const day = end.getDate();
    const month = end.getMonth() + 1;
    const year = end.getFullYear();

    const dateStr = dateToQueryParam(`${year}-${month}-${day} ${time}`);

    const redirect =
      `#/labs/countdown/${dateStr}` + (name ? `/${sanitize(name)}` : '');

    setEnd(undefined);
    setName('');
    window.location.href = redirect;
  };

  return (
    <Page name="Countdown">
      <div className="flex flex-col">
        <div className="flex flex-col">
          <input
            type="text"
            id="first_name"
            value={name}
            onChange={e => setName(sanitize(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Countdown Name"
            required
            max={30}
            min={5}
          />
        </div>
        <DayPicker mode="single" selected={end} onSelect={setEnd} />
        <p>{!end && 'Please select an ending date'}</p>
        <div className="max-w-sm mx-auto">
          <label
            htmlFor="theTime"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select time
          </label>
          <select
            value={time}
            id="theTime"
            name="theTime"
            onChange={e => setTime(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {Array.from({ length: 24 }, (_, i) => i).map(hour => (
              <option key={hour} value={hour}>
                {hour}:00
              </option>
            ))}
          </select>
        </div>

        <button
          disabled={!end}
          className="btn btn-black text-blue-600"
          onClick={createCountdown}
        >
          Create Countdown
        </button>
      </div>
    </Page>
  );
};
