---
soterion:
  sigil: "SCROLL"
  glyph: "📜"
  code_point: "U+1F4DC"
  role: "arda-operating-surface-plan"
  owner: "PROMETHEUS"
  status: "first-pass-implemented"
  last_reviewed: "2026-06-02"
hermes:
  callable_ref: "arda-operating-surface-plan-2026-05-27"
  intent: "Review and coordinate ARDA HUD as the primary operating surface for the autonomous company."
  scope: "apps/arda-hud"
---

> 🜏 Soterion: 📜 arda-operating-surface-plan | owner: PROMETHEUS | status: first-pass-implemented | reviewed: 2026-06-02

# ARDA Operating Surface Plan — 2026-05-27

> Hermes callable reference: `arda-operating-surface-plan-2026-05-27`

## Purpose

ARDA HUD is the primary operating surface for Annunimas as an autonomous company with human augmentation when governance requires it.

ARDA must not be reduced to a dashboard for HADES, ATHENA, setup, or audit. Those systems are capability providers. ARDA must display all relevant and vital information across the company in a way that is clear, navigable, trustworthy, and capable of becoming the user-facing control layer for automation.

The target runtime direction remains:

- Tauri native application.
- Rust backend.
- Three.js / WebGPU visual layer where it materially improves orientation, system comprehension, or interaction.
- Human-usable UI first; CLI commands remain available but should not be the expected operating path for most users.

Runtime proof rule:

- Host Vite/browser is a layout and React iteration tool.
- Tauri dev with Vite hot reload is the practical interaction runtime while building.
- Tauri stable build is the final validation runtime.
- Browser behavior must not be treated as proof for filesystem IPC, WebKit layout, media/embed behavior, native windows, multi-monitor movement, or external service surfaces.

## Existing ARDA References To Preserve

This plan should be reviewed against the existing ARDA docs and contracts in `apps/arda-hud/`:

- `ARDA_PRD.md`
- `ARDA_IMPLEMENTATION_PLAN.md`
- `ARDA_UNIFIED_PATH_FORWARD_2026-05-22.md`
- `ARDA_DATA_SURFACE_MAP_2026-05-21.md`
- `ARDA_DATA_PROVENANCE_CONTRACT.md`
- `ARDA_WORLD_DISTRICT_CONTRACT.md`
- `ARDA_BOARDROOM_SLOT_ASSIGNMENT_CONTRACT.md`
- `HUD_EVENT_SCHEMA.md`
- `MYTHOS_SPEC.md`
- `RUNTIME.md`
- `README.md`

Removed/superseded references:

- `SYSTEM_SPECS.md` was retired on 2026-06-02. Use `RUNTIME.md` for current
  native Tauri/WebKit launch, packaging, and validation constraints.

This plan should also be reconciled with existing source surfaces:

- `src/components/arda/modules/ExecutiveOverviewModule.tsx`
- `src/components/arda/modules/BusinessModule.tsx`
- `src/components/arda/modules/SystemsModule.tsx`
- `src/components/arda/modules/HumanRealmModule.tsx`
- `src/components/arda/modules/SettingsModule.tsx`
- `src/components/arda/modules/HermesDashboardModule.tsx`
- `src/components/arda/modules/ArandurApprovalWorkstation.tsx`
- `src/components/arda/modules/ReviewGateWorkstation.tsx`
- `src/components/arda/modules/DataSourceDetailsPanel.tsx`
- `src/components/arda/modules/DataFreshnessBadge.tsx`
- `src/components/arda/modules/SourceCoverageBadge.tsx`
- `src/lib/ardaProvenance.ts`
- `src/lib/ardaSource.ts`
- `src/lib/automationStatus.ts`
- `src/lib/configWalkthrough.ts`
- `src/lib/dataProvider.ts`
- `src/lib/hudEventSchema.ts`
- `src/lib/surfaceAdapterManifests.ts`
- `src/lib/systemActionBus.ts`

## Product Principle

Organize ARDA around the questions the operator needs answered, not around internal crate names.

Internal systems such as HADES, ATHENA, CHRONOS, CHARON, HERMES, PROMETHEUS, GOVERNANCE, MNEMOSYNE, WARDEN, PLUTUS, and APOLLO should appear as owners, sources, executors, or evidence providers inside user-centered views.

Top-level ARDA navigation should avoid forcing users to know the backend topology. The operator should see concepts like:

- Now
- Work
- Decisions
- Knowledge
- Health
- Evidence
- Settings

Agent names remain available in drilldowns, provenance, ownership fields, logs, service details, and expert views.

## Core User Questions

ARDA should continuously answer:

1. What is the company doing right now?
2. What needs human attention?
3. What is healthy, degraded, blocked, or unknown?
4. What decisions are pending, and why did automation stop?
5. What work is queued, running, completed, or stale?
6. What has the system learned?
7. What automation exists, what runs on a schedule, and what can be manually called?
8. What evidence proves the displayed state is current and true?
9. Which files, scripts, jobs, or systems are active, duplicated, stale, or retired?

## Information Architecture

### 1. Now

The first screen should summarize the current operating state.

Required content:

- Company operating mode.
- Autonomy level.
- Critical alerts.
- Human attention queue.
- Active objectives.
- Running automations.
- Freshness and source state.
- Fast path into the most important blocked or risky item.

Candidate existing surfaces:

- `ExecutiveOverviewModule.tsx`
- `DataFreshnessBadge.tsx`
- `SourceCoverageBadge.tsx`
- `automationStatus.ts`
- `ardaProvenance.ts`

### 2. Work

The Work view should unify the daily queue, project queue, recurring operations, and agent execution lanes.

Required content:

- Daily work queue.
- Project work queue.
- Running jobs.
- Scheduled jobs.
- Blocked jobs.
- Completed work.
- Owner / executor / reviewer.
- Manual run controls for safe actions.
- Links to receipts and results.

Relevant systems:

- HADES for organization and maintenance.
- CHRONOS for schedules and recurring operations.
- APOLLO for workflow execution.
- PROMETHEUS for CEO/autopilot intent.
- FORGE-MIND for code/build work.
- GOVERNANCE for gates and approvals.

Important constraint:

Do not model systems as either only automated or only manual. Each recurring system should expose both scheduled execution and user-callable execution where policy allows.

### 3. Decisions

The Decisions view should be the human augmentation layer.

Required content:

- Pending approvals.
- Review gates.
- Risk level.
- Policy reason.
- Proposed action.
- Available choices.
- Consequences.
- Evidence.
- Who/what requested the decision.
- Whether the decision can be delegated in the future.

Candidate existing surfaces:

- `ArandurApprovalWorkstation.tsx`
- `ReviewGateWorkstation.tsx`
- `ARDA_BOARDROOM_SLOT_ASSIGNMENT_CONTRACT.md`
- `src/lib/boardroomSlotSettings.ts`
- `src/lib/systemActionBus.ts`

Relevant systems:

- GOVERNANCE
- COUNCIL
- PROMETHEUS
- ORACLE
- WARDEN

### 4. Knowledge

The Knowledge view should expose what the company knows, what changed, and what needs review.

Required content:

- ATHENA research and ingestion status.
- MNEMOSYNE memory continuity.
- Digests and summaries.
- Newly learned facts.
- Conflicting or low-confidence knowledge.
- Human notes requiring ingestion.
- Source freshness.
- Provenance and citations.

Candidate existing surfaces:

- `HumanRealmModule.tsx`
- `PersonalGrowthModule.tsx`
- `DataSourceDetailsPanel.tsx`
- `src/lib/ingest/`
- `src/lib/zvecSearch.ts`
- `src/lib/ardaProvenance.ts`

Relevant systems:

- ATHENA
- MNEMOSYNE
- HUMAN
- ORACLE

### 5. Health

The Health view should summarize infrastructure, runtime, services, providers, and communications.

Required content:

- Provider mesh health.
- Charon routing state.
- Hermes communication state.
- Systemd/user services.
- Local and remote service availability.
- Security/monitoring posture.
- Fleet/node status.
- Degraded dependencies.
- Last successful checks.

Candidate existing surfaces:

- `SystemsModule.tsx`
- `HermesDashboardModule.tsx`
- `ServiceEmbedModule.tsx`
- `src/lib/hermesDashboardLauncher.ts`
- `src/lib/surfaceAdapterManifests.ts`

Relevant systems:

- CHARON
- HERMES
- WARDEN
- FLEET
- SERVICE-REGISTRY
- SIGNAL-GRID
- MCP
- SYSTEMD

### 6. Business

The Business view should present the company-level work and outcomes.

Required content:

- Active projects.
- Product/service objectives.
- Revenue/economics if configured.
- JouleWork accounting.
- Risks and opportunities.
- External commitments.
- Customer/user-facing readiness.

Candidate existing surfaces:

- `BusinessModule.tsx`
- `src/lib/serviceLibraryBooks.ts`

Relevant systems:

- PLUTUS
- PROMETHEUS
- APOLLO
- GOVERNANCE
- HUMAN

### 7. Evidence

The Evidence view should make ARDA trustworthy.

Required content:

- Data source map.
- Audit reports.
- Receipts.
- Runtime snapshots.
- Freshness indicators.
- Provenance trace for claims.
- Known gaps.
- Last validation status.

Candidate existing surfaces:

- `ARDA_DATA_SURFACE_MAP_2026-05-21.md`
- `ARDA_DATA_PROVENANCE_CONTRACT.md`
- `DataSourceDetailsPanel.tsx`
- `DataFreshnessBadge.tsx`
- `SourceCoverageBadge.tsx`
- `src/lib/ardaProvenance.ts`
- `src/lib/ardaSource.ts`

Relevant systems:

- HADES
- WARDEN
- CHRONOS
- GOVERNANCE
- ORACLE

### 8. Settings And Onboarding

Settings should include current configuration, but onboarding should become a guided first-run setup surface rather than a CLI checklist.

Required content:

- Environment connection walkthrough.
- Provider/API key setup.
- Local service checks.
- Governance defaults.
- Autonomy level selection.
- Human approval preferences.
- Runtime validation.
- Install repair actions.
- Exportable setup status.

Candidate existing surfaces:

- `SettingsModule.tsx`
- `src/lib/configWalkthrough.ts`
- `src/lib/ardaHudSettings.ts`
- `src/lib/tauriGuard.ts`
- `src/lib/boardroomSlotSettings.ts`
- `ARDA_BOARDROOM_SLOT_ASSIGNMENT_CONTRACT.md`

Relevant systems:

- CLI
- CHARON
- HERMES
- GOVERNANCE
- SERVICE-REGISTRY
- SYSTEMD

## Automation Interaction Model

Every callable capability should eventually expose the same user-facing contract:

- Name.
- Purpose.
- Owner system.
- Executor.
- Schedule state.
- Last run.
- Next run.
- Current status.
- Required permissions.
- Governance gate.
- Manual run availability.
- Dry-run availability.
- Result path.
- Receipt path.
- Failure reason.
- Related evidence.

This makes HADES, ATHENA, CHRONOS, audit, setup, provider checks, queue cleanup, knowledge ingestion, and future systems visible through one consistent surface.

## Stale And Duplicate System Inventory

ARDA should eventually include a capability inventory view so the operator does not have to manually remember which random files, scripts, jobs, and folders still matter.

Required content:

- Known scripts.
- Known systemd services.
- Known CLI commands.
- Known recurring jobs.
- Known audit/check commands.
- Known generated outputs.
- Owning system.
- Last observed use.
- Replacement if deprecated.
- Safe-to-archive status.
- Confidence level.

This should be powered by structured manifests and runtime observations rather than hand-maintained memory.

## Visual And UX Direction

The current priority is display quality and navigability.

Design requirements:

- Dense but calm operating UI.
- Strong visual hierarchy.
- No marketing-style landing page inside the operational HUD.
- No giant decorative cards that hide actual state.
- Important state visible on first screen.
- Clear distinction between healthy, degraded, blocked, stale, unknown, and requires-human.
- Every critical claim should show source/freshness/provenance.
- Use icons for tools and repeated controls.
- Keep text compact and readable.
- Avoid nesting cards inside cards.
- Avoid making backend agent names the primary navigation.
- Three.js/WebGPU should clarify system shape, flow, topology, or attention, not decorate empty space.

## Boardroom Surface Model

The boardroom surface model is now a first-class operating-surface concern.
Each visible monitor/desk slot should have:

- Stable physical slot id.
- Operator-facing role/title.
- Source zone.
- Component/workstation id.
- `adapter_type`.
- Lightweight preview contract.
- Focused view contract.
- Embed policy.
- Refresh cadence.

The efficient interaction pattern is:

1. Boardroom screen shows a lightweight sci-fi preview: component grid, status widgets, metric strips, particle/stream visualizations, media thumbnails, or agent comms summaries.
2. Clicking/focusing opens the heavier surface: in-scene workstation, native Tauri window, external browser, local service dashboard, media viewer, or future remote desktop stream.
3. Heavy surfaces such as Grafana, Open WebUI, noVNC/WebRTC VM streams, PDFs, video, and tool UIs should not all run full-rate inside the Three.js boardroom scene.

Current surface contract:

- Authority: `core/state/arda_boardroom_slots.json`
- Parser/defaults: `src/lib/boardroomSlotSettings.ts`
- Settings display: `SettingsModule.tsx`
- Contract doc: `ARDA_BOARDROOM_SLOT_ASSIGNMENT_CONTRACT.md`

Current default adapter types:

- External service slots use `external_url` with `service_status` previews.
- Annunimas native workstations use `component_grid` previews and native or in-scene focus modes.
- Hermes uses `service_embed` with a terminal/feed preview and native focused dashboard.

Near-term surface targets:

- Beelink Grafana as a configured local service surface.
- Beelink Open WebUI as a configured local service surface.
- Markdown/PDF/image/video/media viewer surfaces.
- Streaming text and agent communication surfaces.
- Remote desktop/tool-stream surfaces for observing agent work in VM/tool contexts such as Blender or ComfyUI.

## First Implementation Pass

1. Inventory existing ARDA modules and map each module to the information architecture in this plan.
2. Identify duplicate, stale, or confusing UI surfaces.
3. Redesign the top-level navigation around `Now`, `Work`, `Decisions`, `Knowledge`, `Health`, `Business`, `Evidence`, and `Settings`.
4. Preserve existing data contracts where possible.
5. Make the first screen answer current state, human attention, active work, and system health.
6. Add consistent status/freshness/provenance treatment across modules.
7. Add an action/capability model that can represent both scheduled automation and user-triggered execution.
8. Validate in native Tauri, not only host Vite.

## Review Checklist

- [x] Does this plan preserve the existing ARDA PRD and contracts?
  - Evidence: first pass reuses the existing `ModuleId` union and module registry contracts instead of introducing new backend-facing module ids.
- [x] Does the navigation make sense to a non-CLI user?
  - Evidence: the top operating rail now uses `Now`, `Work`, `Decisions`, `Knowledge`, `Health`, `Business`, `Evidence`, and `Settings` labels while preserving underlying panel/module mappings.
- [x] Can a user understand what the company is doing without knowing crate names?
  - Evidence: `OperatingSurfacePlanModule.tsx` now starts with Current state, Human attention, Active work, and System health summaries derived from lane reports.
- [x] Can a user find what requires human action within seconds?
  - Evidence: the `Decisions` lane routes to existing governance controls and the first-screen Human attention card reflects the Decisions lane status.
- [x] Can every automation expose scheduled and manual execution state?
  - Evidence: next slice adds descriptor-backed capability status records in `systemActionBus.ts` with name, purpose, owner, executor, schedule state, last run, next run, current status, permissions, governance gate, manual/dry-run availability, result path, receipt path, failure reason, and related evidence. Last-run/failure state is persisted in the HUD profile execution ledger when actions execute.
- [x] Can every important claim be traced to a source?
  - Evidence: the operating surface card keeps `SourceCoverageBadge` and source-map provenance tags; Evidence lane routes to operating surface, systems, and human realm contract surfaces.
- [x] Does the design support both simple operators and deep technical drilldown?
  - Evidence: top-level labels are operator-centered, while deep drilldowns still land on existing modules such as systems, governance controls, planning, business, and settings.
- [x] Does ARDA remain broad enough to represent the whole company, not only HADES/ATHENA/setup/audit?
  - Evidence: lanes cover company state, work, governance, knowledge, health, business, evidence, and settings without renaming or removing existing provider modules.

## First-Pass Implementation Evidence — 2026-05-27

Changed paths:

- `src/App.tsx`
  - Adds the operator-centered lane model and rail labels for `Now`, `Work`, `Decisions`, `Knowledge`, `Health`, `Business`, `Evidence`, and `Settings`.
  - Maps those labels onto existing `ModuleId` values to preserve data contracts and stored panel layouts.
  - Keeps agent/system names as source, owner, evidence, and drilldown details instead of top-level navigation concepts.
- `src/components/arda/modules/OperatingSurfacePlanModule.tsx`
  - Adds a first-screen command summary for current state, human attention, active work, and system health.
  - Adds capability/action counts for scheduled, manual, and governed actions from `systemActionBus` descriptors.
  - Renders the normalized capability execution contract for callable actions so scheduled and manual capabilities use one operator-facing status shape.
- `src/lib/systemActionBus.ts`
  - Adds `SystemActionCapabilityStatus`, schedule/current-status unions, descriptor fields for next run/governance/evidence/receipt paths, and local profile persistence for action execution outcomes.
- `src/lib/systemActionBus.test.ts`
  - Verifies every descriptor exposes the durable capability fields and that governed mutations are blocked behind human review by default.
- `src/index.css`
  - Adds styling for the operating surface rail, first-screen summary, and capability contract grid without replacing existing module styling.

Validation evidence:

- `npm run build` from `apps/arda-hud`: passed; TypeScript and Vite production build completed.
- `npm test -- --run` from `apps/arda-hud`: passed; 28 test files / 96 tests.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:build:stable'`: passed; native Tauri release binary built at `/var/home/mythos/Annunimas/.target-local/cargo-target/release/arda_hud`.
- `scripts/launch_arda_hud.sh` from repo root: passed as a native smoke launch; Hermes background process remained alive for 8s and was then killed intentionally after confirming the release path started.
- `git diff --check`: passed with no whitespace errors.
- JSON/JSONL parser check: passed for `core/projects/tasks/queue.jsonl`, `core/state/knowledge_triage_registry.jsonl`, `core/state/arda_source_map.json`, and `core/state/soterion_render_contract.json`.

## Follow-Up Implementation Evidence — 2026-05-27

Changed paths:

- `src/components/arda/modules/OperatingSurfacePlanModule.tsx`
  - Adds optional `LiveRuntimeChannelEvidence` so the operating surface can show a live HUD event-channel pulse while explicitly preserving the durable `ArdaBundle` projection path as separate evidence.
  - Adds a compact Lane Provenance Matrix that rolls up each lane's status, evidence-link count, next action, and source-map coverage status for the Knowledge and Evidence gaps called out above.
- `src/components/arda/modules/OperatingSurfacePlanModule.test.tsx`
  - Adds component coverage for live runtime channel evidence without replacing durable projection evidence.
  - Adds component coverage for Knowledge/Evidence lane provenance counts and source coverage labeling.
- Cleanup pass:
  - Removed the redundant status-label helper from `OperatingSurfacePlanModule.tsx`; lane statuses now render directly from the typed `OperatingSurfaceLaneReport['status']` union.
  - Kept the existing module IDs and durable projection contract intact; no archive/delete candidate was safe to remove inside this slice beyond the redundant helper.
  - Recorded `tsk_20260527_arda_operating_surface_cleanup_pass` as completed in `core/projects/tasks/queue.jsonl`.

Validation evidence:

- `npm test -- OperatingSurfacePlanModule.test.tsx` from `apps/arda-hud`: passed; 1 test file / 2 tests. Re-run after cleanup pass: passed; 1 test file / 2 tests.
- `npm test -- --run` from `apps/arda-hud`: passed; 29 test files / 98 tests.
- `npm run build` from `apps/arda-hud`: passed; TypeScript and Vite production build completed.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:build:stable'`: passed; native Tauri release binary built at `/var/home/mythos/Annunimas/.target-local/cargo-target/release/arda_hud`.
- Native smoke command with stable WebKit/X11 environment stayed alive until the intentional 8s timeout: `timeout 8s env __NV_DISABLE_EXPLICIT_SYNC=1 WEBKIT_DISABLE_DMABUF_RENDERER=1 WEBKIT_DISABLE_COMPOSITING_MODE=1 LIBGL_ALWAYS_SOFTWARE=1 LIBGL_DRI3_DISABLE=1 MESA_LOADER_DRIVER_OVERRIDE=llvmpipe GSK_RENDERER=cairo GDK_BACKEND=x11 /var/home/mythos/Annunimas/.target-local/cargo-target/release/arda_hud` returned `ARDA_EXIT:124`.
- `git diff --check`: passed with no whitespace errors. Re-run after cleanup pass: passed with no whitespace errors.
- JSON/JSONL parser check: passed for `core/projects/tasks/queue.jsonl`, `core/state/knowledge_triage_registry.jsonl`, `core/state/arda_source_map.json`, and `core/state/soterion_render_contract.json`. Re-run after cleanup pass: passed for the same files.

Drift classification:

- Intentional implementation drift: `src/App.tsx`, `src/components/arda/index.ts`, `src/components/arda/modules/OperatingSurfacePlanModule.tsx`, and `src/components/arda/modules/OperatingSurfacePlanModule.test.tsx` carry the operating-surface live-runtime/provenance work and the redundant-helper cleanup.
- Intentional ledger/doc drift: this plan file, `ARDA_UNIFIED_PATH_FORWARD_2026-05-22.md`, and `core/projects/tasks/queue.jsonl` record the completed slices and validation evidence.
- Generated projection drift: `core/state/arda_source_map.json` is timestamp-only; `core/state/soterion_render_contract.json` was regenerated and is parser-valid, with timestamp plus current glyph-state deltas for CHARON/HERMES.
- ATHENA intake drift: `core/state/knowledge_triage_registry.jsonl` has appended parser-valid triage rows from the approved dirty surface; no schema break observed.

## Boardroom Layout Promotion Evidence — 2026-05-27

Changed paths:

- `src/scene/boardroom/boardroomSpatialLayout.ts`
  - The accepted edit-mode boardroom zone positions are already promoted in the canonical spatial contract without schema churn: zone IDs, `BoardroomSpatialZone`, preview modes, bindings, assignment slot IDs, and override serializer helpers remain unchanged.
  - Promoted monitor placement uses the accepted cockpit arc: `boardroom.monitor.left` `[-3.35, 2.48, -2.7]`, `boardroom.monitor.center_left` `[-1.16, 2.68, -3.06]`, `boardroom.monitor.center_right` `[1.16, 2.68, -3.06]`, and `boardroom.monitor.right` `[3.35, 2.48, -2.7]`.
  - Promoted lower desk placement wraps the operator chair: `boardroom.lower.left_wrap` `[-3.28, 0.62, 2.02]`, `boardroom.lower.left_inner` `[-1.58, 0.6, 1.48]`, `boardroom.lower.right_inner` `[1.58, 0.6, 1.48]`, and `boardroom.lower.right_wrap` `[3.28, 0.62, 2.02]`.

Validation evidence:

- `npm test -- boardroomSpatialLayout.test.ts` from `apps/arda-hud`: passed; 1 test file / 6 tests.
- `npm run build` from `apps/arda-hud`: passed; TypeScript and Vite production build completed.

Drift classification:

- Boardroom layout promotion drift: no additional source diff was required in this pass because `boardroomSpatialLayout.ts` already contains the accepted edit-mode positions and the schema-preserving contract.
- Existing operating-surface implementation/doc/ledger drift remains intentional from the active plan execution slice.
- Generated projection/runtime drift remains separate from boardroom layout promotion and should not be treated as a boardroom schema blocker.

## Capability Descriptor Expansion Evidence — 2026-05-27

Changed paths:

- `src/lib/systemActionBus.ts`
  - Expands the capability descriptor catalog beyond the first registered actions to cover CHRONOS provider checks, CHARON provider intelligence refresh, queue cleanup/pivot capture, HADES nightly/link/organization receipts, ATHENA knowledge ingestion/digest/policy-review flows, audit/repeated-audit jobs, and setup readiness/repair flows.
  - Adds `SystemActionRuntimeReceipts` plus runtime receipt projection helpers so backend files can feed the same `SystemActionCapabilityStatus` shape used by local HUD action execution outcomes.
  - Preserves governed mutations as blocked-by-default capability statuses while read-only and dry-run receipt-backed actions can show succeeded/failed/running state from observed runtime artifacts.
- `src/lib/ardaSource.ts`
  - Adds ARDA bundle fields for `chronosRuntime`, `providerIntelligence`, and `athenaRuntime`, preserving existing projection loading while making those backend receipts available to the operating surface.
- `src/App.tsx`
  - Passes `chronosRuntime`, `providerIntelligence`, `queueSummary`, `setupConsoleReadiness`, `hadesNightlyOperations`, `athenaRuntime`, and `knowledgeTriage` into `getSystemActionCapabilityStatuses`.
- `src/lib/systemActionBus.test.ts`
  - Verifies descriptor coverage includes CHRONOS/provider checks, queue cleanup, knowledge ingestion, setup repair, and repeated audit capabilities.
  - Verifies backend runtime receipts project into the same capability status contract, including last-run timestamps, status, receipt path, and failure reason.

Validation evidence:

- `npm test -- --run src/lib/systemActionBus.test.ts src/components/arda/modules/OperatingSurfacePlanModule.test.tsx` from `apps/arda-hud`: passed; 2 test files / 4 tests.
- `npm run build` from `apps/arda-hud`: passed; TypeScript and Vite production build completed.
- Parser/diff check: passed for `core/projects/tasks/queue.jsonl`, `core/state/knowledge_triage_registry.jsonl`, `core/state/arda_source_map.json`, `core/state/soterion_render_contract.json`, `core/state/chronos_runtime.json`, `core/state/provider_intelligence.json`, `core/state/hades_nightly_operations.json`, and `core/state/setup_console_readiness.json`; `git diff --check` passed.

Drift classification:

- Capability descriptor drift: `src/lib/systemActionBus.ts`, `src/lib/systemActionBus.test.ts`, `src/lib/ardaSource.ts`, and `src/App.tsx` are intentional ARDA operating-surface implementation drift for expanded callable/schedulable/governed capability coverage.
- Existing generated/runtime drift remains intentional and parser-valid: `core/state/arda_source_map.json`, `core/state/soterion_render_contract.json`, and `core/state/knowledge_triage_registry.jsonl` were not treated as blockers for this slice.
- Non-ARDA flywheel/contract source drift remains outside this slice and was preserved without mutation.

Remaining gaps:

- Knowledge and Evidence lanes now have a compact provenance rollup in the operating surface; dedicated knowledge/evidence modules can still be split later without changing the top-level IA.
- Interactive host visual QA for rail readability, keyboard focus behavior, pulse readability, and scene overlap is now complete; hands-on native Tauri/WebKit interaction beyond smoke launch remains a future operator-facing check.

## Capability Contract Render Completion Evidence — 2026-05-27

Changed paths:

- `src/components/arda/modules/OperatingSurfacePlanModule.tsx`
  - Removes the temporary first-seven capability truncation from the operator-facing execution contract so expanded CHRONOS/provider/queue/knowledge/setup/audit capability descriptors are all visible in ARDA.
  - Adds a compact capability contract header with total, succeeded, and governed/blocked counts derived from the same `SystemActionCapabilityStatus` records used for backend runtime receipts.
- `src/components/arda/modules/OperatingSurfacePlanModule.test.tsx`
  - Adds regression coverage proving the operating surface renders the full callable capability contract, including CHRONOS provider checks, setup repair, and policy-ready knowledge promotion descriptors.

Validation evidence:

- `npm test -- --run src/lib/systemActionBus.test.ts src/components/arda/modules/OperatingSurfacePlanModule.test.tsx` from `apps/arda-hud`: passed; 2 test files / 5 tests.
- `npm run build` from `apps/arda-hud`: passed; TypeScript and Vite production build completed.
- `git diff --check` from repo root: passed with no whitespace errors.

Drift classification:

- Capability contract render drift: `OperatingSurfacePlanModule.tsx` and `OperatingSurfacePlanModule.test.tsx` intentionally complete the UI side of the descriptor expansion by making the expanded status list visible instead of only present in data.
- Existing capability descriptor, runtime receipt, generated projection, and knowledge triage drift remains intentional from prior ARDA operating-surface slices.

## Interactive Visual QA Evidence — 2026-05-27

Changed paths:

- `src/index.css`
  - Raises the operating surface rail above the Three.js scene with a high overlay z-index and stronger translucent backing so the rail remains readable over active scene content.
  - Strengthens the rail border, backdrop blur, and shadow separation so the bottom operating surface reads as an intentional control layer rather than scene overlap.
  - Restores a visible keyboard focus treatment for rail lanes with an explicit outline, outline offset, glow, and box shadow instead of suppressing outlines on focused controls.

Validation evidence:

- Live dev server visual QA at `http://127.0.0.1:1420/?__view=boardroom`: passed after CSS adjustment.
  - Rail separation: bottom rail is visibly separated from the starfield/scene by a rounded dark panel, cyan border, and stronger shadow/backdrop.
  - Focus behavior: keyboard `Tab` focus on the `NOW` rail button exposes a visible `2px` outline with `3px` offset plus cyan focus glow; DOM check confirmed `document.activeElement` was the rail button with `aria-label="Open Now: mode, attention, active work. Status partial."`.
  - Live runtime pulse display: `PULSE: IDLE` remains readable in the compact rail status row while the core-state bundle is loading.
  - Scene overlap/clipping: no severe overlap or clipping remains; rail items fit inside the panel, focused outline is not cut off, and only intentional text ellipses remain for compact lane descriptions.
  - Browser console showed only the expected Tauri-global fallback warnings while running in host Vite (`window.__TAURI__`/`window.__TAURI_INTERNALS__` unavailable), not a HUD runtime crash.
- Native Tauri/WebKit validation:
  - `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:build:stable'`: passed; native release binary built at `/var/home/mythos/Annunimas/.target-local/cargo-target/release/arda_hud`.
  - Stable WebKit/X11 smoke command stayed alive until intentional timeout: `timeout 8s env __NV_DISABLE_EXPLICIT_SYNC=1 WEBKIT_DISABLE_DMABUF_RENDERER=1 WEBKIT_DISABLE_COMPOSITING_MODE=1 LIBGL_ALWAYS_SOFTWARE=1 LIBGL_DRI3_DISABLE=1 MESA_LOADER_DRIVER_OVERRIDE=llvmpipe GSK_RENDERER=cairo GDK_BACKEND=x11 /var/home/mythos/Annunimas/.target-local/cargo-target/release/arda_hud` returned `ARDA_EXIT:124` with an empty stderr/stdout log at `/tmp/arda_hud_native_smoke_20260527.log`.
  - Native WebKit AT-SPI interaction pass against the live `/var/home/mythos/.cache/annunimas-build/target/release/arda_hud` process passed; evidence log: `/tmp/arda_native_atspi_qa_2026-05-27_v2.log`.
    - Rail click/focus behavior: AT-SPI `GrabFocus` and `DoAction(0)` returned `b true` for `Knowledge`, `Health`, `Evidence`, `Settings`, `Now`, `Work`, and `Decisions` rail lanes.
    - Live runtime/readability sample: post-click accessibility snapshots exposed lane-specific headings/details such as `Knowledge And Reasoning`, `Fleet Systems Health`, source-trust/provenance text, capability/provider entries, and the compact rail descriptions.
    - Scene overlap check: final rail extents for all eight lanes were inside the native frame and pairwise non-overlapping; every `OVERLAP_CHECK` in the log reports `inside_frame=true` and `overlaps=[]`.
    - Screenshot capture through GNOME Shell D-Bus was denied by session policy (`org.freedesktop.DBus.Error.AccessDenied: Screenshot is not allowed`), so native evidence is captured through AT-SPI process/accessibility logs rather than a PNG artifact.

Drift classification:

- Visual QA drift: `src/index.css` is intentional ARDA readability/focus/surface-separation work from interactive browser QA.
- Native validation drift: no native source change was required; the new release binary path is build output only and remains outside git tracking.
- UX gap disposition: native Tauri/WebKit interaction beyond smoke launch is now exercised through AT-SPI for click/focus, pulse/readability sampling, and scene-overlap geometry. A human subjective visual pass remains useful before release, but the previous implementation gap is no longer open as an engineering blocker.

## Capability Descriptor Closeout Verification — 2026-05-27

Closeout evidence:

- `npm test -- --run src/lib/systemActionBus.test.ts src/components/arda/modules/OperatingSurfacePlanModule.test.tsx --reporter=verbose` from `apps/arda-hud`: passed; 2 test files / 5 tests.
- `npm run build` from `apps/arda-hud`: passed; TypeScript and Vite production build completed.
- Parser check passed for `core/projects/tasks/queue.jsonl`, `core/state/knowledge_triage_registry.jsonl`, `core/state/arda_source_map.json`, `core/state/soterion_render_contract.json`, `core/state/chronos_runtime.json`, `core/state/provider_intelligence.json`, `core/state/hades_nightly_operations.json`, and `core/state/setup_console_readiness.json`.
- `git diff --check` from repo root: passed with no whitespace errors.

Impact:

- ARDA now exposes CHRONOS/provider checks, queue cleanup, knowledge ingestion/digest/policy review, setup readiness/repair, HADES maintenance, and recurring audit/maintenance jobs as governed callable capability descriptors instead of invisible backend-only routines.
- Backend receipt surfaces now project into the shared `SystemActionCapabilityStatus` model, so scheduled/dry-run/read-only capabilities can show last-run state, receipt paths, timestamps, and failure reasons in the same contract used by local HUD action execution.
- The operating surface renders the full capability contract rather than truncating it, preserving visibility for governed/blocked actions while keeping unsafe mutations behind human review.

What is next:

- Best next autonomous slice is to wire one expanded descriptor family end-to-end into an operator action path: choose a safe read-only/dry-run capability such as CHRONOS/provider checks or setup readiness, add its native backend command invocation, receipt writing, HUD refresh, and governed disabled-state handling, then validate in native Tauri/WebKit.

## Setup Readiness Operator Action Closeout — 2026-05-28

Closeout evidence:

- `npm test -- src/lib/systemActionBus.test.ts` from `apps/arda-hud`: passed; 1 file / 4 tests.
- `npm test` from `apps/arda-hud`: passed; 29 files / 102 tests.
- `npm run build` from `apps/arda-hud`: passed; TypeScript and Vite production build completed.
- Host `cargo check --manifest-path src-tauri/Cargo.toml` exposed a host prerequisite gap (`gdk-pixbuf-2.0.pc` and `gdk-3.0.pc` missing), so native compile validation was rerun through the established ARDA runtime container.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:build:stable'`: passed; native release binary built at `/var/home/mythos/Annunimas/.target-local/cargo-target/release/arda_hud`.
- `git diff --check` from repo root: passed with no whitespace errors.
- Parser check passed for `core/projects/tasks/queue.jsonl`, `core/state/knowledge_triage_registry.jsonl`, `core/state/arda_source_map.json`, `core/state/soterion_render_contract.json`, `core/state/chronos_runtime.json`, `core/state/provider_intelligence.json`, `core/state/hades_nightly_operations.json`, and `core/state/setup_console_readiness.json`.

Impact:

- `setup.run_readiness_check` now has a local Tauri CLI execution path behind the `local_cli` adapter preset.
- The native command runs `scripts/audit/setup_console_audit.py` from the Annunimas root, refreshes `core/state/setup_console_readiness.json`, and returns receipt/result paths plus the generated timestamp for HUD status projection.
- The HUD execution ledger now preserves `generatedAt`, `resultPath`, and `receiptPath`, so setup readiness appears as a receipt-backed callable capability after operator execution.
- `setup.run_repair_flow` remains explicitly blocked as a governed mutation until an operator-approval path is wired.

Drift classification:

- Intentional ARDA HUD implementation drift: `src/lib/systemActionBus.ts`, `src/lib/systemActionBus.test.ts`, and `src-tauri/src/lib.rs`.
- Intentional plan/ledger drift: this plan file and `core/projects/tasks/queue.jsonl` record setup readiness closeout evidence.
- Generated/runtime projection drift remains parser-valid and preserved; unrelated CITADEL/Flywheel drift in the working tree was not modified by this setup-readiness slice.

What is next:

- Setup readiness is closed. The next autonomous ARDA HUD capability slice should wire `chronos.run_provider_checks` end-to-end as a read-only operator action: native command, bounded receipt/result projection, HUD refresh, tests, native build, and queue/plan evidence.

## CHRONOS Provider Checks Operator Action Closeout — 2026-05-28

Closeout evidence:

- `cargo run -p annunimas-chronos` from repo root: passed; refreshed `core/state/chronos_runtime.json` through the CHRONOS runtime projection path.
- `npm test -- src/lib/systemActionBus.test.ts` from `apps/arda-hud`: passed; 1 file / 5 tests.
- `npm test` from `apps/arda-hud`: passed; 29 files / 103 tests.
- `npm run build` from `apps/arda-hud`: passed; TypeScript and Vite production build completed.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:build:stable'`: passed; native release binary built at `/var/home/mythos/Annunimas/.target-local/cargo-target/release/arda_hud`.
- `git diff --check` from repo root: passed with no whitespace errors.
- Parser check passed for `core/projects/tasks/queue.jsonl`, `core/state/knowledge_triage_registry.jsonl`, `core/state/arda_source_map.json`, `core/state/soterion_render_contract.json`, `core/state/chronos_runtime.json`, `core/state/provider_intelligence.json`, `core/state/hades_nightly_operations.json`, and `core/state/setup_console_readiness.json`.

Impact:

- `chronos.run_provider_checks` now has a local Tauri CLI execution path behind the `local_cli` adapter preset.
- The native command runs `cargo run -p annunimas-chronos` from the Annunimas root with `ANNUNIMAS_ROOT` set, bounded by a 45-second timeout.
- The HUD execution ledger now preserves `generatedAt`, `resultPath`, and `receiptPath` for `core/state/chronos_runtime.json`, so CHRONOS provider checks appear as a receipt-backed callable read-only capability after operator execution.
- The local CLI adapter now shares one result contract for CHRONOS/provider and setup readiness actions, while setup repair remains governed/blocked.

Drift classification:

- Intentional ARDA HUD implementation drift: `src/lib/systemActionBus.ts`, `src/lib/systemActionBus.test.ts`, and `src-tauri/src/lib.rs`.
- Intentional runtime projection drift: `core/state/chronos_runtime.json` refreshed by `annunimas-chronos`.
- Intentional plan/ledger drift: this plan file and `core/projects/tasks/queue.jsonl` record CHRONOS provider-check closeout evidence.

What is next:

- The next autonomous ARDA HUD capability slice should wire queue cleanup or knowledge ingestion as a governed/dry-run operator action with bounded backend execution, receipt projection, HUD refresh, tests, native build, parser checks, and queue/plan evidence.

## Queue Cleanup Preview Operator Action Closeout — 2026-05-28

Closeout evidence:

- `cargo run -p annunimas-cli -- export autonomy-resume` from repo root: passed; refreshed `core/state/autonomy_resume.json` and `core/state/queue_summary.json` through the read-only export path.
- `core/state/queue_summary.json` generated at `2026-05-28T14:53:40.592509417+00:00` with queue counts `blocked=1`, `cancelled=1`, and `completed=410`; no queued tasks were reported by the projection.
- `npm test -- src/lib/systemActionBus.test.ts` from `apps/arda-hud`: passed; 1 file / 6 tests.
- `npm run build` from `apps/arda-hud`: passed; TypeScript and Vite production build completed.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:build:stable'`: passed; native release binary built at `/var/home/mythos/Annunimas/.target-local/cargo-target/release/arda_hud`.
- `git diff --check` from repo root: passed with no whitespace errors.
- Parser check passed for `core/projects/tasks/queue.jsonl`, `core/state/knowledge_triage_registry.jsonl`, `core/state/arda_source_map.json`, `core/state/soterion_render_contract.json`, `core/state/chronos_runtime.json`, `core/state/provider_intelligence.json`, `core/state/hades_nightly_operations.json`, `core/state/setup_console_readiness.json`, `core/state/queue_summary.json`, and `core/state/autonomy_resume.json`.

Impact:

- `queue.preview_cleanup` now has a local Tauri CLI execution path behind the `local_cli` adapter preset.
- The native command runs `cargo run -p annunimas-cli -- export autonomy-resume` from the Annunimas root with `ANNUNIMAS_ROOT` set, bounded by a 45-second timeout.
- The HUD execution ledger now preserves `generatedAt`, `resultPath`, and `receiptPath` for `core/state/queue_summary.json`, so queue cleanup appears as a dry-run, receipt-backed callable capability after operator execution.
- Queue mutation remains separated from preview: `queue.capture_pivot` remains governed, while the preview path only refreshes read-only summary/resume projections.

Drift classification:

- Intentional ARDA HUD implementation drift: `src/lib/systemActionBus.ts`, `src/lib/systemActionBus.test.ts`, and `src-tauri/src/lib.rs`.
- Intentional runtime projection drift: `core/state/queue_summary.json` and `core/state/autonomy_resume.json` refreshed by `annunimas-cli export autonomy-resume`.
- Intentional plan/ledger drift: this plan file and `core/projects/tasks/queue.jsonl` record queue cleanup preview closeout evidence.

What is next:

- The next autonomous ARDA HUD capability slice should wire knowledge ingestion/digest or HADES recurring maintenance as the next governed/dry-run operator action with bounded backend execution, receipt projection, HUD refresh, tests, native build, parser checks, and queue/plan evidence.

## HADES Recurring Maintenance Operator Action Closeout — 2026-05-28

Closeout evidence:

- `python3 scripts/hades_nightly_operations.py --root /var/home/mythos/Annunimas` from repo root: passed; refreshed `core/state/hades_nightly_operations.json` with `status=pass` and generated timestamp `2026-05-28T15:34:35Z`.
- HADES receipt artifacts now include `audit/hades-nightly-runs/2026-05-28/hades-nightly-20260528T153428Z/organization/organization_plan_last.json`, `audit/hades-nightly-runs/2026-05-28/hades-nightly-20260528T153428Z/organization/organization_audit_last.json`, `audit/repeated-audit-runs/2026-05-28/repeated-audit-20260528T153428Z/summary.json`, `audit/setup-console-runs/2026-05-28/setup-console-20260528T153428Z/setup_console_readiness_receipt.json`, and `audit/system-audit-runs/2026-05-28/system-audit-20260528T153428Z/summary.json`.
- `npm run test -- src/lib/systemActionBus.test.ts -t "HADES recurring maintenance"` from `apps/arda-hud`: passed.
- `npm run test -- src/lib/systemActionBus.test.ts` from `apps/arda-hud`: passed; 1 test file / 9 tests.
- `npm test` from `apps/arda-hud`: passed; 29 test files / 107 tests.
- `npm run build` from `apps/arda-hud`: passed; TypeScript and Vite production build completed.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:build:stable'`: passed; native release binary built at `/var/home/mythos/Annunimas/.target-local/cargo-target/release/arda_hud`.
- `git diff --check` from repo root: passed with no whitespace errors.
- Parser check passed for `core/projects/tasks/queue.jsonl`, `core/state/knowledge_triage_registry.jsonl`, `core/state/arda_source_map.json`, `core/state/soterion_render_contract.json`, `core/state/chronos_runtime.json`, `core/state/provider_intelligence.json`, `core/state/hades_nightly_operations.json`, `core/state/setup_console_readiness.json`, `core/state/queue_summary.json`, and `core/state/autonomy_resume.json`.
- Queue evidence: `tsk_20260528_arda_hud_hades_recurring_maintenance_local_cli_c` appended to `core/projects/tasks/queue.jsonl` as completed.

Impact:

- `hades.run_nightly` now has a local Tauri CLI execution path behind the `local_cli` adapter preset.
- The frontend adapter maps `hades.run_nightly` to `run_hades_recurring_maintenance`, persists `generatedAt`, `receiptPath`, and `resultPath` into the HUD execution ledger, and projects successful runs back into `SystemActionCapabilityStatus`.
- The native Tauri command runs `python3 scripts/hades_nightly_operations.py --root <annunimas_root>` from the Annunimas root with a bounded 120-second timeout, reads `core/state/hades_nightly_operations.json`, and returns the HADES organization-plan artifact as the result path.
- HADES recurring maintenance remains an audit/receipt-only no-delete operation through `mutation_policy=audit_receipts_only_no_source_config_service_or_queue_mutation` in the refreshed receipt.

Drift classification:

- Intentional ARDA HUD implementation drift: `src/lib/systemActionBus.ts`, `src/lib/systemActionBus.test.ts`, and `src-tauri/src/lib.rs` wire the local CLI adapter, tests, command implementation, and Tauri invoke registration for HADES recurring maintenance.
- Intentional plan/ledger drift: this plan file and `core/projects/tasks/queue.jsonl` record the HADES recurring-maintenance closeout evidence.
- Intentional runtime/audit receipt drift: `core/state/hades_nightly_operations.json`, `core/state/setup_console_readiness.json`, repeated/system audit state, and date-stamped `audit/*-runs/2026-05-28/*` artifacts were refreshed by the no-delete HADES nightly operation.
- Existing unrelated CITADEL/Flywheel/ATHENA working-tree drift remains outside this ARDA slice and was preserved without mutation.

What is next:

- HADES recurring maintenance is closed. The next autonomous ARDA HUD capability slice should wire ATHENA knowledge ingestion/digest into the same local CLI/operator-action pattern, then run focused adapter tests, native Tauri build, parser checks for ATHENA JSONL/state receipts, and plan/queue evidence.

## ATHENA Knowledge Ingestion/Digest Operator Action Closeout — 2026-05-28

Closeout evidence:

- `npm test -- --run src/lib/systemActionBus.test.ts -t "ATHENA|CHARON"` from `apps/arda-hud`: passed; focused ATHENA/CHARON adapter contracts passed.
- `npm test -- --run src/lib/systemActionBus.test.ts` from `apps/arda-hud`: passed; focused system action bus suite passed.
- `npm test -- --run` from `apps/arda-hud`: passed; full frontend test suite passed.
- `npm run build` from `apps/arda-hud`: passed; TypeScript and Vite production build completed.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas && PKG_CONFIG_PATH=/usr/lib64/pkgconfig:/usr/lib/pkgconfig:/usr/share/pkgconfig cargo test --manifest-path apps/arda-hud/src-tauri/Cargo.toml athena -- --nocapture'`: passed; ATHENA native parser/receipt tests passed.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas && PKG_CONFIG_PATH=/usr/lib64/pkgconfig:/usr/lib/pkgconfig:/usr/share/pkgconfig cargo test --manifest-path apps/arda-hud/src-tauri/Cargo.toml -- --nocapture'`: passed; full native crate test suite passed with 6 tests, including ATHENA JSONL/parser and provider-intelligence parser checks.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:build:stable'`: passed; native release binary built at `/var/home/mythos/Annunimas/.target-local/cargo-target/release/arda_hud`.
- `source scripts/runtime_build_env.sh && cargo run -p annunimas-cli -- athena human-scan --human-root human --output data/athena/human_ingestion_results.jsonl --contradictions data/athena/human_contradiction_candidates.jsonl --limit 25`: passed; emitted 25 human-ingestion records and 0 contradiction candidates.
- `source scripts/runtime_build_env.sh && cargo run -p annunimas-cli -- athena digest --limit 25 && cargo run -p annunimas-cli -- export athena-digest-pipeline`: passed; refreshed ATHENA digest pipeline state.
- JSONL/state parser check rerun during reconciliation and passed for `data/athena/human_ingestion_results.jsonl` (25 records), `data/athena/human_contradiction_candidates.jsonl` (0 records), `data/athena/digest.jsonl` (11912 records), `core/state/knowledge_triage_registry.jsonl` (8539 records), and `core/projects/tasks/queue.jsonl` (611 records). State JSON checks passed for `core/state/athena_runtime.json`, `core/state/athena_digest_pipeline.json` (`schema_version=annunimas.athena-digest-pipeline.v1`, generated `2026-05-28T19:48:36Z`), `core/state/provider_intelligence.json` (`schema_version=annunimas.provider-intelligence.v1`, generated `2026-05-28T16:12:28Z`), `core/state/arda_source_map.json`, and `core/state/soterion_render_contract.json`; timestamp-only projection churn on generated ARDA/core state files is expected during parser/source-map reconciliation.
- `git diff --check` from repo root: passed with no whitespace errors during implementation validation and was rerun during reconciliation after plan/queue edits.
- Queue evidence: `tsk_20260528_arda_athena_knowledge_ingestion_digest_local_cli` in `core/projects/tasks/queue.jsonl` updated with exact validation commands and reconciliation parser evidence.

Impact:

- `knowledge.ingest_human_notes` now has a local Tauri CLI execution path behind the `local_cli` adapter preset.
- The frontend adapter maps the ATHENA knowledge action to `run_athena_knowledge_ingestion`, persists `generatedAt`, `receiptPath`, `resultPath`, and status details into the HUD execution ledger, and projects successful runs back into `SystemActionCapabilityStatus`.
- The native Tauri command runs ATHENA human-scan, digest, and digest-pipeline export from the Annunimas root with bounded execution, parses JSONL receipt surfaces with line-numbered malformed-record errors, reads `core/state/athena_runtime.json` and `core/state/athena_digest_pipeline.json`, and returns the ATHENA digest pipeline state as the result path.
- ATHENA operator execution remains a local evidence/receipt refresh path; downstream policy review and task emission remain separately governed actions.

Drift classification:

- Intentional ARDA HUD implementation drift: `src/lib/systemActionBus.ts`, `src/lib/systemActionBus.test.ts`, and `src-tauri/src/lib.rs` wire the local CLI adapter, focused tests, native command implementation, ATHENA JSONL/state parsing, and Tauri invoke registration.
- Intentional plan/ledger drift: this plan file and `core/projects/tasks/queue.jsonl` record ATHENA closeout evidence.
- Intentional ATHENA runtime drift: `data/athena/human_ingestion_results.jsonl`, `data/athena/digest.jsonl`, `core/state/knowledge_triage_registry.jsonl`, `core/state/athena_runtime.json`, and `core/state/athena_digest_pipeline.json` were refreshed by bounded ATHENA ingestion/digest commands and subsequent parser/source-map reconciliation.
- Intentional generated ARDA projection drift: `core/state/arda_source_map.json` and `core/state/soterion_render_contract.json` remain parser-valid timestamp/projection updates from validation.
- Existing unrelated CITADEL/Flywheel/HADES audit/RELIC working-tree drift remains outside this ARDA slice and was preserved without mutation.

What is next:

- ATHENA knowledge ingestion/digest local CLI action is closed. The next autonomous ARDA HUD capability slice should wire CHARON provider intelligence refresh or ATHENA policy-review/task-emission preview as the next governed operator action with focused adapter tests, native parser checks, native Tauri build, and plan/queue evidence.

## CHARON Provider Intelligence + ATHENA Policy Readiness Operator Action Closeout — 2026-05-28

Closeout evidence:

- `npm test -- --run src/lib/systemActionBus.test.ts -t "CHARON|policy readiness"` from `apps/arda-hud`: passed; focused adapter contracts for CHARON provider intelligence refresh and ATHENA policy-readiness preview passed.
- `npm test -- --run src/lib/systemActionBus.test.ts` from `apps/arda-hud`: passed; focused system action bus suite passed.
- `npm test -- --run` from `apps/arda-hud`: passed; full frontend test suite passed.
- `npm run build` from `apps/arda-hud`: passed; TypeScript and Vite production build completed.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas && PKG_CONFIG_PATH=/usr/lib64/pkgconfig:/usr/lib/pkgconfig:/usr/share/pkgconfig cargo test --manifest-path apps/arda-hud/src-tauri/Cargo.toml provider_intelligence -- --nocapture && PKG_CONFIG_PATH=/usr/lib64/pkgconfig:/usr/lib/pkgconfig:/usr/share/pkgconfig cargo test --manifest-path apps/arda-hud/src-tauri/Cargo.toml athena_policy -- --nocapture'`: passed; native provider-intelligence and ATHENA policy preview parser tests passed.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas && PKG_CONFIG_PATH=/usr/lib64/pkgconfig:/usr/lib/pkgconfig:/usr/share/pkgconfig cargo test --manifest-path apps/arda-hud/src-tauri/Cargo.toml -- --nocapture'`: passed; full native Tauri crate test suite passed with 6 tests.
- `python3 scripts/refresh_provider_intelligence.py`: passed; refreshed `core/state/provider_intelligence.json` with `schema_version=annunimas.provider-intelligence.v1`, generated `2026-05-28T20:12:35Z`, and 5 provider entries.
- `source scripts/runtime_build_env.sh && cargo run -p annunimas-cli -- athena policy-readiness --limit 25 >/tmp/athena_policy_readiness_preview.json`: passed; emitted 25 preview rows without mutating queue state.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:build:stable'`: passed after rerun with `CARGO_BUILD_JOBS=1`; native release binary built at `/var/home/mythos/Annunimas/.target-local/cargo-target/release/arda_hud`. The first release attempt was SIGKILLed during optimized Rust compilation, then succeeded with single-job Cargo to reduce memory pressure.
- Parser check passed for `core/state/provider_intelligence.json`, `data/athena/policy_readiness.jsonl` (876 records), `core/projects/tasks/queue.jsonl` (611 records before closeout append), `/tmp/athena_policy_readiness_preview.json` (25 rows), `core/state/arda_source_map.json`, and `core/state/soterion_render_contract.json`.
- `git diff --check` from repo root: passed with no whitespace errors before reconciliation.

Impact:

- `charon.refresh_provider_intelligence` now has a local Tauri CLI execution path behind the `local_cli` adapter preset.
- `athena.promote_policy_ready` now runs as a bounded policy-readiness preview path (`run_athena_policy_readiness_preview`) instead of a queue/task mutation path; the capability remains governed by preview-only semantics.
- The frontend adapter maps both capabilities to native commands, persists `generatedAt`, `receiptPath`, `resultPath`, and status details into the HUD execution ledger, and projects refreshed provider/policy receipts back into `SystemActionCapabilityStatus`.
- The native Tauri commands run from the Annunimas root, parse provider-intelligence and ATHENA policy-readiness receipt surfaces, report row/provider counts, and return receipt/result paths suitable for operator evidence.

Drift classification:

- Intentional ARDA HUD implementation drift: `src/lib/systemActionBus.ts`, `src/lib/systemActionBus.test.ts`, and `src-tauri/src/lib.rs` wire the CHARON and ATHENA preview local CLI adapter mappings, focused tests, native parser helpers, command implementations, and Tauri invoke registration.
- Intentional plan/ledger drift: this plan file and `core/projects/tasks/queue.jsonl` record the CHARON/ATHENA preview closeout evidence.
- Intentional runtime/projection drift: `core/state/provider_intelligence.json`, `data/athena/policy_readiness.jsonl`, `core/state/arda_source_map.json`, and `core/state/soterion_render_contract.json` were refreshed by bounded validation/reconciliation commands.
- Existing unrelated CITADEL/Flywheel/HADES audit/RELIC working-tree drift remains outside this ARDA slice and was preserved without mutation.

What is next:

- CHARON provider intelligence refresh and ATHENA policy-readiness preview are closed. The next autonomous ARDA HUD capability slice should wire the next safe receipt-backed operator action, preferably system/repeated audit preview or setup repair preflight, while keeping destructive repair/task-emission mutations behind governed confirmation and recording focused tests, native build, parser checks, and plan/queue evidence.

## Repeated Audit Preview Operator Action Closeout — 2026-05-28

Closeout evidence:

- `npm test -- --run src/lib/systemActionBus.test.ts` from `apps/arda-hud`: passed; focused system action bus suite passed with 13 tests, including `audit.run_repeated_audit` local CLI adapter invocation and direct `repeatedAuditStatus` receipt projection.
- `python3 scripts/audit/repeated_audit.py --root /var/home/mythos/Annunimas --out audit/repeated-audit-runs/arda-hud-preview-last --state-path core/state/repeated_audit_status.json --run-id arda-hud-preview-last`: passed; refreshed `core/state/repeated_audit_status.json` and `audit/repeated-audit-runs/arda-hud-preview-last/summary.json` with `gate_status=pass`, `candidate_task_count=0`, and `regression_count=0`.
- `npm test` from `apps/arda-hud`: passed; 29 test files / 111 tests.
- `npm run build` from `apps/arda-hud`: passed; TypeScript and Vite production build completed.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:build:stable'`: passed; native release binary built at `/var/home/mythos/Annunimas/.target-local/cargo-target/release/arda_hud`.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas && timeout 20s scripts/launch_arda_hud.sh'`: native smoke stayed alive until the intentional 20-second timeout with no crash output.
- `git diff --check` from repo root: passed with no whitespace errors.
- Parser check passed for `core/state/repeated_audit_status.json` (`gate_status=pass`, `regression_count=0`), `audit/repeated-audit-runs/arda-hud-preview-last/summary.json` (`gate_status=pass`, `regression_count=0`), and `core/projects/tasks/queue.jsonl` (612 records before closeout append).
- Host `cargo check --manifest-path apps/arda-hud/src-tauri/Cargo.toml` was attempted and blocked by missing host GTK/GDK pkg-config dependencies (`gdk-3.0.pc`, `gdk-pixbuf-2.0.pc`); native validation is the distrobox `lothlorien` Tauri build above, which matches the documented ARDA HUD validation path.
- Queue evidence: `tsk_20260528_arda_repeated_audit_preview_local_cli_action_clo` appended to `core/projects/tasks/queue.jsonl` as completed with receipt `core/state/repeated_audit_status.json`.

Impact:

- `audit.run_repeated_audit` now has a local Tauri CLI execution path behind the `local_cli` adapter preset.
- The frontend adapter maps the repeated-audit capability to `run_repeated_audit_preview`, persists receipt/result paths through the local action ledger, and projects `core/state/repeated_audit_status.json` back into `SystemActionCapabilityStatus`.
- The native Tauri command runs `scripts/audit/repeated_audit.py` from the Annunimas root with bounded execution, writes the preview state to `core/state/repeated_audit_status.json`, returns the summary artifact as the result path, and rejects unsupported action IDs.
- The repeated audit action is a receipt-backed preview path: it refreshes audit/state evidence and does not perform destructive source, config, service, or queue mutations.

Drift classification:

- Intentional ARDA HUD implementation drift: `src/lib/systemActionBus.ts`, `src/lib/systemActionBus.test.ts`, and `src-tauri/src/lib.rs` wire the repeated-audit local CLI adapter mapping, focused tests, native command implementation, and Tauri invoke registration.
- Intentional plan/ledger drift: this plan file and `core/projects/tasks/queue.jsonl` record repeated-audit preview closeout evidence.
- Intentional runtime/audit receipt drift: `core/state/repeated_audit_status.json` and `audit/repeated-audit-runs/arda-hud-preview-last/summary.json` were refreshed by the preview command.
- Existing unrelated CITADEL/Flywheel/ATHENA/RELIC working-tree drift remains outside this ARDA slice and was preserved without mutation.

What is next:

- Repeated audit preview is closed. The next safe ARDA HUD capability slice should wire setup repair as a governed preflight-only action: keep actual repair mutations disabled until explicit confirmation, expose/read a receipt-backed preflight result in the same capability-status contract, and repeat focused adapter tests, native Tauri build/smoke, parser checks, and plan/queue evidence.

## Setup Repair Preflight Operator Action Closeout — 2026-05-28

Closeout evidence:

- `npm test -- --run src/lib/systemActionBus.test.ts` from `apps/arda-hud`: passed; focused system action bus suite passed with 13 tests, including `setup.run_repair_flow` invoking `run_setup_repair_preflight` through the `local_cli` adapter.
- `python3 scripts/audit/setup_console_audit.py --root /var/home/mythos/Annunimas --out-dir audit/setup-console-runs/arda-hud-repair-preflight-last --state-path core/state/setup_repair_preflight.json`: passed; refreshed the preflight receipt at `audit/setup-console-runs/arda-hud-repair-preflight-last/setup_console_readiness_receipt.json` and state at `core/state/setup_repair_preflight.json` with `gate_status=pass`.
- `npm run build` from `apps/arda-hud`: passed; TypeScript and Vite production build completed.
- `npm test -- --run` from `apps/arda-hud`: passed; full frontend suite passed with 29 test files / 111 tests.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:build:stable'`: passed; native release binary built at `/var/home/mythos/Annunimas/.target-local/cargo-target/release/arda_hud`.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas && timeout 20s scripts/launch_arda_hud.sh'`: native smoke stayed alive until the intentional 20-second timeout with no crash output.
- `git diff --check` from repo root: passed with no whitespace errors.
- Parser check passed for `audit/setup-console-runs/arda-hud-repair-preflight-last/setup_console_readiness_receipt.json`, `core/state/setup_repair_preflight.json`, `core/state/setup_console_readiness.json`, and `core/projects/tasks/queue.jsonl` (613 records before closeout append).

Impact:

- `setup.run_repair_flow` now has a governed preflight-only local Tauri CLI execution path behind the `local_cli` adapter preset.
- The frontend adapter maps the repair descriptor to `run_setup_repair_preflight`, persists `generatedAt`, `receiptPath`, and `resultPath`, and records capability status as succeeded only for the preflight receipt refresh.
- The native Tauri command reuses the read-only setup console audit runner, writes the preflight state to `core/state/setup_repair_preflight.json`, and returns the receipt path `audit/setup-console-runs/arda-hud-repair-preflight-last/setup_console_readiness_receipt.json`.
- Actual setup repair mutations remain disabled; this slice only refreshes read-only receipt/state evidence and labels the result `no repair mutations applied`.

Drift classification:

- Intentional ARDA HUD implementation drift: `src/lib/systemActionBus.ts`, `src/lib/systemActionBus.test.ts`, and `src-tauri/src/lib.rs` wire the setup repair preflight local CLI adapter mapping, focused test, native command helper, and Tauri invoke registration.
- Intentional plan/ledger drift: this plan file and `core/projects/tasks/queue.jsonl` record setup repair preflight closeout evidence.
- Intentional runtime/audit receipt drift: `core/state/setup_repair_preflight.json` and `audit/setup-console-runs/arda-hud-repair-preflight-last/*` were refreshed by the preflight command; `core/state/setup_console_readiness.json` remains parser-valid generated state from the setup readiness flow.
- Existing unrelated CITADEL/Flywheel/ATHENA/HADES/RELIC working-tree drift remains outside this ARDA slice and was preserved without mutation.

What is next:

- Setup repair preflight is closed. The next autonomous ARDA HUD capability slice should add an explicit operator-confirmed repair execution gate, or defer mutation work and instead package the current ARDA local-CLI capability tranche with scoped staging, final parser checks, native smoke evidence, and push verification.

## Setup Repair Execution Gate Closeout — 2026-05-28

Closeout evidence:

- `npm test -- --run src/lib/systemActionBus.test.ts` from `apps/arda-hud`: first run failed after the focused RED test was added; rerun passed with 1 test file / 14 tests after implementation.
- `python3 scripts/audit/setup_console_audit.py --root /var/home/mythos/Annunimas --out-dir audit/setup-console-runs/arda-hud-repair-execution-gate-last --state-path core/state/setup_repair_execution_gate.json`: passed; refreshed `audit/setup-console-runs/arda-hud-repair-execution-gate-last/setup_console_readiness_receipt.json` and `core/state/setup_repair_execution_gate.json` with `gate_status=pass`.
- `npm run build` from `apps/arda-hud`: passed; TypeScript and Vite production build completed.
- `npm test -- --run` from `apps/arda-hud`: passed; full frontend suite passed with 29 test files / 112 tests.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:build:stable'`: passed; native release binary built at `/var/home/mythos/Annunimas/.target-local/cargo-target/release/arda_hud`.
- `distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas && timeout 20s scripts/launch_arda_hud.sh'`: native smoke stayed alive until the intentional 20-second timeout with no crash output.
- `git diff --check` from repo root: passed with no whitespace errors.
- Parser check passed for `audit/setup-console-runs/arda-hud-repair-execution-gate-last/setup_console_readiness_receipt.json`, `core/state/setup_repair_execution_gate.json`, `audit/setup-console-runs/arda-hud-repair-preflight-last/setup_console_readiness_receipt.json`, `core/state/setup_repair_preflight.json`, and `core/projects/tasks/queue.jsonl` (614 records after closeout append).
- Queue evidence: `tsk_20260528_arda_setup_repair_execution_gate` appended to `core/projects/tasks/queue.jsonl` as completed.

Impact:

- `setup.run_repair_flow` still defaults to the safe `run_setup_repair_preflight` path, preserving no-mutation behavior for normal operator clicks.
- The frontend local CLI adapter now opens the explicit execution-gate command only when `payload.repairExecutionConfirmation` equals `RUN_SETUP_REPAIR_FLOW`; without that phrase, no repair-execution command is invoked.
- The native Tauri command `run_setup_repair_execution_gate` is registered in the invoke handler, validates both the action ID and confirmation phrase, and writes separate execution-gate receipt/state evidence.
- Repair mutations remain disabled in this slice: the execution gate records operator-confirmed readiness evidence and labels the result `repair mutations still disabled`.

Drift classification:

- Intentional ARDA HUD implementation drift: `src/lib/systemActionBus.ts`, `src/lib/systemActionBus.test.ts`, and `src-tauri/src/lib.rs` wire the confirmation-gated execution path, focused tests, native command, and invoke registration.
- Intentional plan/ledger drift: this plan file and `core/projects/tasks/queue.jsonl` record setup repair execution-gate closeout evidence.
- Intentional runtime/audit receipt drift: `core/state/setup_repair_execution_gate.json` and `audit/setup-console-runs/arda-hud-repair-execution-gate-last/*` were refreshed by the read-only setup console audit runner.
- Existing unrelated CITADEL/Flywheel/ATHENA/HADES/RELIC/generated working-tree drift remains outside this ARDA slice and was preserved without mutation.

What is next:

- Setup repair execution gate is closed without enabling destructive repair mutations. The next autonomous ARDA HUD step is to package the scoped ARDA local-CLI capability tranche: stage only ARDA source/test/plan, the queue closeout row, and the setup repair receipt artifacts needed for evidence; preserve unrelated drift unstaged, commit, push, and verify the remote ref.

## Runtime Parity And Boardroom Surface Evidence — 2026-06-01

Changed paths:

- `src/lib/ardaRuntimeMode.ts`
  - Adds explicit runtime mode detection for Tauri native, Tauri dev, static preview, and browser dev.
- `src/components/arda/core/RuntimeModeBadge.tsx`
  - Exposes runtime mode, data source status, and native-validation warning in the operating rail.
- `src/lib/ardaBundleTypes.ts`, `src/lib/ardaReaders.ts`, `src/lib/ardaSource.ts`
  - Split ARDA bundle types/readers away from the monolithic source module while preserving public exports.
- `src/components/arda/hooks/useArdaBundle.ts`
- `src/components/arda/hooks/useArdaRuntimePulse.ts`
- `src/components/arda/hooks/useArdaWindowControls.ts`
- `src/components/arda/hooks/useArdaActionAdapters.ts`
  - Extract App-level runtime/data/action/window responsibilities into focused hooks.
- `src-tauri/src/lib.rs`
  - Centers native workstation windows and creates decorated native workstation pop-outs so focused workstations can move across monitors.
- `src/scene/boardroom/BoardroomViewport.tsx`
  - Moves in-scene workstation overlays out of Drei fullscreen `Html` and into a normal DOM overlay above the canvas, fixing native WebKit bottom-right placement drift.
  - Adds the command-core surface and Hermes desk terminal presentation.
- `src/scene/boardroom/boardroomSpatialLayout.ts`
  - Promotes the center command core as a wider desk/control surface and moves the Hermes button toward the desk-terminal area.
- `src/lib/boardroomSlotSettings.ts`
  - Adds the `surface_layout` contract for adapter type, preview widgets, refresh cadence, focus mode, and embed policy.
- `src/components/arda/hooks/useBoardroomSlotAssignments.ts`
  - Exposes loaded slot documents and `surfaceLayouts` to the app.
- `src/components/arda/modules/SettingsModule.tsx`
  - Displays all boardroom surface slots with adapter type, preview/focus mode, widget count, refresh cadence, component id, and embed URL.

Validation evidence:

- `npm test -- --run src/lib/boardroomSlotSettings.test.ts`: passed; 1 test file / 5 tests.
- `npm run build`: passed; TypeScript and Vite production build completed.
- Native hot-reload path restarted successfully with `npm run tauri:dev:stable` inside distrobox `lothlorien`; Vite served on `localhost:1420` and the Tauri shell launched.
- Native stable build passed with `npm run tauri:build:stable` inside distrobox `lothlorien`; the build produced `.target-local/cargo-target/release/arda_hud`.
- Beelink Grafana service probe passed for `http://100.103.125.88:3000`; the service returns `HTTP 302 /login` and `X-Frame-Options: deny`, so inline iframe embedding remains invalid without service/proxy policy changes.
- Beelink Open WebUI service probe failed for `http://100.103.125.88:8080`; native focus-click validation is blocked until the service is reachable from this host.
- Prior boardroom/runtime slice also passed focused boardroom tests and native Tauri stable build. Re-run native stable validation after the next renderer/editor pass before claiming final boardroom surface completion.

Current gap disposition:

- Settings data model, multi-widget authoring, and service presets are present; native service build/reachability proof is partially complete, while GUI focus-click proof is still pending.
- Surface preview renderer first pass is implemented for `surface_layout.preview.widgets`; live data binding and richer per-kind visuals remain future work.
- Local service manifests for Beelink Grafana and Open WebUI are present with inline embedding disabled by default.
- Inline embedding policy must be proven per service in Tauri/WebKit; Grafana currently denies framing and Open WebUI was unreachable, so default should remain native-window focus.

## Hermes Usage

Hermes may reference this plan by:

- Path: `apps/arda-hud/ARDA_OPERATING_SURFACE_PLAN_2026-05-27.md`
- Callable ref: `arda-operating-surface-plan-2026-05-27`
- Scope: `apps/arda-hud`
- Intent: `Review and coordinate ARDA HUD as the primary operating surface for the autonomous company.`

Recommended Hermes prompt:

```text
Use apps/arda-hud/ARDA_OPERATING_SURFACE_PLAN_2026-05-27.md as the ARDA HUD operating-surface plan. Review current ARDA HUD work against it, preserve existing ARDA contracts, and report gaps by Now, Work, Decisions, Knowledge, Health, Business, Evidence, and Settings.
```
