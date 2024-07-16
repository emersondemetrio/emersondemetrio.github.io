export type UrlToJson = {
  source: string;
  props: Record<string, string>;
  keysList: string[];
  valuesList: string[];
};

export const url2JSON = (source: string) => {
  const result: UrlToJson = {
    source,
    props: {},
    keysList: [],
    valuesList: [],
  };

  const arr = source.split('?');

  if (arr.length > 1) {
    const parts = arr[1].split('&');
    parts.forEach(part => {
      const splitted = part.split('=');
      result.keysList.push(splitted[0]);
      result.valuesList.push(splitted[1]);
      result.props[splitted[0]] = decodeURIComponent(splitted[1]);
    });
  }

  return result;
};
