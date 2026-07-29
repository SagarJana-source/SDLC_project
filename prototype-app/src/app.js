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
};

function artifact(id, type, title, status, owner, summary, sourceIds, details) {
  return { id, type, title, status, owner, summary, sourceIds, details };
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

function setNotice(message) {
  el("#run-notice").textContent = message;
}

function agentStatus(index) {
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
        : status === "blocked"
          ? "Gate blocked"
          : "Queued";
    return `<article class="agentCard ${status}">
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
}

function render() {
  renderStatus();
  renderAgents();
  renderGate();
  renderArtifacts();
  renderAudit();
}

function runToGate() {
  const requirement = el("#requirement").value.trim();
  if (!requirement) {
    setNotice("Requirement intake blocked: enter a business requirement.");
    addAudit(
      "Requirement Intake Agent",
      "Rejected an empty requirement",
      "blocked",
    );
    render();
    return;
  }

  state.run = "waiting";
  state.gate = "waiting";
  state.completed = 3;
  state.artifacts = [
    artifact(
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
      ],
    ),
    artifact(
      "SAF-KNOW-SET-001",
      "Knowledge set",
      "Prior governance knowledge",
      "verified",
      "Knowledge Curator",
      "Three approved sources matched the requirement.",
      ["SAF-REQ-001"],
      [
        "KNOW-001 - Material BRD edits require fresh approval",
        "KNOW-002 - Authors cannot self-approve governed work",
        "KNOW-004 - Every criterion requires test evidence",
      ],
    ),
    artifact(
      `SAF-BRD-001-v${state.brdVersion}`,
      "BRD",
      `Governed architect approval - v${state.brdVersion}`,
      "awaiting approval",
      "Business Analyst",
      "Defines version-specific architect approval and downstream blocking.",
      ["SAF-REQ-001", "SAF-KNOW-SET-001"],
      [
        "AC-001 - Create one approval task per BRD version",
        "AC-002 - Approval permits backlog decomposition",
        "AC-003 - Rejection returns the BRD to rework",
        "AC-004 - Unauthorized decisions are refused",
        "AC-005 - Material edits require new approval",
      ],
    ),
  ];
  state.selectedId = `SAF-BRD-001-v${state.brdVersion}`;
  setNotice(
    `BRD v${state.brdVersion} is ready. Backlog decomposition is blocked pending architect approval.`,
  );
  addAudit(
    "Orchestrator",
    `Stopped at BRD v${state.brdVersion} approval gate`,
    "blocked",
  );
  addAudit(
    "BRD Generation Agent",
    `Generated SAF-BRD-001-v${state.brdVersion} with five criteria`,
    "success",
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
    ),
  );
  setNotice(
    `BRD v${state.brdVersion} was rejected. Revise it before continuing.`,
  );
  addAudit(
    "Architect A. Sharma",
    `Rejected SAF-BRD-001-v${state.brdVersion}: ${reason}`,
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
    ),
  );
  state.selectedId = `SAF-BRD-001-v${state.brdVersion}`;
  setNotice(
    `BRD v${state.brdVersion} generated. Earlier decisions do not apply to it.`,
  );
  addAudit(
    "BRD Generation Agent",
    `Created SAF-BRD-001-v${state.brdVersion}; fresh approval required`,
    "success",
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
    ),
  );
  state.selectedId = decisionId;
  setNotice(
    `BRD v${state.brdVersion} approved. The remaining agents may continue.`,
  );
  addAudit(
    "Architect A. Sharma",
    `Approved SAF-BRD-001-v${state.brdVersion}`,
    "decision",
  );
  el("#decision-comment").value = "";
  render();
}

function completeRun() {
  if (state.gate !== "approved") {
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
  state.artifacts.push(
    artifact(
      "SAF-EPIC-001",
      "Backlog",
      "Governed BRD approval epic",
      "ready",
      "Product Owner",
      "One epic, three stories, and five linked criteria.",
      [brdId, "SAF-REQ-001"],
      [
        "STORY-001 - Create version-specific approval task",
        "STORY-002 - Capture authorized architect decision",
        "STORY-003 - Enforce downstream workflow block",
      ],
    ),
    artifact(
      "SAF-SPRINT-001",
      "Sprint proposal",
      "Prototype Sprint 01",
      "accepted",
      "Product Owner",
      "Three stories sized for one bounded vertical slice.",
      ["SAF-EPIC-001"],
      ["Capacity: 12 points", "Scope: 10 points", "Dependency: state model first"],
    ),
    artifact(
      "SAF-CHANGE-001",
      "Code change",
      "Approval gate vertical slice",
      "implemented",
      "Application Developer",
      "Adds approval state, authorization, version invalidation, and tests.",
      ["SAF-SPRINT-001", "SAF-EPIC-001"],
      ["Approval task model", "Approve and reject actions", "Version invalidation", "Workflow guard"],
    ),
    artifact(
      "SAF-GIT-001",
      "Git reference",
      "Pull request metadata",
      "prepared",
      "Platform Administrator",
      "Traceable branch, commit, and pull-request proposal.",
      ["SAF-CHANGE-001"],
      [
        "Branch: feature/SAF-REQ-001-brd-approval",
        "Commit: feat(approval): enforce BRD gate [SAF-REQ-001]",
        "PR: SAF-REQ-001 - Govern BRD approval",
      ],
    ),
    artifact(
      "SAF-REVIEW-001",
      "Review",
      "Independent technical review",
      "accepted",
      "Technical Reviewer",
      "No blocking findings; two advisory observations recorded.",
      ["SAF-CHANGE-001", "SAF-GIT-001"],
      ["Authorization path covered", "Old-version reuse prevented", "Production identity remains out of scope"],
    ),
    artifact(
      "SAF-TEST-001",
      "Test evidence",
      "Acceptance sanity suite",
      "passed",
      "QA Lead",
      "Five of five acceptance criteria passed.",
      ["SAF-REVIEW-001", brdId],
      [
        "AC-001 PASS - One task per version",
        "AC-002 PASS - Approval permits progression",
        "AC-003 PASS - Rejection returns to rework",
        "AC-004 PASS - Unauthorized user refused",
        "AC-005 PASS - New version requires approval",
      ],
    ),
    artifact(
      "SAF-QA-001",
      "QA handoff",
      "QA-ready evidence package",
      "accepted",
      "QA Lead",
      "Scope, code, review, tests, and limitations packaged.",
      ["SAF-TEST-001", "SAF-REVIEW-001", "SAF-GIT-001"],
      ["Build: prototype-001", "Email delivery simulated", "Enterprise identity not integrated", "Ready for demonstration"],
    ),
    artifact(
      "SAF-NODE-001",
      "Knowledge graph",
      "Completed requirement lineage",
      "complete",
      "Knowledge Curator",
      "All required nodes and relationships recorded with no orphans.",
      ["SAF-REQ-001", brdId, "SAF-EPIC-001", "SAF-CHANGE-001", "SAF-TEST-001", "SAF-QA-001"],
      ["12 governed artifacts", "18 validated relationships", "0 orphan required artifacts", "Lineage coverage: 100%"],
    ),
  );
  state.completed = 11;
  state.run = "complete";
  state.selectedId = "SAF-NODE-001";
  setNotice("Delivery complete. QA evidence and knowledge lineage are ready.");
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
