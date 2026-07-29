const AGENTS = [
  { id: "A01", name: "Requirement Intake", owner: "Business Analyst" },
  { id: "A02", name: "Knowledge Retrieval", owner: "Knowledge Curator" },
  { id: "A03", name: "BRD Generation", owner: "Business Analyst" },
  { id: "A04", name: "Backlog Decomposition", owner: "Product Owner" },
  { id: "A05", name: "Sprint Planning", owner: "Product Owner" },
  { id: "A06", name: "Code Generation", owner: "Developer" },
  { id: "A07", name: "Git Operations", owner: "Platform Admin" },
  { id: "A08", name: "Code Review", owner: "Technical Reviewer" },
  { id: "A09", name: "Sanity Testing", owner: "QA Lead" },
  { id: "A10", name: "QA Handoff", owner: "QA Lead" },
  { id: "A11", name: "Knowledge Graph Update", owner: "Knowledge Curator" },
];

const AGENT_TASKS = [
  "Normalize the requirement and extract actors, outcomes, constraints, and approval rules.",
  "Search prior project decisions and rank relevant governance knowledge.",
  "Generate a versioned BRD with business rules and testable acceptance criteria.",
  "Decompose the approved BRD into an epic, stories, tasks, and criterion links.",
  "Build a capacity-aware sprint proposal with estimates and dependencies.",
  "Generate the approval state model, authorization guard, and automated tests.",
  "Prepare a traceable branch, commit, and pull-request package.",
  "Review the change independently for correctness, security, and traceability.",
  "Execute acceptance scenarios and record criterion-level evidence.",
  "Package scope, build, review, test, risk, and limitation context for QA.",
  "Write artifacts and relationships into the delivery knowledge graph.",
];

const DEFAULT_REQUIREMENT = document.querySelector("#requirement").value;
const el = (selector) => document.querySelector(selector);
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
const time = () =>
  new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());

const initialAudit = () => [
  {
    id: 1,
    time: time(),
    actor: "System",
    action: "Loaded safe demonstration state",
    result: "success",
  },
];

let state = {
  completed: 0,
  gate: "not_reached",
  run: "ready",
  brdVersion: 1,
  artifacts: [],
  selectedId: "",
  audit: initialAudit(),
  activity: [
    {
      id: 1,
      time: time(),
      agent: "Orchestrator",
      message: "Run initialized in safe demonstration mode",
      status: "ready",
    },
  ],
  currentAgent: null,
  currentTask: "Enter or edit the requirement, then start the governed run.",
  latestOutput: null,
  isRunning: false,
  startedAt: null,
};

function artifact(
  id,
  type,
  title,
  status,
  owner,
  summary,
  sourceIds,
  details,
  output = "",
) {
  return { id, type, title, status, owner, summary, sourceIds, details, output };
}

function addAudit(actor, action, result) {
  state.audit.unshift({
    id: state.audit.length + 1,
    time: time(),
    actor,
    action,
    result,
  });
}

function addActivity(agent, message, status = "working") {
  state.activity.unshift({
    id: state.activity.length + 1,
    time: time(),
    agent,
    message,
    status,
  });
}

const wait = (milliseconds) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

function setNotice(message) {
  el("#run-notice").textContent = message;
}

function agentStatus(index) {
  if (state.isRunning && state.currentAgent === index) return "running";
  if (index < state.completed) return "complete";
  if (
    index === state.completed &&
    (state.gate === "waiting" || state.gate === "rejected")
  )
    return "blocked";
  return "queued";
}

function renderAgents() {
  el("#agent-grid").innerHTML = AGENTS.map((agent, index) => {
    const status = agentStatus(index);
    const label =
      status === "complete"
        ? "Complete"
        : status === "running"
          ? "Working"
        : status === "blocked"
          ? "Gate blocked"
          : "Queued";
    return `<article class="agentCard ${status}" data-agent="${agent.id}">
      <div class="agentTop"><span>${agent.id}</span><i aria-label="${status}"></i></div>
      <strong>${agent.name}</strong><small>${agent.owner}</small>
      <div class="agentStatus">${label}</div>
    </article>`;
  }).join("");
}

function renderAudit() {
  el("#audit-count").textContent = String(state.audit.length);
  el("#audit-list").innerHTML = state.audit
    .map(
      (event) => `<div class="auditEvent">
        <i class="${event.result}"></i>
        <div><strong>${escapeHtml(event.actor)}</strong><p>${escapeHtml(event.action)}</p><small>${escapeHtml(event.time)}</small></div>
      </div>`,
    )
    .join("");
}

function renderExecution() {
  const active =
    state.currentAgent === null ? null : AGENTS[state.currentAgent];
  el("#active-agent-id").textContent = active?.id ?? (
    state.run === "complete" ? "DONE" : "READY"
  );
  el("#active-agent-name").textContent =
    active?.name ?? (state.run === "complete" ? "Delivery complete" : "Orchestrator");
  el("#active-agent-task").textContent = state.currentTask;
  el("#live-label").textContent = state.isRunning
    ? "Agents working"
    : state.gate === "waiting"
      ? "Paused for human approval"
      : state.run === "complete"
        ? "Run completed"
        : "Waiting to start";
  el("#live-dot").className = state.isRunning
    ? "working"
    : state.run === "complete"
      ? "complete"
      : state.gate === "waiting"
        ? "waiting"
        : "";

  const elapsedSeconds = state.startedAt
    ? Math.max(0, Math.floor((Date.now() - state.startedAt) / 1000))
    : 0;
  el("#execution-clock").textContent =
    `${String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:${String(elapsedSeconds % 60).padStart(2, "0")}`;

  const preview = el("#work-preview");
  if (!state.latestOutput) {
    preview.innerHTML =
      '<div class="previewEmpty"><span>&gt;_</span><p>Generated analysis, documents, code, tests, and handoff evidence will appear here.</p></div>';
  } else {
    preview.innerHTML = `<div class="previewTop"><span>${escapeHtml(state.latestOutput.type)}</span><b>${escapeHtml(state.latestOutput.status)}</b></div>
      <h4>${escapeHtml(state.latestOutput.title)}</h4>
      <pre>${escapeHtml(state.latestOutput.output)}</pre>
      <button class="inspectOutput" type="button" data-artifact-id="${escapeHtml(state.latestOutput.id)}">Inspect full artifact</button>`;
    const inspectButton = preview.querySelector(".inspectOutput");
    inspectButton?.addEventListener("click", () => {
      selectArtifact(state.latestOutput.id);
      el("#artifact-detail").scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  el("#activity-count").textContent = String(state.activity.length);
  el("#activity-feed").innerHTML = state.activity
    .map(
      (event) => `<div class="feedEvent ${escapeHtml(event.status)}">
        <i></i><div><strong>${escapeHtml(event.agent)}</strong><p>${escapeHtml(event.message)}</p><small>${escapeHtml(event.time)}</small></div>
      </div>`,
    )
    .join("");
}

function renderArtifactDetail() {
  const selected =
    state.artifacts.find((item) => item.id === state.selectedId) ??
    state.artifacts[0];
  if (!selected) {
    el("#artifact-detail").innerHTML =
      '<div class="emptyDetail"><span>SAF</span><h3>Lineage begins with intent</h3><p>Run the lifecycle to create governed artifacts and inspect their complete chain of evidence.</p></div>';
    return;
  }

  const sources = selected.sourceIds.length
    ? selected.sourceIds.join(" · ")
    : "Origin artifact";
  el("#artifact-detail").innerHTML = `
    <div class="detailTop"><span>${escapeHtml(selected.type)}</span><b>${escapeHtml(selected.status)}</b></div>
    <h3>${escapeHtml(selected.title)}</h3>
    <p>${escapeHtml(selected.summary)}</p>
    <dl>
      <div><dt>Artifact ID</dt><dd>${escapeHtml(selected.id)}</dd></div>
      <div><dt>Accountable owner</dt><dd>${escapeHtml(selected.owner)}</dd></div>
      <div><dt>Sources</dt><dd>${escapeHtml(sources)}</dd></div>
    </dl>
    <div class="producedOutput">
      <div><span>Produced work</span><b>${escapeHtml(selected.type)} output</b></div>
      <pre>${escapeHtml(selected.output || selected.details.join("\n"))}</pre>
    </div>
    <div class="detailChecklist">${selected.details
      .map((detail) => `<div><span>✓</span>${escapeHtml(detail)}</div>`)
      .join("")}</div>`;
}

function selectArtifact(id) {
  state.selectedId = id;
  renderArtifacts();
}

function renderArtifacts() {
  el("#artifact-count").textContent = String(state.artifacts.length);
  if (!state.artifacts.length) {
    el("#artifact-list").innerHTML =
      '<div class="emptyState"><span>◇</span><p>Artifacts appear after requirement intake runs.</p></div>';
    renderArtifactDetail();
    return;
  }

  const list = el("#artifact-list");
  list.innerHTML = "";
  state.artifacts.forEach((item) => {
    const button = document.createElement("button");
    if (item.id === state.selectedId) button.className = "selected";
    button.innerHTML = `<span class="artifactGlyph">${escapeHtml(item.type.slice(0, 2).toUpperCase())}</span>
      <span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.id)}</small></span>
      <b>${escapeHtml(item.status)}</b>`;
    button.addEventListener("click", () => selectArtifact(item.id));
    list.append(button);
  });
  renderArtifactDetail();
}

function renderGate() {
  const section = el("#approval-section");
  const form = el("#decision-form");
  const revise = el("#revise-brd");
  const continueButton = el("#continue-agents");
  if (state.gate === "not_reached") {
    section.className = "approvalSection hidden";
    return;
  }

  section.className = `approvalSection ${state.gate}`;
  form.classList.toggle("hidden", state.gate !== "waiting");
  revise.classList.toggle("hidden", state.gate !== "rejected");
  continueButton.classList.toggle(
    "hidden",
    state.gate !== "approved" || state.run === "complete",
  );
  el("#gate-icon").textContent = state.gate === "approved" ? "✓" : "!";

  if (state.gate === "waiting") {
    el("#gate-title").textContent =
      `BRD v${state.brdVersion} needs an architect decision`;
    el("#gate-description").textContent =
      "Backlog decomposition cannot start until the assigned architect decides on this exact version.";
  } else if (state.gate === "rejected") {
    el("#gate-title").textContent = `BRD v${state.brdVersion} is in rework`;
    el("#gate-description").textContent =
      "The rejection rationale is preserved. Generate a revised version to continue.";
    revise.innerHTML = `Revise BRD and create v${state.brdVersion + 1} <span>→</span>`;
  } else {
    el("#gate-title").textContent = `BRD v${state.brdVersion} approved`;
    el("#gate-description").textContent =
      "The decision is recorded and downstream work is now authorized.";
  }
}

function renderStatus() {
  const labels = {
    ready: ["Ready", "NOT_STARTED"],
    running: ["Authorized", "AUTHORIZED"],
    waiting: ["Approval required", "WAITING_FOR_BRD_APPROVAL"],
    rework: ["Rework required", "BRD_REWORK_REQUIRED"],
    complete: ["Completed", "COMPLETED"],
  };
  const [label, code] = labels[state.run];
  el("#status-label").textContent = label;
  el("#state-code").textContent = code;
  el("#status-beacon").className = `statusBeacon ${state.run}`;
  el("#agent-count").textContent = String(state.completed);
  el("#agent-progress").style.width = `${(state.completed / 11) * 100}%`;
  el("#lineage-percent").textContent = String(
    state.completed ? Math.round((state.completed / 11) * 100) : 0,
  );
  el("#lineage-note").textContent =
    state.run === "complete" ? "no required orphans" : "in progress";
  el("#gate-count").textContent =
    state.gate === "approved" || state.run === "complete" ? "1/1" : "0/1";

  el("#run-gate").classList.toggle("hidden", state.completed > 0);
  el("#complete-run").classList.toggle(
    "hidden",
    state.gate !== "approved" || state.run === "complete",
  );
  el("#reset-demo").classList.toggle("hidden", state.run !== "complete");
  el("#requirement").disabled = state.completed > 0;
  [
    "#run-gate",
    "#complete-run",
    "#approve-brd",
    "#reject-brd",
    "#revise-brd",
    "#continue-agents",
  ].forEach((selector) => {
    el(selector).disabled = state.isRunning;
  });
}

function render() {
  renderStatus();
  renderAgents();
  renderExecution();
  renderGate();
  renderArtifacts();
  renderAudit();
}

async function executeAgent(index, producedArtifact) {
  const agent = AGENTS[index];
  state.isRunning = true;
  state.currentAgent = index;
  state.currentTask = AGENT_TASKS[index];
  addActivity(agent.name, state.currentTask, "working");
  setNotice(`${agent.id} ${agent.name} is working...`);
  render();
  await wait(700);

  if (!state.artifacts.some((item) => item.id === producedArtifact.id)) {
    state.artifacts.push(producedArtifact);
  }
  state.completed = Math.max(state.completed, index + 1);
  state.selectedId = producedArtifact.id;
  state.latestOutput = producedArtifact;
  addActivity(
    agent.name,
    `Published ${producedArtifact.id}: ${producedArtifact.title}`,
    "complete",
  );
  addAudit(
    agent.name,
    `Produced ${producedArtifact.id}`,
    "success",
  );
  setNotice(`${agent.id} completed and published ${producedArtifact.id}.`);
  render();
  await wait(350);
}

async function runToGate() {
  const requirement = el("#requirement").value.trim();
  if (!requirement || state.isRunning) {
    if (state.isRunning) return;
    setNotice("Requirement intake blocked: enter a business requirement.");
    addAudit(
      "Requirement Intake Agent",
      "Rejected an empty requirement",
      "blocked",
    );
    render();
    return;
  }

  state.startedAt = Date.now();
  state.run = "running";
  state.gate = "not_reached";
  state.isRunning = true;
  addActivity("Orchestrator", "Authorized agents A01-A03 to run in sequence", "decision");
  render();

  const intake = artifact(
    "SAF-REQ-001",
    "Requirement",
    "Architect approval for generated BRDs",
    "normalized",
    "Business Analyst",
    requirement,
    [],
    [
      "Business outcome identified",
      "Designated architect required",
      "Downstream backlog must be blocked",
      "Decision evidence must retain reviewer, version, time, and rationale",
    ],
    `BUSINESS OUTCOME
Prevent unapproved BRD content from entering delivery planning.

ACTORS
- Requester: Product Operations
- Author: Business Analyst
- Approver: Designated Solution Architect
- Consumers: Product Owner, Developer, QA Lead

CONTROL RULES
- Approval is bound to an exact BRD version.
- Backlog decomposition remains blocked until approval.
- Rejection requires rationale and returns the BRD to rework.
- Every downstream artifact must trace to an acceptance criterion.`,
  );
  const knowledge = artifact(
    "SAF-KNOW-SET-001",
    "Knowledge set",
    "Prior governance knowledge",
    "verified",
    "Knowledge Curator",
    "Three approved sources matched and were ranked against the requirement.",
    ["SAF-REQ-001"],
    [
      "KNOW-001 - Material BRD edits require fresh approval",
      "KNOW-002 - Authors cannot self-approve governed work",
      "KNOW-004 - Every criterion requires test evidence",
    ],
    `RETRIEVAL QUERY
"BRD version approval authorization downstream blocking traceability"

RANKED MATCHES
1. KNOW-001 | 96% | Version invalidation policy
2. KNOW-002 | 92% | Separation-of-duties decision
3. KNOW-004 | 88% | Acceptance evidence standard

SYNTHESIS
The new flow must enforce version-specific approval, prevent self-approval,
block downstream work, and preserve criterion-level test lineage.`,
  );
  const brd = artifact(
    `SAF-BRD-001-v${state.brdVersion}`,
    "BRD",
    `Governed architect approval - v${state.brdVersion}`,
    "awaiting approval",
    "Business Analyst",
    "A complete versioned BRD defining approval authority, workflow states, and measurable acceptance criteria.",
    ["SAF-REQ-001", "SAF-KNOW-SET-001"],
    [
      "AC-001 - Create one approval task per BRD version",
      "AC-002 - Approval permits backlog decomposition",
      "AC-003 - Rejection returns the BRD to rework",
      "AC-004 - Unauthorized decisions are refused",
      "AC-005 - Material edits require new approval",
    ],
    `BRD: GOVERNED ARCHITECT APPROVAL
Version: ${state.brdVersion}

OBJECTIVE
Ensure only an authorized decision on the current BRD version can unlock backlog work.

FUNCTIONAL FLOW
Draft -> Awaiting Approval -> Approved -> Backlog Ready
                          \\-> Rejected -> Rework -> New Version

BUSINESS RULES
BR-01: One open approval task per BRD version.
BR-02: Only the assigned architect may decide.
BR-03: A rejection must include rationale.
BR-04: Material edits invalidate prior approval.

ACCEPTANCE CRITERIA
AC-001 through AC-005 are measurable and mapped to SAF-REQ-001.`,
  );

  await executeAgent(0, intake);
  await executeAgent(1, knowledge);
  await executeAgent(2, brd);
  state.isRunning = false;
  state.currentAgent = null;
  state.currentTask =
    `Review SAF-BRD-001-v${state.brdVersion}. Downstream execution is paused until an authorized decision is recorded.`;
  state.run = "waiting";
  state.gate = "waiting";
  state.selectedId = brd.id;
  setNotice(
    `BRD v${state.brdVersion} is ready. Backlog decomposition is blocked pending architect approval.`,
  );
  addActivity(
    "Orchestrator",
    `Paused the run at the approval gate for SAF-BRD-001-v${state.brdVersion}`,
    "waiting",
  );
  addAudit(
    "Orchestrator",
    `Stopped at BRD v${state.brdVersion} approval gate`,
    "blocked",
  );
  render();
}

function unauthorizedDecision() {
  if (state.gate !== "waiting") return;
  setNotice(
    "Decision refused: Developer D. Rao is not the assigned architect.",
  );
  addAudit(
    "Developer D. Rao",
    `Attempted to approve SAF-BRD-001-v${state.brdVersion}`,
    "blocked",
  );
  render();
}

function rejectBrd() {
  if (state.gate !== "waiting") return;
  const reason = el("#decision-comment").value.trim();
  if (!reason) {
    setNotice("Rejection blocked: the architect must provide a reason.");
    addAudit(
      "Architect A. Sharma",
      "Attempted rejection without a rationale",
      "blocked",
    );
    render();
    return;
  }

  state.gate = "rejected";
  state.run = "rework";
  state.artifacts = state.artifacts.map((item) =>
    item.id === `SAF-BRD-001-v${state.brdVersion}`
      ? { ...item, status: "rejected" }
      : item,
  );
  state.artifacts.push(
    artifact(
      `SAF-DEC-00${state.brdVersion}`,
      "Decision",
      `BRD v${state.brdVersion} rejected`,
      "rejected",
      "Solution Architect",
      reason,
      [`SAF-BRD-001-v${state.brdVersion}`],
      [
        "Decision: rejected",
        "Backlog remains blocked",
        "A revised BRD version is required",
      ],
      `DECISION: REJECTED
Artifact: SAF-BRD-001-v${state.brdVersion}
Reviewer: Architect A. Sharma
Rationale: ${reason}
Effect: Backlog remains blocked; a new BRD version is required.`,
    ),
  );
  state.selectedId = `SAF-DEC-00${state.brdVersion}`;
  state.latestOutput = state.artifacts.at(-1);
  state.currentTask =
    "Revise the rejected BRD, preserve the decision evidence, and request fresh approval.";
  setNotice(
    `BRD v${state.brdVersion} was rejected. Revise it before continuing.`,
  );
  addAudit(
    "Architect A. Sharma",
    `Rejected SAF-BRD-001-v${state.brdVersion}: ${reason}`,
    "decision",
  );
  addActivity(
    "Architect A. Sharma",
    `Rejected SAF-BRD-001-v${state.brdVersion}; rework is required`,
    "decision",
  );
  el("#decision-comment").value = "";
  render();
}

function reviseBrd() {
  if (state.gate !== "rejected") return;
  const previous = state.brdVersion;
  state.brdVersion += 1;
  state.gate = "waiting";
  state.run = "waiting";
  state.artifacts.push(
    artifact(
      `SAF-BRD-001-v${state.brdVersion}`,
      "BRD",
      `Governed architect approval - v${state.brdVersion}`,
      "awaiting approval",
      "Business Analyst",
      "Revised to clarify delegates, audit evidence, and notification retry.",
      ["SAF-REQ-001", "SAF-KNOW-SET-001", `SAF-BRD-001-v${previous}`],
      [
        "AC-001 - Create one approval task per BRD version",
        "AC-002 - Approval permits backlog decomposition",
        "AC-003 - Rejection returns the BRD to rework",
        "AC-004 - Unauthorized decisions are refused and audited",
        "AC-005 - Material edits require new approval",
      ],
      `BRD REVISION SUMMARY
Previous version: ${previous}
Current version: ${state.brdVersion}

CHANGES
- Clarified delegated-approver authorization.
- Added audit evidence requirements for refused attempts.
- Added notification retry and delivery-status behavior.
- Preserved all five acceptance criteria with stronger wording.

CONTROL
Earlier approval decisions do not apply to this new version.`,
    ),
  );
  state.selectedId = `SAF-BRD-001-v${state.brdVersion}`;
  state.latestOutput = state.artifacts.at(-1);
  state.currentTask =
    `Review revised BRD v${state.brdVersion}; fresh approval is required.`;
  setNotice(
    `BRD v${state.brdVersion} generated. Earlier decisions do not apply to it.`,
  );
  addAudit(
    "BRD Generation Agent",
    `Created SAF-BRD-001-v${state.brdVersion}; fresh approval required`,
    "success",
  );
  addActivity(
    "BRD Generation",
    `Published revised SAF-BRD-001-v${state.brdVersion}`,
    "complete",
  );
  render();
}

function approveBrd() {
  if (state.gate !== "waiting") return;
  const decisionId = `SAF-DEC-00${state.brdVersion}`;
  const comment =
    el("#decision-comment").value.trim() ||
    "Approved for prototype backlog decomposition.";
  state.gate = "approved";
  state.run = "running";
  state.artifacts = state.artifacts.map((item) =>
    item.id === `SAF-BRD-001-v${state.brdVersion}`
      ? { ...item, status: "approved" }
      : item,
  );
  state.artifacts.push(
    artifact(
      decisionId,
      "Decision",
      `BRD v${state.brdVersion} approved`,
      "approved",
      "Solution Architect",
      comment,
      [`SAF-BRD-001-v${state.brdVersion}`],
      [
        "Decision: approved",
        "Reviewer: Architect A. Sharma",
        "Applies to current version only",
      ],
      `DECISION: APPROVED
Artifact: SAF-BRD-001-v${state.brdVersion}
Reviewer: Architect A. Sharma
Comment: ${comment}
Scope: This exact BRD version only
Effect: Agents A04-A11 are authorized to continue.`,
    ),
  );
  state.selectedId = decisionId;
  state.latestOutput = state.artifacts.at(-1);
  state.currentTask =
    "Approval is recorded. Run the remaining agents to produce backlog, code, review, test, QA, and lineage outputs.";
  setNotice(
    `BRD v${state.brdVersion} approved. The remaining agents may continue.`,
  );
  addAudit(
    "Architect A. Sharma",
    `Approved SAF-BRD-001-v${state.brdVersion}`,
    "decision",
  );
  addActivity(
    "Architect A. Sharma",
    `Approved SAF-BRD-001-v${state.brdVersion}; downstream agents authorized`,
    "decision",
  );
  el("#decision-comment").value = "";
  render();
}

async function completeRun() {
  if (state.gate !== "approved" || state.isRunning) {
    if (state.isRunning) return;
    setNotice("Delivery run blocked: approve the current BRD first.");
    addAudit(
      "Orchestrator",
      "Blocked downstream run without current BRD approval",
      "blocked",
    );
    render();
    return;
  }

  const brdId = `SAF-BRD-001-v${state.brdVersion}`;
  state.run = "running";
  state.isRunning = true;
  addActivity(
    "Orchestrator",
    `Approval verified for ${brdId}; authorized agents A04-A11`,
    "decision",
  );
  render();

  const downstreamArtifacts = [
    artifact(
      "SAF-EPIC-001",
      "Backlog",
      "Governed BRD approval epic",
      "ready",
      "Product Owner",
      "One epic, three implementation stories, nine tasks, and five linked criteria.",
      [brdId, "SAF-REQ-001"],
      [
        "STORY-001 (3 pts) - Create version-specific approval task",
        "STORY-002 (5 pts) - Capture authorized architect decision",
        "STORY-003 (2 pts) - Enforce downstream workflow block",
      ],
      `EPIC SAF-EPIC-001
Goal: Govern BRD approval before backlog progression.

STORY-001 | 3 points | AC-001
As an architect, I receive one decision task for the exact BRD version.
Tasks: approval model; notification event; version uniqueness test.

STORY-002 | 5 points | AC-002, AC-003, AC-004
As the assigned architect, I can approve or reject with an auditable rationale.
Tasks: authorization guard; decision API; audit record; negative tests.

STORY-003 | 2 points | AC-005
As a Product Owner, I can proceed only with current-version approval.
Tasks: workflow guard; invalidation hook; orchestration test.`,
    ),
    artifact(
      "SAF-SPRINT-001",
      "Sprint proposal",
      "Prototype Sprint 01",
      "accepted",
      "Product Owner",
      "A capacity-aware sprint plan sequences the governed vertical slice.",
      ["SAF-EPIC-001"],
      [
        "Capacity: 12 points",
        "Committed scope: 10 points",
        "Dependency: approval state model before workflow guard",
        "Definition of done includes five acceptance tests",
      ],
      `SPRINT 01 PLAN
Team capacity: 12 points | Committed: 10 | Buffer: 2

Day 1-2  STORY-001  Approval task and version model
Day 3-5  STORY-002  Authorized decision and audit trail
Day 6-7  STORY-003  Downstream guard and invalidation
Day 8    Independent review
Day 9    Acceptance sanity suite
Day 10   QA handoff and knowledge update

EXIT CRITERIA
- Five acceptance criteria pass
- No blocking review finding
- QA package and lineage graph complete`,
    ),
    artifact(
      "SAF-CHANGE-001",
      "Code change",
      "Approval gate vertical slice",
      "implemented",
      "Application Developer",
      "Generated a bounded approval state machine, authorization guard, and tests.",
      ["SAF-SPRINT-001", "SAF-EPIC-001"],
      [
        "Approval task model",
        "Approve and reject actions",
        "Version invalidation",
        "Workflow progression guard",
      ],
      `export function decideBrd({ brd, actor, decision, reason }) {
  if (actor.id !== brd.assignedArchitectId) {
    throw new AuthorizationError("Assigned architect required");
  }
  if (decision === "rejected" && !reason?.trim()) {
    throw new ValidationError("Rejection rationale required");
  }
  return {
    brdVersion: brd.version,
    status: decision,
    decidedBy: actor.id,
    decidedAt: new Date().toISOString(),
    reason: reason ?? "Approved",
  };
}

export function mayDecomposeBacklog(brd, approval) {
  return approval?.status === "approved"
    && approval.brdVersion === brd.version;
}`,
    ),
    artifact(
      "SAF-GIT-001",
      "Git reference",
      "Pull request metadata",
      "prepared",
      "Platform Administrator",
      "Prepared a traceable branch, conventional commit, and pull-request package.",
      ["SAF-CHANGE-001"],
      [
        "Branch: feature/SAF-REQ-001-brd-approval",
        "Commit: feat(approval): enforce BRD gate [SAF-REQ-001]",
        "PR: SAF-REQ-001 - Govern BRD approval",
      ],
      `BRANCH
feature/SAF-REQ-001-brd-approval

COMMIT
feat(approval): enforce version-bound BRD gate [SAF-REQ-001]

PULL REQUEST
Title: SAF-REQ-001 - Govern BRD approval
Traceability: REQ-001 -> BRD-001 -> EPIC-001 -> CHANGE-001
Checks: unit 8/8 | acceptance 5/5 | lineage 100%
Reviewers: Technical Reviewer, QA Lead

No remote write is executed in demonstration mode.`,
    ),
    artifact(
      "SAF-REVIEW-001",
      "Review",
      "Independent technical review",
      "accepted",
      "Technical Reviewer",
      "Independent review found no blocker and recorded two advisory observations.",
      ["SAF-CHANGE-001", "SAF-GIT-001"],
      [
        "PASS - Authorization path covered",
        "PASS - Old-version approval reuse prevented",
        "ADVISORY - Add notification retry telemetry",
        "ADVISORY - Integrate enterprise identity before production",
      ],
      `REVIEW RESULT: ACCEPTED

Correctness
[PASS] Approval is bound to the current BRD version.
[PASS] Rejection rationale is mandatory.
[PASS] Downstream progression fails closed.

Security
[PASS] Assigned-architect authorization is explicit.
[PASS] Unauthorized attempts are audit events.

Traceability
[PASS] Change references requirement, BRD, epic, and criteria.

Blocking findings: 0 | Advisory findings: 2`,
    ),
    artifact(
      "SAF-TEST-001",
      "Test evidence",
      "Acceptance sanity suite",
      "passed",
      "QA Lead",
      "Executed five criterion-level scenarios with captured expected and actual results.",
      ["SAF-REVIEW-001", brdId],
      [
        "AC-001 PASS - One task per version",
        "AC-002 PASS - Approval permits progression",
        "AC-003 PASS - Rejection returns to rework",
        "AC-004 PASS - Unauthorized user refused",
        "AC-005 PASS - New version requires approval",
      ],
      `ACCEPTANCE SANITY REPORT
Environment: prototype-001 | Result: 5 passed, 0 failed

AC-001 PASS | v1 creates exactly one open approval task
AC-002 PASS | current-version approval unlocks backlog
AC-003 PASS | rejection returns status to BRD_REWORK_REQUIRED
AC-004 PASS | unassigned developer receives AUTHORIZATION_DENIED
AC-005 PASS | editing v1 to v2 invalidates the v1 decision

Duration: 1.42s | Required evidence captured: 5/5`,
    ),
    artifact(
      "SAF-QA-001",
      "QA handoff",
      "QA-ready evidence package",
      "accepted",
      "QA Lead",
      "Packaged scope, build, review, tests, risks, limitations, and entry criteria.",
      ["SAF-TEST-001", "SAF-REVIEW-001", "SAF-GIT-001"],
      [
        "Build: prototype-001",
        "Email delivery simulated",
        "Enterprise identity not integrated",
        "Ready for exploratory QA",
      ],
      `QA HANDOFF PACKAGE
Build: prototype-001
Scope: BRD approval vertical slice
Stories: STORY-001, STORY-002, STORY-003
Acceptance evidence: 5/5 passed
Review: accepted, 0 blocking findings

KNOWN LIMITATIONS
- Email notification is simulated.
- Enterprise identity is not integrated.
- Git operations remain dry-run only.

RECOMMENDED QA FOCUS
Authorization boundaries, version invalidation, concurrent decisions.`,
    ),
    artifact(
      "SAF-NODE-001",
      "Knowledge graph",
      "Completed requirement lineage",
      "complete",
      "Knowledge Curator",
      "Recorded the governed delivery graph with validated relationships and no orphans.",
      ["SAF-REQ-001", brdId, "SAF-EPIC-001", "SAF-CHANGE-001", "SAF-TEST-001", "SAF-QA-001"],
      [
        "12 governed artifacts",
        "18 validated relationships",
        "0 orphan required artifacts",
        "Lineage coverage: 100%",
      ],
      `KNOWLEDGE GRAPH UPDATE
SAF-REQ-001  --DEFINED_BY-->       ${brdId}
${brdId} --APPROVED_BY-->       SAF-DEC-00${state.brdVersion}
${brdId} --DECOMPOSED_INTO-->   SAF-EPIC-001
SAF-EPIC-001 --SCHEDULED_IN-->     SAF-SPRINT-001
SAF-SPRINT-001 --IMPLEMENTED_BY--> SAF-CHANGE-001
SAF-CHANGE-001 --REVIEWED_BY-->    SAF-REVIEW-001
SAF-REVIEW-001 --VERIFIED_BY-->    SAF-TEST-001
SAF-TEST-001 --PACKAGED_IN-->      SAF-QA-001

Nodes: 12 | Relationships: 18 | Orphans: 0
Required lineage coverage: 100%`,
    ),
  ];

  for (let index = 0; index < downstreamArtifacts.length; index += 1) {
    await executeAgent(index + 3, downstreamArtifacts[index]);
  }

  state.isRunning = false;
  state.currentAgent = null;
  state.currentTask =
    "All work products are complete. Select any artifact to inspect its generated content and lineage.";
  state.run = "complete";
  state.selectedId = "SAF-NODE-001";
  setNotice("Delivery complete. QA evidence and knowledge lineage are ready.");
  addActivity(
    "Orchestrator",
    "Completed the governed lifecycle with 11 agent outputs and 100% required lineage",
    "complete",
  );
  addAudit(
    "Orchestrator",
    "Completed all 11 agents with 100% required lineage",
    "success",
  );
  addAudit(
    "Sanity Testing Agent",
    "Passed five of five acceptance criteria",
    "success",
  );
  render();
}

function resetDemo() {
  state = {
    completed: 0,
    gate: "not_reached",
    run: "ready",
    brdVersion: 1,
    artifacts: [],
    selectedId: "",
    audit: initialAudit(),
    activity: [
      {
        id: 1,
        time: time(),
        agent: "Orchestrator",
        message: "Run initialized in safe demonstration mode",
        status: "ready",
      },
    ],
    currentAgent: null,
    currentTask: "Enter or edit the requirement, then start the governed run.",
    latestOutput: null,
    isRunning: false,
    startedAt: null,
  };
  el("#requirement").value = DEFAULT_REQUIREMENT;
  el("#decision-comment").value = "";
  setNotice("Ready to process SAF-REQ-001 through the governed lifecycle.");
  render();
}

el("#run-gate").addEventListener("click", runToGate);
el("#approve-brd").addEventListener("click", approveBrd);
el("#reject-brd").addEventListener("click", rejectBrd);
el("#revise-brd").addEventListener("click", reviseBrd);
el("#complete-run").addEventListener("click", completeRun);
el("#continue-agents").addEventListener("click", completeRun);
el("#reset-demo").addEventListener("click", resetDemo);
el("#unauthorized-demo").addEventListener("click", unauthorizedDecision);
render();
window.setInterval(() => {
  if (!state.startedAt) return;
  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - state.startedAt) / 1000),
  );
  el("#execution-clock").textContent =
    `${String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:${String(elapsedSeconds % 60).padStart(2, "0")}`;
}, 1000);
