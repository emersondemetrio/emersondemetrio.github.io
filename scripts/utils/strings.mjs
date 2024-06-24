export const camelCase = (s) => {
  return s
    .replace(/-([a-z])/g, (g) => g[1].toUpperCase())
    .replace("-", "")
    .replace(" ", "");
};

export const titleCase = (str) => {
  return str
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const dashCase = (str) => {
  return str.toLowerCase().replace(" ", "-");
};
