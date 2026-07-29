import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const [html, css, js] = await Promise.all([
  readFile(resolve(root, "src/index.html"), "utf8"),
  readFile(resolve(root, "src/styles.css"), "utf8"),
  readFile(resolve(root, "src/app.js"), "utf8"),
]);

await rm(dist, { recursive: true, force: true });
await mkdir(resolve(dist, "server"), { recursive: true });
await mkdir(resolve(dist, "client"), { recursive: true });
await mkdir(resolve(dist, ".openai"), { recursive: true });

const worker = `const HTML=${JSON.stringify(html)};
const CSS=${JSON.stringify(css)};
const APP=${JSON.stringify(js)};
const headers={"cache-control":"public, max-age=300","x-content-type-options":"nosniff","referrer-policy":"strict-origin-when-cross-origin"};
export default {
  async fetch(request, env) {
    const url=new URL(request.url);
    if(url.pathname==="/"||url.pathname==="/index.html"){
      return new Response(HTML.replaceAll("__ORIGIN__",url.origin),{headers:{...headers,"content-type":"text/html; charset=utf-8"}});
    }
    if(url.pathname==="/styles.css") return new Response(CSS,{headers:{...headers,"content-type":"text/css; charset=utf-8"}});
    if(url.pathname==="/app.js") return new Response(APP,{headers:{...headers,"content-type":"text/javascript; charset=utf-8"}});
    if(url.pathname==="/og.png"&&env?.ASSETS) return env.ASSETS.fetch(request);
    return new Response("Not found",{status:404,headers});
  }
};`;

await writeFile(resolve(dist, "server/index.js"), worker, "utf8");
await copyFile(resolve(root, "public/og.png"), resolve(dist, "client/og.png"));
await copyFile(
  resolve(root, ".openai/hosting.json"),
  resolve(dist, ".openai/hosting.json"),
);
console.log("Built dependency-free Sites worker in dist/");
