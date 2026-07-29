import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("build emits a Cloudflare-compatible worker and social asset", async () => {
  const [worker, hosting, image] = await Promise.all([
    readFile(new URL("dist/server/index.js", root), "utf8"),
    readFile(new URL("dist/.openai/hosting.json", root), "utf8"),
    readFile(new URL("dist/client/og.png", root)),
  ]);
  assert.match(worker, /export default/);
  assert.match(worker, /async fetch/);
  assert.deepEqual(JSON.parse(hosting), { d1: null, r2: null });
  assert.ok(image.byteLength > 100_000);
});

test("source defines eleven agents and governed lifecycle actions", async () => {
  const source = await readFile(new URL("src/app.js", root), "utf8");
  assert.equal((source.match(/name: "/g) ?? []).length, 11);
  assert.match(source, /function unauthorizedDecision/);
  assert.match(source, /function rejectBrd/);
  assert.match(source, /function reviseBrd/);
  assert.match(source, /function approveBrd/);
  assert.match(source, /function completeRun/);
  assert.match(source, /async function executeAgent/);
  assert.match(source, /Produced work/);
  assert.match(source, /ACCEPTANCE SANITY REPORT/);
  assert.match(source, /KNOWLEDGE GRAPH UPDATE/);
  assert.match(source, /Lineage coverage: 100%/);
  assert.match(source, /escapeHtml/);
});

test("HTML presents control, evidence, and metadata surfaces", async () => {
  const html = await readFile(new URL("src/index.html", root), "utf8");
  assert.match(html, /<title>SDLC Control Room<\/title>/);
  assert.match(html, /Trace every decision/);
  assert.match(html, /Human-governed delivery orchestration/);
  assert.match(html, /Eleven-agent delivery line/);
  assert.match(html, /See the agents do the work/);
  assert.match(html, /Artifact and work-output explorer/);
  assert.match(html, /Production writes disabled/);
  assert.match(html, /__ORIGIN__\/og\.png/);
});
