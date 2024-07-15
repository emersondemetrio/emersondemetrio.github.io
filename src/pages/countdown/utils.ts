const DELIMITER = '_';

export const dateToQueryParam = (date: Date): string => {
  return encodeURIComponent(date.toISOString());
};

export const queryToDate = (param: string): Date | null => {
  const date = new Date(decodeURIComponent(param));

  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
};

export const createCountdownId = (d1: Date, d2: Date): string => {
  return `${dateToQueryParam(d1)}${DELIMITER}${dateToQueryParam(d2)}`;
};

export const getIntervalFromId = (
  id: string,
): [Date, Date, string] | [null, null, null] => {
  const [d1, d2] = id.split(DELIMITER).map(queryToDate);
  if (!d1 || !d2) {
    return [null, null, null];
  }

  const description = `Countdown from ${d1.toDateString()} to ${d2.toDateString()}`;

  return [d1, d2, description];
};
