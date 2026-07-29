# Governance

## Purpose

This project uses explicit approval gates so that agents and contributors cannot silently advance the prototype beyond reviewed business and architecture decisions.

## Decision states

- `Draft`: being prepared and not eligible for downstream use.
- `In Review`: ready for named reviewers.
- `Approved`: accepted for the recorded version.
- `Changes Requested`: must be revised and reviewed again.
- `Superseded`: retained for history but replaced by a newer version.

## Gate rules

1. Approval applies to a specific artifact version.
2. Material changes create a new version and invalidate progression based on the old approval.
3. The approver must be independent of the primary author for governed artifacts.
4. Rejection or requested changes must include a rationale.
5. Downstream work may be drafted only when explicitly authorized; it may not be treated as approved input.
6. Every gate decision must remain auditable.

## Repository controls to configure on GitHub

- Protect the `main` branch.
- Require pull requests.
- Require at least one approving review.
- Dismiss approvals after new commits.
- Require review from code owners after teams are configured.
- Block force pushes and branch deletion on `main`.
- Require status checks once automated checks exist.
- Enable secret scanning and dependency alerts where available.

## Change control

Changes to scope, acceptance criteria, agent responsibilities, shared schemas, security rules, or approval logic require a dedicated issue and pull request.

Emergency bypasses are outside the prototype scope.

## Current gate

Only `SAF-GATE-001`, approval of the Step 1 prototype scenario, is active. Later gates are not yet defined in detail.
