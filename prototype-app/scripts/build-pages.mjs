import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "pages-dist");
const baseUrl = (
  process.env.PAGES_BASE_URL ||
  "https://sagarjana-source.github.io/SDLC_project"
).replace(/\/$/, "");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const sourceHtml = await readFile(resolve(root, "src/index.html"), "utf8");
const pagesHtml = sourceHtml
  .replaceAll("__ORIGIN__", baseUrl)
  .replace('href="/styles.css"', 'href="./styles.css"')
  .replace('src="/app.js"', 'src="./app.js"');

await Promise.all([
  writeFile(resolve(output, "index.html"), pagesHtml),
  writeFile(resolve(output, ".nojekyll"), ""),
  copyFile(resolve(root, "src/styles.css"), resolve(output, "styles.css")),
  copyFile(resolve(root, "src/app.js"), resolve(output, "app.js")),
  copyFile(resolve(root, "public/og.png"), resolve(output, "og.png")),
]);

console.log(`GitHub Pages artifact built at ${output}`);
console.log(`Base URL: ${baseUrl}`);
