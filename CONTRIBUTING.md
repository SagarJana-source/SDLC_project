# Contributing

## Collaboration model

The project uses trunk-based collaboration with short-lived branches and reviewed pull requests.

No contributor should push directly to `main` after the GitHub repository is configured.

## Before starting work

1. Confirm that the relevant project gate is approved.
2. Create or claim a GitHub issue.
3. Ensure the issue identifies its requirement, artifact, owner, and acceptance conditions.
4. Check for dependent or overlapping work.

## Branch naming

Use:

```text
<type>/<requirement-id>-<short-description>
```

Examples:

```text
docs/SAF-REQ-001-refine-scenario
feature/SAF-REQ-001-approval-task
test/SAF-REQ-001-authorization
fix/SAF-REQ-001-version-check
```

Allowed types are `docs`, `feature`, `test`, `fix`, `chore`, and `spike`.

## Commit messages

Use:

```text
<type>(<area>): <summary> [<requirement-id>]
```

Example:

```text
docs(scenario): clarify BRD version invalidation [SAF-REQ-001]
```

Keep commits focused. Do not combine unrelated requirements or artifacts.

## Pull requests

Every pull request must:

- Link to an approved issue.
- Name the applicable requirement and acceptance criteria.
- Describe the affected artifacts.
- Include verification evidence appropriate to the change.
- Identify security, data, or integration impact.
- Receive the required reviews.
- Resolve review comments before merge.

## Review ownership

Until real GitHub usernames or teams are known, assign reviewers manually:

- Business artifacts: Business Analyst and Product Owner
- Architecture or orchestration: Architect
- Code: Developer reviewer
- Tests and QA evidence: QA or test reviewer
- Security-sensitive changes: Security reviewer
- Governance changes: Project maintainer and Architect

A `.github/CODEOWNERS.example` file is provided for conversion into a real `CODEOWNERS` file after GitHub teams are created.

## Definition of done

A work item is done only when:

- Its entry gate was approved.
- Acceptance conditions are satisfied.
- Required traceability links are present.
- Relevant tests or document checks pass.
- Review is complete.
- Documentation is updated.
- No secrets, production data, or generated credentials are committed.

## Gated work

Repository structure does not authorize work in a later lifecycle stage. The status in `PROJECT_PLAN.md` is authoritative.
