import 'react';
import 'react-day-picker/dist/style.css';
import { Page } from '@/components/page/page';
import { useParams } from 'react-router-dom';
import { ViewCountdown } from './view-countdown';
import { useState } from 'react';
import { DateRange, DayPicker } from 'react-day-picker';
import { createCountdownId } from './utils';

export const Countdown = () => {
  const { id } = useParams();

  const [range, setRange] = useState<DateRange | undefined>();

  if (id) {
    return <ViewCountdown id={id} />;
  }

  const hasRange = range?.from && range?.to;

  const createCountdown = () => {
    if (!range?.from || !range?.to) return;

    const from = range?.from;
    const to = range?.to;

    const id = createCountdownId(from, to);

    setRange(undefined);

    window.location.href = `#/experiments/countdown/${id}`;
  };

  return (
    <Page name="Countdown">
      <div className="flex flex-col"></div>
      <DayPicker mode="range" selected={range} onSelect={setRange} />
      <p>
        {range?.from && range?.to
          ? `Selected from ${range.from.toDateString()} to ${range.to.toDateString()}`
          : 'Please select a range'}
      </p>
      <button
        disabled={!hasRange}
        className="btn btn-black text-blue-600"
        onClick={createCountdown}
      >
        Create Countdown
      </button>
    </Page>
  );
};
