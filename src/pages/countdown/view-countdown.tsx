import 'react';
import { Page } from '@/components/page/page';
import { Link } from 'react-router-dom';
import { useIntervalCountdown } from './use-interval-countdown';
import { formatDate } from 'date-fns';
import { getNewsURL, titleCase } from '../weather-app/utils';

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
  const { durationString } = useIntervalCountdown(end);

  const title = decodeURIComponent(name || '');

  return (
    <Page landing>
      <div className="my-[50px] flex items-start justify-center text-white">
        <div className="shadow rounded-lg p-6 max-w-sm w-full bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-center mb-4 capitalize">
            {title ? (
              <>
                Countdown to
                <br />
                {titleCase(title)}
              </>
            ) : (
              `Countdown to ${formatDate(end, 'dd/MM/yyyy')}`
            )}
          </h1>
          <div className="text-center mb-4">
            {description.map(line => (
              <div className="my-2" key={line}>
                {line}
              </div>
            ))}
            {durationString && <div>{durationString}</div>}
          </div>
          <div className="mt-20 w-full">
            {name && (
              <Link
                target="_blank"
                to={getNewsURL(name)}
                className="w-full bg-green-700 text-white py-2 px-4 rounded"
              >
                What's going on in over there?
              </Link>
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
