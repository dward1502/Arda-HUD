---
soterion:
  sigil: "SCROLL"
  glyph: "📜"
  code_point: "U+1F4DC"
  role: "arda_boardroom_contract"
  owner: "PROMETHEUS"
  status: "active"
  last_reviewed: "2026-06-06"
---

> 🜏 Soterion: 📜 arda_boardroom_contract | owner: PROMETHEUS | status: active | reviewed: 2026-06-06

# ARDA Boardroom Slot Assignment Contract

Status: active
Authority: `core/state/arda_boardroom_slots.json`
Schema version: `annunimas.arda_boardroom_slots.v1`
Related contract: `src/scene/workstations/SLOT_COMPONENT_CONTRACT.md`
Last reviewed: 2026-06-01

## Purpose

This document defines the durable workspace-backed projection that maps stable ARDA boardroom scene slots to operator-facing workstation roles and display-surface behavior. Scene geometry remains generic and stable; domain meaning lives in assignment records, workstation manifests, and per-slot `surface_layout` records.

The assignment document allows the boardroom to boot from workspace/core state before falling back to browser-local state or safe defaults.

## Authority and path

Authoritative file:

`core/state/arda_boardroom_slots.json`

Frontend loader path constant:

`ARDA_BOARDROOM_SLOT_SETTINGS_RELATIVE_PATH = "core/state/arda_boardroom_slots.json"`

Browser fallback key:

`arda.boardroom.scene_slots.v1`

The workspace file is preferred when readable and valid. Browser-local state is a fallback, not the source of truth for workflow-critical assignments.

## Document schema

Top-level fields:

- `schema_version`: must be `annunimas.arda_boardroom_slots.v1`.
- `authority`: must identify `core/state/arda_boardroom_slots.json`.
- `operator_profile_id`: optional string or null for future operator-specific layouts.
- `updated_at_utc`: ISO-8601 timestamp for the document projection.
- `assignments`: array of slot assignment records.

Each assignment record must include:

- `slot_id`: stable physical scene slot id.
- `component_id`: component/workstation contract id.
- `source_zone_id`: workstation/source zone id used by runtime routing.
- `title`: human-readable label.
- `module_ids`: module ids represented by the slot.
- `presentation_modes`: supported display modes such as `in_scene` or `native_window`.
- `surface_layout`: preview/focus/embed contract for the physical screen.
- `updated_at_utc`: ISO-8601 timestamp for this assignment.

### `surface_layout`

`surface_layout` is the per-slot display contract. It allows the upper monitors and desk terminals to show lightweight boardroom previews while preserving heavier focused surfaces for native windows, external services, media, or future remote desktop streams.

Fields:

- `enabled`: boolean. Disabled slots still render as safe placeholders.
- `adapter_type`: one of:
  - `component_grid`
  - `external_url`
  - `service_embed`
  - `media_viewer`
  - `streaming_text`
  - `remote_desktop`
  - `agent_activity`
- `preview.mode`: one of:
  - `component_grid`
  - `service_status`
  - `inline_embed`
  - `media_thumbnail`
  - `stream_feed`
  - `remote_preview`
  - `agent_activity`
- `preview.refresh_ms`: preview refresh cadence. Boardroom previews should stay lightweight.
- `preview.widgets`: CSS-grid-style widgets arranged inside the screen preview.
- `focus.mode`: one of:
  - `in_scene_workstation`
  - `native_window`
  - `external_browser`
  - `inline_embed`
- `focus.target`: source zone, URL, media id, or future stream id for the focused view.
- `focus.refresh_ms`: focused surface refresh cadence.
- `embed.url`: optional URL for local services such as Grafana, Open WebUI, Hermes Dashboard, noVNC/WebRTC gateways, or media endpoints.
- `embed.allow_inline`: explicit embed permission. `false` means ARDA may show a status/thumbnail preview but should open the focused surface in a native window or external browser.

Each preview widget must include:

- `id`
- `kind`: `metric_strip`, `particle_stream`, `sparkline`, `status_grid`,
  `agent_comms`, `media_tile`, `iframe_preview`, `markdown_doc`, `pdf_doc`,
  `image_asset`, `video_asset`, `document_asset`, `data_stream`, or
  `remote_session`
- `title`
- `data_binding`
- `grid_area`

## Stable slot ids

Current visible boardroom scene slot ids:

- `monitor_left_1`
- `monitor_left_2`
- `monitor_left_3`
- `monitor_left_4`
- `view_desk_l`
- `view_desk_control_panel`
- `view_desk_r`
- `view_desk_aux`

Do not rename these after assignment without a migration. The slot id is geometry identity, not domain identity.

## Default role projection

The current default workspace projection is:

| Slot | Default role | Source zone | Component id | Default adapter | Default preview | Default focus |
| --- | --- | --- | --- | --- | --- | --- |
| `monitor_left_1` | Warp Surface | `service_warp_dev` | `warp-dev-service-surface` | `external_url` | `service_status` | `native_window` |
| `monitor_left_2` | Routing Providers | `routing_and_comms` | `routing-providers-workstation` | `component_grid` | `component_grid` | `native_window` |
| `monitor_left_3` | Knowledge + Memory | `memory_and_continuity` | `knowledge-workstation` | `component_grid` | `component_grid` | `native_window` |
| `monitor_left_4` | Queue + Plans | `planning_and_queue` | `queue-plans-workstation` | `component_grid` | `component_grid` | `native_window` |
| `view_desk_l` | Review Gates | `governance_guardhouse` | `review-gates-workstation` | `component_grid` | `component_grid` | `native_window` |
| `view_desk_control_panel` | Command Podium | `sovereign_world` | `command-podium-workstation` | `component_grid` | `component_grid` | `in_scene_workstation` |
| `view_desk_r` | Human + Business | `human_realm` | `human-business-workstation` | `component_grid` | `component_grid` | `native_window` |
| `view_desk_aux` | Hermes Dashboard | `hermes_dashboard` | `hermes-dashboard-workstation` | `service_embed` | `stream_feed` | `native_window` |

Unknown or invalid component ids must not crash the scene. Runtime should render the stable scene slot as a placeholder surface when a manifest/component cannot be resolved.

## Runtime behavior

1. Load `core/state/arda_boardroom_slots.json` through the scoped file IPC path.
2. Validate `schema_version` and normalize records by `slot_id`.
3. Fill missing visible slots from defaults.
4. Use browser-local assignments while workspace state is unavailable.
5. Persist operator slot changes through the scoped write IPC contract only.
6. Report assignment mode/status in the operator UI as `workspace`, `local`, or `fallback`.
7. Normalize missing or partial `surface_layout` fields from defaults so older workspace files remain loadable.
8. Render the Settings surface from this contract first; final editor styling and drag/drop composition can iterate without changing schema.

## Safety rules

- Assignment writes are local workspace state writes only.
- Do not execute workstation actions while saving slot assignments.
- Do not use assignment data as a command surface.
- Do not execute `surface_layout.focus.target`; it is a display/focus target, not a shell command.
- Do not couple scene mesh names to domain modules.
- Preserve placeholder rendering for missing, unknown, or unassigned slots.
- Mutating workflow actions remain governed by `ARDA_ACTION_CONTRACT.md`; this contract only governs slot-to-workstation projection.

## Verification

Minimum verification for this contract:

- `python -m json.tool core/state/arda_boardroom_slots.json`
- `cd apps/arda-hud && npm test -- boardroomSlotSettings`
- `cd apps/arda-hud && npm run build`

Native persistence proof for final release should additionally assign a slot in the Tauri app, restart ARDA HUD, and confirm the assignment reloads from `core/state/arda_boardroom_slots.json`.

## Current implementation status — 2026-06-01

Implemented:

- `src/lib/boardroomSlotSettings.ts` defines the `surface_layout` types, defaults, parser normalization, and layout extraction helpers.
- `src/lib/boardroomSlotSettings.test.ts` covers default layout generation and partial workspace document normalization.
- `src/components/arda/hooks/useBoardroomSlotAssignments.ts` exposes loaded `document` and `surfaceLayouts` to the app.
- `src/components/arda/modules/SettingsModule.tsx` displays slot, source zone, role, adapter type, preview mode, focus mode, widget count, refresh cadence, component id, and embed URL, and now provides controls for adapter type, focus mode, embed URL, inline embed policy, refresh cadence, multi-widget preview composition, per-widget kind/title/binding/grid area, and service presets.
- `src/scene/boardroom/BoardroomSurfacePreview.tsx` consumes `surface_layout.preview.widgets` for in-room monitor and desk previews.
- `src/scene/boardroom/boardroomSurfacePreviewModel.ts` maps widget contracts to deterministic preview view models, with tests in `boardroomSurfacePreviewModel.test.ts`.
- Mixed media and remote/session preview widgets now have explicit compact
  rendering and labels for `.md`, `.pdf`, image, video, document, data-stream,
  agent-comms, iframe, and remote-session declarations. Remote sessions are
  marked attention unless their focused surface uses a native window.
- Focused adapter manifests now exist for `media_library` and
  `agent_remote_session`; both prefer native-window focus and keep inline
  rendering disabled until source/codec or transport/auth behavior is verified.
- `media_library` has a read-only focused workstation module that inventories
  scoped roots and previews text-like files. Supported images and video render
  through scoped, size-capped preview paths. Supported PDF files render through
  a scoped, size-capped PDF preview path; unsupported/oversized media and
  document files stay native/open-handler focused. Selected entries can open
  through the scoped native `open_source_path` command.

Not complete yet:

- Settings editing supports multi-widget layout authoring, per-widget kind/title/grid-area/binding editing, and local-service presets. Native service focus/embedding proof is still future work.
- The preview renderer is first-pass and compact; document conversion,
  richer media playback, live stream binding, and remote desktop transport are
  still future adapter work.
- Grafana/Open WebUI/media/remote-session manifests exist with inline
  embedding disabled. Actual media viewers and noVNC/WebRTC adapters still need
  scoped source, codec, transport, auth, and embed policy checks before enabling
  inline views.
