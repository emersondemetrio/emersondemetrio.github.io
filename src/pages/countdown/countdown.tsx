import { Page } from "@/components/page/page";
import { replaceNonUrlFriendly } from "@/regex";
import { limitString } from "@/utils/utils";
import "react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Link, useParams } from "react-router-dom";
import { ViewCountdown } from "./components/view-countdown";
import { dateToQueryParam, getIntervalFromId } from "./utils";

const dateIsToday = (date: Date) => {
  return (
    date.getDate() === new Date().getDate() &&
    date.getMonth() === new Date().getMonth() &&
    date.getFullYear() === new Date().getFullYear()
  );
};

const dateIsInThePast = (date: Date) => {
  return date.getTime() < new Date().getTime();
};

const sanitize = (str?: string) => {
  if (!str) return "";

  return encodeURIComponent(limitString(replaceNonUrlFriendly(str, " "), 30));
};

const isValid = (date?: Date) => {
  return date && !dateIsToday(date) && !dateIsInThePast(date);
};

export const Countdown = () => {
  const { id, countdownName } = useParams();

  const [end, setEnd] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("10:00");
  const [name, setName] = useState("");

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

    const redirect = `#/labs/countdown/${dateStr}` +
      (name ? `/${encodeURIComponent(name)}` : "");

    setEnd(undefined);
    setName("");
    window.location.href = redirect;
  };

  return (
    <Page name="Countdown" className="flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="mb-6">
          <input
            type="text"
            id="first_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter countdown name"
            required
            maxLength={30}
            minLength={5}
          />
        </div>
        <div className="mb-6">
          <DayPicker mode="single" selected={end} onSelect={setEnd} />
          {!end && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Please select a different ending date.
            </p>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="theTime"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Select time
          </label>
          <select
            value={time}
            id="theTime"
            name="theTime"
            onChange={(e) => setTime(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
              <option key={hour} value={hour}>
                {hour}:00
              </option>
            ))}
          </select>
        </div>
        <button
          disabled={!isValid(end) || !name}
          className={`w-full py-2 px-4 rounded ${
            !end || dateIsToday(end) || dateIsInThePast(end) || !name
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700 text-white"
          }`}
          onClick={createCountdown}
        >
          Create Countdown
        </button>
      </div>
    </Page>
  );
};
