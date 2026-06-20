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
import "./countdown.css";

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
          <Link to="/labs/countdown" className="btn btn-outline">
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
      <div className="cd-card">
        <div className="cd-field">
          <label className="cd-label" htmlFor="first_name">Countdown name</label>
          <input
            type="text"
            id="first_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter countdown name"
            required
            maxLength={30}
            minLength={5}
          />
        </div>
        <div className="cd-field">
          <div className="cd-day-picker">
            <DayPicker mode="single" selected={end} onSelect={setEnd} />
          </div>
          {!end && (
            <p className="cd-error">
              Please select a different ending date.
            </p>
          )}
        </div>
        <div className="cd-field">
          <label htmlFor="theTime" className="cd-label">
            Select time
          </label>
          <select
            value={time}
            id="theTime"
            name="theTime"
            onChange={(e) => setTime(e.target.value)}
            className="select select-bordered w-full"
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
          className="cd-btn"
          onClick={createCountdown}
        >
          Create Countdown
        </button>
      </div>
    </Page>
  );
};
