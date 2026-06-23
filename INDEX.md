<!-- sigil: REPAIR -->
# ARDA HUD Index

Consolidated ARDA HUD index and source index.

## Documents

- `README.md`
- `ARDA_OPERATING_SURFACE_PLAN_2026-05-27.md`
- `ARDA_CONTRACTS_MANIFEST.md`
- `ARDA_HUD_INTEGRATION.md`
- `src/scene/ARDA_SCENE_CONTRACTS.md`
- `src/scene/systems/CONTRACTS.md`
- `docs/archived/ARCHIVED_MYTHOS_SPEC.md`

## Current implementation notes

- `RUNTIME.md` is the canonical runtime proof note. Final ARDA validation is
  native Tauri/WebKit in distrobox `lothlorien`; host Vite/browser is useful
  for fast visual iteration but is not final proof.
- `src/lib/ardaRuntimeMode.ts` and
  `src/components/arda/core/RuntimeModeBadge.tsx` expose whether the current
  surface is running as Vite/browser, Tauri dev, Tauri static, or a degraded
  fallback.
- `src/lib/ardaBundleTypes.ts`, `src/lib/ardaReaders.rs`, and
  `src/lib/ardaSource.rs` split ARDA bundle typing, Rust file/static readers, and
  the public bundle loader.
- `src/lib/ardaProvenance.ts` defines the shared ARDA source provenance and
  freshness model used by `DataFreshnessBadge.tsx` and
  `DataSourceDetailsPanel.tsx`.
- `ARDA_CONTRACTS_MANIFEST.md` defines current scene asset size budgets,
  boardroom surface layout semantics, source freshness/provenance behavior,
  and world district field/action/urgency rules after the 2026-06-23
  contract merge.
- `src/components/arda/modules/WorkerReportSummary.tsx` is a lightweight
  positive-path check. It verifies the module renders, emits the expected
  surface-split summary for workers, and respects the ARDA status reporting
  contract.

## Archived paths

The old split contract docs were retired into the merged docs above.
This index is the migration surface; do not revive per-file authority
for those source paths.
