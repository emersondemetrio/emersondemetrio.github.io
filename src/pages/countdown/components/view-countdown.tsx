import { Page } from "@/components/page/page";
import { formatDate } from "date-fns";
import "react";
import { Link } from "react-router-dom";
import { getForecastUrl, getNewsURL, titleCase } from "../../weather-app/utils";
import CountdownTimer from "./countdown-timer";
import "../view-countdown.css";

type ViewCountdownProps = {
  end: Date;
  name?: string;
  description: string[];
};

export const ViewCountdown = ({
  end,
  name,
  description,
}: ViewCountdownProps) => {
  const title = decodeURIComponent(name || "");
  const countdownName = `Countdown to ${
    title ? titleCase(title) : `${formatDate(end, "dd/MM/yyyy")}`
  }`;

  return (
    <Page landing name={countdownName}>
      <div className="my-[5px] md:my-[50px] flex items-start justify-center">
        <div className="vcd-card">
          <h1 className="vcd-title capitalize">
            {countdownName}
          </h1>
          <div className="vcd-desc">
            {description.map((line) => (
              <div className="my-2" key={line}>
                {line}
              </div>
            ))}
            <div className="vcd-timer">
              <CountdownTimer end={end} />
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            {name && (
              <>
                <Link
                  target="_blank"
                  to={getNewsURL(title)}
                  className="vcd-link vcd-link-primary"
                >
                  What's going on in over there?
                </Link>
                <Link
                  target="_blank"
                  to={getForecastUrl(title, end)}
                  className="vcd-link"
                >
                  Forecast for the day
                </Link>
              </>
            )}
            <Link
              to="/labs/countdown"
              className="vcd-link"
            >
              Click to create a countdown
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
};
