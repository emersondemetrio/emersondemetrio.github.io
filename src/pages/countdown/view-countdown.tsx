import 'react';
import { Page } from '@/components/page/page';
import { Link } from 'react-router-dom';
import { useIntervalCountdown } from './use-interval-countdown';
import { formatDate } from 'date-fns';

type ViewCountdownProps = {
  end: Date;
  name?: string;
  description: string;
};

export const ViewCountdown = ({
  end,
  name,
  description,
}: ViewCountdownProps) => {
  const { durationString } = useIntervalCountdown(end);

  return (
    <Page name={`Countdown to ${name || formatDate(end, 'dd/MM/yyyy')}`}>
      <p>{description}</p>
      {durationString && <div>{durationString}</div>}
      <Link to="/experiments/countdown" className="btn btn-black text-blue-600">
        Create one here.
      </Link>
    </Page>
  );
};
