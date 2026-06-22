---
soterion:
  sigil: "SCROLL"
  glyph: "📜"
  code_point: "U+1F4DC"
  role: "directory_index"
  owner: "HADES"
  status: "active"
  last_reviewed: "2026-06-02"
---

> 🜏 Soterion: 📜 directory_index | owner: HADES | status: active | reviewed: 2026-06-02

# Index: apps/arda-hud

- `.gitignore`
- `.vscode`
- `ARDA-hud_prototype.jpg`
- `ARDA_AUDIT.md`
- `ARDA_ASSET_PERFORMANCE_BUDGET.md`
- `ARDA_BOARDROOM_SLOT_ASSIGNMENT_CONTRACT.md`
- `ARDA_DATA_PROVENANCE_CONTRACT.md`
- `ARDA_DATA_SURFACE_MAP_2026-05-21.md`
- `ARDA_IMPLEMENTATION_PLAN.md`
- `ARDA_OPERATING_SURFACE_PLAN_2026-05-27.md`
- `ARDA_PRD.md`
- `ARDA_UNIFIED_PATH_FORWARD_2026-05-22.md`
- `ARDA_WORLD_DISTRICT_CONTRACT.md`
- `Dockerfile`
- `HUD_EVENT_SCHEMA.md`
- `MYTHOS_SPEC.md`
- `README.md`
- `RUNTIME.md`

- `arda_hud`
- `arda_hud_bin`
- `avatar.jpg`
- `desk.jpg`
- `dist`
- `index.html`
- `node_modules`
- `package-lock.json`
- `package.json`
- `public`
- `scripts`
- `src`
- `src-tauri`
- `tsconfig.json`
- `tsconfig.node.json`
- `vite.config.ts`

## Current implementation notes

- `RUNTIME.md` is the canonical runtime proof note. Final ARDA validation is
  native Tauri/WebKit in distrobox `lothlorien`; host Vite/browser is useful
  for fast visual iteration but is not final proof.
- `src/lib/ardaRuntimeMode.ts` and
  `src/components/arda/core/RuntimeModeBadge.tsx` expose whether the current
  surface is running as Vite/browser, Tauri dev, Tauri static, or a degraded
  fallback.
- `src/lib/ardaBundleTypes.ts`, `src/lib/ardaReaders.ts`, and
  `src/lib/ardaSource.ts` split ARDA bundle typing, file/static readers, and
  the public bundle loader.
- `src/lib/ardaProvenance.ts` defines the shared ARDA source provenance and
  freshness model used by `DataFreshnessBadge.tsx` and
  `DataSourceDetailsPanel.tsx`.
- `ARDA_BOARDROOM_SLOT_ASSIGNMENT_CONTRACT.md` and
  `src/lib/boardroomSlotSettings.ts` are the current authority for boardroom
  slot assignments and `surface_layout` preview/focus/embed metadata.
- `core/state/arda_boardroom_slots.json` is the workspace-backed operator
  document for boardroom assignments. Older documents are normalized with
  default `surface_layout` values at load time.
- `ARDA_UNIFIED_PATH_FORWARD_2026-05-22.md` is the most recent execution path.
  `ARDA_PRD.md` remains a vision source, not the current task queue.
- `ARDA_WORLD_DISTRICT_CONTRACT.md` documents the Milestone 3 world district
  metadata, urgency states, action guards, and native-validation boundary.
- `ARDA_ASSET_PERFORMANCE_BUDGET.md` defines current scene asset size budgets,
  measured 2026-06-01 build offenders, and the Blender/optimization exit
  criteria for promoting starter assets to production runtime assets.
- `SYSTEM_SPECS.md` was removed on 2026-06-02. It was a host-specific
  historical troubleshooting note superseded by `RUNTIME.md`.

## Current open boardroom work

- Add local service manifests for media/document renderers and VM/agent work
  surfaces. Beelink Grafana and Open WebUI now have first-pass manifests.
- Prove each heavy local service in native Tauri/WebKit before enabling inline
  embed mode; otherwise open it as a native workstation window.
