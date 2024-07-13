import React, { useEffect, useState, useRef } from 'react';
import { formatDate } from '../utils';

interface ClockProps {
  timeZone: string;
}

const Clock: React.FC<ClockProps> = ({ timeZone }) => {
  const [time, setTime] = useState<string>(formatDate(timeZone, new Date()));
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const updateClock = () => {
      setTime(formatDate(timeZone, new Date()));
    };

    intervalRef.current = window.setInterval(updateClock, 1000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeZone]);

  return (
    <div>
      {time}
    </div>
  );
};

export default Clock;
