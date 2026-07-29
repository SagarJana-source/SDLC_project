# SAF-SCOPE-001 - Prototype Boundaries

## Status

Draft for stakeholder approval.

- Related scenario: `SAF-SCENARIO-001`
- Related requirement: `SAF-REQ-001`
- Approval gate: `SAF-GATE-002`
- Authorized next step after approval: Step 3, identify users and responsibilities

## Purpose of this boundary

The prototype will prove that one feature can travel through a representative SDLC agent workflow with human control and complete traceability. It will not attempt to provide a production platform or automate every variation of enterprise delivery.

## Prototype outcome

Using `SAF-REQ-001`, the prototype must demonstrate a single vertical slice from requirement intake through BRD approval and representative downstream delivery artifacts.

The principal proof is:

> The current BRD version cannot progress to backlog decomposition until an authorized architect decision is recorded, and the complete artifact chain remains traceable to the originating requirement.

## Functional scope included

The prototype includes the minimum behavior needed to exercise the 11-agent lifecycle:

1. Accept one structured or free-text feature requirement.
2. Normalize it into a controlled requirement artifact.
3. Retrieve relevant information from a small, curated body of prior project knowledge.
4. Generate one versioned BRD.
5. Create an architect approval task for the current BRD version.
6. Record an approval or rejection with reviewer identity, timestamp, and comments.
7. Block backlog decomposition until the current BRD version is approved.
8. Decompose the approved BRD into a small backlog.
9. Propose a single-sprint plan.
10. Produce a bounded code-and-test change in a sandbox repository.
11. Prepare Git branch, commit, and pull-request artifacts.
12. Perform an automated review proposal and record human review disposition.
13. Execute a small sanity-test suite and preserve its evidence.
14. Generate a QA handoff package.
15. Add or update requirement lineage in a prototype knowledge representation.
16. Demonstrate one successful path and at least one rejection, authorization, or version-invalidation path.

This list sets the outer boundary only. It does not define detailed workflow, agent contracts, schemas, tools, or implementation technology.

## Artifact scope included

The vertical slice may create only the artifact types needed to demonstrate lineage:

- Raw and normalized requirement
- Retrieved-knowledge references
- Versioned BRD
- Approval task and decision
- Acceptance criteria
- Epic, user stories, and engineering tasks
- Sprint proposal
- Proposed code and automated tests
- Branch, commit, and pull-request references
- Review findings and disposition
- Sanity-test results
- QA handoff
- Knowledge-lineage records
- Audit events

Detailed schemas are outside Step 2 and remain unapproved.

## Scale boundary

The prototype is limited to:

- One organization context
- One project
- One application repository
- One active feature scenario
- One BRD under review at a time
- One designated architect decision path
- One proposed sprint
- A backlog of no more than one epic and five user stories
- A code change small enough for one pull request
- A compact sanity suite focused on the approved acceptance criteria
- A curated knowledge set small enough for manual verification
- A demonstration environment, not a shared production service

Multi-feature concurrency and enterprise throughput are excluded.

## User-interaction boundary

The prototype must provide enough interaction to:

- Submit the feature requirement.
- View generated artifacts and their source links.
- Approve or reject the current BRD version.
- View workflow status and blocked-state reasoning.
- Inspect review and test evidence.
- View or export the QA handoff.
- Navigate the requirement lineage.

Production-quality visual design, accessibility certification, mobile support, and extensive administration interfaces are excluded.

Detailed personas, permissions, and responsibility assignments belong to Step 3 and are not defined here.

## Integration boundary

The prototype may use:

- A local Git repository as the authoritative implementation sandbox.
- A GitHub repository for multi-person issues, branches, pull requests, and reviews after a remote is explicitly configured.
- Local or sandbox execution for tests.
- A small local document collection for prior project knowledge.
- Lightweight storage for prototype artifacts, audit events, and lineage.
- A simulated notification adapter for architect email delivery.

The prototype must not:

- Read from or write to production repositories.
- Merge automatically to a protected branch.
- Deploy to production.
- Send real customer or enterprise-wide notifications.
- Modify production project-management, QA, identity, or knowledge systems.
- Depend on privileged enterprise credentials.

Selection of specific integration products and technologies belongs to Step 11.

## Data boundary

Allowed data:

- Synthetic feature requirements
- Sanitized example BRDs and decisions
- Synthetic users and roles
- Purpose-built sample source code
- Generated test data
- Non-sensitive audit and lineage metadata

Disallowed data:

- Production secrets or credentials
- Personal, customer, regulated, or confidential data
- Unapproved proprietary source code
- Production defect, release, or operational data
- Unredacted conversation or model logs containing sensitive content

Prototype data may be reset and recreated. Production retention, archival, legal-hold, and data-residency requirements are excluded.

## Environment boundary

Included environments:

- Contributor development environments
- Local or sandbox Git repositories
- One shared demonstration environment if required

Excluded environments:

- Production
- Disaster recovery
- High-availability clusters
- Customer-facing staging environments
- Regulated validation environments

## Automation and authority boundary

Agents may prepare, validate, and recommend artifacts within the prototype.

Agents may not independently:

- Approve business or architecture artifacts.
- Override a rejection.
- Merge a pull request.
- deploy software.
- Change protected-branch settings.
- Grant permissions.
- access production data.
- suppress failed tests or review findings.

At minimum, human confirmation is required for the BRD decision and before any external write. Detailed approval gates belong to later design steps.

## Quality boundary

The prototype must demonstrate:

- Complete lineage for every artifact in the selected scenario.
- Explicit blocked states when prerequisites are not approved.
- Version-aware approval behavior.
- Reproducible test evidence for the selected acceptance criteria.
- Audit records for human decisions and agent actions.
- Clear error reporting for the demonstrated failure path.

The prototype is not required to demonstrate:

- Production service-level objectives
- Load or endurance testing
- High availability or disaster recovery
- Full penetration testing or compliance certification
- Cost optimization at enterprise scale
- Model fine-tuning
- Support for every programming language or repository type

## Collaboration boundary

Multiple contributors may work through Git and GitHub, subject to these limits:

- `main` is the integration branch.
- Each work item uses a short-lived branch and pull request.
- Every issue, branch, commit, and pull request carries its requirement identifier.
- Parallel work begins only when shared inputs and the applicable gate are approved.
- Contributors must not define competing shared contracts or schemas in isolation.
- Protected-branch rules and required reviews must be enabled when the repository is published.
- Repository collaboration does not remove business or architecture approval gates.

## Explicit exclusions

The following are outside the prototype:

- Multi-project, multi-repository, or multi-tenant operation
- Concurrent processing of many features
- Production deployment and release automation
- Autonomous merging or self-approval
- Full enterprise identity federation and permission administration
- Real-time collaboration editing
- Enterprise Jira, Azure DevOps, ServiceNow, Teams, or email integration
- Migration of historical enterprise artifacts
- Production knowledge-graph operation
- Advanced analytics, forecasting, or portfolio planning
- Custom model training or fine-tuning
- Comprehensive UI design system
- Commercial packaging, billing, or customer support
- Full regulatory certification

## Boundary-change rule

An item may enter the prototype only through:

1. A documented scope-change issue.
2. Impact analysis covering schedule, security, data, integration, and evaluation.
3. Stakeholder approval.
4. An update to this artifact with a new version.

An idea is not in scope merely because a contributor creates a branch or proof of concept.

## Step 2 completion criteria

Step 2 is complete when the stakeholder confirms:

- The functional boundary is sufficient to demonstrate the framework.
- The scale limits are acceptable.
- Real versus simulated interaction boundaries are acceptable.
- The data and environment restrictions are acceptable.
- The exclusions are acceptable.
- Step 3 may begin.

## Approval checkpoint

Approve `SAF-SCOPE-001` as written or request changes. Step 3 must not start until `SAF-GATE-002` is approved.
