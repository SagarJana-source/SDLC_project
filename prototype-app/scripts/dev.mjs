import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 4173);
const types = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://127.0.0.1:${port}`);
  const source =
    url.pathname === "/"
      ? resolve(root, "src/index.html")
      : url.pathname === "/styles.css"
        ? resolve(root, "src/styles.css")
        : url.pathname === "/app.js"
          ? resolve(root, "src/app.js")
          : url.pathname === "/og.png"
            ? resolve(root, "public/og.png")
            : null;

  if (!source) {
    response.writeHead(404).end("Not found");
    return;
  }
  if (url.pathname === "/") {
    const html = await readFile(source, "utf8");
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end(html.replaceAll("__ORIGIN__", `http://127.0.0.1:${port}`));
    return;
  }
  response.writeHead(200, { "content-type": types[extname(source)] });
  createReadStream(source).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Local URL: http://127.0.0.1:${port}`);
});
