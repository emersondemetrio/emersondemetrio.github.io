export const genericDateOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
} as Intl.DateTimeFormatOptions;

export const formatDate = (timeZone: string, date: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    ...genericDateOptions,
    timeZone,
  }).format(date);

export const isCurrentLocalTimeZone = (timeZone: string) =>
  Intl.DateTimeFormat().resolvedOptions().timeZone === timeZone;

export const getNewsURL = (city: string) =>
  `https://www.google.com/search?q=${encodeURI(city)}&source=lnms&tbm=nws`;
