import * as fs from "fs";
import path from "path";

export const ensurePath = (targetDir) => {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }
};

export const writeUtf8File = (filePath, content) => {
  fs.writeFileSync(filePath, content, "utf-8");
};

export const resolve = (filePath) => {
  return path.resolve(filePath);
};
