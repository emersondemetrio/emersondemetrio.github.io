const transformMap: { [key: string]: string } = {
  á: "a",
  à: "a",
  ó: "o",
  é: "e",
  ç: "c",
  ã: "a",
  "¿": "?",
  o: "o",
  a: "a",
};

export type Color = "yellow" | "white";

const transform = (l: string) => (transformMap[l] ?? l).toLowerCase();

const to = (l: string, color: Color = "yellow") => {
  if (l === " ") return "  ";
  if (l === ".") return ".";
  if (l === "?") return ":question:";
  if (l === "!") return ":exclamation:";

  const pure = transform(l);

  if (!/[a-zA-Z]/.test(l)) {
    return l;
  }

  return `:alphabet-${color}-${pure}:`;
};

export const createSlackAlphabet = (w: string, color: Color = "yellow") =>
  w
    .split("")
    .map((l) => to(l, color))
    .join("");
