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

# sigil: REPAIR
# ARDA Implementation Plan

> **Status:** Current completion record.
>
> **Disposition:** Keep. This is the canonical record of the completed
> scene-first rebuild pass through Phase 7 plus the first follow-on
> productization work.
>
> **Last triage:** 2026-06-01.

This document translates the rebuild phases into concrete implementation work.

Use it with:

- `docs/arda/ARDA_FRONTEND_REBUILD.md`
- `apps/arda-hud/ARDA_AUDIT.md`

## Current Status

- Phase 0: baseline freeze guidance defined
- Phase 1: scene runtime contracts written
- Phase 2: complete
- Phase 3: complete
- Phase 4: complete
- Phase 5: complete (5.3 complete)
- Phase 6: complete
- Phase 7: complete
- Phase 8: in progress (runtime parity, App structure, boardroom surface contracts, provenance adoption)

## Working Rule

Each work package should:

- touch only one phase unless explicitly marked cross-phase
- preserve packaging/build/launch behavior
- update status here when complete

## Phase 2: Scene-Native Data Projection

### 2.1 Add Scene Projection To Bundle

Status:

- complete

Files:

- `src/lib/ardaSource.ts`

Outcome:

- additive scene-native projection exists for:
  - `sceneZones`
  - `sceneAnchors`
  - `sceneSurfaces`
  - `workstationManifests`

### 2.2 Make Current App Read Scene Projection

Status:

- complete

Files:

- `src/App.tsx`

Required work:

- use `sceneZones` where world/district concepts are needed
- use `workstationManifests` where workstation/module semantics are needed
- keep current UI stable while reducing direct panel-centric assumptions

Outcome:

- `src/App.tsx` now consumes additive scene-native projection for districts and
  workstation/module counts without breaking the existing shell

### 2.3 Split Panel-Centric State From Reusable State

Status:

- complete

Files:

- `src/stores/appStore.ts`
- `src/lib/ardaSource.ts`
- `src/App.tsx`

Required work:

- identify reusable domain entities
- identify legacy HUD-only nav/ui state
- isolate or remove state that blocks scene migration

Progress:

- shared app state types extracted to `src/stores/appStateTypes.ts`
- demo seed data extracted to `src/stores/appStateSeedData.ts`
- `appStore.ts` reduced to store shell plus explicit runtime/UI initialization

Outcome:

- `src/App.tsx` no longer depends on the legacy HUD/Zustand store for the
  scene-runtime three-layer flag
- ARDA orchestration now keeps that runtime flag in the ARDA shell boundary,
  reducing coupling to demo seed state and legacy HUD navigation state

### 2.4 Introduce Scene Runtime Types

Status:

- complete

Files:

- `src/scene/systems/`
- `src/lib/ardaSource.ts`

Required work:

- define implementation-facing TS types for:
  - anchors
  - zones
  - surfaces
  - workstation instances
  - camera states
  - interaction events

Outcome:

- implementation-facing runtime types now exist under
  `src/scene/systems/runtimeTypes.ts`

## Phase 3: Boardroom Scene Implementation

### 3.1 Build Boardroom Runtime Skeleton

Status:

- complete

Files:

- `src/scene/boardroom/`

Required work:

- create real scene entry component
- create boardroom anchor registry
- create camera-state wiring
- create placeholder geometry ownership

Outcome:

- real boardroom runtime entry added at `src/scene/boardroom/BoardroomViewport.tsx`
- boardroom now has a 3D runtime skeleton with anchor-driven interaction hooks

### 3.2 Bridge Current App To New Boardroom Runtime

Status:

- complete

Files:

- `src/App.tsx`
- `src/scene/boardroom/BoardroomViewport.tsx`
- `src/components/arda/core/SceneWorkstation.tsx`

Required work:

- route current boardroom mode through new scene runtime
- remove legacy stage fallback; route boardroom through the scene runtime only

Outcome:

- `App.tsx` now routes boardroom mode through the active 3D runtime only
- legacy non-WebGL boardroom fallback was removed

## Phase 4: World Scene Implementation

### 4.1 Build World Runtime Skeleton

Status:

- complete

Files:

- `src/scene/world/`

Required work:

- create traversal scene entry
- create district zone model
- create world terminal anchors
- create return-to-boardroom path

Outcome:

- real world runtime entry added at `src/scene/world/WorldViewport.tsx`
- world now has a 3D traversal skeleton with district and terminal anchor concepts

### 4.2 Bridge Current App To New World Runtime

Status:

- complete

Files:

- `src/App.tsx`
- `src/components/world/WorldViewport.tsx`
- `src/scene/world/`

Required work:

- preserve mode-switching behavior
- keep world mode routed through the scene runtime

Outcome:

- `App.tsx` now routes world mode through the active 3D runtime only
- legacy flat world fallback was removed

## Phase 5: Workstations And Native Windowing

### 5.1 Normalize Workstation Model

Status:

- complete

Files:

- `src/components/arda/core/SceneWorkstation.tsx`
- `src/components/arda/core/PanelWorkspace.tsx`
- `src/utils/multiWindow.ts`

Required work:

- distinguish workstation content from workstation container
- map workstation manifests to actual instances

Outcome:

- `App.tsx` now stores floating workstations by manifest identity rather than
  raw section id
- workstation titles, module sets, and pop-out behavior now resolve from
  `workstationManifests`
- a compatibility manifest exists for `settings` so the transition does not
  regress operator controls

### 5.2 Replace Browser Popup Assumptions

Status:

- complete

Files:

- `src/utils/multiWindow.ts`
- `src-tauri/src/lib.rs`
- `src-tauri/tauri.conf.json`
- `src-tauri/capabilities/default.json`

Required work:

- replace browser-popup strategy with explicit Tauri-native window behavior

Outcome:

- `src/utils/multiWindow.ts` now carries workstation-aware metadata:
  `windowRole`, `workstationId`, `sourceZoneId`, `originAnchorId`, and
  `presentationMode`
- workstation pop-outs now call a dedicated Tauri command for native
  workstation windows before falling back to browser behavior
- `src-tauri/src/lib.rs` now creates and focuses workstation windows by label
  and routes window controls to the current window instead of always `main`
- `src-tauri/capabilities/default.json` now grants the default capability to
  `arda-workstation-*` windows

### 5.3 Add Workstation State Sync

Status:

- complete

Files:

- `src/utils/multiWindow.ts`
- `src/App.tsx`
- `src/components/arda/core/SceneWorkstation.tsx`
- `src/components/arda/core/PanelWorkspace.tsx`

Required work:

- define the first real workstation-specific state sync path across scene and
  native window

Outcome:

- workstation state is now keyed by `workstationId` and persisted in
  `localStorage`
- active module, source zone, origin anchor, presentation mode, and basic layout
  metadata are broadcast through the workstation bridge
- browser popouts, same-window listeners, and Tauri native workstation windows
  now converge on the `workstation-sync` event path
- `SceneWorkstation` and `PanelWorkspace` can now run in controlled mode so
  active module selection can follow a synced workstation state

### 5.4 Native Pop-Out Placement And Multi-Monitor Movement

Status:

- complete

Files:

- `src-tauri/src/lib.rs`
- `src/App.tsx`
- `src/scene/boardroom/BoardroomViewport.tsx`

Outcome:

- native workstation windows center on creation instead of offsetting from a
  fullscreen main window
- native workstation windows use OS decorations so they can be dragged to other
  monitors
- custom ARDA window controls are hidden inside workstation pop-out windows to
  avoid duplicate chrome
- in-scene workstation overlays now render as a normal DOM layer above the
  boardroom canvas instead of through Drei fullscreen `Html`, avoiding native
  WebKit bottom-right placement drift

Validation:

- `npm run build`: passed on 2026-06-01
- native hot-reload Tauri shell launched through `npm run tauri:dev:stable`

## Phase 6: Photoreal Asset/Material Pass

### 6.1 Asset Pipeline Definition

Status:

- complete

Files:

- `src/assets/scene/ASSET_PIPELINE_CONTRACT.md`
- `src/scene/systems/MATERIAL_CONTRACT.md`
- `src/scene/systems/LIGHTING_CONTRACT.md`
- `src/scene/systems/ATMOSPHERE_CONTRACT.md`
- `src/scene/systems/PRESENCE_CONTRACT.md`
- `src/scene/shaders/SHADER_CONTRACT.md`

Outcome:

- asset organization, naming, ingest rules, and scene-domain mapping are
  defined in `ASSET_PIPELINE_CONTRACT.md`
- PBR conventions, material families, and anchor-to-family defaults are
  defined in `MATERIAL_CONTRACT.md`
- named lighting rigs for boardroom and world are defined in
  `LIGHTING_CONTRACT.md`
- fog, sky, environment, and particulate rules are defined in
  `ATMOSPHERE_CONTRACT.md`
- hologram/presence composition, bindings, and restraint rules are defined
  in `PRESENCE_CONTRACT.md`
- shader categories, authoring conventions, and factory-based integration
  rules are defined in `SHADER_CONTRACT.md`

### 6.2 Visual Replacement Pass

Status:

- complete

Required work:

- replace placeholder/transitional visuals
- remove dominant neon-dashboard look from primary experience

Files:

- `src/scene/systems/sceneAssets.ts`
- `src/scene/boardroom/BoardroomViewport.tsx`
- `src/scene/world/WorldViewport.tsx`
- `src/assets/scene/**`

Outcome:

- procedural starter  asset pack is synced into the Phase 6 asset
  layout with metadata sidecars
- material metadata was repaired after sync so active families expose
  `channels` and `status` for the runtime loader
- boardroom runtime now uses the synced HDRI environment map, procedural
  boardroom/control/monitor GLBs where available, and material-family
  fallbacks where needed
- boardroom runtime now owns fixed ARDA interaction pads for monitors, desk
  controls, settings, and the world gate so the synced starter meshes are
  functional even when genGLB/HDRIerated anchors are sparse
- boardroom visual slot IDs are now separated from workstation/domain IDs:
  `monitor_left_1` through `monitor_left_4`, `view_desk_l`,
  `view_desk_control_panel`, `view_desk_r`, and `view_desk_aux` remain stable
  scene placement IDs while workstation assignment remains swappable
- scene slots now open floating workstations through the same path as settings;
  unassigned slots receive slot-specific template workstations under
  `scene_slot:<slot_id>` so future customizable components have a real runtime
  container without falling back to one generic placeholder
- boardroom scene-slot assignment is now operator-configurable in edit mode and
  persisted in browser-local state under `arda.boardroom.scene_slots.v1`
- first slot component contract was added under
  `src/scene/workstations/SLOT_COMPONENT_CONTRACT.md` to define how stable
  scene slots host swappable workstation/component content
- slot template manifests are now centralized in
  `src/scene/workstations/sceneSlotWorkstationTemplates.ts` and covered by
  `src/scene/workstations/sceneSlotWorkstationTemplates.test.ts`
- boardroom presence was extracted into a visible `PresenceAvatar` component
  that renders the synced `presence_rig.glb` unconditionally with a brighter
  hologram material and existing projection/scanline masks
- world runtime now uses synced world ground, district, and terminal GLBs where
  available
- duplicated inline runtime debug HUDs were extracted into reusable
  `SceneRuntimeCard` and are now shown only when edit/debug mode is enabled
- superseded old desk/floor JPG channels were removed from the runtime asset
  tree so Vite no longer bundles them through the eager material glob

Validation:

- `npm test -- --run src/scene/workstations/sceneSlotWorkstationTemplates.test.ts src/lib/boardroomSlotSettings.test.ts src/scene/boardroom/boardroomSurfacePreviewModel.test.ts`: passed; 13 tests
- `npm run build`: passed

## Phase 7: Retirement Pass

### 7.1 Remove Retired HUD Shell Files

Status:

- complete

Files:

- `src/components/hud/TopBar.tsx`
- `src/components/hud/LeftRail.tsx`
- `src/components/hud/BottomDock.tsx`
- `src/components/hud/CorporateDeskShell.tsx`
- `src/components/hud/MonitorPopoutPilot.tsx`
- `src/components/hud/Lounge.tsx`
- `src/components/hud/AvatarCustomization.tsx`

Outcome:

- retired files deleted after confirming the ARDA shell no longer imports
  `src/components/hud/**`
- stale `MonitorPopoutPilot` import/render removed from the remaining
  reference-only legacy `SettingsPanel`

### 7.3 Archive Remaining Reference Components

Status:

- complete

Files:

- `src/components/hud/**`
- `src/components/ingest/**`
- `src/components/ui/**`
- `archive/arda-hud/reference-components-2026-06-01/**`

Outcome:

- active imports were audited and no runtime references remained for the legacy
  dashboard-era `hud`, slot/ingest, or old base `ui` component trees
- those files were moved out of `apps/arda-hud/src` into an archive folder with
  a disposition note
- active component work now stays under `src/components/arda/**`,
  `src/components/kit/**`, scene contracts, and workstation contracts

Validation:

- `rg` found no active imports of the archived component trees outside their own
  files before the move
- `npm run build`: passed after moving the reference component trees out of
  `apps/arda-hud/src`

### 7.2 Remove Legacy Runtime Baggage

Status:

- complete

Files:

- `src/utils/multiWindow.ts`
- `src-tauri/src/lib.rs`
- `src/stores/appStore.ts`
- `src/lib/numenorProvider.ts`
- `src/lib/dataProvider.ts`
- `src/lib/zvecSearch.ts`
- `src/components/world/**`
- `archive/arda-hud/legacy-runtime-2026-06-01/**`

Required work:

- remove stale dashboard-first assumptions once replacements are stable

Outcome:

- removed unscoped voice-era native commands from the Tauri invoke surface:
  `list_directory`, `create_folder`, `delete_path`, `create_file`,
  `rename_path`, and `move_path`
- kept scoped filesystem commands for the remaining reference inventory
  workflow: `create_scoped_folder`, `rename_scoped_path`,
  `delete_scoped_path`
- added `write_scoped_file` so settings/reference writes use
  `numenorPath + relativePath` instead of arbitrary absolute paths
- updated ARDA HUD settings save and remaining reference HUD write paths to use
  scoped writes
- downgraded legacy voice filesystem handling to a retired/no-op path so it no
  longer references removed native commands
- archived the unused Numenor-era provider/store/helper/runtime wrapper files
  after confirming they are not imported by the active ARDA build
- removed unused Numenor-era direct-fetch wrappers from `src/lib/weathertop.ts`
  after archiving their only frontend consumer
- removed unused Numenor-era direct-fetch Tauri commands and invoke-handler
  registrations from `src-tauri/src/lib.rs`; scoped inventory/file helpers,
  source reveal, action-bus commands, Hermes, pulse, and workstation windows
  remain active
- `src/utils/multiWindow.ts` remains active for Tauri/native workstation window
  sync; it was not archived

Validation:

- `rg` found no active imports for `numenorProvider`, `dataProvider`,
  `zvecSearch`, `src/stores`, or old `components/world`
- `rg` found no references to the removed legacy direct-fetch wrappers
- `rg` found no active frontend/native references to the removed direct-fetch
  Tauri commands
- `npm test -- --run src/lib/systemActionBus.test.ts src/lib/ardaPresenceSchema.test.ts src/lib/ardaSource.remoteConfidence.test.ts src/lib/boardroomSlotSettings.test.ts`: passed; 27 tests
- `npm run build`: passed

## Phase 8: Productization And Surface Runtime

Status:

- in progress

Purpose:

- move ARDA from scene-first rebuild into a configurable operating surface
- keep native Tauri/WebKit as the canonical proof path
- make boardroom monitors and desk terminals configurable without hardcoding
  every visual or service directly into `BoardroomViewport`
 - ARDA target is universal agentic control surface.
 -Annunimas is first-class adapter/profile.
 - Workstation recovery must preserve scene-slot configurability.

### 8.1 Runtime Parity And App Structure

Status:

- complete

Files:

- `src/lib/ardaRuntimeMode.ts`
- `src/components/arda/core/RuntimeModeBadge.tsx`
- `src/lib/ardaBundleTypes.ts`
- `src/lib/ardaReaders.ts`
- `src/lib/ardaSource.ts`
- `src/components/arda/hooks/useArdaBundle.ts`
- `src/components/arda/hooks/useArdaRuntimePulse.ts`
- `src/components/arda/hooks/useArdaWindowControls.ts`
- `src/components/arda/hooks/useArdaActionAdapters.ts`
- `src/App.tsx`

Outcome:

- ARDA now labels browser/Vite, Tauri dev, static preview, and Tauri native
  runtime modes explicitly
- the operating rail warns when a mode is useful for layout but not native proof
- bundle loading, runtime pulse, window controls, and action adapters are split
  out of the root component
- `ardaSource.ts` is no longer the only place holding bundle types, readers, and
  source orchestration

Validation:

- `npm test`: passed earlier in this runtime parity slice
- `npm run build`: passed
- `npm run tauri:build:stable`: passed in distrobox `lothlorien`

### 8.2 Boardroom Command Core And Hermes Terminal

Status:

- complete first pass

Files:

- `src/scene/boardroom/BoardroomViewport.tsx`
- `src/scene/boardroom/boardroomSpatialLayout.ts`
- `src/index.css`

Outcome:

- center control core is now a wider desk/control surface
- command core presents a split visual: screen area plus physical buttons
- buttons route to existing safe surfaces/actions: planning, governance, routing,
  Hermes, world, and settings
- Hermes desk slot can render as a terminal-like surface instead of a generic
  instrument card
- avatar/presence remains intentionally unchanged pending a dedicated avatar pass

Validation:

- `npm test -- --run src/scene/boardroom/boardroomSpatialLayout.test.ts src/scene/boardroom/boardroomHudInstruments.test.ts`: passed
- `npm run build`: passed
- native Tauri stable build passed earlier in this boardroom slice

### 8.3 Boardroom Surface Layout Contract

Status:

- renderer/model/editor/local-service manifest first pass complete; richer layout authoring and native embed proof pending

Files:

- `ARDA_BOARDROOM_SLOT_ASSIGNMENT_CONTRACT.md`
- `src/lib/boardroomSlotSettings.ts`
- `src/lib/boardroomSlotSettings.test.ts`
- `src/components/arda/hooks/useBoardroomSlotAssignments.ts`
- `src/components/arda/modules/SettingsModule.tsx`
- `src/components/arda/core/types.ts`
- `src/scene/boardroom/BoardroomSurfacePreview.tsx`
- `src/scene/boardroom/boardroomSurfacePreviewModel.ts`
- `src/scene/boardroom/boardroomSurfacePreviewModel.test.ts`
- `src/App.tsx`

Outcome:

- each boardroom slot assignment can now carry a `surface_layout`
- `surface_layout` includes adapter type, preview mode, preview refresh cadence,
  preview widgets, focus mode, focus target, focused refresh cadence, embed URL,
  and inline-embed permission
- old or partial workspace slot documents normalize from defaults
- Settings now displays the contract for all monitor and desk slots
- current defaults support component-grid previews, external-service previews,
  and Hermes service/embed terminal behavior
- boardroom monitor and desk previews now render compact widgets from
  `surface_layout.preview.widgets` instead of relying only on the older HUD
  instrument fallback
- the preview widget contract now explicitly covers mixed visual media:
  `.md`, `.pdf`, image, video, document, data-stream, agent-comms, iframe, and
  remote-session declarations. These render as compact screen previews while
  actual playback/rendering/remote transport remains focused-adapter work.
- `surfaceAdapterManifests.ts` now includes first focused-adapter contracts for
  `media_library` and `agent_remote_session`, both routed through native-window
  focus with inline rendering blocked until source/codec or transport/auth
  policy is explicit.
- `MediaLibraryModule` now provides the first scoped focused viewer for
  `media_library`: it indexes the `human`, `docs`, and `data` roots through the
  scoped inventory IPC path, classifies markdown/PDF/image/video/document/data
  entries, previews text-like files read-only, and opens selected files through
  the scoped native `open_source_path` command. Supported image files now use
  the scoped, size-capped `read_source_image_preview` path for inline previews;
  supported video files use the scoped, size-capped
  `read_source_video_preview` path for inline playback; supported PDF files use
  the scoped, size-capped `read_source_pdf_preview` path; document files remain
  native-focus work.
- Settings now provides controls for adapter type, focus mode, embed URL, inline
  embed policy, preview refresh cadence, add/remove preview widgets, per-widget
  kind/title/data binding/grid area, and Beelink Grafana/Open WebUI/Hermes
  plus media-library/agent-session presets
- full boardroom slot documents are saved so surface layout edits are preserved
- Beelink Grafana and Open WebUI service manifests are available as local
  service surfaces with native-window focus and inline embedding disabled

Validation:

- `npm test -- --run src/lib/surfaceAdapterManifests.test.ts src/lib/boardroomSlotSettings.test.ts src/scene/boardroom/boardroomSurfacePreviewModel.test.ts`: passed; 12 tests
- `npm run build`: passed
- Native stable build passed in distrobox `lothlorien` on 2026-06-01.
- Beelink Grafana is reachable at `http://100.103.125.88:3000`, but returns
  `X-Frame-Options: deny`, so `embed.allow_inline=true` is not valid for that
  service without upstream proxy/header changes.
- Beelink Open WebUI was not reachable at `http://100.103.125.88:8080` during
  the 2026-06-01 service probe.

Open follow-on work:

- run native GUI focus-click validation for local service native-window focus
  after Open WebUI reachability is restored; keep inline embedding disabled
  unless a service explicitly allows framing in Tauri/WebKit

### 8.4 Source Provenance Adoption

Status:

- first pass complete for core module surfaces, lower-traffic context modules,
  Planning/Queue provenance, boardroom preview provenance, and display-only
  refresh affordances

Files:

- `src/lib/ardaProvenance.ts`
- `src/components/arda/modules/SourceFreshnessStrip.tsx`
- `src/components/arda/modules/systems/SourceTrustPanel.tsx`
- `src/components/arda/modules/SectionFocusModule.tsx`
- `src/components/arda/modules/ReviewGateWorkstation.tsx`
- `src/components/arda/modules/HermesDashboardModule.tsx`
- `src/components/arda/modules/HumanRealmModule.tsx`
- `src/components/arda/modules/BusinessModule.tsx`
- `src/components/arda/modules/PersonalGrowthModule.tsx`
- `src/components/arda/modules/QueueProvenancePanel.tsx`
- `src/components/arda/modules/DataFreshnessBadge.tsx`
- `src/components/arda/modules/SourceRefreshAffordance.tsx`
- `src/scene/boardroom/BoardroomSurfacePreview.tsx`
- `src/scene/boardroom/boardroomSurfacePreviewModel.ts`
- `src/App.tsx`

Outcome:

- Systems continues to summarize source trust through `SourceTrustPanel`
- Section Focus now shows freshness for source records matching the selected
  module/domain
- Review Gate now shows freshness for the selected packet's backing source
  domain
- Hermes Dashboard now shows freshness for Hermes, dispatch, and gateway source
  records
- Human Realm, Business, and Personal Growth now show compact source freshness
  strips from `ArdaBundle.sourceProvenance`, moving those context modules beyond
  source-map coverage badges
- Planning now renders queue/planning/HADES source freshness through
  `QueueProvenancePanel`
- the new surfaces consume `ArdaBundle.sourceProvenance` without executing
  refresh commands or implying that projection-backed data is live-streamed
- `ArdaRefreshAffordance` classifies source paths as read-only,
  projection-refresh-only, approval-required, or manual-only
- `SourceRefreshAffordance` renders refresh guidance in display-only mode beside
  provenance records and in source detail panels
- queue projection refreshes are explicitly approval-gated instead of exposed as
  direct commands
- boardroom monitor and desk previews now match `surface_layout` focus/widget
  bindings against `ArdaBundle.sourceProvenance`
- stale, missing, blocked, or unknown projection-backed boardroom previews are
  promoted to attention status and show compact provenance/safety labels

Validation:

- `npm test -- --run src/components/arda/modules/SectionFocusModule.test.tsx src/components/arda/modules/ReviewGateWorkstation.test.tsx src/lib/surfaceAdapterManifests.test.ts src/lib/boardroomSlotSettings.test.ts src/scene/boardroom/boardroomSurfacePreviewModel.test.ts`: passed; 18 tests
- `npm test -- --run src/lib/ardaProvenance.test.ts src/components/arda/modules/SourceRefreshAffordance.test.tsx src/components/arda/modules/SectionFocusModule.test.tsx src/components/arda/modules/ReviewGateWorkstation.test.tsx src/components/arda/modules/systems/SourceTrustPanel.test.tsx`: passed; 31 tests
- `npm test -- --run src/components/arda/modules/QueueProvenancePanel.test.tsx src/components/arda/modules/SourceRefreshAffordance.test.tsx src/lib/ardaProvenance.test.ts`: passed; 25 tests
- `npm test -- --run src/scene/boardroom/boardroomSurfacePreviewModel.test.ts src/components/arda/modules/QueueProvenancePanel.test.tsx src/lib/ardaProvenance.test.ts`: passed; 25 tests
- `npm test -- --run src/components/arda/modules/LowerTrafficCoverageBadges.test.tsx
  src/components/arda/modules/DataFreshnessBadge.test.tsx`: passed; 8 tests
- `npm run build`: passed

Open follow-on work:

- continue extending action contracts to remaining focused workstations where
  command execution gates are clear

### 8.5 Refresh Action Flow

Status:

- first pass complete

Files:

- `src/components/arda/modules/OperatingSurfacePlanModule.tsx`
- `src/components/arda/modules/OperatingSurfacePlanModule.test.tsx`
- `src/App.tsx`

Outcome:

- Operating Surface now has a `Refresh Action Flow` section that is separate
  from provenance badges and source-detail panels.
- The flow exposes only action-bus-backed refresh descriptors that are
  `read_only` or `dry_run`; governed mutations such as policy promotion and
  setup repair remain excluded.
- Clicking a refresh action routes through `executeSystemAction()`, records the
  provider/result message, and refreshes the ARDA bundle after success.

Validation:

- `npm test -- --run src/components/arda/modules/OperatingSurfacePlanModule.test.tsx src/lib/systemActionBus.test.ts`: passed; 21 tests
- `npm run build`: passed

### 8.6 Planning Task Capture Action Contract

Status:

- first pass complete

Files:

- `src/components/arda/modules/PlanningActionContractPanel.tsx`
- `src/components/arda/modules/PlanningActionContractPanel.test.tsx`
- `src/App.tsx`

Outcome:

- Planning now has a focused action-contract panel instead of only queue and
  plan readouts.
- The panel exposes `queue.preview_cleanup` as a dry-run queue preview button
  routed through the same action bus path as the Operating Surface refresh
  lane.
- The panel also shows a governed `queue.capture_pivot` task-pivot record
  preview, including the exact `annunimas-cli utility task-pivot` command shape,
  owner, priority, origin, scope, glyph, status, and result fields.
- The task-pivot mutation remains operator-gated and is not exposed as a
  generic one-click refresh action.

Validation:

- `npm test -- --run src/components/arda/modules/PlanningActionContractPanel.test.tsx src/components/arda/modules/OperatingSurfacePlanModule.test.tsx src/lib/systemActionBus.test.ts`: passed; 24 tests
- `npm run build`: passed

### 8.7 Review Gate Inspect-Decide-Record Workflow

Status:

- first pass complete

Files:

- `src/components/arda/modules/ReviewGateWorkstation.tsx`
- `src/components/arda/modules/ReviewGateWorkstation.test.tsx`
- `src/App.tsx`

Outcome:

- Review Gate now presents the selected packet as an inspect/decide/record
  workflow instead of only a list plus buttons.
- The selected packet shows action requested, decision rationale, decision
  effect, evidence, checklist, source freshness, and decision controls.
- `buildReviewGateDecisionRecordPreview()` creates the exact
  `decision_class`, `command_signature`, `approvers`, `evidence`, and note
  fields used by the workstation preview and by `submitReviewGateDecision()`.
- Approve/Reject still routes through the existing governed
  `approve_human_augmentation` action bus path.

Validation:

- `npm test -- --run src/components/arda/modules/ReviewGateWorkstation.test.tsx`: passed; 6 tests
- `npm run build`: passed

### 8.8 World Surface Assignment Contract

Status:

- first pass complete

Files:

- `core/state/arda_world_surfaces.json`
- `src/lib/worldSurfaceSettings.ts`
- `src/lib/worldSurfaceSettings.test.ts`
- `src/components/arda/hooks/useWorldSurfaceAssignments.ts`
- `src/components/arda/modules/SettingsModule.tsx`
- `src/scene/world/WorldViewport.tsx`
- `src/App.tsx`

Outcome:

- World districts and terminals now have a workspace-backed settings document
  parallel to the boardroom slot contract.
- The contract defines surface role, source-zone focus target, component id,
  module ids, presentation modes, preview widgets, refresh cadence, focus mode,
  and non-embed defaults.
- Settings renders world surface slots beside boardroom slots and can adjust
  adapter type, focus mode, focus target, and preview refresh cadence.
- `WorldRuntimeViewport` consumes configured world surface layouts so district
  and terminal clicks route through the configured focus target instead of only
  the hardcoded anchor/urgency target.

Validation:

- `npm test -- --run src/lib/worldSurfaceSettings.test.ts
  src/scene/world/worldDistrictPresentation.test.ts
  src/scene/world/worldDistrictUrgency.test.ts`: passed; 12 tests
- `jq -e . core/state/arda_world_surfaces.json`: passed
- `npm run build`: passed

### 8.9 World Terminal Action Contracts

Status:

- first pass complete

Files:

- `src/components/arda/modules/WorldTerminalActionContractPanel.tsx`
- `src/components/arda/modules/WorldTerminalActionContractPanel.test.tsx`
- `src/components/arda/index.ts`
- `src/App.tsx`
- `src/index.css`

Outcome:

- Queue, Tools, and Status world terminals now have explicit action contracts
  tied to existing action-bus descriptors.
- Safe/read-only/dry-run terminal actions reuse the Operating Surface refresh
  execution path.
- Governed terminal mutations remain preview-only/operator-gated and are shown
  with their governance gate/status instead of being exposed as one-click
  terminal actions.
- Terminal actions now resolve descriptor/status detail into visible status,
  risk, schedule, next-run, receipt/result path, governance gate, and evidence
  rows so the operator can inspect why each terminal action is runnable or
  blocked.
- The Operating Surface review now includes the terminal action contract panel
  so world terminals are part of the cockpit workflow model before deeper
  terminal-specific visuals land.

Validation:

- `npm test -- --run src/components/arda/modules/WorldTerminalActionContractPanel.test.tsx
  src/components/arda/modules/PlanningActionContractPanel.test.tsx
  src/lib/systemActionBus.test.ts`: passed; 20 tests
- `npm test -- --run src/components/arda/modules/WorldTerminalActionContractPanel.test.tsx
  src/lib/systemActionBus.test.ts`: passed; 18 tests

### 8.10 Knowledge Workstation Action Contract

Status:

- first pass complete

Files:

- `src/components/arda/modules/systems/KnowledgeActionContractPanel.tsx`
- `src/components/arda/modules/systems/KnowledgeActionContractPanel.test.tsx`
- `src/components/arda/modules/systems/KnowledgeMapPanel.tsx`
- `src/components/arda/modules/SystemsModule.tsx`
- `src/App.tsx`

Outcome:

- Knowledge/ATHENA now has an explicit focused action contract inside the
  Knowledge Map.
- `athena.refresh_digest` is exposed as the safe executable refresh action.
- `athena.ingest_knowledge` and `athena.promote_policy_ready` are shown as
  governed, human-review-required actions instead of being exposed as one-click
  mutations.
- The contract shares the same action-bus path and busy/result messaging used
  by Operating Surface, Planning, and world terminal contracts.

Validation:

- `npm test -- --run src/components/arda/modules/systems/KnowledgeActionContractPanel.test.tsx
  src/lib/systemActionBus.test.ts`: passed; 17 tests
- `npm run build`: passed

### 8.11 Routing Workstation Action Contract

Status:

- first pass complete

Files:

- `src/components/arda/modules/systems/RoutingActionContractPanel.tsx`
- `src/components/arda/modules/systems/RoutingActionContractPanel.test.tsx`
- `src/components/arda/modules/SystemsModule.tsx`
- `src/components/arda/index.ts`

Outcome:

- Routing/Providers now has an explicit focused action contract inside the
  Systems module.
- `chronos.run_provider_checks` and `charon.refresh_provider_intelligence` are
  exposed as safe executable refresh actions.
- Provider reroute is shown as not exposed until a separate approval contract
  exists, so route mutation is not implied by the provider refresh UI.
- The contract shares the same action-bus path and busy/result messaging used
  by Operating Surface, Planning, world terminal, and Knowledge contracts.

Validation:

- `npm test -- --run src/components/arda/modules/systems/RoutingActionContractPanel.test.tsx
  src/lib/systemActionBus.test.ts`: passed; 17 tests

### 8.12 Asset Performance Budget

Status:

- first pass complete; visual Blender refinement remains open

Files:

- `ARDA_ASSET_PERFORMANCE_BUDGET.md`
- `src/scene/systems/assetPerformanceBudget.ts`
- `src/scene/systems/assetPerformanceBudget.test.ts`
- `src/assets/scene/ASSET_PIPELINE_CONTRACT.md`

Outcome:

- ARDA now has explicit model, texture, environment, script, and total
  `dist/assets` size budgets for scene runtime assets.
- The budget model flags oversized assets with concrete recommendations:
  decimate/split/lazy-load models, resize/compress textures, downsample HDRI,
  or split/defer runtime chunks.
- The 2026-06-01 production build snapshot identifies the current top payload
  blockers before deferral: `boardroom_main_desk` at about 29.6 MB,
  `boardroom_main_desk_flux2` at about 22.1 MB, and `boardroom_wall_ao` at
  about 8.0 MB.
- The asset pipeline contract now requires runtime assets to satisfy the
  budget or carry an explicit lazy-load/archive/optimization note before being
  treated as production-ready.
- The default runtime import graph now excludes the unused heavy desk starter
  variants and oversized boardroom AO/emissive texture channels. The measured
  `dist/assets` payload dropped from about 86 MB to about 25 MB while keeping
  the source assets available for a later optimized/lazy-loaded Blender pass.

Validation:

- `npm test -- --run src/scene/systems/assetPerformanceBudget.test.ts`: passed
- `npm run build`: passed; `dist/assets` measured about 25 MB after deferral

### 8.13 World District Workflow Resolver

Status:

- first pass complete

Files:

- `src/scene/world/worldDistrictWorkflows.ts`
- `src/scene/world/worldDistrictWorkflows.test.ts`
- `src/scene/world/WorldViewport.tsx`
- `ARDA_WORLD_DISTRICT_CONTRACT.md`

Outcome:

- World districts now have an explicit workflow resolver between the static
  district contract, workspace-backed world surface layouts, and the 3D click
  path.
- Each district resolves its focus target, safe inspection actions,
  gated/draft-only action IDs, surface adapter, focus mode, preview widget
  count, and transition label before the viewport opens the focused panel.
- `WorldRuntimeViewport` stores workflow action IDs and surface metadata in
  district `userData`, keeping future debug/inspection overlays grounded in
  the same contract rather than decorative-only labels.

Validation:

- `npm test -- --run src/scene/world/worldDistrictWorkflows.test.ts
  src/scene/world/worldDistrictContracts.test.ts
  src/scene/world/worldDistrictPresentation.test.ts
  src/scene/world/worldDistrictUrgency.test.ts`: passed; 13 tests

### 8.14 Source Details Action Contract

Status:

- first pass complete; scoped native reveal complete

Files:

- `src/lib/sourceActionContract.ts`
- `src/lib/sourceActionContract.test.ts`
- `src/components/arda/modules/SourceActionContractPanel.tsx`
- `src/components/arda/modules/SourceActionContractPanel.test.tsx`
- `src/components/arda/modules/DataSourceDetailsPanel.tsx`
- `src-tauri/src/lib.rs`

Outcome:

- Source/provenance details now have an explicit action contract for the
  open-source/export-share lane.
- Safe actions copy source paths or a local provenance packet to the clipboard.
- Native source reveal is available through the scoped `reveal_source_path`
  Tauri command, which resolves only existing paths inside the Annunimas
  workspace before using the opener plugin.
- External sharing is gated until destination, redaction, and operator approval
  are explicit.

Validation:

- `npm test -- --run src/lib/sourceActionContract.test.ts
  src/components/arda/modules/SourceActionContractPanel.test.tsx`: passed; 4 tests
- `cargo test --manifest-path apps/arda-hud/src-tauri/Cargo.toml source_paths`
  inside distrobox `lothlorien`: passed; 2 tests
- `npm run build`: passed

### 8.15 World Terminal Preview Rendering

Status:

- first pass complete

Files:

- `src/scene/world/worldTerminalSurfacePreviewModel.ts`
- `src/scene/world/worldTerminalSurfacePreviewModel.test.ts`
- `src/scene/world/WorldTerminalSurfacePreview.tsx`
- `src/scene/world/WorldViewport.tsx`
- `src/index.css`

Outcome:

- Queue, Tools, and Status terminals now render compact terminal-specific
  previews in the world scene instead of generic text labels.
- Terminal previews consume `surface_layout.preview.widgets`, focus mode,
  adapter type, and safe-action summaries while preserving existing click
  routing through configured source-zone focus targets.
- Terminal object `userData` now carries adapter, focus mode, action summary,
  and widget count for future debug/inspection overlays.

Validation:

- `npm test -- --run src/scene/world/worldTerminalSurfacePreviewModel.test.ts
  src/lib/worldSurfaceSettings.test.ts
  src/scene/world/worldDistrictWorkflows.test.ts`: passed; 10 tests

### 8.16 Boardroom Runtime Visual Refinement Bridge

Status:

- first pass complete; final Blender asset art pass remains open

Files:

- `src/scene/boardroom/boardroomVisualRefinement.ts`
- `src/scene/boardroom/boardroomVisualRefinement.test.ts`
- `src/scene/boardroom/BoardroomViewport.tsx`
- `src/scene/boardroom/BOARDROOM_CONTRACT.md`
- `ARDA_ASSET_PERFORMANCE_BUDGET.md`

Outcome:

- Boardroom monitor and desk screen surfaces now render as separate physical
  glass panes plus metallic trim bars instead of one flat translucent box.
- The refinement model makes glass opacity/clearcoat, trim count, and trim
  metalness measurable before binary Blender promotion.
- This improves the current runtime cockpit depth without adding GLB or texture
  payload; the final bevel/proportion/glass/screen Blender pass remains open.

Validation:

- `npm test -- --run src/scene/boardroom/boardroomVisualRefinement.test.ts
  src/scene/boardroom/boardroomSpatialLayout.test.ts
  src/scene/boardroom/boardroomSurfacePreviewModel.test.ts
  src/scene/systems/assetPerformanceBudget.test.ts`: passed; 16 tests

### 8.17 Operations/HADES Workstation Action Contract

Status:

- first pass complete

Files:

- `src/components/arda/modules/OperationsActionContractPanel.tsx`
- `src/components/arda/modules/OperationsActionContractPanel.test.tsx`
- `src/components/arda/index.ts`
- `src/App.tsx`

Outcome:

- Operations and Packages now has an explicit focused action contract instead
  of only inspection panels.
- HADES organization-plan preview, HADES link check, HADES recurring
  maintenance, system audit, repeated audit, and setup readiness checks are
  exposed through the safe read-only/dry-run action-bus lane.
- Setup repair remains governed/operator-gated and is shown with its approval
  gate instead of being exposed as a one-click repair mutation.

Validation:

- `npm test -- --run src/components/arda/modules/OperationsActionContractPanel.test.tsx
  src/lib/systemActionBus.test.ts`: passed; 17 tests
- `npm run build`: passed
- `npm run tauri:build:stable` inside distrobox `lothlorien`: passed and
  produced `.target-local/cargo-target/release/arda_hud`

## Immediate Next Package

The rebuild plan is complete through Phase 7. Phase 8 is the current
productization track.

Recommended follow-on package:

1. run native GUI focus-click validation for Beelink Grafana/Open WebUI
   native-window focus after Open WebUI reachability is restored; keep Grafana
   inline embedding disabled because the service returns `X-Frame-Options: deny`
2. refine the procedural starter assets in Blender: bevels, proportions, glass
   panels, trims, and screen surfaces
   - Performance gate first pass complete: `ARDA_ASSET_PERFORMANCE_BUDGET.md`
     and `assetPerformanceBudget.ts` define the size budget and current build
     offenders; the visual Blender refinement and asset optimization remain
     open.
   - Runtime visual bridge complete: `boardroomVisualRefinement.ts` separates
     current monitor/desk glass panes and metallic trim without adding binary
     payload. Final Blender bevel/proportion/art polish remains open.
3. re-run native Tauri/WebKit service validation after Beelink service endpoint
   or proxy policy changes
   - Post world-terminal-preview/source-export native build validation passed:
     `npm run tauri:build:stable` inside distrobox `lothlorien` produced
     `.target-local/cargo-target/release/arda_hud`.
   - Post Operations/HADES action-contract native build validation passed:
     `npm run tauri:build:stable` inside distrobox `lothlorien` produced
     `.target-local/cargo-target/release/arda_hud`.
   - Post native direct-fetch command prune validation passed:
     `npm run tauri:build:stable` inside distrobox `lothlorien` produced
     `.target-local/cargo-target/release/arda_hud`.
   - Post mixed media/session preview widget validation passed:
     `npm run tauri:build:stable` inside distrobox `lothlorien` produced
     `.target-local/cargo-target/release/arda_hud`.
   - Post focused media/session adapter contract validation passed:
     `npm run tauri:build:stable` inside distrobox `lothlorien` produced
     `.target-local/cargo-target/release/arda_hud`.
   - Post scoped media-library focused viewer validation passed:
     `npm run tauri:build:stable` inside distrobox `lothlorien` produced
     `.target-local/cargo-target/release/arda_hud`.
   - Post scoped native media open action validation passed:
     `npm run tauri:build:stable` inside distrobox `lothlorien` produced
     `.target-local/cargo-target/release/arda_hud`.
   - Post scoped image preview validation passed:
     focused frontend tests, Vite production build, and the native Tauri image
     MIME allowlist test passed.
   - Post scoped video preview validation passed:
     focused frontend tests, Vite production build, and the native Tauri image
     and video MIME allowlist tests passed.
   - Post scoped PDF preview validation passed:
     focused frontend tests and native Tauri image/video/PDF MIME allowlist
     tests passed.
4. extend the slot assignment model to world scene terminals/district surfaces
   after the world interaction model is ready
   - First pass complete: world district/terminal surfaces now have
     `core/state/arda_world_surfaces.json`, runtime parsing, Settings display,
     and world-click focus routing.
   - Workflow pass complete: `worldDistrictWorkflows.ts` now resolves
     district focus targets, safe/gated action summaries, and surface metadata
     for the world viewport.
   - Terminal preview pass complete: `WorldTerminalSurfacePreview` now renders
     terminal-specific status/feed widgets from `surface_layout.preview.widgets`.
5. continue focused workstation/world terminal action contracts.
   - First pass complete for Queue, Tools, and Status terminals through
     `WorldTerminalActionContractPanel`.
   - Terminal action detail complete for Queue, Tools, and Status terminals:
     descriptor/status evidence now shows receipt/result paths, schedule,
     risk, governance gate, and related evidence for each action.
   - First pass complete for Knowledge/ATHENA through
     `KnowledgeActionContractPanel`.
   - First pass complete for Source Details open-source/export-share through
     `SourceActionContractPanel`.
   - Scoped native source reveal complete through `reveal_source_path`;
     external sharing remains gated.
   - First pass complete for Operations/HADES through
     `OperationsActionContractPanel`.
6. keep future filesystem/data expansion on scoped inventory/file helpers,
   explicit action contracts, or `ArdaBundle`/`core/state` projections; do not
   reintroduce broad direct-fetch Tauri commands without a current consumer and
   projection contract
   - Current prune complete: unused Numenor-era direct-fetch Tauri commands and
     invoke-handler registrations were removed from active native source.


## Appendix B: Data Surface Map (Integrated 2026-05-21)

This appendix preserves the source inventory and representative backend shapes
originally documented in `ARDA_DATA_SURFACE_MAP_2026-05-21.md — archived data surface map; content integrated into `ARDA_IMPLEMENTATION_PLAN.md` Appendix B`. Boardroom surface
assignment behavior is now governed by `ARDA_BOARDROOM_SLOT_ASSIGNMENT_CONTRACT.md`
and `src/lib/boardroomSlotSettings.ts`; runtime proof rules are documented in
`RUNTIME.md`.

# ARDA HUD Data Surface Map - 2026-05-21

This is the working map for customizing ARDA HUD components and data visuals. It focuses on where the backend data lives, how the frontend can reach it, what shape the data has, and which surfaces still need live wiring.

Update note 2026-06-01: this remains the source inventory. Current boardroom
surface assignment/display behavior is now governed by
`ARDA_BOARDROOM_SLOT_ASSIGNMENT_CONTRACT.md` and `src/lib/boardroomSlotSettings.ts`.
Runtime proof rules are documented in `RUNTIME.md`.

## Current Frontend Data Path

The current ARDA HUD app is primarily file-backed through the Tauri shell:

1. `apps/arda-hud/src/App.tsx` creates `createCoreStateSource()`.
2. `apps/arda-hud/src/lib/ardaSource.ts` loads `ArdaBundle`; bundle types and
   file readers are split into `ardaBundleTypes.ts` and `ardaReaders.ts`.
3. `apps/arda-hud/src/lib/ardaHudSettings.ts` defines the default backend paths.
4. Tauri commands in `apps/arda-hud/src-tauri/src/lib.rs` provide direct reads and a few typed fetch helpers.

For final validation, use the native Tauri path from the repository instructions. Host Vite can be useful for layout iteration, but it is not proof that native WebKit/Tauri data loading works.

## Immediate Findings

- Most core HUD state is already reachable by the frontend through `ArdaBundle`.
- Runtime mode is detected explicitly so browser/Vite, static preview, Tauri dev,
  and Tauri native are not treated as equal proof modes.
- ATHENA digest, deep graph, runtime, and policy readiness are now loaded by `ArdaBundle`.
- ATHENA policy readiness exists at `data/athena/policy_readiness.jsonl` and now appears in `ReviewGateWorkstation` as `ATHENA Policy` packets when a source is not `implementation_ready`.
- `KnowledgeMapPanel` now separates ATHENA Registry, Digest, Deep Graph, and Policy Readiness views from the already-loaded `ArdaBundle` surfaces.
- `core/state/operator_runtime_status.json` was stale before this audit and said Charon was unavailable. It was refreshed on 2026-05-21 with `cargo run -p annunimas-cli -- utility operator-runtime-status`.
- `core/state/charon_router.json` is the more direct current source for provider/model routing state.
- Attempting `athena policy-promote --limit 25 --reevaluate` was denied by policy guard because the decision class is `strategy_change` and requires 2-of-3 philosopher triad approval with evidence. ARDA HUD should show that as an approval/remediation lane, not as silently implementation-ready data.
- A task was queued: `tsk_20260521_expose_athena_policy_readiness_approval_gates_in`.
- Boardroom monitor/desk surfaces now have `surface_layout` contracts for
  adapter type, preview widgets, refresh cadence, focus mode, and embed policy.
  Settings displays this contract; the final preview-widget renderer/editor is
  still pending.

## Source Inventory

| HUD domain | Backend source | Backend shape | Frontend access today | Current status |
| --- | --- | --- | --- | --- |
| ARDA snapshot and scene map | `core/state/arda_snapshot.json`, `core/state/arda_source_map.json` | JSON projection with authority, generated timestamp, sections, panels, source paths, missing projections | Loaded into `ArdaBundle.snapshot`, `sourceMap`, `sections`, `sceneZones`, `sceneAnchors`, `sceneSurfaces`, `workstationManifests` | Implemented |
| World and agent roster | `core/state/world.json` | JSON with agents, roles, status, realm context | Loaded into `ArdaBundle.world`; consumed by roster/world helpers | Implemented |
| Human/business/personal realm | `core/state/human_context.json`, `core/state/business_runtime.json`, `core/state/personal_runtime.json` | JSON projections; fallbacks are derived from local human context files if missing | Loaded into `humanContext`, `businessRuntime`, `personalRuntime` | Implemented |
| Runtime settings/governance/ops | `core/state/runtime_settings.json`, `governance_runtime.json`, `operations_flow.json`, `operator_actions.json` | JSON state projections | Loaded into corresponding `ArdaBundle` fields, with derived fallbacks | Implemented |
| Review gates | `data/arandur/mission_queue_write_requests.jsonl`, `data/arandur/recommendations.jsonl`, `data/arandur/mission_approval_requests.jsonl`, `data/hades/lifecycle_review_queue.jsonl`, `core/state/human_augmentation_runtime.json` | JSONL ledgers and JSON runtime state | Loaded into `arandurRecommendations`, `arandurMissionApprovalRequests`, `hadesLifecycleReviewQueue`, `humanAugmentationRuntime`; consumed by `ReviewGateWorkstation` | Implemented for ARANDUR/HADES/human augmentation |
| ATHENA knowledge registry | `core/state/knowledge_triage_registry.jsonl` | JSONL records with classification, canonical home, authority, domain, glyph, title/path | Loaded into `ArdaBundle.knowledgeTriage`; consumed by `KnowledgeMapPanel` Registry tab | Implemented |
| ATHENA runtime | `core/state/athena_runtime.json` | JSON projection with counts such as books, digest events, deep graph events, policy-ready count, reference-only count, queue depth, provenance ratio | Loaded into `ArdaBundle.athenaRuntime` | Implemented |
| ATHENA digest | `data/athena/digest.jsonl` | JSONL digest/deep entries keyed by source, stage, title, extracted knowledge, relevance tags, policy readiness | Loaded into `ArdaBundle.athenaDigest`; consumed by `KnowledgeMapPanel` Digest tab; Tauri command `fetch_athena_digest` also exists | Implemented |
| ATHENA deep graph | `data/athena/deep_graph.jsonl` | JSONL graph/update entries keyed by source with confidence, triad result, extracted nodes/edges/evidence | Loaded into `ArdaBundle.athenaDeepGraph`; consumed by `KnowledgeMapPanel` Deep Graph tab; Tauri command `fetch_athena_deep_graph` also exists | Implemented |
| ATHENA policy readiness | `data/athena/policy_readiness.jsonl` | JSONL readiness records with source id, readiness class, gate blockers, observed thresholds, policy gate evidence | Loaded into `ArdaBundle.athenaPolicyReadiness`; latest non-ready record per source is shown in `ReviewGateWorkstation`; all recent records are available in `KnowledgeMapPanel` Policy Readiness tab | Implemented |
| Charon provider/router state | `core/state/charon_router.json` | JSON projection with provider pressure, provider states, model lists, access tiers, quality bands, route successes/failures, operational state | Loaded into `ArdaBundle.charonRouter`; `RoutableProvidersPanel` prefers direct Charon provider/model details and falls back to operator projection | Implemented for direct provider/model visual surface |
| Operator runtime | `core/state/operator_runtime_status.json` | JSON projection with Charon summary, fleet live targets, lane routes, provider pressure, routable providers | Loaded into `ArdaBundle.operatorRuntimeStatus` | Implemented; refreshed on 2026-05-21 |
| Queue/task state | `core/state/queue_summary.json`, `core/projects/tasks/queue.jsonl` | JSON summary plus JSONL task queue | Loaded into `queueSummary`; task queue is parsed and can derive fallback summary | Implemented |
| Presence and boardroom cues | `data/prometheus/arda_presence_events.jsonl` | JSONL presence events | Loaded into `agentPresenceState` and `agentPresenceStatus`; Tauri has a HUD pulse stream for periodic refresh | Implemented file-backed; pulse is transport/event timing, not domain state |
| Boardroom surface slots | `core/state/arda_boardroom_slots.json` | JSON projection with slot assignments and optional `surface_layout` | Loaded by `useBoardroomSlotAssignments`; displayed in Settings; consumed by boardroom slot assignment routing | Implemented data/model pass; renderer/editor pending |
| Packages/storage/output topology | `core/state/package_health.json`, `package_enablement.json`, `package_runtime_activation.json`, `storage_pressure.json`, `output_topology.json`, `output_accounting.json` | JSON projections | Loaded into corresponding bundle fields | Implemented if projections are current |
| Plan map | `core/state/plan_map.json` plus configured plan/task sources | JSON projection of plans and related tasks | Loaded into `planMap`; derived fallback exists | Implemented |

## Backend Shapes To Expect

These are representative shapes for component work. Treat JSONL files as one JSON object per line.

### ATHENA Policy Readiness

```json
{
  "source_id": "src_8186de0e",
  "policy_readiness": "reference_only",
  "gate": {
    "blockers": ["confidence_threshold", "opposition_coverage"],
    "observed": {
      "confidence": 0.72,
      "triad_passed": true,
      "opposition_coverage": 0.2
    },
    "thresholds": {
      "confidence": 0.8,
      "opposition_coverage": 0.6
    }
  },
  "ts_utc": "2026-05-21T11:40:00Z"
}
```

Use this for an ARDA approval/remediation view. Records with `reference_only` are good evidence/reference material, but should not be promoted as implementation-ready without additional corroboration or opposition work.

### ATHENA Digest

```json
{
  "source_id": "src_3c90af76",
  "stage": "deep",
  "data": {
    "title": "GitNexus",
    "confidence": 0.74,
    "policy_readiness": "reference_only",
    "extracted_knowledge": [],
    "relevance_tags": ["github_repo", "knowledge_reference"]
  },
  "ts_utc": "2026-05-21T11:40:00Z"
}
```

Use this for source cards, evidence summaries, tags, and "what did ATHENA learn?" panels.

### ATHENA Deep Graph

```json
{
  "source_id": "src_f1be994a",
  "confidence": 0.7,
  "triad_passed": false,
  "nodes": [],
  "edges": [],
  "ts_utc": "2026-05-21T11:40:00Z"
}
```

Use this for graph visuals, confidence overlays, claim/evidence links, and opposition gaps.

### Charon Router

```json
{
  "authority": "charon_router_projection",
  "generated_at_utc": "2026-05-21T11:49:04Z",
  "status": {
    "providers_ready": 15,
    "providers_healthy": 10,
    "recent_route_successes": 10,
    "recent_route_failures": 0
  },
  "providers": [
    {
      "id": "openai_sub",
      "operational_state": "ready",
      "models": [
        {
          "id": "gpt-5.3-codex",
          "context_window": 32000,
          "is_default": true
        }
      ]
    }
  ]
}
```

Use this for provider/model connection visuals. `operator_runtime_status.json` is useful for fleet and lane summaries; `charon_router.json` is better for provider/model detail.

## Gaps To Close Before Visual Customization

0. Implement boardroom surface preview composition.
   - `surface_layout` now defines adapter type, preview mode, preview widgets,
     focus mode, embed URL, and inline policy for each monitor/desk slot.
   - Settings displays the current contract for every boardroom slot.
   - Next refinement: render `surface_layout.preview.widgets` inside monitor and
     desk previews, then add Settings controls for editing that composition.
   - Local-service refinement: add Beelink Grafana and Open WebUI surface
     manifests with `embed.allow_inline=false` until Tauri/WebKit embed policy
     is proven.

1. Expand knowledge visuals: completed for the first-pass data surface.
   - `KnowledgeMapPanel` now exposes tabs for Registry, Digest, Deep Graph, and Policy Readiness.
   - Next refinement: replace the first-pass cards with richer graph/evidence visualizations once layout customization begins.

2. Wire live provider visuals: completed for first-pass direct provider/model surface.
   - `core/state/charon_router.json` now feeds `ArdaBundle.charonRouter`.
   - `RoutableProvidersPanel` renders provider name/id, access tier, quality band, health/enabled state, EWMA latency, active connections, model context window/default flag, model health, and capable task tags.
   - `core/state/operator_runtime_status.json` remains the fallback source for lane routes, fleet live targets, and budget pressure.
   - Next refinement: add data freshness (`generated_at_utc`) and richer route-pressure/cooldown visuals once layout customization begins.

3. Surface missing projections: completed for first-pass source-map coverage warnings.
   - `core/state/arda_source_map.json.sections[*].missing_projections` now feeds `KnowledgeMapPanel` through `getKnowledgeMap`.
   - `KnowledgeMapPanel` exposes a Missing Projections tab with section title, owner, section id, and missing projection keys.
   - `SectionFocusModule` and `SystemsModule` now render source-map coverage badges in their panel headers, using the mapped section coverage state (`backed`, `partial`, or `unmapped`).
   - High-traffic mapped panels now also render the same header badge: `operations_and_packages`, `governance_controls`, `human_realm`, and `planning`.
   - Lower-traffic workstation modules now render coverage badges as well: `executive_overview`, `personal_growth`, and `business` (currently displayed as `unmapped` until the source map assigns it to a section).
   - Next refinement: either add a stable source-map section assignment for `business`, or extend badge coverage to any newly promoted/reserved workstation modules once their panel ids become stable.

## Refresh Commands

Useful backend refresh commands before a UI customization session:

```bash
cargo run -p annunimas-cli -- utility operator-runtime-status
cargo run -p annunimas-cli -- athena policy-readiness --limit 25
cargo run -p annunimas-cli -- athena policy-promote --limit 25 --reevaluate
```

The promotion command is policy-guarded. On 2026-05-21 it was denied because the promotion decision requires 2-of-3 philosopher triad approval with evidence.

Native ARDA HUD validation path:

```bash
distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:dev:stable'
distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:build:stable'
```


## Appendix C: Legacy HUD Event Schema v1 (Integrated)

Events described here are also implemented in `src/lib/hudEventSchema.ts`.
Keep this section as the durable reference; raw schema docs outside the plan
are retired.

# sigil: REPAIR
# ARDA HUD Event Schema (v1)

Status: Active reference  
Version: `1.0.0`

> **Disposition:** Keep. This document describes the event shape implemented in
> `src/lib/hudEventSchema.ts`. It is still relevant for legacy HUD feed logic
> and future scene/workstation event ingestion.
>
> **Last triage:** 2026-04-29.

This schema standardizes all log/combat-feed events shown in ARDA HUD so data from UI actions, local tasks, and backend telemetry can be rendered and audited uniformly.

## Core Fields

```ts
{
  id: string
  timestamp: Date
  severity: 'debug' | 'info' | 'warn' | 'error' | 'critical'
  source: string
  message: string
  refs: Array<{ type: 'agent' | 'mission' | 'node'; id: string }>
  pinned: boolean
  schemaVersion: '1.0.0'
  kind: string
  domain: 'system' | 'operations' | 'agent' | 'mission' | 'inventory' | 'dock' | 'governance' | 'security' | 'telemetry' | 'knowledge' | 'external' | 'unknown'
}
```

## Optional Extensions

```ts
{
  sigils?: string[]            // Soterion/UI signal tags, example: ['∇','⚡','◈']
  tags?: string[]              // Fast filters/grouping
  metrics?: {
    jwEstimated?: number       // JouleWork estimate
    leScore?: number           // Love Equation score
    triadScore?: number        // Triad aggregate score
    durationMs?: number        // Execution latency
  }
  trace?: {
    taskId?: string
    missionId?: string
    agentId?: string
    correlationId?: string
  }
  raw?: Record<string, unknown> // Original event payload for audit/debug
}
```

## Event Kinds (initial)

- `operations.system_action` for action-bus execution results
- `telemetry.<operation>` for parsed JSONL telemetry streams
- `telemetry.joulework` for legacy JouleWork log parsing fallback
- `<domain>.event` default when producer did not set kind

## Ingestion Rules

- All producers pass through `normalizeHudEvent(...)`.
- Missing fields are defaulted (id, timestamp, schemaVersion, domain, kind).
- `setEvents(...)` and `addEvent(...)` normalize every event before storing.
- `arda:system-action-result` browser events are converted into schema events and appended to the HUD log feed.
- Native telemetry merge in provider pulls from:
  - `data/hades/hades_log.jsonl`
  - `data/hades/joulework.jsonl`
  - `data/athena/digest.jsonl`
  - `data/athena/deep_graph.jsonl`
  - `data/prometheus/orders.jsonl`
  - `data/prometheus/escalations.jsonl`
  - `data/prometheus/autopilot/metrics.jsonl`

## Feed Health Snapshot

HUD also computes per-feed observability metrics each refresh cycle:

```ts
{
  feedId: string
  status: 'healthy' | 'stale' | 'offline' | 'error'
  lastEventAt: Date | null
  lastEventAgeSec: number | null
  linesRead: number
  eventsParsed: number
  parseErrors: number
}
```

## Example

```json
{
  "id": "action-status_report-1741511200000",
  "timestamp": "2026-03-09T20:13:20.000Z",
  "severity": "info",
  "source": "action:voice",
  "message": "Action status_report completed via weathertop-http",
  "refs": [],
  "pinned": false,
  "schemaVersion": "1.0.0",
  "kind": "operations.system_action",
  "domain": "operations",
  "sigils": ["∇", "⚡"],
  "tags": ["status_report", "frankyrache", "success", "weathertop-http"],
  "metrics": { "durationMs": 215 },
  "trace": { "correlationId": "status_report:1741511200000" }
}
```
