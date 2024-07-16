export const onlyWordsRegex = /\b\w+\b/g;

export const replaceNotWords = (str: string) => {
  return str.replace(onlyWordsRegex, '');
};
