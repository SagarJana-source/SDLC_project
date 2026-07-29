# SAF-ROLES-001 - Users and Responsibilities

## Status

Draft for stakeholder approval.

- Related scenario: `SAF-SCENARIO-001`
- Scope boundary: `SAF-SCOPE-001`
- Approval gate: `SAF-GATE-003`
- Authorized next step after approval: Step 4, document the target workflow

## Purpose

This artifact identifies the people who use, govern, build, review, test, and operate the prototype. It assigns decision rights and artifact accountability before detailed workflow or agent contracts are designed.

It does not define the detailed target workflow, the 11 agent contracts, technology choices, or implementation design.

## Responsibility principles

1. A named human remains accountable for every governed outcome.
2. Agents may prepare or recommend artifacts but cannot become business, architecture, security, code-review, or QA approvers.
3. Authors cannot be the sole approvers of their own governed work.
4. Approval applies to a specific artifact version.
5. A role may be combined for a small prototype only when required independence is preserved.
6. Repository permissions do not automatically grant business decision authority.
7. Each handoff must include the artifact, version, traceability identifiers, decision state, and unresolved risks.

## Human users

### 1. Business Sponsor or Feature Requester

**Purpose:** Own the business outcome and confirm that the requested capability provides value.

**Responsibilities:**

- Provide the raw business need and expected outcome.
- Clarify business priority, constraints, and success intent.
- Confirm material scope changes.
- Accept or reject the final prototype demonstration from a business perspective.

**Decision rights:**

- Business priority and intended outcome
- Material feature-scope changes
- Final business acceptance of the prototype demonstration

**Does not own:**

- Architecture approval
- Code approval
- Security approval
- QA execution

### 2. Business Analyst

**Purpose:** Convert the feature request into a complete, testable, and traceable business definition.

**Responsibilities:**

- Capture and normalize the raw requirement.
- Identify assumptions, rules, constraints, and missing information.
- Review retrieved prior-project knowledge for business relevance.
- Review the generated BRD for completeness and fidelity.
- Maintain links from the requirement to the BRD and acceptance criteria.
- Coordinate clarification with the requester.

**Decision rights:**

- Requirement completeness recommendation
- Business-language corrections that do not change approved scope

**Primary artifacts:**

- Raw and normalized requirement
- Business rules
- BRD review comments
- Requirement-to-acceptance-criteria links

### 3. Product Owner

**Purpose:** Convert the approved business definition into a prioritized, deliverable product increment.

**Responsibilities:**

- Confirm that backlog items reflect the approved BRD.
- Prioritize the epic, stories, and tasks.
- Confirm story readiness and acceptance-criteria coverage.
- Resolve product-priority conflicts.
- Approve the proposed sprint scope from a product perspective.

**Decision rights:**

- Backlog priority
- Story readiness
- Product scope included in the proposed sprint

**Primary artifacts:**

- Prioritized backlog
- Story readiness decisions
- Product sprint-scope decision

### 4. Solution Architect

**Purpose:** Protect architecture integrity and act as the mandatory human approver for the prototype BRD.

**Responsibilities:**

- Review the exact generated BRD version.
- Approve or reject the BRD with rationale.
- Assess architectural constraints, dependencies, and risks.
- Review future workflow, agent, artifact, and integration designs.
- Ensure downstream work uses the currently approved BRD version.
- Participate in design and security decisions.

**Decision rights:**

- BRD approval for `SAF-SCENARIO-001`
- Architecture decisions
- Technical constraints and exception recommendations
- Approval of material orchestration or shared-contract changes

**Primary artifacts:**

- BRD approval decision
- Architecture decision records
- Architecture review findings

### 5. AI and Automation Engineer

**Purpose:** Design and implement agent behavior and orchestration after the applicable designs are approved.

**Responsibilities:**

- Implement approved agent contracts.
- Configure prompts, tools, permissions, retries, and validations.
- Implement approved orchestration behavior.
- Create agent-level evaluation cases.
- Document limitations and failure behavior.
- Preserve auditability and traceability in agent actions.

**Decision rights:**

- Implementation choices within approved contracts and architecture
- Recommendation of agent-runtime improvements

**Primary artifacts:**

- Agent definitions
- Orchestration implementation
- Agent evaluations
- Runtime documentation

### 6. Application Developer

**Purpose:** Implement the bounded application behavior and automated checks.

**Responsibilities:**

- Implement approved stories and tasks.
- Link code changes to requirements and acceptance criteria.
- Create focused unit, service, or API tests.
- Document design assumptions and known limitations.
- Respond to review findings.
- Keep changes within the approved pull-request boundary.

**Decision rights:**

- Local implementation details within approved architecture
- Recommendation of technical refactoring

**Primary artifacts:**

- Source code
- Developer tests
- Commit and pull-request content
- Remediation changes

### 7. Technical Reviewer or Development Lead

**Purpose:** Independently assess code quality, correctness, maintainability, and alignment with approved artifacts.

**Responsibilities:**

- Review code and tests against linked acceptance criteria.
- Validate architecture and coding-standard compliance.
- Classify findings and require remediation where necessary.
- Confirm that generated code receives the same scrutiny as human-written code.
- Approve or request changes on pull requests.

**Decision rights:**

- Technical pull-request approval
- Code-quality finding disposition

**Primary artifacts:**

- Review findings
- Pull-request decision
- Review evidence

**Independence rule:** The pull-request author cannot be the sole technical approver.

### 8. QA Lead or Test Engineer

**Purpose:** Independently verify the feature and determine whether the QA handoff is adequate.

**Responsibilities:**

- Review acceptance criteria for testability.
- Define and execute sanity and QA scenarios.
- Verify requirement-to-test coverage.
- Record results, evidence, defects, and limitations.
- Validate the QA handoff package.
- Provide the QA readiness decision.

**Decision rights:**

- Test sufficiency recommendation
- Defect severity from a QA perspective
- QA handoff acceptance or rejection

**Primary artifacts:**

- Test scenarios and results
- Defects
- Coverage evidence
- QA readiness decision

**Independence rule:** The principal feature implementer cannot be the sole QA approver.

### 9. Platform and Git Administrator

**Purpose:** Maintain safe collaboration and controlled execution environments.

**Responsibilities:**

- Configure the GitHub repository and access.
- Protect `main` and enable required reviews.
- Maintain CI runners and sandbox environments.
- Manage non-production secrets using approved mechanisms.
- Support branch, pull-request, and test automation.
- Preserve logs needed for troubleshooting.

**Decision rights:**

- Repository administration within approved governance
- CI and sandbox operational changes

**Primary artifacts:**

- Repository settings
- Branch-protection configuration
- CI configuration
- Operational runbooks

**Does not own:** Business, BRD, architecture, code-quality, or QA approval merely because the role has administrator access.

### 10. Security and Risk Reviewer

**Purpose:** Identify and disposition security, privacy, data, model, and integration risks.

**Responsibilities:**

- Review agent permissions and tool boundaries.
- Assess data classification and secret handling.
- Review external-write and prompt-injection controls.
- Review dependency, code, and integration risks.
- Record findings and required mitigations.
- Approve security-sensitive exceptions.

**Decision rights:**

- Security finding disposition
- Security exception approval or escalation
- Recommendation to block unsafe demonstration activity

**Primary artifacts:**

- Threat and risk findings
- Security review decision
- Approved exceptions

### 11. Knowledge and Data Curator

**Purpose:** Ensure retrieved prior knowledge and recorded lineage are relevant, authorized, and maintainable.

**Responsibilities:**

- Curate the small prototype knowledge corpus.
- Verify source quality, access, and provenance.
- Remove obsolete, duplicated, or unauthorized material.
- Validate knowledge and lineage updates after the feature run.
- Support manual verification of retrieval results.

**Decision rights:**

- Inclusion or removal of material from the prototype corpus
- Knowledge-quality recommendation

**Primary artifacts:**

- Curated source inventory
- Provenance metadata
- Knowledge-quality findings
- Lineage verification

### 12. Project Maintainer

**Purpose:** Coordinate delivery, enforce gates, and maintain the project record.

**Responsibilities:**

- Maintain the project plan and gate status.
- Ensure every work item has an owner and approved entry condition.
- Coordinate reviews without replacing specialist decision makers.
- Maintain contribution templates and repository documentation.
- Escalate blocked decisions and scope conflicts.
- Prepare demonstration logistics and status reporting.

**Decision rights:**

- Work coordination and issue administration
- Enforcement of documented gates
- Acceptance of administrative project changes

**Does not own:** Specialist business, architecture, security, technical-review, or QA decisions unless separately assigned and independence is preserved.

## System actors

System actors perform work but do not hold human accountability.

### Orchestrator

- Tracks lifecycle state and entry conditions.
- Invokes the appropriate approved agent behavior.
- Blocks downstream activity when prerequisites are unmet.
- Records state transitions, failures, and retries.
- Cannot approve its own outputs or bypass a human gate.

### Specialized agents

- Prepare lifecycle artifacts within approved contracts.
- Cite inputs and return structured outputs.
- Report uncertainty, validation failures, and missing information.
- Operate only with explicitly granted tools and permissions.
- Cannot act as the accountable or approving role.

The individual contracts for the 11 agents belong to Step 5 and are not defined here.

### External systems

- Git or GitHub stores collaboration and change history.
- A test runner executes approved automated checks.
- Prototype stores retain artifacts, audit events, and lineage.
- A notification adapter signals that human attention is needed.

External-system selection and detailed behavior remain outside Step 3.

## Responsibility assignment by lifecycle outcome

The table uses:

- **A:** Accountable for the accepted outcome
- **R:** Performs or coordinates the work
- **C:** Must be consulted
- **I:** Must be informed

| Lifecycle outcome | A | R | C | I |
|---|---|---|---|---|
| Business need and priority | Business Sponsor | Business Analyst | Product Owner | Architect, Project Maintainer |
| Normalized requirement | Business Analyst | Business Analyst | Business Sponsor, Product Owner | Architect |
| Relevant prior knowledge | Knowledge Curator | Knowledge Curator, Business Analyst | Architect | Product Owner |
| Complete BRD draft | Business Analyst | Business Analyst with agent assistance | Architect, Product Owner | Business Sponsor |
| BRD approval decision | Solution Architect | Solution Architect | Business Analyst, Security Reviewer when needed | Sponsor, Product Owner, Maintainer |
| Prioritized backlog | Product Owner | Product Owner | Business Analyst, Architect, Developer, QA | Sponsor |
| Proposed sprint scope | Product Owner | Product Owner, Project Maintainer | Architect, Developer, QA | Sponsor |
| Approved technical design | Solution Architect | Architect, AI Engineer, Developer | Security, Platform, QA | Product Owner |
| Agent and orchestration implementation | AI Engineer | AI Engineer | Architect, Security, Platform | Maintainer |
| Application implementation | Application Developer | Application Developer | Architect, AI Engineer, QA | Product Owner |
| Pull-request technical decision | Technical Reviewer | Technical Reviewer | Architect, QA, Security as needed | Developer, Product Owner |
| Sanity-test evidence | QA Lead | QA/Test Engineer | Developer, Product Owner | Architect, Maintainer |
| QA handoff decision | QA Lead | QA/Test Engineer | Product Owner, Developer, Architect | Sponsor |
| Knowledge and lineage update | Knowledge Curator | Knowledge Curator with agent assistance | Business Analyst, Architect, QA | Maintainer |
| Repository and sandbox operation | Platform Administrator | Platform Administrator | Security, AI Engineer, Developer | Maintainer |
| Prototype business acceptance | Business Sponsor | Project Maintainer | Product Owner, Architect, QA, Security | All contributors |

## Artifact ownership

| Artifact area | Accountable owner | Required reviewers |
|---|---|---|
| Requirements and BRD content | Business Analyst | Product Owner, Solution Architect |
| BRD approval record | Solution Architect | Business Analyst informed |
| Backlog and product sprint scope | Product Owner | Business Analyst, Architect, Developer, QA |
| Architecture decisions | Solution Architect | Security and Platform when affected |
| Agent definitions and orchestration code | AI Engineer | Architect, Security, Technical Reviewer |
| Application code | Application Developer | Technical Reviewer |
| Automated test suites and QA evidence | QA Lead | Developer and Product Owner consulted |
| Knowledge corpus and lineage | Knowledge Curator | Business Analyst, Architect |
| Repository and CI configuration | Platform Administrator | Security, Technical Reviewer |
| Governance and project records | Project Maintainer | Architect plus affected artifact owner |

## GitHub collaboration ownership

When the remote repository is created, map teams to repository areas:

| Repository area | Suggested GitHub team |
|---|---|
| `/docs/scenarios/` | `business-analysts`, `architects` |
| `/docs/decisions/` | `architects` |
| `/docs/roles/` | `project-maintainers`, `architects` |
| `/agents/` and `/orchestration/` | `ai-engineers`, `architects` |
| `/schemas/` | `architects`, `data-engineers` |
| `/integrations/` | `platform-engineers`, `security` |
| `/src/` | `developers` |
| `/tests/` | `qa-engineers` |
| `/.github/` | `project-maintainers`, `platform-engineers` |
| `/SECURITY.md` and security controls | `security` |

Replace the placeholder organization and teams in `.github/CODEOWNERS.example`, then rename it to `.github/CODEOWNERS`.

## Practical staffing model

### Recommended prototype team

Use nine core contributors where possible, with part-time Security and Knowledge Curator support:

1. Business Sponsor or Requester
2. Business Analyst
3. Product Owner
4. Solution Architect
5. AI/Automation Engineer
6. Application Developer
7. Technical Reviewer
8. QA/Test Engineer
9. Platform Administrator

The Technical Reviewer may be another developer, but not the pull-request author. A Security Reviewer and Knowledge Curator should join the activities that require their expertise.

### Minimum viable team

Five people may cover the prototype if roles are combined carefully:

1. Sponsor plus Product Owner
2. Business Analyst plus Knowledge Curator
3. Solution Architect plus Security Reviewer
4. AI Engineer plus Application Developer
5. Technical Reviewer plus QA Engineer, provided the reviewer did not author the change

Platform administration may be assigned to a technically qualified team member. No combination may permit self-approval of the BRD, pull request, or QA decision.

## Required handoff information

Every person-to-person or agent-to-person handoff must include:

- Requirement ID
- Artifact ID and version
- Current status
- Source and dependency links
- Acceptance criteria affected
- Decisions already made
- Open questions, assumptions, and risks
- Requested action and due owner
- Evidence required to complete the action

## Escalation ownership

| Issue | First owner | Escalation |
|---|---|---|
| Ambiguous requirement | Business Analyst | Business Sponsor |
| Product-priority conflict | Product Owner | Business Sponsor |
| Architecture conflict | Solution Architect | Sponsor and governance review |
| Unsafe agent action | Security Reviewer | Solution Architect and Project Maintainer |
| Repository or CI failure | Platform Administrator | Project Maintainer |
| Code-review disagreement | Technical Reviewer | Solution Architect |
| Test or QA disagreement | QA Lead | Product Owner and Solution Architect |
| Knowledge quality or provenance issue | Knowledge Curator | Business Analyst and Security Reviewer |
| Scope expansion request | Project Maintainer | Business Sponsor |

## Step 3 completion criteria

Step 3 is complete when the stakeholder confirms:

- All necessary prototype users are represented.
- Decision rights are assigned to appropriate human roles.
- Responsibility assignments are acceptable.
- Role combinations and independence rules are practical.
- GitHub ownership boundaries support multiple contributors.
- Step 4 may document the detailed target workflow.

## Approval checkpoint

Approve `SAF-ROLES-001` as written or request changes. Step 4 must not start until `SAF-GATE-003` is approved.
