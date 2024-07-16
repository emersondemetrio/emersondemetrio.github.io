import { useState, useEffect } from 'react';

const durationToString = (duration: number | null) => {
  if (!duration) {
    return 'Invalid duration';
  }

  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const formattedSeconds = ('0' + (seconds % 60)).slice(-2);
  const formattedMinutes = ('0' + (minutes % 60)).slice(-2);
  const formattedHours = ('0' + (hours % 24)).slice(-2);

  return `${days !== 0 ? days + 'd ' : ''}${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
};

export const useIntervalCountdown = (end: Date | null) => {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!end) {
      setExpired(true);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = end.getTime() - now.getTime();

      if (difference <= 0) {
        setExpired(true);
        setRemainingTime(0);
        return;
      }

      setRemainingTime(difference);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [end]);

  return {
    remainingTime,
    durationString: durationToString(remainingTime),
    expired,
  };
};
