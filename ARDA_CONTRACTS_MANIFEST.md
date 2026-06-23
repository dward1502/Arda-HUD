<!-- sigil: REPAIR -->
# ARDA Contracts Manifest

Merged root authority for ARDA cross-cutting contracts.

Last merged: 2026-06-23

## Contents

- World District Contract
- Boardroom Slot Assignment Contract
- Data Provenance Contract
- Asset Performance Budget

## World District Contract

Status: Milestone 3 safe-local contract
Authority: `src/scene/world/worldDistrictContracts.ts`
Runtime carriers:
  - `WORLD_DISTRICT_CONTRACTS`
  - `calculateWorldDistrictUrgency()`
  - `resolveWorldDistrictPresentation()`
  - `resolveWorldDistrictWorkflow()`
Scope: projection-backed world district meaning, urgency, and focused workstation routing

### Objective

World traversal must answer where pressure is in the system, who owns it, what
data backs it, what made it light up, and which safe inspection surface opens
next.

### Required contract fields

Each district must define:
  - districtId, title, ownerAgent, sceneZoneId, domain
  - sourcePaths, provenanceDomainIds, urgencyInputs, alertTriggers
  - workstationId or explicit action target
  - safeActions, gatedActions, visualStateMapping, acceptanceCriteria

### Action guard rules

Allowed from the world:
  - open a focused workstation/source zone
  - inspect district provenance or projection state
  - present safe read-only guidance
  - draft an action packet for later approval

Not allowed from the world:
  - mutate queue state directly
  - promote knowledge/policy without approval
  - reroute providers directly
  - send Discord/external messages
  - deploy, restart, spend, or escalate autonomy

### District set

- `district_command` | PROMETHEUS | sovereign_world | Open Command
- `district_knowledge` | ATHENA/MNEMOSYNE | knowledge_and_reasoning | Open Knowledge
- `district_operations` | HADES/APOLLO | planning_and_queue | Open Queue
- `district_communications` | CHARON/HERMES | routing_and_comms | Open Routing
- `district_governance` | ORACLE | governance_guardhouse | Open Governance
- `district_monitoring` | WARDEN | systems_health | Open Fleet
- `district_human_business` | HUMAN | human_realm | Open Human Realm
- `district_finance` | PLUTUS | lifecycle_execution_economics | Open Economy

### Urgency states

- nominal: no elevated projection-backed signal
- attention: queue/review/drift/degraded/pressure signal requiring attention
- stale: matching provenance exists but is stale or missing
- blocked: policy/triad/guardhouse/unsafe autonomy signal blocks progress
- critical: critical/offline/failed/unhealthy runtime signal present
- unknown: no matching provenance or no district contract exists

Do not claim live event behavior before Milestone 4. Current urgency is derived
from source provenance plus section signals, highlights, alerts, and counts in
the loaded ARDA bundle.

## Boardroom Slot Assignment Contract

Authority: `core/state/arda_boardroom_slots.json`
Schema version: `annunimas.arda_boardroom_slots.v1`
Slot ids: `monitor_left_1` through `monitor_left_4`, `view_desk_l`,
`view_desk_control_panel`, `view_desk_r`, `view_desk_aux`

Each assignment includes:
  - slot_id, component_id, source_zone_id, title, module_ids
  - presentation_modes
  - surface_layout with preview widgets and focus target

Unknown/invalid component ids must not crash the scene. Unknown slots render as
placeholders.

## Data Provenance Contract

Authority: `src/lib/ardaProvenance.ts`
Runtime carrier: `ArdaBundle.sourceProvenance`

Every ARDA data surface must answer:
  - which source path(s) back this data
  - when it was generated or observed
  - freshness state: fresh, stale, missing, derived, blocked, or unknown
  - next safe operator refresh/check command if one is known

Refreshes are display-only and must not execute mutating commands from the HUD.

## Asset Performance Budget

- GLB/GLTF model: 5 MB
- Texture/image channel: 2 MB
- HDR/environment: 3 MB
- JS runtime chunk: 750 KB
- Total `dist/assets` payload: 65 MB

2026-06-01 initial build snapshot offenders:
  - `boardroom_main_desk-ZfJB1Q42.glb`: 29,575,352 bytes
  - `boardroom_main_desk_flux2-BW9jZosy.glb`: 22,105,868 bytes
  - `boardroom_wall_ao-H8Bri2t8.png`: 7,978,084 bytes
  - `boardroom_wall_emissive-_scY76-5.png`: 2,210,802 bytes
  - `boardroom_floor_ao-CLvf0vbG.jpg`: 2,062,254 bytes

After deferred import tree changes, the default 2026-06-01 build shrank to
about 25 MB under `dist/assets`.

Exit criteria:
  - default runtime assets satisfy per-asset budgets or have documented
    lazy-load exceptions
  - total `dist/assets` is at or below 65 MB, or a native-load benchmark
    justifies a temporary exception
  - oversized starter variants are archived, optimized, or removed from the
    default import graph
  - native Tauri/WebKit validation confirms scene load and interaction remain
    acceptable after optimization
