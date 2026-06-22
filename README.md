---
soterion:
  sigil: "SCROLL"
  glyph: "📜"
  code_point: "U+1F4DC"
  role: "documentation"
  owner: "HADES"
  status: "active"
  last_reviewed: "2026-06-02"
---

> 🜏 Soterion: 📜 documentation | owner: HADES | status: active | reviewed: 2026-06-02

# sigil: REPAIR
# ARDA HUD

ARDA HUD is the operator-facing frontend for Annunimas. The executable app lives
in `apps/arda-hud`, but its runtime data contract is rooted in `/core/state`,
`/human`, and `config/arda_hud.settings.json`.

## Current Reality

- frontend stack: React 19 + TypeScript + Vite
- desktop shell: Tauri 2
- current machine-readable path contract: `config/arda_hud.settings.json`
- current human-readable baseline: `docs/arda/ARDA_HUD.md`
- current scene-first rebuild history: `docs/arda/ARDA_FRONTEND_REBUILD.md`
- current app product path: `ARDA_UNIFIED_PATH_FORWARD_2026-05-22.md`
- current operating-surface evidence plan: `ARDA_OPERATING_SURFACE_PLAN_2026-05-27.md`
- current native runtime proof note: `RUNTIME.md`

The old template-era README and host-specific system note are retired. Treat the
files above as the current source of truth for what ARDA HUD consumes and how it
is intended to operate.

## Active Implementation Boundary

Current ARDA work targets the active Three.js/WebGL scene runtime inside the
Tauri shell:

- boardroom/world scene systems under `src/scene/**`
- scene assets and budget gates under `src/assets/scene/**`
- in-scene workstation surfaces plus explicit native Tauri pop-out windows
- boardroom monitor/desk `surface_layout` assignments backed by
  `core/state/arda_boardroom_slots.json`

Do not revive the retired rail-layout/dashboard shell as the implementation
target. The remaining operating rail is a control/status layer over the active
scene, not the product architecture to expand. Host Vite/browser is allowed only
for fast React/CSS iteration; final proof is native Tauri/WebKit through the
stable `lothlorien` path described below.

## Runtime Contract

ARDA HUD is currently built around these state surfaces:

- `core/state/arda_snapshot.json`
- `core/state/arda_source_map.json`
- `core/state/world.json`
- `core/state/human_context.json`
- `core/state/runtime_settings.json`
- `core/state/package_health.json`
- `core/state/storage_pressure.json`
- `core/state/queue_summary.json`
- `core/state/operator_actions.json`
- `core/state/arda_boardroom_slots.json`

The app-specific hookup for plan roots and state paths is configured in:

- `config/arda_hud.settings.json`

The runtime bundle also exposes `sourceProvenance` records from
`src/lib/ardaSource.ts`. These records use `src/lib/ardaProvenance.ts` to carry
operator-facing provenance and freshness metadata:

- source domain id and label
- source paths
- generated and observed timestamps when known
- freshness state: `fresh`, `stale`, `missing`, `derived`, `blocked`, or
  `unknown`
- source kind: `snapshot`, `live`, `derived`, `config`, or `manual`
- optional safe refresh command and last refresh result

Reusable display components live under `src/components/arda/modules/`:

- `DataFreshnessBadge.tsx`
- `DataSourceDetailsPanel.tsx`

These components are presentation-only. They may show safe refresh guidance, but
they do not execute refresh or mutation commands from the HUD.

## Boardroom Surface Contract

Boardroom monitor/desk assignments are backed by:

- authority file: `core/state/arda_boardroom_slots.json`
- frontend contract: `src/lib/boardroomSlotSettings.ts`
- human contract: `ARDA_BOARDROOM_SLOT_ASSIGNMENT_CONTRACT.md`

Each slot can include a `surface_layout` with:

- adapter type
- preview mode
- preview widgets
- preview refresh cadence
- focus mode and target
- embed URL
- inline-embed policy

Settings displays this data for all upper monitor and desk slots and can edit
core surface fields, multi-widget preview composition, per-widget bindings, and
service presets. The boardroom preview layer renders compact widgets from this
contract. Beelink Grafana and Open WebUI have safe local-service manifests;
native focus/embed proof is the next Phase 8 surface task.

## Build And Test

From `apps/arda-hud/`:

```bash
npm run build
npm test
```

For local frontend development:

```bash
npm run dev
```

Use this for fast React/CSS layout iteration only. It is not proof for native
filesystem IPC, WebKit layout, native windowing, external service embeds, or
media/runtime behavior.

For stable Tauri invocation with the current NVIDIA/Wayland workarounds:

```bash
npm run tauri:dev:stable
npm run tauri:build:stable
```

Repository-standard native validation runs inside distrobox `lothlorien`:

```bash
distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:dev:stable'
distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:build:stable'
```

## Preferred Packaging

From the repo root, use the Annunimas wrapper instead of ad hoc Tauri commands:

```bash
bash scripts/package_arda_hud.sh
```

That script:

- builds the frontend
- runs the frontend tests by default
- attempts a no-bundle Tauri build when native prerequisites are available
- degrades cleanly to frontend-only status when native Tauri prerequisites are missing
- writes status to `data/prometheus/arda_hud_package_last.json`

## Preferred Launch

From the repo root:

```bash
bash scripts/launch_arda_hud.sh
```

Launcher behavior:

- prefers the newest local compiled binary under the workspace target dir
- then checks the app-local Tauri target dir
- then checks `/usr/bin/arda_hud`
- if no native binary exists but `dist/` exists, falls back to `vite preview`

Session bootstrap also uses this launcher when `ANNUNIMAS_BOOT_LAUNCH_ARDA=true`.

## Display Runtime Notes

The stable desktop runtime currently expects:

```bash
WEBKIT_DISABLE_DMABUF_RENDERER=1
WEBKIT_DISABLE_COMPOSITING_MODE=1
__NV_DISABLE_EXPLICIT_SYNC=1
GDK_BACKEND=x11
```

These are already applied by the stable Tauri scripts and the launcher.

## Status Caveat

`data/prometheus/arda_hud_package_last.json` is only authoritative after a fresh
packaging run. If binaries have been removed or host prerequisites changed since
the last package pass, rerun `bash scripts/package_arda_hud.sh` before trusting it.

## Related Files

- `ARDA_UNIFIED_PATH_FORWARD_2026-05-22.md` — central product path that
  reconciles the vision, PRD, completed rebuild work, live data surface, and
  missing pieces.
- `ARDA_AUDIT.md` — current factual implementation/data/gap audit for the ARDA
  HUD app.
- `ARDA_BOARDROOM_SLOT_ASSIGNMENT_CONTRACT.md` — current boardroom slot and
  `surface_layout` contract.
- `ARDA_DATA_SURFACE_MAP_2026-05-21.md` — current detailed data-source map for
  frontend component work.
- `MYTHOS_SPEC.md` — broad ARDA/MYTHOS vision and idea bank.
- `ARDA_PRD.md` — boardroom/throne product and experience direction.
- `ARDA_IMPLEMENTATION_PLAN.md` — current completion record for the scene-first
  rebuild pass.
- `HUD_EVENT_SCHEMA.md` — active event schema reference for HUD/workstation
  feeds.
- `RUNTIME.md` — active operational launch/build and native-validation note.
- `ARDA_ASSET_PERFORMANCE_BUDGET.md` — active GLB/texture/runtime payload gates
  for Three.js scene assets.
- `src/lib/hudEventSchema.ts`
