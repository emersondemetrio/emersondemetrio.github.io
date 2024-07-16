export const onlyWordsRegex = /\b\w+\b/g;
export const notWordsRegex = /[^\w\s]/g;
export const notHexDecimalRegex = /[^a-zA-Z0-9]/g;

export const replaceNotWords = (str: string) => {
  return str.replace(notWordsRegex, '');
};

export const replaceNotHexDecimal = (str: string) => {
  return str.replace(notHexDecimalRegex, '');
};
