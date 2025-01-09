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

export const copyToClipboard = (message: string) => () => {
  navigator.clipboard.writeText(message);
};
