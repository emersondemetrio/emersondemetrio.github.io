export const noop = () => {};

export const randomUUID = () => {
  return Math.random().toString(36).substring(2, 15);
};

export const range = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
};

export const reverseRange = (start: number, end: number) => {
  return range(start, end).reverse();
};

export const limitString = (str: string, limit: number) => {
  return str.length > limit ? str.slice(0, limit) : str;
};
