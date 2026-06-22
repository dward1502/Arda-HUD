---
soterion:
  sigil: "SCROLL"
  glyph: "📜"
  code_point: "U+1F4DC"
  role: "arda_data_contract"
  owner: "PROMETHEUS"
  status: "active"
  last_reviewed: "2026-06-06"
---

> 🜏 Soterion: 📜 arda_data_contract | owner: PROMETHEUS | status: active | reviewed: 2026-06-06

# ARDA Data Provenance Contract

Status: Milestone 1 safe-local contract
Authority: `apps/arda-hud/src/lib/ardaProvenance.ts`
Runtime carrier: `ArdaBundle.sourceProvenance`
Scope: read-only operator provenance, freshness, and refresh guidance
Last reviewed: 2026-06-01

## Objective

Every major ARDA data surface must be able to answer:

- Which source path(s) back this data?
- When was the source generated or observed?
- Is the data fresh, stale, missing, derived, blocked, or unknown?
- Is the surface direct file-backed state, derived projection, config, manual, or live transport?
- What is the next safe operator refresh/check command, if one is known?

This contract is intentionally read-only. ARDA may display safe refresh commands as
operator guidance, but it must not execute mutating refresh, promotion, deployment,
or autonomy commands from this milestone.

The refresh affordance contract is also read-only. `ArdaRefreshAffordance`
classifies source paths as `read_only`, `projection_refresh_only`,
`approval_required`, or `not_registered`, and the UI renders those records in
`display_only` mode. Command execution belongs in explicit workstation action
flows, not provenance badges or source-detail panels.

## Canonical Type

The canonical implementation is `ArdaSourceProvenance` in
`apps/arda-hud/src/lib/ardaProvenance.ts`:

```ts
export type ArdaFreshnessState =
  | 'fresh'
  | 'stale'
  | 'missing'
  | 'derived'
  | 'blocked'
  | 'unknown'

export interface ArdaSourceProvenance {
  domainId: string
  label: string
  sourcePaths: string[]
  generatedAtUtc: string | null
  observedAtUtc: string | null
  state: ArdaFreshnessState
  sourceKind: 'snapshot' | 'live' | 'derived' | 'config' | 'manual'
  derivedFrom?: string[]
  safeRefreshCommand?: string
  lastRefreshResult?: {
    success: boolean
    message?: string
    timestampUtc: string
  }
  notes?: string
}
```

The companion refresh-guidance type is `ArdaRefreshAffordance` in the same
source file:

```ts
export interface ArdaRefreshAffordance {
  id: string
  label: string
  safety: 'read_only' | 'projection_refresh_only' | 'approval_required' | 'not_registered'
  command?: string
  systemActionId?: string
  executionMode: 'display_only'
  operatorInstruction: string
  notes: string
}
```

Use this source file as the authority if this document and TypeScript drift.

## Freshness States

- `fresh`: the source has a usable generated/observed timestamp inside the accepted freshness window.
- `stale`: the source exists but the generated/observed timestamp is older than the accepted window.
- `missing`: one or more expected source paths are absent or unavailable.
- `derived`: the surface is synthesized from another source rather than backed by a direct projection.
- `blocked`: a safe read path exists, but refresh/promotion/action is policy-gated or approval-gated.
- `unknown`: the source can be read, but no trustworthy timestamp/state can be derived.

Do not convert `unknown` or `derived` into `fresh` by guessing timestamps.

## Required Baseline Domains

`apps/arda-hud/src/lib/ardaSource.ts` derives baseline records for the current
bundle. Bundle types and file readers now live in
`apps/arda-hud/src/lib/ardaBundleTypes.ts` and
`apps/arda-hud/src/lib/ardaReaders.ts`, while `ardaSource.ts` remains the source
orchestration entrypoint. Major domains include:

- ARDA source map / snapshot
- world and agent roster
- Charon routing and operator runtime
- queue and plans
- ATHENA runtime, digest, deep graph, and policy readiness
- review gates and approval ledgers
- fleet drift
- storage, output, and package projections
- governance and autonomy projections
- human, business, and personal runtime projections
- boardroom slot/surface configuration through
  `core/state/arda_boardroom_slots.json`

When a new ARDA surface is added, it should either attach to one of these records
or add a new low-cardinality domain record in the bundle derivation layer.

## Safe Refresh Command Rules

`safeRefreshCommand` is display-only guidance. It must be:

- read-only or projection-refresh-only;
- scoped to the backing source domain;
- rendered as text, not as an executable HUD action;
- omitted or marked blocked when the next step is approval-gated.

`ArdaRefreshAffordance` makes the omitted/blocked case explicit:

- `read_only`: a command can inspect current state without changing it.
- `projection_refresh_only`: a command can refresh local projection/readiness
  state without promotion, deployment, or external side effects.
- `approval_required`: the owning workflow may mutate queue or policy state, so
  ARDA must route the operator to an explicit workstation/action flow.
- `not_registered`: no safe affordance is known; the operator must inspect the
  source manually.

Current safe display examples include:

```bash
cargo run -p annunimas-cli -- utility operator-runtime-status
cargo run -p annunimas-cli -- athena policy-readiness --limit 25
```

Policy promotion, deployment, Discord channel creation, webhook mutation, account
actions, spending, or autonomy escalation are not safe refresh commands. If a
surface needs one of those actions, represent the record as `blocked` or document
that it requires explicit human/operator approval.

## UI Primitives

### `DataFreshnessBadge`

Path: `apps/arda-hud/src/components/arda/modules/DataFreshnessBadge.tsx`

Props:

- `record: ArdaSourceProvenance`
- `compact?: boolean`
- `onDetailsClick?: () => void`
- `className?: string`

Behavior:

- renders a compact state label for fresh/stale/missing/derived/blocked/unknown;
- includes source/state tooltip text;
- exposes a details button only when non-compact mode, source paths, and a details callback are present.

### `DataSourceDetailsPanel`

Path: `apps/arda-hud/src/components/arda/modules/DataSourceDetailsPanel.tsx`

Behavior:

- renders domain, label, state, source paths, source kind, generated/observed timestamps,
  derived-from records, display-only refresh affordance text, last refresh result, and notes;
- does not execute commands.

### `SourceRefreshAffordance`

Path: `apps/arda-hud/src/components/arda/modules/SourceRefreshAffordance.tsx`

Behavior:

- renders display-only refresh guidance from `ArdaRefreshAffordance`;
- shows compact safety labels beside provenance rows;
- renders full command/instruction text in source details;
- hides unknown/manual-only hints in compact mode to avoid noise;
- never executes the displayed command.

### `SourceTrustPanel`

Path: `apps/arda-hud/src/components/arda/modules/systems/SourceTrustPanel.tsx`

Behavior:

- summarizes counts by freshness state;
- prioritizes missing, blocked, stale, and unknown records before healthy records;
- renders compact `DataFreshnessBadge` rows for the visible source records.

## Current Integration Status

Verified safe-local integration:

- `ArdaBundle.sourceProvenance` exists and is derived during bundle loading.
- `DataFreshnessBadge` has component coverage for all six freshness states.
- `DataSourceDetailsPanel` renders source details and safe refresh text without executing commands.
- `SystemsModule` accepts `sourceProvenance` and renders `SourceTrustPanel`.
- `SectionFocusModule` renders matching source freshness records for the focused
  module/domain.
- `ReviewGateWorkstation` renders source freshness for the selected packet's
  backing source domain.
- `HermesDashboardModule` renders Hermes/dispatch/gateway source freshness.
- `QueueProvenancePanel` renders queue/planning/HADES source freshness in the
  Planning module.
- `SourceRefreshAffordance` renders display-only refresh guidance and explicitly
  marks queue refreshes as approval-gated.
- `BoardroomSurfacePreview` matches surface focus/widget bindings to
  provenance records and marks stale, missing, blocked, or unknown
  projection-backed previews as attention surfaces.
- `getSafeRefreshCommand()` maps known source paths to display-only CLI guidance.

Remaining adoption work:

- extend provenance display into additional workstation detail surfaces;
- run native Tauri validation from the distrobox release path for final runtime proof;
- keep policy promotion and external side effects behind explicit human/operator approval gates.

## Validation Contract

Safe-local validation for this milestone should include:

```bash
cd apps/arda-hud && npm test -- ardaProvenance DataFreshnessBadge
cd apps/arda-hud && npm run build
```

Release/native validation remains:

```bash
distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:build:stable'
```

Do not treat host Vite proof as final native WebKit/Tauri proof.

## Supersession

This contract formalizes the provenance/freshness parts of
`apps/arda-hud/ARDA_DATA_SURFACE_MAP_2026-05-21.md`. The data surface map remains
a source inventory; this document is the contract for fields, guardrails, and UI
behavior.
