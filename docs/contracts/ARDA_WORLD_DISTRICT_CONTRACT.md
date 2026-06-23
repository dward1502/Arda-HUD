---
soterion:
  sigil: "SCROLL"
  glyph: "📜"
  code_point: "U+1F4DC"
  role: "arda_world_contract"
  owner: "PROMETHEUS"
  status: "active"
  last_reviewed: "2026-06-23"
---

> 🜏 Soterion: 📜 arda_world_contract | owner: PROMETHEUS | status: active | reviewed: 2026-06-23

# ARDA World District Contract

Status: Milestone 3 safe-local contract
Authority: `apps/arda-hud/src/scene/world/worldDistrictContracts.ts`
Runtime carriers:
- `WORLD_DISTRICT_CONTRACTS`
- `calculateWorldDistrictUrgency()`
- `resolveWorldDistrictPresentation()`
- `resolveWorldDistrictWorkflow()`
Scope: projection-backed world district meaning, urgency, and focused workstation routing

## Objective

ARDA world traversal must answer: where is the pressure in the system, who owns it,
what data backs it, what made it light up, and which safe inspection surface opens
next.

The world is not a second dashboard and not a decoration layer. District geometry,
labels, urgency rings, and terminal affordances must be grounded in district
contracts and projection-backed provenance.

## Required Contract Fields

The canonical code contract is `WorldDistrictContract`:

```ts
interface WorldDistrictContract {
  districtId: string
  title: string
  ownerAgent: string
  sceneZoneId: string
  domain: string
  sourcePaths: string[]
  provenanceDomainIds: string[]
  urgencyInputs: string[]
  alertTriggers: string[]
  workstationId: string | null
  sourceZoneId: string
  primaryActions: WorldDistrictAction[]
  safeActions: WorldDistrictAction[]
  gatedActions: WorldDistrictAction[]
  visualStateMapping: Record<WorldDistrictUrgencyState, string>
  acceptanceCriteria: string[]
}
```

Each district must define an owner, backing source paths, provenance domains,
urgency inputs, alert triggers, a workstation or explicit action target, safe
inspection actions, gated or draft-only actions, visual state mapping, and
acceptance criteria.

## Action Guard Rules

World actions are routing and inspection affordances only.

Allowed from the world:
- open a focused workstation/source zone;
- inspect district provenance or projection state;
- present safe read-only guidance;
- draft an action packet for later approval.

Not allowed from the world:
- mutate queue state directly;
- promote knowledge/policy without approval;
- reroute providers directly;
- send Discord/external messages;
- deploy, restart, spend, or escalate autonomy.

`safeActions` must use guard `safe`. Mutating or approval-sensitive entries must
be represented as `draft_only` or `gated` inside `gatedActions`.

## District Set

| District | Owner | Scene/source zone | Domain | Primary safe target |
|---|---|---|---|---|
| `district_command` | PROMETHEUS | `sovereign_world` | CEO overview and autonomy readiness | Open Command workstation |
| `district_knowledge` | ATHENA/MNEMOSYNE | `knowledge_and_reasoning` | Research, memory, and knowledge triage | Open Knowledge workstation |
| `district_operations` | HADES/APOLLO | `planning_and_queue` | Queue, lifecycle execution, and cleanup | Open Queue workstation |
| `district_communications` | CHARON/HERMES | `routing_and_comms` | Provider routing and communication mesh | Open Routing workstation |
| `district_governance` | ORACLE | `governance_guardhouse` | Governance, review gates, and autonomy guardrails | Open Governance workstation |
| `district_monitoring` | WARDEN | `systems_health` | Fleet health, runtime drift, storage, package state | Open Fleet workstation |
| `district_human_business` | HUMAN | `human_realm` | Human, business, personal, and realm context | Open Human Realm workstation |
| `district_finance` | PLUTUS | `lifecycle_execution_economics` | JouleWork accounting and output economics | Open Economy workstation |

Economy may remain reference/future when live accounting data is unavailable, but
it still needs source paths and an unknown/stale-safe presentation rather than an
empty decorative district.

## Urgency States

World urgency states are deterministic and projection-backed:

- `nominal`: no elevated projection-backed signal.
- `attention`: queue/review/drift/degraded/pressure signal requires operator attention.
- `stale`: matching provenance exists but is stale or missing.
- `blocked`: policy, triad, guardhouse, or unsafe autonomy signal blocks progress.
- `critical`: critical/offline/failed/unhealthy runtime signal is present.
- `unknown`: no matching provenance or no district contract exists.

The implementation must not claim live event behavior before Milestone 4. Current
urgency is derived from source provenance plus section signals, highlights, alerts,
and counts in the loaded ARDA bundle.

## Visual Mapping

Urgency visuals must conform to district objects and labels:

- `nominal`: steady cyan district emissive trace attached to district mesh.
- `attention`: gold pulse on district mesh and label.
- `stale`: violet freshness hatch on district mesh and label.
- `blocked`: amber guardhouse lock trace on district mesh and label.
- `critical`: red escalation pulse on district mesh and label.
- `unknown`: dim gray unresolved-source trace on district mesh and label.

Do not add floating or disconnected urgency planes that fail to align with the
actual district surface. Visual additions must remain subordinate to workflow
meaning.

## Runtime Integration

Current safe-local integration:

- `worldDistrictContracts.ts` defines the district metadata and validates that
  every district has owner, sources, triggers, and workstation/action targets.
- `worldDistrictUrgency.ts` maps provenance and section signals to district
  urgency, top signals, summaries, and recommended actions.
- `worldDistrictPresentation.ts` resolves display copy, color, tone, and focused
  source-zone routing for clickable world labels.
- `worldDistrictWorkflows.ts` resolves each district's actual open target,
  safe inspection actions, gated/draft-only actions, surface adapter, focus
  mode, and preview widget count from the district contract plus
  `core/state/arda_world_surfaces.json`.
- `WorldRuntimeViewport` consumes district presentation so district and terminal
  interactions route back through the existing focused panel/workstation path
  rather than a separate world command bus; district object `userData` now
  carries workflow action IDs and surface metadata for inspection/debug layers.

## Acceptance Criteria

A Milestone 3 district passes when:

- the operator can identify the owner agent and domain;
- source paths and provenance domain IDs are defined;
- alert triggers and urgency inputs are explicit;
- the district opens a useful source zone or workstation;
- mutating or external actions are draft-only/gated;
- visual urgency is attached to district geometry/labels and does not float
  independently;
- no live-channel claim is made before Milestone 4.

## Verification

Safe-local verification:

```bash
cd apps/arda-hud && npm test -- worldDistrictContracts worldDistrictUrgency worldDistrictPresentation worldDistrictWorkflows
cd apps/arda-hud && npm run build
```

Native/release validation remains a separate gate:

```bash
distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:build:stable'
```

Do not treat host Vite validation as final native WebKit/Tauri proof.
