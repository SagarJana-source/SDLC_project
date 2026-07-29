# SDLC Control Room

Dependency-free interactive prototype for the SDLC Agentic Framework.

## Demonstrated behavior

- Eleven visible agent stages
- Requirement intake and curated knowledge retrieval
- Versioned BRD generation
- Mandatory architect approval
- Unauthorized-decision blocking
- Rejection, rework, and fresh-version approval
- Backlog, sprint, code, Git, review, test, QA, and knowledge artifacts
- Artifact ownership and source lineage
- Audit trail and 100% completion coverage

The browser experience is a deterministic simulation. It performs no production writes and does not call live language models.

## Run locally

```text
npm run dev
```

Open `http://127.0.0.1:4173`.

## Verify

```text
npm test
```

The build produces a Cloudflare Worker-compatible site in `dist/`.
