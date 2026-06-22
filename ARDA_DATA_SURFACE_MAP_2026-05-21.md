---
soterion:
  sigil: "SCROLL"
  glyph: "📜"
  code_point: "U+1F4DC"
  role: "arda_data_map"
  owner: "PROMETHEUS"
  status: "active"
  last_reviewed: "2026-06-06"
---

> 🜏 Soterion: 📜 arda_data_map | owner: PROMETHEUS | status: active | reviewed: 2026-06-06

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
