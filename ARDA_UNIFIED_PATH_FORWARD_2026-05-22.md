---
soterion:
  sigil: "SCROLL"
  glyph: "📜"
  code_point: "U+1F4DC"
  role: "documentation"
  owner: "HADES"
  status: "active"
  last_reviewed: "2026-06-01"
---

> 🜏 Soterion: 📜 documentation | owner: HADES | status: active | reviewed: 2026-06-01

# ARDA Unified Path Forward

> **Purpose:** Unify `MYTHOS_SPEC.md`, `ARDA_PRD.md`,
> `ARDA_IMPLEMENTATION_PLAN.md`, `ARDA_AUDIT.md`, and
> `ARDA_DATA_SURFACE_MAP_2026-05-21.md` into one central product path.
>
> **Date:** 2026-05-22
>
> **Current posture:** Scene-first runtime exists, native Tauri is the canonical
> validation path, and boardroom surface slots now have a durable display
> contract. The next risk is turning configured surfaces into polished, efficient
> preview/focus renderers.

## North Star

ARDA is the operator cockpit for Annunimas: a scene-first command environment
where the boardroom is the immediate control throne and the world is the larger
living map of agents, systems, memory, plans, business, and human context.

The product should converge on three promises:

1. **See the system**
   - Agents, routes, queues, memory, provider health, review gates, plans, and
     human/business context are visible as live operational surfaces.

2. **Understand what matters**
   - ARDA should separate ready, stale, blocked, risky, missing, and
     reference-only data without making the operator inspect raw ledgers.

3. **Act from the cockpit**
   - The operator should approve, reject, refresh, spawn, route, assign, open,
     and inspect through scene workstations rather than jumping across scripts
     and files.

## How The Existing Docs Fit Together

| Document | What it contributes | How to use it now |
| --- | --- | --- |
| `MYTHOS_SPEC.md` | Maximal vision: live remote agents, file forest, voice, document editing, Git rivers, XR, Night City metaphor. | Use as the idea bank, not the short-term execution plan. |
| `ARDA_PRD.md` | Boardroom product feel: physical desk, floating monitors, companion avatar, command podium, reactive surfaces. | Use as the boardroom experience target. |
| `ARDA_IMPLEMENTATION_PLAN.md` | Completed rebuild phases: scene projections, boardroom/world runtime, native workstations, assets, retirement. | Keep as completion history and regression guard. |
| `ARDA_DATA_SURFACE_MAP_2026-05-21.md` | Detailed source map of what backend data is reachable and what was wired yesterday. | Use as the current data-source reference. |
| `ARDA_AUDIT.md` | Current factual audit of app shape, data, verification, and gaps. | Use as the implementation truth snapshot. |

## What Has Been Accomplished

The app now has a usable spine:

- Scene-first boardroom and world runtime entries.
- Manifest-backed workstation model.
- In-scene and Tauri-native workstation presentation modes.
- Boardroom scene slots for monitor and desk surfaces.
- Workspace-backed boardroom slot assignment with browser-local fallback.
- Per-slot `surface_layout` contracts for preview widgets, adapter type,
  focus mode, refresh cadence, and embed policy.
- Starter 3D boardroom/world assets, material loading, and HDRI environment.
- Visible boardroom presence/avatar rig.
- Runtime mode detection and UI badging so browser/Vite and Tauri/WebKit are
  not confused as equivalent proof paths.
- Native workstation pop-outs that use OS-decorated windows for moving focused
  workstations across monitors.
- Boardroom command core with split screen/buttons and a Hermes desk-terminal
  treatment for the Hermes dashboard slot.
- Source-map coverage badges.
- Shared provenance/freshness model in `src/lib/ardaProvenance.ts` and
  `ArdaBundle.sourceProvenance`.
- Reusable `DataFreshnessBadge` and `DataSourceDetailsPanel` components for
  operator-facing freshness/status display.
- Knowledge map surfaces for ATHENA registry, digest, deep graph, policy
  readiness, and missing projections.
- Review gate surface for ARANDUR, mission approvals, HADES lifecycle, human
  augmentation, and ATHENA policy readiness.
- Direct provider/model visibility from Charon router data.
- Fleet, runtime drift, lane ownership, lane headroom, lane fitness, package,
  storage, output, queue, plan, human, business, and personal data surfaces.
- Numenor-era provider/store/helper/runtime wrappers are archived out of active
  source; active data loading is centered on `ArdaBundle` and `core/state`
  projections.
- Scene asset performance now has a first-pass budget contract in
  `ARDA_ASSET_PERFORMANCE_BUDGET.md` and an implementation model in
  `src/scene/systems/assetPerformanceBudget.ts`; current heavy starter assets
  are explicitly classified as optimization work rather than invisible build
  cost, and unused heavy starter variants are deferred out of the default
  runtime bundle.
- Boardroom screen visual refinement now has a runtime bridge in
  `src/scene/boardroom/boardroomVisualRefinement.ts`: monitor and desk screens
  render as physical glass panes plus metallic trim bars while the final Blender
  asset polish remains open.
- Unused Numenor-era direct-fetch commands were pruned from active Tauri native
  command registration; scoped inventory/file commands and native action/window
  commands remain the supported backend surface.
- Passing unit/component tests and production frontend build.

This is enough to stop treating ARDA as a prototype shell. The next work should
be productization, not another foundational rebuild.

## Data Coming Into The App

ARDA currently receives data through a projection/file-backed Tauri path. The
central bundle is `ArdaBundle` from `src/lib/ardaSource.ts`.

Core incoming domains:

- **System/world:** `world`, agents, sections, source map, scene zones, anchors,
  surfaces, workstation manifests.
- **Routing/providers:** Charon router, operator runtime status, provider token
  usage, lane ownership, provider models, context windows, health, capabilities.
- **Knowledge:** ATHENA runtime, knowledge triage registry, digest, deep graph,
  policy readiness.
- **Review/approval:** ARANDUR recommendations, mission approvals, queue write
  requests, HADES lifecycle queue, human augmentation runtime.
- **Operations:** queue summary, task queue, operator actions, operations flow,
  task lifecycle runtime, plan map.
- **Governance/autonomy:** active ruleset-derived runtime, governance runtime,
  autonomy readiness, CEO council runtime, escalation runtime.
- **Human realm:** human context, notes/docs summaries, personal runtime,
  business runtime.
- **Infrastructure:** fleet runtime drift, package health, package enablement,
  runtime activation, storage pressure, output topology, output accounting.
- **Presence:** PROMETHEUS presence events derived into `agentPresenceState` and
  `agentPresenceStatus`.

Important caveat: most of this is projection-backed, not live-stream-backed.
The app now has a reusable provenance/freshness model, but most major modules
still need to consume it in their headers and details flows.

## What Is Missing

### Product Focus

The largest gap is not a missing component. It is an explicit product sequence.
There are many valid ideas, but they should be grouped into lanes and milestones
so each pass compounds.

### Data Freshness

ARDA now has the first shared freshness language:

- generated timestamp
- source path
- projected vs derived
- stale/healthy/missing state
- display-only refresh affordance contract
- safe refresh command guidance where registered
- last refresh result

The remaining work is adoption: major modules need to render the shared
freshness records and link them to source details without implying live state
where the backend is projection/file-backed.

First-pass adoption now covers Systems, Section Focus, Planning/Queue, Review
Gate, Hermes dashboard surfaces, Human Realm, Business, Personal Growth, and
boardroom monitor/desk preview widgets. Compact visual widgets now surface
freshness so they do not imply live state when they are backed by projections.

Safe refresh guidance is explicitly display-only:
`ArdaRefreshAffordance` classifies read-only, projection-refresh-only,
approval-required, and manual-only source paths without executing commands from
provenance UI.

### Action Contracts

The app should stop at fewer read-only dashboards. Each important surface needs
an explicit action contract:

- approve/reject
- refresh projection
- open source
- spawn task
- assign workstation slot
- route provider/lane
- promote/reject knowledge
- create plan/task
- export/share packet

Current action-contract coverage:

- Review Gate covers governed approve/reject with an inspect/decide/record
  preview.
- Operating Surface covers read-only and dry-run refresh actions.
- Planning now covers a focused queue-preview refresh and a governed task-pivot
  record preview for task creation. The task-pivot mutation remains
  operator-gated and is not mixed into the generic refresh lane.
- World terminals now have explicit action contracts: Queue Terminal exposes
  queue preview and task-pivot preview, Tools Terminal exposes setup/audit
  evidence refresh and repair-flow preview, and Status Terminal exposes
  provider/runtime refresh actions. Governed terminal actions remain
  preview-only/operator-gated. Each terminal action now also shows status,
  risk, schedule, receipt/result path, governance gate, and related evidence.
- Knowledge now has an explicit focused action contract: ATHENA digest refresh
  can run through the safe action-bus path, while knowledge ingestion and
  policy-ready promotion remain governed preview-only actions.
- Routing/Providers now has an explicit focused action contract: CHRONOS
  provider checks and CHARON provider intelligence refresh can run through the
  safe action-bus path, while provider reroute remains not exposed until it has
  a separate approval contract.
- Operations/HADES now has an explicit focused action contract: HADES
  organization/link-check receipts, system/repeated audit receipts, and setup
  readiness checks can run through the safe action-bus path, while setup repair
  remains governed/operator-gated.
- Source details now have an explicit source/export action contract:
  provenance records can copy source paths, copy a local provenance packet, or
  reveal an existing scoped workspace path in the native shell. External share
  remains gated until redaction, destination, and approval contracts exist.

### Persistent Operator Customization

Boardroom slot assignment has moved to a workspace-backed file with browser
fallback:

- workspace authority: `core/state/arda_boardroom_slots.json`
- frontend contract: `src/lib/boardroomSlotSettings.ts`
- visible settings display: `SettingsModule`

Settings now exposes and edits the main surface contract fields: adapter type,
focus mode, embed URL, inline embed policy, preview refresh cadence, service
presets, and multi-widget preview composition.

The renderer consumes `surface_layout.preview.widgets` for boardroom monitor
and desk previews. The widget contract now distinguishes compact preview
declarations for metrics, particle streams, status grids, agent comms,
iframes, `.md`, `.pdf`, image, video, document, data-stream, and remote-session
surfaces. These are still preview declarations; actual document rendering,
media playback, and remote desktop transport belong in focused adapters.
The first focused-adapter contracts now exist for `media_library` and
`agent_remote_session`; both prefer native-window focus and keep inline
rendering disabled until scoped source, codec, transport, auth, and isolation
rules are proven.
`media_library` now has a read-only focused workstation module that inventories
scoped document/media roots, previews text-like files, and marks heavier
PDF/image/video/document files for native focused handling.
Selected media-library entries can now call a scoped native open action through
`open_source_path`. Supported image files can also render inline through the
scoped, size-capped `read_source_image_preview` path. Supported video files now
have the same bounded inline preview path through `read_source_video_preview`;
supported PDF files use the bounded `read_source_pdf_preview` path. Document
files remain native-focus until conversion/redaction policy is explicit.

### World Workflow

The world scene exists, but needs clear purpose per district:

- what data it represents
- what the operator can do there
- what alerts or state changes make it light up
- how a district opens a focused workstation

### Live Runtime Layer

`MYTHOS_SPEC.md` calls for live agent registration, remote sync, WebSocket/gRPC
updates, and remote laptop operation. The current app is prepared conceptually,
but the active path is still file-backed projection loading.

### Runtime Parity / Native Proof

ARDA has three practical runtime truths:

- host browser/Vite: useful for fast React/CSS iteration only
- Tauri dev with Vite hot reload: preferred interaction path while building
- Tauri stable build: final validation path

Changes do not need to be implemented twice, but browser behavior is not proof
for native WebKit/Tauri behavior. Anything involving filesystem IPC, windowing,
WebKit layout, embedding, media codecs, iframe policy, external service URLs, or
multi-monitor behavior must be validated in Tauri.

2026-06-01 service proof: native stable Tauri build passed in distrobox
`lothlorien` after the world-terminal preview and source/export action-contract
passes, producing `.target-local/cargo-target/release/arda_hud`. Earlier Beelink
Grafana validation showed `http://100.103.125.88:3000` reachable but returning
`X-Frame-Options: deny`; keep inline embedding disabled and use native-window
focus. Beelink Open WebUI was not reachable at `http://100.103.125.88:8080`
from this host, so focus-click proof remains blocked on service availability.

## Central Roadmap

### Milestone 1: Make ARDA Trustworthy

Goal: the operator can tell what is live, stale, missing, derived, or blocked.

Work:

- Use the shared `ArdaSourceProvenance` model for module-level freshness.
- Add data freshness badges to major module headers.
- Expose source paths and generated timestamps consistently in details panels.
- Add missing/stale states to provider, ATHENA, queue, plan, and fleet panels.
- Define refresh commands per source domain without wiring unsafe mutation.
- Treat `ARDA_DATA_PROVENANCE_CONTRACT.md` as the durable freshness/provenance
  contract; keep `ARDA_DATA_SURFACE_MAP_2026-05-21.md` as the source inventory.

Exit criteria:

- Every major module can answer: where did this data come from, when was it
  generated, and what should I do if it is stale?

Current implementation note:

- `ArdaBundle.sourceProvenance`, `DataFreshnessBadge`, and
  `DataSourceDetailsPanel` are implemented and covered by Vitest.
- `SystemsModule`, `SectionFocusModule`, `ReviewGateWorkstation`, and
  `HermesDashboardModule` now render source freshness from
  `ArdaBundle.sourceProvenance`.
- Human Realm, Business, and Personal Growth now render compact freshness
  strips from `ArdaBundle.sourceProvenance` instead of relying only on
  source-map coverage badges.
- `QueueProvenancePanel` renders queue/planning/HADES source freshness inside
  the Planning module.
- `SourceRefreshAffordance` renders display-only refresh guidance beside
  provenance records, including approval-gated queue guidance and manual-only
  fallback text.
- `BoardroomSurfacePreview` now receives provenance records and marks stale,
  missing, blocked, or unknown projection-backed previews as attention surfaces.
- `ReviewGateWorkstation` now exposes the inspect/decide/record path and a
  decision-record preview before approval or rejection.
- `OperatingSurfacePlanModule` now exposes explicit refresh action-flow buttons
  for read-only and dry-run action-bus descriptors, keeping governed mutations
  out of the refresh lane.
- `PlanningActionContractPanel` now gives the Planning workstation a runnable
  dry-run queue preview and an operator-gated task-pivot command preview for
  creating durable task records.
- Remaining Milestone 1 adoption should focus on native validation and any
  remaining workstation-specific action contracts.

### Milestone 2: Make The Boardroom Operable

Goal: the boardroom becomes the daily cockpit, not just a visual shell.

Viewport/product direction:

- The boardroom is a fixed-seat C-shaped operator cockpit.
- Lower screens wrap around the operator on the desk rim: left wrap, left inner,
  center control, right inner, right wrap.
- Four upper monitors sit above the lower row and frame the rear world/window.
- The rear window should show a cyberpunk city scene now and evolve toward a
  richer 2D/3D parallax or WebGL city surface later.
- ARDA presence should rise from a circular emitter behind the center control
  panel, not dominate the city/window wall.
- Normal runtime should be stable: no scene-object drift, no pan, no wheel zoom,
  and only constrained left/right look.
- Edit/debug mode may expose draggable zone placement so the cockpit can be
  shaped visually before accepted positions are promoted to the spatial
  contract.

Work:

- Persist boardroom scene-slot assignments to a workspace-scoped settings or
  `core/state` projection.
- Replace generic placeholder slot workstations with real templates from
  `src/scene/workstations/SLOT_COMPONENT_CONTRACT.md`.
- Define monitor roles: system health, routing, knowledge, queue/plans,
  review gates, human/business, Hermes.
- Add workstation action contracts for review, refresh, open source, and
  task/plan creation.
- Keep the command podium focused on global actions and safe operator control.

Exit criteria:

- The operator can open ARDA, see the boardroom, understand system status, and
  complete at least one real approval/refresh/planning workflow without leaving
  the app.

Current implementation note:

- Boardroom slot assignments now have a workspace state contract at
  `core/state/arda_boardroom_slots.json`, a browser-local fallback key
  `arda.boardroom.scene_slots.v1`, default monitor/desk role mappings, and
  defensive load/save helpers covered by `src/lib/boardroomSlotSettings.test.ts`.
- Boardroom spatial zones now live in
  `src/scene/boardroom/boardroomSpatialLayout.ts` with position, rotation, size,
  interaction behavior, optional assignment slot, and preview mode.
- Boardroom placement tuning is documented in
  `src/scene/boardroom/BOARDROOM_TUNING.md`; edit/debug dragging persists local
  position overrides in browser storage key
  `arda.boardroom.zone_positions.v1`.
- `useBoardroomSlotAssignments` wires the workspace/local assignment contract
  into the boardroom runtime without moving scene slot IDs into domain component
  names. The in-scene slots remain geometry anchors; source zones and workstation
  manifests remain the domain/action layer.
- Unassigned `scene_slot:<slot_id>` fallbacks now use slot-specific workstation
  templates from `src/scene/workstations/sceneSlotWorkstationTemplates.ts`
  instead of one generic placeholder manifest. Each boardroom slot has a title,
  module set, entry anchor, and presentation mode.
- `surface_layout` now extends each slot assignment with `adapter_type`,
  `preview.mode`, `preview.refresh_ms`, `preview.widgets`, `focus.mode`,
  `focus.target`, `focus.refresh_ms`, `embed.url`, and `embed.allow_inline`.
  Partial or older workspace documents normalize from defaults.
- Settings now displays the slot surface contract for all upper monitors and
  desk surfaces, including adapter type, preview/focus mode, widget count,
  refresh cadence, component id, and embed URL.
- Boardroom monitor and desk previews now consume
  `surface_layout.preview.widgets` through `BoardroomSurfacePreview` and
  `boardroomSurfacePreviewModel`, with compact visual support for metric,
  particle, status, sparkline, media/document, data-stream, agent/session, and
  iframe preview declarations.
- Settings now provides editor controls for `adapter_type`, `focus.mode`,
  `embed.url`, `embed.allow_inline`, `preview.refresh_ms`, add/remove preview
  widgets, and per-widget kind/title/binding/grid-area, saving the full
  boardroom slot document so custom `surface_layout` data is preserved.
- Boardroom workstation overlays now render as normal DOM above the Three canvas
  instead of through Drei fullscreen `Html`, preventing native WebKit placement
  drift that pushed in-scene workstations to the bottom-right.
- Native workstation pop-outs center on creation and use OS decorations, so
  focused workstation windows can be dragged to another monitor.
- Validation: `npm test -- --run src/lib/boardroomSlotSettings.test.ts
  src/scene/boardroom/boardroomSurfacePreviewModel.test.ts` and `npm run build`
  passed on 2026-06-01.
- Planning workstation action-contract validation:
  `npm test -- --run src/components/arda/modules/PlanningActionContractPanel.test.tsx
  src/components/arda/modules/OperatingSurfacePlanModule.test.tsx
  src/lib/systemActionBus.test.ts` passed on 2026-06-01.
- Slot-template validation:
  `npm test -- --run src/scene/workstations/sceneSlotWorkstationTemplates.test.ts
  src/lib/boardroomSlotSettings.test.ts
  src/scene/boardroom/boardroomSurfacePreviewModel.test.ts` passed on
  2026-06-01.

### Milestone 3: Make The World Meaningful

Goal: world traversal becomes a spatial map of domains, not a second dashboard.

Work:

- Define each district's owner, data sources, alert triggers, and workstation.
- Connect district state to projection health and domain urgency.
- Add terminal/district interaction patterns that reuse the workstation model.
- Keep world visuals subordinate to workflow meaning.

Exit criteria:

- Moving through the world answers "where is the pressure in the system?" and
  each district opens a useful action or inspection surface.

Current implementation note:

- World district contracts now define owner agents, source zones, triggers, and
  recommended actions in `src/scene/world/worldDistrictContracts.ts`; the durable
  field/action/urgency contract is documented in `ARDA_WORLD_DISTRICT_CONTRACT.md`.
- Projection-backed urgency is calculated in
  `src/scene/world/worldDistrictUrgency.ts` and presented through
  `src/scene/world/worldDistrictPresentation.ts`, with district labels and
  interaction routing wired into `WorldRuntimeViewport`.
- District workflows are resolved in
  `src/scene/world/worldDistrictWorkflows.ts`, combining the world district
  contract with `core/state/arda_world_surfaces.json` so each district has a
  concrete open target, safe inspection actions, gated/draft-only action IDs,
  focus mode, surface adapter, and preview widget count.
- District and terminal interactions reuse the existing focused panel/workstation
  model by passing source-zone IDs back to `App.tsx`; district visuals stay
  limited to urgency rings, labels, and userData evidence, while world terminal
  surfaces now render compact configured preview widgets through
  `WorldTerminalSurfacePreview`.
- World district and terminal surfaces now have a workspace-backed assignment
  contract at `core/state/arda_world_surfaces.json`, parsed by
  `src/lib/worldSurfaceSettings.ts` and loaded through
  `useWorldSurfaceAssignments`. Settings exposes the world surface slots beside
  boardroom slots, and `WorldRuntimeViewport` uses each surface layout's focus
  target, adapter type, preview refresh cadence, and widget count when routing
  district/terminal clicks.
- `WorldTerminalActionContractPanel` binds Queue, Tools, and Status terminals
  to safe action-bus descriptors plus governed preview-only actions, making the
  first terminal action model visible from the Operating Surface review.
- `WorldTerminalSurfacePreview` renders each Queue, Tools, and Status terminal
  with its `surface_layout.preview.widgets`, focus mode, and safe-action
  summary instead of a generic text label.
- Validation: `npm run test -- src/scene/world/worldDistrictPresentation.test.ts
  src/scene/world/worldDistrictUrgency.test.ts
  src/scene/world/worldDistrictContracts.test.ts` and the combined milestone
  suite passed on 2026-05-22.
- 2026-06-01 validation: `npm test -- --run src/lib/worldSurfaceSettings.test.ts
  src/scene/world/worldDistrictPresentation.test.ts
  src/scene/world/worldDistrictUrgency.test.ts`, `jq -e .
  core/state/arda_world_surfaces.json`, and `npm run build` passed.
- World terminal action-contract validation:
  `npm test -- --run
  src/components/arda/modules/WorldTerminalActionContractPanel.test.tsx
  src/components/arda/modules/PlanningActionContractPanel.test.tsx
  src/lib/systemActionBus.test.ts` passed on 2026-06-01.
- World terminal preview validation:
  `npm test -- --run src/scene/world/worldTerminalSurfacePreviewModel.test.ts
  src/lib/worldSurfaceSettings.test.ts
  src/scene/world/worldDistrictWorkflows.test.ts` passed on 2026-06-01.
- Routing/provider action-contract validation:
  `npm test -- --run
  src/components/arda/modules/systems/RoutingActionContractPanel.test.tsx
  src/lib/systemActionBus.test.ts` passed on 2026-06-01.
- World district workflow validation:
  `npm test -- --run src/scene/world/worldDistrictWorkflows.test.ts
  src/scene/world/worldDistrictContracts.test.ts
  src/scene/world/worldDistrictPresentation.test.ts
  src/scene/world/worldDistrictUrgency.test.ts` passed on 2026-06-01.

### Milestone 4: Add Live Runtime Channels

Goal: bridge from projection-backed status to live operational presence.

Work:

- Define the event schema for agent registration, task activity, provider
  routing, file activity, and human/operator actions.
- Decide whether the first transport is Tauri event stream, WebSocket, or a
  hybrid projection-plus-pulse model.
- Preserve file-backed projections as durable state while live streams power
  animations and immediate status.

Exit criteria:

- At least one domain updates live without a full bundle reload, and the same
  domain still has a durable projection for restart/recovery.

Current implementation note:

- First low-risk live channel is implemented as a native Tauri HUD pulse stream:
  Rust emits `arda://hud-pulse` events carrying `{ ts_unix_ms, status, source,
  sequence }`, the frontend subscribes through `listenHudPulse`, and `App.tsx`
  stores the latest event in transient React state rather than mutating the
  durable `ArdaBundle` projection.
- `OperatingSurfacePlanModule` now surfaces live channel freshness/evidence
  beside durable projection evidence, so the operator can distinguish immediate
  native presence from restart/recovery state.
   - Focused component coverage lives in
     `src/components/arda/modules/OperatingSurfacePlanModule.test.tsx` and verifies
     that live runtime evidence renders without replacing durable projection
     evidence.

### Milestone 5: Bring MYTHOS Ideas In Deliberately

Goal: incorporate the large vision without scattering the app.

Candidate epics:

- File Forest: inventory/document nodes, scoped file operations, Monaco editing.
- Agent Swarm: live agent actions, topology trails, replay timeline.
- Voice/Command: command parser and safe action bus.
- Git Rivers: repository/branch visualization and PR/task linkage.
- Remote Cockpit: secure home-base connection and laptop operation.
- XR Mode: later reuse of scene contracts, not a near-term dependency.
- Reusable System Surfaces: service/custom component embeds for Annunimas,
  Factory, Warp, VAST, local dashboards, websites, and user-created views.
- Local Service Surfaces: Grafana on Beelink, Open WebUI on Beelink, Hermes
  Dashboard, and future noVNC/WebRTC/media endpoints as configured monitor or
  workstation surfaces. Inline embedding requires explicit `embed.allow_inline`
  and service CSP/frame policy compatibility; otherwise ARDA should show a
  lightweight preview and open the focused surface in a native window.
- ATHENA/Mnemosyne Library Books: nightly or operator-triggered research packets
  that preserve third-party docs, API notes, visual references, provenance, and
  freshness so ARDA adapters are generated from curated knowledge instead of
  scene hardcoding.

Rule: each epic must bind to a data contract, scene surface, action contract,
and exit criteria before implementation.

## Near-Term Backlog

1. Add local service manifests for Beelink Grafana and Open WebUI with safe
   default `allow_inline=false` until CSP/frame behavior is proven in Tauri.
   - First pass complete: manifests exist in `src/lib/surfaceAdapterManifests.ts`
     for `service_beelink_grafana` and `service_beelink_openwebui`; generated
     boardroom layouts default to native-window focus and inline embedding
     disabled.
   - 2026-06-01 validation: Grafana is reachable but denies framing with
     `X-Frame-Options: deny`; Open WebUI was not reachable on port 8080. Keep
     native-window focus as the safe default.
2. Expand Settings from first-pass surface editing to full multi-widget layout
   authoring, per-widget title/binding/grid-area controls, and service presets.
   - Complete first pass: Settings can add/remove preview widgets, edit each
     widget kind/title/data binding/grid area, and apply Beelink Grafana,
     Beelink Open WebUI, or Hermes presets.
3. Promote accepted edit-mode boardroom zone positions back into
   `boardroomSpatialLayout.ts` whenever operator tuning changes canonical
   layout.
4. Add data freshness and source provenance UI to `SystemsModule`,
   `SectionFocusModule`, `ReviewGateWorkstation`, and Hermes/queue surfaces.
   - First pass complete for Systems, Section Focus, Planning/Queue, Review
     Gate, Hermes dashboard surfaces, Human Realm, Business, Personal Growth,
     and boardroom preview widgets.
5. Define a small action contract for safe projection refreshes.
   - First pass complete: `ArdaRefreshAffordance` and
     `SourceRefreshAffordance` provide display-only refresh guidance for
     registered read-only/projection-refresh sources and explicitly mark queue
     refreshes as approval-gated.
   - Action-flow pass complete: Operating Surface exposes action-bus-backed
     read-only/dry-run refreshes separately from provenance badges and excludes
     governed mutations.
6. Turn the Review Gate into the first complete inspect-decide-record workflow.
   - First pass complete: Review Gate shows packet inspection, decision
     checklist, source freshness, and the exact decision record fields that will
     be submitted through the action bus before Approve/Reject.
7. Keep native Tauri validation notes current after visual, windowing, or live
   event-channel passes.
   - 2026-06-01 post world-terminal-preview validation complete:
     `distrobox enter lothlorien -- bash -lc 'cd
     /var/home/mythos/Annunimas/apps/arda-hud && npm run
     tauri:build:stable'` passed and produced
     `.target-local/cargo-target/release/arda_hud`.
8. Decide which remaining reference-only HUD components should be archived,
   extracted, or deleted.
   - Complete first pass: unused dashboard-era `src/components/hud/**`,
     `src/components/ingest/**`, and old `src/components/ui/**` files were
     archived under `archive/arda-hud/reference-components-2026-06-01`.
     Active component work stays in `src/components/arda/**`,
     `src/components/kit/**`, scene, and workstation contracts.
9. Extend boardroom-style assignment/settings contracts to world scene
   terminals and district surfaces.
   - First pass complete: `core/state/arda_world_surfaces.json` defines
     district and terminal surface roles, source-zone focus targets,
     presentation modes, preview widgets, and safe non-embed defaults.
     Settings renders world surface slots and `WorldRuntimeViewport` routes
     clicks through the configured focus targets.
10. Add explicit action contracts for world terminals.
    - First pass complete: Queue, Tools, and Status terminals now map to
      existing action-bus descriptors through `WorldTerminalActionContractPanel`;
      read-only/dry-run actions can run through the existing refresh action
      path, while governed mutations are shown as blocked preview-only actions.
    - Detail pass complete: terminal actions now resolve action-bus descriptor
      and capability-status evidence into status, risk, schedule, next-run,
      receipt/result path, gate, and related evidence rows.
11. Add an explicit action contract for the Knowledge/ATHENA workstation.
    - First pass complete: `KnowledgeActionContractPanel` maps
      `athena.refresh_digest` to the safe executable action-bus lane and shows
      `athena.ingest_knowledge` plus `athena.promote_policy_ready` as governed,
      human-review-required actions.
12. Add an explicit action contract for the Routing/Providers workstation.
    - First pass complete: `RoutingActionContractPanel` maps
      `chronos.run_provider_checks` and `charon.refresh_provider_intelligence`
      to the safe executable action-bus lane and keeps provider reroute as not
      exposed until a separate approval contract exists.
13. Add a measurable scene asset performance budget before the Blender polish
    pass.
    - First pass complete: `ARDA_ASSET_PERFORMANCE_BUDGET.md` defines per-asset
      and total build budgets, `assetPerformanceBudget.ts` classifies model,
      texture, HDR, and script offenders, and the 2026-06-01 build snapshot
      identifies the oversized desk GLBs and wall/floor texture channels that
      must be optimized, split, compressed, or lazy-loaded.
    - Default runtime deferral complete: the unused heavy desk starter variants
      and oversized AO/emissive channels no longer ship in the default build;
      `dist/assets` dropped from about 86 MB to about 25 MB while source assets
      remain available for later optimized promotion.
    - Runtime visual bridge complete: `boardroomVisualRefinement.ts` separates
      screen glass and metallic trim for current boardroom monitor/desk surfaces
      without adding binary asset payload.
14. Add an explicit open-source/export-share contract for provenance details.
    - First pass complete: `SourceActionContractPanel` is rendered from
      `DataSourceDetailsPanel`, supports safe local copy of source paths and
      provenance packets, and keeps external sharing gated until approval and
      redaction contracts are added.
    - Native reveal follow-up complete: `reveal_source_path` resolves only
      existing source paths inside the Annunimas workspace before handing them
      to the Tauri opener plugin. Browser mode reports native reveal as
      unavailable instead of silently pretending to open files.
15. Add an explicit action contract for Operations/HADES.
    - First pass complete: `OperationsActionContractPanel` maps HADES
      organization/link-check/recurring maintenance, WARDEN/CHRONOS audit
      evidence refresh, and setup readiness checks to the safe executable
      action-bus lane. Setup repair remains governed and visibly blocked behind
      the operator approval gate.
    - 2026-06-01 validation: focused Vitest coverage, production frontend
      build, and native stable Tauri build passed.
16. Prune remaining active native direct-fetch command remnants.
    - Complete: unused Numenor-era direct-fetch commands were removed from
      `src-tauri/src/lib.rs` and from the Tauri invoke handler after active
      frontend search showed no consumers. `fetch_inventory_tree`,
      scoped file mutation helpers, source reveal, action-bus commands, Hermes
      dashboard, pulse, and workstation-window commands remain active.
17. Extend the screen widget contract for varied visual media.
    - First pass complete: boardroom surface widgets now include explicit
      preview declarations for `.md`, `.pdf`, image, video, document,
      data-stream, and remote/session views. The preview model labels each
      medium and marks remote-session previews as attention unless the focused
      surface opens in a native window.
18. Add first focused-adapter contracts for media and remote sessions.
    - First pass complete: `surfaceAdapterManifests.ts` now includes
      `media_library` and `agent_remote_session` manifests, native-window focus
      contracts, Settings presets, and workstation manifests. Inline document,
      media, and remote-session rendering remains blocked until source/codec or
      transport/auth policies are explicit.
19. Add the first scoped focused media-library viewer.
    - First pass complete: `MediaLibraryModule` indexes scoped `human`, `docs`,
      and `data` roots through `fetch_inventory_tree`, classifies markdown,
      PDF, image, video, document, and data-stream files, previews safe
      text-like files through `read_file`, and keeps heavier media as
      native-focus placeholders until renderer/codec policy is explicit.
    - Native open follow-up complete: selected entries can use
      `open_source_path`, which resolves existing paths inside the Annunimas
      workspace before handing them to the Tauri opener plugin.
    - Scoped image preview follow-up complete: supported image files use
      `read_source_image_preview` to return size-capped data URLs for inline
      preview, while unsupported or oversized media remain native-focus.
    - Scoped video preview follow-up complete: supported video files use
      `read_source_video_preview` to return size-capped data URLs for inline
      playback, while unsupported or oversized video remains native-focus.
    - Scoped PDF preview follow-up complete: supported PDF files use
      `read_source_pdf_preview` to return size-capped data URLs for inline
      preview, while document formats remain native-focus until conversion and
      redaction rules are explicit.

## Operating Rule

Every ARDA feature should now answer five questions before it lands:

1. What operator question does it answer?
2. What data source backs it?
3. How does ARDA show freshness, missing state, and policy/readiness state?
4. What action can the operator take from this surface?
5. Does it belong in the boardroom, the world, or a workstation?

If a feature cannot answer those questions yet, keep it in the idea bank rather
than adding another partial surface.
