# ARDA Universal Workstation Recovery Plan

> For Hermes: this is a planning document only. Do not implement broad refactors from this plan without an explicit user go-ahead. If implementation is requested, work task-by-task and verify with `npm run test` and `npm run build`.

Goal: recover ARDA HUD from a mixed Annunimas-specific/dashboard/service-adapter state into a universal scene-first agentic control surface with clear monitor previews, focused workstation windows, and an API/control contract that can support Annunimas or any compatible agentic control system.

Architecture: keep the current scene-slot model, but separate physical placement, universal workstation roles, adapter/provider data, in-scene previews, and focused controls. Annunimas becomes one adapter/profile, not the hard-coded meaning of the app. The boardroom remains the primary UX: monitors show compact ambient operational visuals; clicking opens a deeper in-scene or native-window workstation with charts, controls, evidence, and governed actions.

Tech stack: React, TypeScript, Tauri, existing `ArdaBundle` projection, `surface_layout`, boardroom slot assignment document, workstation/module components, existing tests under Vitest.

Current verified state:
- `ARDA_IMPLEMENTATION_PLAN.md` already explains why the current shape exists: Phase 8 moved ARDA from a scene-first rebuild into a configurable operating surface.
- `docs/contracts/ARDA_BOARDROOM_SLOT_ASSIGNMENT_CONTRACT.md` already defines stable scene slots, `surface_layout`, preview widgets, focus modes, and workspace-backed slot assignments.
- `src/scene/workstations/SLOT_COMPONENT_CONTRACT.md` already says scene slots are physical placement IDs and must host swappable workstation content.
- `src/scene/workstations/WORKSTATION_CONTRACT.md` already says workstations have both `in_scene` and `native_window` presentation modes.
- `src/App.tsx` still contains many Annunimas-specific derivations and module assembly paths, so the universal product idea is present in contracts but not cleanly separated in implementation.
- `src/services/` is user-created and currently contains empty `index.ts` and `getSummaries.ts`; do not delete or treat it as model-generated debris.

Conclusion:
The app is convoluted for a real reason, not random drift. It is trying to serve two goals at once:
1. original Annunimas operating HUD, with source-map/projection-specific modules;
2. more universal ARDA product shell, where any agentic control system can provide data/actions through adapters and be displayed in movable scene slots.

The correct recovery path is not another large App.tsx extraction. The correct path is to make the universal contracts first-class, then remap Annunimas into those contracts.

---

## Target Mental Model

ARDA should have five distinct layers:

1. Physical scene slot
   - Example: `monitor_left_1`, `view_desk_control_panel`.
   - Owns position, size, mesh/screen placement, and click target.
   - Never owns domain meaning like Fleet, Planning, Annunimas, or Charon.

2. Workstation role
   - Example: `fleet`, `work`, `decisions`, `knowledge`, `evidence`, `settings`.
   - Owns operator purpose and the question the station answers.
   - Can be assigned to any compatible scene slot by settings.

3. Adapter profile
   - Example: `annunimas`, `generic-openapi`, `local-llm-stack`, `service-library`.
   - Owns how raw system data becomes universal ARDA view models.
   - Annunimas should become the first full adapter/profile, not the whole product architecture.

4. Preview surface
   - Small in-scene embedded screen visual.
   - Ambient and glanceable: Evangelion-style waveforms, bars, pulse lines, status blocks, warning indicators.
   - No raw JSON by default.

5. Focused workstation
   - Opened by clicking a scene slot.
   - In-scene or native window.
   - Deep visualizations, tables, controls, action receipts, debug/source drilldowns.
   - Controls must be governed by explicit action contracts.

---

## Recommended V1 Workstation Roles

Start with a small universal role set. Do not expose every existing Annunimas panel as a top-level station.

### 1. Fleet

Purpose: health of model/API/provider connectivity and runtime services.

In-scene preview:
- provider health bars;
- latency waveforms;
- local/cloud split;
- error pulse count;
- routable model count;
- animated line/noise treatment inspired by the user’s Evangelion examples.

Focused view:
- provider list;
- local/cloud/source labels;
- model availability;
- latency/error/failure history;
- routing lane ownership;
- service checks;
- read-only refresh actions first;
- governed repair actions later.

Initial Annunimas mapping:
- `operator_runtime_status.json`;
- `charon_router.json`;
- current `getFleetHealth`, `getRoutableProviders`, `getLaneOwnership`, `getLaneHeadroom`, and `getLaneFitness` logic currently in `src/App.tsx`.

### 2. Work

Purpose: active tasks, plans, queues, scheduled runs, receipts.

In-scene preview:
- active/pending/completed counts;
- queue flow bands;
- blocked item indicator;
- latest receipt pulse.

Focused view:
- active queue;
- plan/task relationship;
- scheduled operations;
- dry-run controls;
- task capture preview;
- execution receipts and evidence.

Initial Annunimas mapping:
- planning/queue projections;
- HADES nightly operations;
- current Planning and Operating Surface modules.

### 3. Decisions

Purpose: human gates, approvals, policy reviews, pending delegations.

In-scene preview:
- pending gate count;
- risk/severity colors;
- oldest wait timer;
- compact provenance indicator.

Focused view:
- approval packet list;
- reason/consequence/evidence;
- approve/reject/dry-run controls only after action contract is explicit.

### 4. Knowledge

Purpose: memory, source freshness, docs, citations, unresolved conflicts.

In-scene preview:
- freshness rings;
- citation/source pulses;
- conflict count;
- ingestion activity.

Focused view:
- source map;
- knowledge graph/status;
- citations;
- stale/missing projection list;
- media/docs viewer as a controlled sub-view, not raw JSON default.

### 5. Evidence

Purpose: trust, provenance, audits, validation, known gaps.

In-scene preview:
- validation pass/fail blocks;
- source freshness strip;
- audit warning pulses.

Focused view:
- receipts;
- audit results;
- source provenance;
- missing projection explanations;
- raw data only behind a Debug/Raw disclosure.

### 6. Settings / Layout

Purpose: operator customization and adapter/profile setup.

In-scene preview:
- setup readiness;
- current profile;
- slot assignment mode: workspace/local/fallback.

Focused view:
- drag/drop or select slot assignment;
- preview widget editor;
- adapter profile setup;
- API key/service setup guidance;
- export/import layout profile.

---

## Implementation Tasks

### Task 1: Freeze the intended product boundary in docs

Objective: explicitly document that ARDA is universal, while Annunimas is the first adapter/profile.

Files:
- Modify: `ARDA_IMPLEMENTATION_PLAN.md`
- Create: `docs/plans/2026-06-26-arda-universal-workstation-recovery-plan.md` already exists as this plan.
- Optional modify: `ARDA_CONTRACTS_MANIFEST.md`

Steps:
1. Add a short Phase 8 note to `ARDA_IMPLEMENTATION_PLAN.md`:
   - ARDA target is universal agentic control surface.
   - Annunimas is first-class adapter/profile.
   - Workstation recovery must preserve scene-slot configurability.
2. Add this plan to the contracts/plan references if desired.
3. Run: `npm run build` only if code changes are made; docs-only can use `git diff --check`.

Acceptance:
- A future implementer can understand why universal adapter work exists and why Annunimas-specific code should not keep spreading through UI components.

### Task 2: Define universal workstation role types

Objective: create a small typed contract that separates role semantics from scene slot placement and Annunimas source details.

Files:
- Create: `src/scene/workstations/workstationRoles.ts`
- Create: `src/scene/workstations/workstationRoles.test.ts`

Model to define:
- `WorkstationRoleId`: `fleet | work | decisions | knowledge | evidence | settings`
- `WorkstationRoleDefinition`
  - `id`
  - `title`
  - `purpose`
  - `operatorQuestion`
  - `previewKinds`
  - `focusedCapabilities`
  - `defaultPresentationModes`
  - `debugRawAllowed`

Acceptance:
- Tests assert all V1 roles exist.
- Tests assert role IDs are stable and unique.
- Tests assert raw/debug is not default for normal roles.

Verification:
- `npm test -- --run src/workstations/workstationRoles.test.ts`

### Task 3: Create adapter-neutral view models

Objective: define the data shapes that previews and focused workstations render, independent of Annunimas file names.

Files:
- Create: `src/scene/workstations/viewModels.ts`
- Create: `src/scene/workstations/viewModels.test.ts`

View models:
- `FleetViewModel`
- `WorkViewModel`
- `DecisionViewModel`
- `KnowledgeViewModel`
- `EvidenceViewModel`
- `SettingsViewModel`
- shared `ViewModelFreshness`, `ViewModelSource`, `ActionDescriptor`

Rules:
- Raw source objects are not part of the default view model.
- Each model has `status`, `summary`, `metrics`, `sources`, and optional `actions`.
- Actions must declare `read_only`, `dry_run`, or `governed_mutation`.

Acceptance:
- Type-level tests or runtime fixtures prove each model can represent empty/fallback state safely.

Verification:
- `npm test -- --run src/workstations/viewModels.test.ts`

### Task 4: Map Annunimas data into universal view models

Objective: move Annunimas-specific derivation out of generic render flow into an adapter mapper.

Files:
- Create: `src/scene/workstations/adapters/annunimasAdapter.ts`
- Create: `src/scene/workstations/adapters/annunimasAdapter.test.ts`
- Later modify: `src/App.tsx` only to call the adapter, not to redesign UI.

Initial extraction candidates from `src/App.tsx`:
- `getFleetHealth`
- `getLaneOwnership`
- `getLaneHeadroom`
- `getLaneFitness`
- `getRoutableProviders`
- planning/queue summary helpers only after Fleet works.

Rules:
- Preserve existing behavior first.
- Add tests around current fixture-like bundle shapes before moving more code.
- Keep Annunimas naming inside the adapter, not inside the generic workstation preview.

Acceptance:
- Fleet view model can be produced from the existing `ArdaBundle`.
- Missing Annunimas projections produce safe fallback/attention state, not raw JSON.

Verification:
- `npm test -- --run src/workstations/adapters/annunimasAdapter.test.ts`
- `npm run build`

### Task 5: Replace monitor previews with role-based preview models

Objective: make in-scene screens show compact ambient visuals for the assigned role instead of arbitrary module summaries.

Files:
- Modify: `src/scene/boardroom/boardroomSurfacePreviewModel.ts`
- Modify: `src/scene/boardroom/BoardroomSurfacePreview.tsx`
- Test: `src/scene/boardroom/boardroomSurfacePreviewModel.test.ts`

Implementation shape:
- Keep the existing `surface_layout.preview.widgets` contract.
- Add role-aware widget interpretations for Fleet first:
  - provider bars;
  - latency waveform/sparkline;
  - status grid;
  - source freshness marker.
- Add generic fallback for unknown roles.

Acceptance:
- A Fleet-assigned monitor renders Fleet-specific preview widgets.
- Unknown/missing data renders placeholder/attention state, not raw JSON.
- Existing service/media preview tests still pass.

Verification:
- `npm test -- --run src/scene/boardroom/boardroomSurfacePreviewModel.test.ts`
- `npm run build`

### Task 6: Make focused workstations role-first

Objective: clicking a monitor should open the focused workstation for that role, with deeper visuals and controls.

Files:
- Modify: `src/components/arda/core/SceneWorkstation.tsx` only if container behavior needs metadata.
- Modify: `src/App.tsx` only at the module assembly boundary.
- Create or modify role-specific modules under `src/components/arda/modules/`.

First implementation target:
- Fleet focused workstation.

Rules:
- In-scene and native window use the same role view model.
- Raw/debug source is behind a disclosure or debug tab.
- No mutating controls until action contracts are explicit.

Acceptance:
- `monitor_left_1` or any user-assigned slot can open Fleet focused view.
- Focused view is more detailed than in-scene preview.
- Existing popout/native sync still works.

Verification:
- `npm test -- --run` relevant module tests plus workstation sync tests if present.
- `npm run build`

### Task 7: Move customization to role assignment, not hard-coded module assignment

Objective: settings should let users assign workstation roles to slots, while advanced users can still tune preview widgets.

Files:
- Modify: `src/lib/boardroomSlotSettings.ts`
- Modify: `src/components/arda/modules/SettingsModule.tsx`
- Test: `src/lib/boardroomSlotSettings.test.ts`

Rules:
- Slot id remains physical.
- Role id becomes the main user-facing assignment.
- Existing `component_id`, `source_zone_id`, and `module_ids` are either derived from role/profile or preserved for backward compatibility.

Acceptance:
- User can set bottom-left monitor to Fleet without editing code.
- Settings still saves through the scoped workspace/local path.
- Old assignment documents still normalize.

Verification:
- `npm test -- --run src/lib/boardroomSlotSettings.test.ts`
- `npm run build`

### Task 8: Add a generic external adapter path after Fleet is stable

Objective: prove ARDA is not only Annunimas by accepting a simple generic control-system manifest.

Files:
- Create: `src/workstations/adapters/genericControlSystemAdapter.ts`
- Create: `src/workstations/adapters/genericControlSystemAdapter.test.ts`
- Optional create: `docs/contracts/ARDA_GENERIC_CONTROL_SYSTEM_ADAPTER.md`

Minimum generic manifest:
- systems/services;
- providers/models;
- health checks;
- tasks/jobs;
- decisions/approvals;
- source provenance;
- action descriptors.

Acceptance:
- A non-Annunimas fixture can produce at least Fleet and Work view models.
- The same boardroom preview/focused components render the generic fixture.

Verification:
- `npm test -- --run src/workstations/adapters/genericControlSystemAdapter.test.ts`
- `npm run build`

---

## What Not To Do

- Do not delete `src/services/`; it is user-created.
- Do not perform another broad App.tsx refactor before the role/view-model contract exists.
- Do not make raw JSON the default display for any workstation.
- Do not rename stable scene slot IDs to domain names.
- Do not turn every existing Annunimas panel into a top-level universal workstation.
- Do not expose mutating controls without explicit action contract, confirmation, and receipt path.

---

## Suggested Execution Strategy

Best path for low token usage and low risk:
1. User implements Task 1-3 from this plan.
2. Hermes reviews the diff and confirms contract alignment.
3. Hermes batches Task 4-5 because those require careful code tracing and tests.
4. User reviews visual direction with screenshots/examples for the Fleet monitor.
5. Hermes or user implements Task 6-8 incrementally.

Best path if Hermes batches implementation:
1. One batch for Task 1-3: docs + types + tests.
2. One batch for Task 4: Annunimas Fleet adapter extraction only.
3. One batch for Task 5-6: Fleet preview + focused Fleet view.
4. One batch for Task 7: settings customization cleanup.
5. One batch for Task 8: generic adapter proof.

Stop gate after every batch:
- `npm test` or targeted Vitest command passes.
- `npm run build` passes.
- user confirms visual/product direction before the next UX-heavy batch.
