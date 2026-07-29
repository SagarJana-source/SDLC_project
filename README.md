# SDLC Agentic Framework Prototype

A collaboration-ready project for validating an end-to-end, human-governed SDLC agentic workflow.

The prototype is intended to prove that a raw business requirement can produce structured delivery artifacts while preserving traceability through BRD approval, planning, implementation, review, testing, QA handoff, and knowledge capture.

## Current status

| Item | Status |
|---|---|
| Project structure | Ready |
| Step 1: Prototype scenario | Approved |
| Step 2: Prototype boundaries | Approved |
| Step 3: Users and responsibilities | Approved |
| Steps 4-17: Accelerated blueprint and review | Complete |
| Interactive prototype | Built and verified |
| GitHub remote | Configured and public |

The current scenario is documented in [docs/scenarios/01-brd-approval.md](docs/scenarios/01-brd-approval.md).
The approved prototype boundaries are documented in [docs/scope/02-prototype-boundaries.md](docs/scope/02-prototype-boundaries.md).
The approved users and responsibilities are documented in [docs/roles/03-users-and-responsibilities.md](docs/roles/03-users-and-responsibilities.md).
The completed Steps 4-17 are documented in [docs/blueprint/04-17-accelerated-blueprint.md](docs/blueprint/04-17-accelerated-blueprint.md).
The working browser prototype is in [prototype-app/](prototype-app/).

## Prototype scenario

The proposed vertical slice is:

> Architect approval notification and decision capture for generated BRDs.

It demonstrates human-in-the-loop control, BRD version integrity, downstream workflow blocking, auditability, and requirement-to-delivery traceability.

## Repository structure

```text
.
|-- .github/                 GitHub issue and pull-request templates
|-- agents/                  Reserved for future agent definitions
|-- docs/
|   |-- decisions/           Architecture decision records
|   |-- roles/               Users, ownership, and responsibilities
|   |-- scenarios/           Approved prototype scenarios
|   `-- templates/           Controlled artifact templates
|-- integrations/            Reserved for external-system adapters
|-- orchestration/           Reserved for workflow definitions
|-- schemas/                 Reserved for artifact schemas
|-- src/                     Reserved for application code
|-- tests/                   Reserved for automated tests
|-- CONTRIBUTING.md          Git and review workflow
|-- GOVERNANCE.md            Approval and change-control rules
|-- PROJECT_PLAN.md          Milestones and approval gates
`-- SECURITY.md              Prototype security expectations
```

Reserved folders do not contain implementation or later-stage design. They establish ownership boundaries so contributors do not invent incompatible structures.

## Working with the project

1. Open the hosted prototype or run `npm run dev` from `prototype-app/`.
2. Select **Run to approval gate**.
3. Demonstrate rejection, revision, version-specific approval, and completion.
4. Inspect artifacts, lineage, test evidence, and the audit trail.
5. Use GitHub issues and pull requests for pilot feedback.

Detailed rules are in [CONTRIBUTING.md](CONTRIBUTING.md) and [GOVERNANCE.md](GOVERNANCE.md).

## Initial identifiers

- Project: `SAF`
- Prototype scenario: `SAF-SCENARIO-001`
- Requirement: `SAF-REQ-001`
- Approval checkpoint: `SAF-GATE-001`

These identifiers should appear in related issues, branches, commits, pull requests, and future artifacts.

## What is intentionally simulated

- Production credentials or integrations
- Live language-model agent calls
- Enterprise knowledge retrieval
- Autonomous Git or pull-request writes from the browser
- Production identity and email delivery
- Production deployment of generated application changes

## Next authorized action

Run the demonstration and decide whether to begin a pilot that replaces selected deterministic agents with live integrations.
