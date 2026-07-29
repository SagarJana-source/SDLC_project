# SAF-BLUEPRINT-001 - Accelerated Steps 4-17

## Status

Implemented as the controlling prototype blueprint.

## Step 4 - Target workflow

The prototype follows this lifecycle:

```text
Requirement submitted
  -> Requirement normalized
  -> Prior knowledge retrieved
  -> BRD generated
  -> Architect decision required
     -> rejected: BRD rework and new version
     -> approved: backlog decomposition
  -> Sprint proposed
  -> Code and tests proposed
  -> Git change prepared
  -> Technical review performed
     -> changes requested: implementation rework
     -> accepted: sanity testing
  -> Sanity tests executed
     -> failed: implementation rework
     -> passed: QA handoff
  -> Knowledge lineage updated
  -> Prototype run completed
```

Every transition records its actor, timestamp, input artifact IDs, output artifact IDs, and outcome. The orchestrator blocks invalid transitions and reports the reason.

### Workflow entry and exit

- Entry: a non-empty feature requirement and designated architect.
- Successful exit: QA handoff and lineage update completed with all required links.
- Controlled stop: a human gate, validation failure, rejection, or failed test.
- Recovery: revise the affected artifact and resume from the earliest invalidated stage.

## Step 5 - Eleven agent contracts

| Agent | Required input | Output | Validation | Human control |
|---|---|---|---|---|
| 1. Requirement Intake | Raw requirement | Normalized requirement | Outcome, actor, rules and constraints present | BA confirms ambiguity resolution |
| 2. Knowledge Retrieval | Requirement and curated corpus | Ranked source references | Source ID and provenance required | Curator may remove irrelevant sources |
| 3. BRD Generation | Requirement and knowledge references | Versioned BRD | Requirement links and acceptance criteria present | Architect must approve exact version |
| 4. Backlog Decomposition | Approved BRD | Epic, stories and tasks | Every item links to BRD and criteria | Product Owner confirms readiness |
| 5. Sprint Planning | Ready backlog | Single sprint proposal | Capacity and dependencies identified | Product Owner accepts scope |
| 6. Code Generation | Approved task and architecture constraints | Proposed code and tests | No unlinked change; sandbox only | Developer owns final change |
| 7. Git Operations | Validated change | Branch, commit and PR metadata | Requirement ID in all references | Human push/review rules apply |
| 8. Code Review | Diff, criteria and standards | Findings and recommendation | Severity and affected artifact required | Technical reviewer decides |
| 9. Sanity Testing | Reviewed change and test plan | Test results and evidence | Criterion coverage required | QA decides sufficiency |
| 10. QA Handoff | Approved scope and evidence | QA package | Required sections and links present | QA accepts or rejects handoff |
| 11. Knowledge Graph Update | Final artifacts and decisions | Lineage nodes and edges | No orphan required artifacts | Curator verifies provenance |

All agents must return structured output, evidence references, uncertainty, validation errors, and audit events. They may not approve their own output, bypass a gate, conceal failed checks, or write to production systems.

## Step 6 - Shared artifact model

### Core entities

| Entity | Identifier | Required relationships |
|---|---|---|
| Requirement | `REQ-*` | Parent of BRD and acceptance criteria |
| Knowledge reference | `KNOW-*` | Cites source and supports requirement or BRD |
| BRD | `BRD-*` plus version | Derived from requirement; subject of approval |
| Approval task | `APR-*` | Targets one artifact version and one approver |
| Decision | `DEC-*` | Resolves an approval task |
| Acceptance criterion | `AC-*` | Belongs to requirement and BRD version |
| Epic/story/task | `EPIC-*`, `STORY-*`, `TASK-*` | Implements one or more criteria |
| Sprint proposal | `SPRINT-*` | Contains ready backlog items |
| Code change | `CHANGE-*` | Implements tasks and criteria |
| Git reference | `GIT-*` | Identifies branch, commit or pull request |
| Review finding | `REVIEW-*` | Targets code or test evidence |
| Test result | `TEST-*` | Verifies one or more criteria |
| QA handoff | `QA-*` | Aggregates approved scope and evidence |
| Knowledge node/edge | `NODE-*`, `EDGE-*` | Preserves final lineage |
| Audit event | `AUDIT-*` | Records actor, action, time and result |

Every artifact carries `id`, `type`, `version`, `status`, `createdAt`, `createdBy`, `sourceIds`, and `requirementIds`.

## Step 7 - Traceability rules

1. Every BRD links to at least one requirement.
2. Every BRD claim informed by prior knowledge cites a knowledge source.
3. Every story and task links to at least one acceptance criterion.
4. Every code change links to a task and acceptance criterion.
5. Every acceptance criterion has test evidence or an explicit approved waiver.
6. Every review finding identifies its affected artifact.
7. QA handoff contains the current approved versions only.
8. Editing an approved governed artifact invalidates downstream approval based on the older version.
9. Required artifacts may not be orphaned.
10. Lineage coverage is calculated as satisfied required links divided by total required links.

## Step 8 - Orchestration model

The orchestrator uses a finite-state model:

```text
NOT_STARTED
ANALYZING_REQUIREMENT
RETRIEVING_KNOWLEDGE
GENERATING_BRD
WAITING_FOR_BRD_APPROVAL
BRD_REWORK_REQUIRED
DECOMPOSING_BACKLOG
PLANNING_SPRINT
GENERATING_CHANGE
PREPARING_GIT
REVIEWING_CHANGE
CHANGES_REQUIRED
RUNNING_SANITY_TESTS
TESTS_FAILED
PREPARING_QA_HANDOFF
UPDATING_KNOWLEDGE
COMPLETED
```

The state record includes the current agent, allowed actions, blocking reason, retry count, last successful checkpoint, and audit history. Invalid actions return a visible blocked result without mutating state.

## Step 9 - Human approval gates

| Gate | Approver | Blocking condition | Rejection route |
|---|---|---|---|
| BRD version | Solution Architect | Backlog cannot start | BRD rework and new version |
| Backlog readiness | Product Owner | Sprint cannot be accepted | Story refinement |
| Sprint scope | Product Owner | Implementation cannot be authorized | Replanning |
| Code change | Technical Reviewer | Sanity testing cannot be accepted | Development rework |
| Security-sensitive exception | Security Reviewer | Unsafe action remains prohibited | Mitigation or scope removal |
| QA handoff | QA Lead | Run cannot complete | Test, defect or documentation rework |

The interactive prototype implements the BRD gate directly and represents later decisions as evidence-bearing simulated approvals.

## Step 10 - Prototype knowledge base

The curated corpus contains sanitized examples:

- `KNOW-001`: BRD versioning decision
- `KNOW-002`: Human approval and segregation-of-duties policy
- `KNOW-003`: Pull-request traceability convention
- `KNOW-004`: Acceptance-criteria test coverage rule
- `KNOW-005`: QA handoff checklist

Each source records title, summary, owner, status, effective date, tags and provenance. Retrieval is deterministic keyword matching for the prototype. Production semantic retrieval is outside scope.

## Step 11 - Prototype integrations

| Capability | Prototype selection | Mode |
|---|---|---|
| User experience | React browser dashboard | Real prototype UI |
| Orchestration | Deterministic in-browser state machine | Simulated agent execution |
| Artifact storage | In-memory state with browser persistence optional | Device-local only |
| Knowledge retrieval | Curated static corpus | Deterministic simulation |
| Git collaboration | Git and public GitHub repository | Real collaboration |
| Pull request creation | Metadata simulation | No autonomous external write |
| Test execution | Built-in deterministic evidence plus automated app tests | Real app verification |
| Notifications | In-application approval card | Email simulated |
| Knowledge graph | In-memory nodes and edges | Visual lineage prototype |
| Hosting | OpenAI Sites | Public prototype deployment |

## Step 12 - Accelerated milestones

1. Governance baseline and scenario: complete.
2. Scope, roles and blueprint: complete.
3. Interactive vertical slice: implemented.
4. Automated build and behavior verification: required before release.
5. GitHub push and hosted demonstration: required for handoff.

## Step 13 - Safety and governance controls

- Synthetic data only.
- No secrets or production credentials in the browser.
- No autonomous merge, deployment or permission changes.
- External writes require explicit human action outside the simulation.
- User-entered text is rendered as text, not executable markup.
- Agents expose source references and audit events.
- Human approval cannot be generated by an agent.
- Rejection comments are mandatory.
- Version changes invalidate earlier approval.
- Reset restores a known safe demonstration state.

## Step 14 - Evaluation scenarios

| ID | Scenario | Expected result |
|---|---|---|
| EVAL-001 | Complete requirement | Stops at BRD approval with linked artifacts |
| EVAL-002 | Empty requirement | Intake blocked with visible validation message |
| EVAL-003 | Unauthorized approval attempt | Decision rejected and audit event recorded |
| EVAL-004 | Architect rejects BRD | Rework state; backlog remains blocked |
| EVAL-005 | Revised BRD | New version requires new approval |
| EVAL-006 | Approved BRD | Backlog and later agents may proceed |
| EVAL-007 | Review finding | Finding linked to change and criterion |
| EVAL-008 | Sanity test pass | Evidence maps to all prototype criteria |
| EVAL-009 | QA handoff | Contains current scope, test and review evidence |
| EVAL-010 | Completed run | No required artifact is orphaned |

## Step 15 - Success measures

| Measure | Prototype target |
|---|---|
| Required artifact lineage | 100% |
| Acceptance criteria with test evidence | 100% |
| Governed version approval integrity | 100% |
| Invalid transition blocking | 100% of evaluation cases |
| Human decision audit completeness | 100% |
| Successful-path completion | Under 3 minutes in demonstration |
| Rejection-path visibility | Demonstrated |
| Automated build and tests | Passing |

These targets measure prototype correctness, not production quality or model accuracy.

## Step 16 - Demonstration script

1. Open the SDLC Control Room.
2. Review the seeded feature requirement.
3. Select **Run to approval gate**.
4. Show normalized requirement, retrieved knowledge and BRD v1.
5. Reject the BRD with a reason and show backlog remains blocked.
6. Select **Revise BRD** to create v2.
7. Approve v2 as the designated architect.
8. Select **Complete delivery run**.
9. Inspect backlog, sprint, code-change, Git, review, test and QA artifacts.
10. Open the lineage view and confirm 100% coverage.
11. Inspect the audit trail.
12. Reset the demonstration.

## Step 17 - Prototype review

### Confirmed strengths

- One coherent vertical slice covers all 11 agent responsibilities.
- The BRD gate is visible, version-aware and blocking.
- Artifacts, evidence and audit records remain linked.
- Both successful and rejection/rework paths are demonstrable.
- GitHub collaboration is supported without autonomous merging.

### Known limitations

- Agent outputs are deterministic templates rather than live language-model calls.
- Knowledge retrieval is a curated simulation.
- Git and pull-request actions are represented, not executed by the browser.
- Later human gates are summarized rather than individually interactive.
- State is not a production database and no enterprise identity is integrated.
- Security, performance, accessibility and compliance require production hardening.

### Pilot recommendation

Use this prototype to validate the workflow with one Business Analyst, Product Owner, Architect, Developer and QA reviewer. If accepted, the next phase should replace one simulated agent at a time, beginning with requirement intake, knowledge retrieval and BRD generation, while retaining the same artifact contracts and approval behavior.
