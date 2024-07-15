import 'react';
import { Page } from '@/components/page/page';
import { getIntervalFromId } from './utils';
import { Link } from 'react-router-dom';
import { useIntervalCountdown } from './use-interval-countdown';

type ViewCountdownProps = {
  id: string;
};

export const ViewCountdown = ({ id }: ViewCountdownProps) => {
  const [d1, d2, description] = getIntervalFromId(id);
  const { timeLeft, expired } = useIntervalCountdown(d1, d2);

  if (!d1 || !d2) {
    return (
      <Page name="View Countdown" description="Invalid countdown">
        <Link
          to="/experiments/countdown"
          className="btn btn-black text-blue-600"
        >
          Create one here.
        </Link>
      </Page>
    );
  }

  return (
    <Page name="View Countdown">
      <div>{description}</div>

      <div>{timeLeft}</div>
      <Link to="/experiments/countdown" className="btn btn-black text-blue-600">
        Create one here.
      </Link>
    </Page>
  );
};
