import { formatDate } from 'date-fns';

export const dateToQueryParam = (dateString: string): string => {
  const parts = dateString.split(' ');
  const [date, time] = parts;

  return `${date}_${time}`;
};

const getDescription = (start: Date, end: Date): string => {
  return `Countdown from [${formatDate(start, 'dd/MM/yyyy HH:mm')}] to [${formatDate(end, 'dd/MM/yyyy HH:00')}]`;
};

const createDateTime = (date: Date, time: string) => {
  date.setHours(parseInt(time, 10), 0, 0, 0);

  return date;
};

export const queryToDate = (dateString: string): Date => {
  const [dateStr, timeStr] = dateString.split('_');

  const date = new Date(dateStr);

  return createDateTime(date, timeStr);
};

export const getIntervalFromId = (
  id: string,
): [Date, Date, string] | [null, null, null] => {
  const start = new Date();

  const end = queryToDate(id);

  if (isNaN(end.getTime())) {
    return [null, null, null];
  }

  return [start, end, getDescription(start, end)];
};
