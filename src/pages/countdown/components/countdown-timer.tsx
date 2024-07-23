import { useIntervalCountdown } from '../use-interval-countdown';

type CountdownTimerProps = {
  end: Date;
};

const CountdownTimer = ({ end }: CountdownTimerProps) => {
  const { durationString } = useIntervalCountdown(end);

  return <div>{durationString}</div>;
};

export default CountdownTimer;
