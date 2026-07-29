# SAF-SCENARIO-001 - BRD Architect Approval

## Status

Approved for prototype planning. Approval is recorded in `docs/decisions/DEC-0001-step-1-scenario-approval.md`.

## Raw feature requirement

> When the framework generates a Business Requirements Document (BRD), the designated architect must be notified and given a controlled way to approve or reject that exact BRD version. The decision, reviewer identity, timestamp, and comments must be recorded and linked to the originating requirement. Downstream backlog generation must not begin until the current BRD version is approved.

## Business objective

Prevent unapproved or outdated BRDs from progressing into backlog decomposition while reducing the manual effort required to notify architects and preserve their decisions.

## Primary user story

As a designated architect, I want to receive an approval task when a BRD is ready, review the exact generated version, and approve or reject it, so that downstream delivery work is based on an explicitly governed business document.

## Actors

- Business Analyst
- BRD Generation Agent
- Designated Architect
- Orchestrator
- Audit/Knowledge component

## Preconditions

- A normalized requirement exists with a persistent requirement ID.
- A BRD exists with a unique BRD ID and version.
- A designated architect is associated with the project.
- The framework can create an in-application approval task.
- Email may be simulated; the in-application task is authoritative.

## Business rules

1. An approval task is created only when a BRD version enters `Awaiting Approval`.
2. A single active approval task may exist for each BRD version.
3. Only the assigned architect or an authorized delegate may decide.
4. Rejection requires a comment; approval comments are optional.
5. The decision records the requirement ID, BRD ID, version, reviewer, result, timestamp, and comments.
6. Backlog decomposition remains blocked until the current BRD version is approved.
7. Editing an approved BRD creates a new version and requires a new approval.
8. Notification failure does not remove the approval task and must be recorded.

## Acceptance criteria

### SAF-AC-001 - Approval request creation

- **Given:** a generated BRD with a designated architect
- **When:** the BRD enters `Awaiting Approval`
- **Then:** exactly one active approval task is created for that BRD version

### SAF-AC-002 - Approval and progression

- **Given:** an authorized architect is reviewing the current BRD version
- **When:** the architect approves it
- **Then:** the decision is recorded and backlog decomposition may begin

### SAF-AC-003 - Rejection and rework

- **Given:** an authorized architect is reviewing the current BRD version
- **When:** the architect rejects it with a comment
- **Then:** the reason is recorded, the BRD returns to rework, and backlog decomposition remains blocked

### SAF-AC-004 - Authorization

- **Given:** a user is not an assigned architect or authorized delegate
- **When:** that user attempts to decide
- **Then:** the decision is refused and the attempt is recorded

### SAF-AC-005 - Version integrity

- **Given:** a BRD version is approved
- **When:** its content changes
- **Then:** a new version requires a new decision while the earlier history remains traceable

## Expected traceability

`SAF-REQ-001 -> BRD version -> Approval task -> Architect decision -> Acceptance criteria -> Backlog items -> Code change -> Review -> Test evidence -> QA handoff -> Knowledge update`

## Success conditions

- The current BRD cannot progress without authorized approval.
- Approval permits workflow progression.
- Rejection returns the BRD to rework with its rationale.
- A changed BRD cannot reuse an older approval.
- All downstream evidence remains linked to `SAF-REQ-001`.
- The demonstration covers a successful decision and one failure path.

## Exclusions

- Production email integration
- Mobile or chat notifications
- Committee approvals
- Production deployment
- Autonomous pull-request merging
- Enterprise identity-provider integration

## Assumptions requiring approval

- The architect is the only mandatory prototype approver.
- In-application approval is authoritative.
- Every BRD content change requires a new version and approval.
- Backlog decomposition is the first blocked downstream stage.
- Rejection returns the BRD to generation or refinement.

## Approval checkpoint

Approved by the project stakeholder through the project task. Material changes require a new decision.
