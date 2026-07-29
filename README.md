# SDLC Agentic Framework Prototype

A collaboration-ready project for validating an end-to-end, human-governed SDLC agentic workflow.

The prototype is intended to prove that a raw business requirement can produce structured delivery artifacts while preserving traceability through BRD approval, planning, implementation, review, testing, QA handoff, and knowledge capture.

## Current status

| Item | Status |
|---|---|
| Project structure | Ready |
| Step 1: Prototype scenario | Approved |
| Step 2: Prototype boundaries | Approved |
| Step 3: Users and responsibilities | Awaiting stakeholder approval |
| Step 4 and later | Blocked by the Step 3 approval gate |
| Framework implementation | Not started |
| GitHub remote | Not configured |

The current scenario is documented in [docs/scenarios/01-brd-approval.md](docs/scenarios/01-brd-approval.md).
The approved prototype boundaries are documented in [docs/scope/02-prototype-boundaries.md](docs/scope/02-prototype-boundaries.md).
The proposed users and responsibilities are documented in [docs/roles/03-users-and-responsibilities.md](docs/roles/03-users-and-responsibilities.md).

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

1. Review the proposed users and responsibilities.
2. Record approval or requested changes in a GitHub issue.
3. Do not start Step 4 until the Step 3 approval issue is closed as approved.
4. Create one branch per approved work item.
5. Link every pull request to its issue and requirement identifier.
6. Require review before merging to `main`.

Detailed rules are in [CONTRIBUTING.md](CONTRIBUTING.md) and [GOVERNANCE.md](GOVERNANCE.md).

## Initial identifiers

- Project: `SAF`
- Prototype scenario: `SAF-SCENARIO-001`
- Requirement: `SAF-REQ-001`
- Approval checkpoint: `SAF-GATE-001`

These identifiers should appear in related issues, branches, commits, pull requests, and future artifacts.

## What is intentionally not included

- Functional application code
- Agent prompts or runtime definitions
- Technology-stack selection
- Production credentials or integrations
- CI/CD deployment
- A GitHub repository or remote
- Design work belonging to Step 2 or later

## Next authorized action

Obtain stakeholder approval or requested changes for `SAF-ROLES-001`. Step 4 must not begin before that decision is recorded.
