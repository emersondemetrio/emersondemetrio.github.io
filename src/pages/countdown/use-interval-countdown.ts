import { useState, useEffect } from 'react';

export const useIntervalCountdown = (start: Date | null, end: Date | null) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [expired, setExpired] = useState<boolean>(false);

  useEffect(() => {
    if (!start || !end) {
      setTimeLeft(0);
      setExpired(true);
      return;
    }
    let interval = null;

    const calculateTimeLeft = () => {
      const currentTime = new Date().getTime();
      const endTime = end.getTime();
      const timeDifference = endTime - currentTime;

      setTimeLeft(timeDifference);

      if (timeDifference <= 0) {
        clearInterval(interval);
        setExpired(true);
      }
    };

    calculateTimeLeft();
    interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [start, end]);

  return { timeLeft, expired };
};
