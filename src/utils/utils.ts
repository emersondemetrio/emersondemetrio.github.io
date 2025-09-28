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

export const openUrl = (url: string, target = "_blank") => window.open(url, target);

export const delay = (callback: () => void, ms: number = 500) => {
  return setTimeout(callback, ms);
};

export const unDelay = (id?: NodeJS.Timeout, callback?: () => void) => {
  return () => {
    clearTimeout(id);
    if (typeof callback === "function") {
      callback();
    }
  };
};

export const copyToClipboard = async (message: string) => {
  await navigator.clipboard.writeText(message);
};

export const ensure = <T>(value: T | null | undefined, name: string): value is T => {
  if (value === null || value === undefined) {
    throw new Error(`Expected ${name} to be defined, but got ${value}`);
  }

  return true;
};
