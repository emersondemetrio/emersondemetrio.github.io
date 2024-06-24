import { camelCase, dashCase, titleCase } from "../utils/strings.mjs";
import { ensurePath, resolve, writeUtf8File } from "../utils/filesystem.mjs";
import { PageContent } from "../templates/page.mjs";

export const createNewPage = async (name, description = "Come back soon!") => {
  const nameDashCase = dashCase(name);
  const nameCamelCase = camelCase(name);

  const targetDir = resolve(`src/pages/${nameDashCase}`);

  ensurePath(targetDir);

  const filePath = `${targetDir}/${nameDashCase}.tsx`;

  writeUtf8File(
    filePath,
    PageContent(titleCase(nameCamelCase), titleCase(name), description)
  );

  console.log(`Created new page: ${filePath}`);
};
