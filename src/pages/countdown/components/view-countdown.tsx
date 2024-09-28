import { Page } from "@/components/page/page";
import { formatDate } from "date-fns";
import "react";
import { Link } from "react-router-dom";
import { getForecastUrl, getNewsURL, titleCase } from "../../weather-app/utils";
import CountdownTimer from "./countdown-timer";

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

  return (
    <Page landing>
      <div className="my-[5px] md:my-[50px] flex items-start justify-center text-white">
        <div className="shadow rounded-lg p-6 max-w-sm w-full bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-center mb-4 capitalize">
            {title
              ? (
                <>
                  Countdown to
                  <br />
                  {titleCase(title)}
                </>
              )
              : (
                `Countdown to ${formatDate(end, "dd/MM/yyyy")}`
              )}
          </h1>
          <div className="text-center mb-4">
            {description.map((line) => (
              <div className="my-2" key={line}>
                {line}
              </div>
            ))}
            <CountdownTimer end={end} />
          </div>
          <div className="mt-20 w-full">
            {name && (
              <div className="flex flex-col justify-between">
                <Link
                  target="_blank"
                  to={getNewsURL(title)}
                  className="w-full bg-green-700 text-white py-2 px-4 rounded"
                >
                  What's going on in over there?
                </Link>

                <Link
                  target="_blank"
                  to={getForecastUrl(title, end)}
                  className="mt-10 w-full text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Forecast for the day
                </Link>
              </div>
            )}
          </div>
          <div className="mt-20 w-full">
            <Link
              to="/labs/countdown"
              className="w-full text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Click to create a countdown
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
};
