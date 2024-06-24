import process from "process";
import { createNewPage } from "./commands/page.mjs";

const args = process.argv.slice(2);

const command = args[0];
const param1 = args[1];
const param2 = args[2];

if (command === "page") {
  createNewPage(param1, param2);
}
