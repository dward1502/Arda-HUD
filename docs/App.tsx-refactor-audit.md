# Arda HUD App.tsx Refactor Audit

Created during audit pass on `src/App.tsx` to preserve ownership mapping and recommended extraction order.

## Problem statement

- `src/App.tsx` is currently the whole app: data derivation, React root, layout constants, and inline JSX.
- Over time multiple agents added surfaces there instead of extracting modules.
- Result: localhost, `npm run tauri:dev:stable`, and `launch_arda_hud` can behave differently because the surrounding harness/ env differs, but `App.tsx` itself also makes divergence worse by intercepting all data in one blob.

## Ownership map: App.tsx

Lines are approximate because `App.tsx` is large and keeps changing. Treat the ranges as indicative, not as hard cut rules.

### Block A lines ~1..~1870: data derivation over bundle

This is the "safe" chunk to extract before touching JSX or hooks.

- Top section through `getQueueSummary` / review gate blocks (survey pass done earlier)
- `getOperatorCockpitSurface`-family functions
- `getCommandConsoleSurface`
- `getPlanShelf`
- `getHumanAugmentationRuntime`
- `getArandurQueueWriteRequests`
- `getReviewGateItems`
- `getCeoCouncilRuntime`
- `getTaskLifecycleRuntime`
- `getFleetHealth`
- `getLaneOwnership`
- `getLaneHeadroom`
- `getLaneFitness`
- `getRoutableProviders`
- `getRuntimeDrift`

### Block B lines ~1872..~2110: derived surface "operating surface" layer

- `getKnowledgeMap`
- `getOperatingSurfaceReports`

These consume Block A outputs, so Block A must move first.

### Mixed helpers lines ~908..~927 and others

- `providerOperationalState`
- `providerUsageRatio`
- `providerBudgetPressureLevel`
- `latestTaskEntries`
- `getOperatorRuntimeSurface`
- `readStoredModuleOrder`
- `moveModule`
- `sectionToPanelLayout`
- `formatSectionStatus`
- `formatPanelStatus`
- `formatProviderLabel`
- `asModuleId`
- `titleForSectionOrPanel`

These are pure helpers and should move with the data layer that uses them.

### React root lines ~2169..~END

- `App`
- bundle selectors
- effect lifecycle
- window/ bridge handling
- handlers
- JSX layout

Hold this in place until the extraction targets are verified.

## Recommended split files

1. `src/lib/ardaSurfaces.ts`
   - all pure getters over `ArdaBundle`
   - the helper functions above
   - exports used by both `App.tsx` and tests

2. `src/lib/reviewGateDerivation.ts` (optional, if you want smaller files)
   - `getReviewGateItems`
   - queue-write normalization
   - `ArandurQueueWriteRequest`, `ReviewGateItem`-related helpers

3. `src/lib/providerRouting.ts` (optional follow-up)
   - `getRoutableProviders`
   - `getLaneHeadroom`
   - `getLaneFitness`
   - `getRuntimeDrift`

4. `src/lib/settingsLayout.ts` (optional follow-up)
   - module-order helpers, section/panel formatters

## Root cause of 3-run behavior divergence

The architecture bug that makes dev, tauri dev, and launch look different:

1. `App.tsx` is both data transform and render root
2. Each bundler adds its own env / platform assumptions:
   - plain `npm run dev`
   - `npm run tauri:dev:stable`
   - `launch_arda_hud` likely adding distrobox / env patch layer
3. `App.tsx` does not expose a verified data contract; instead each surface normalizes its own slice of JSON
4. When environment changes, fields present or absent from `bundle` changes, so surfaces show different gaps and metrics

Fixes that matter after refactor:

- pin source path for `ArdaBundle` in one place
- pin explicit fallback behavior for missing projections
- run `tsc`, `vitest`, and `build` after each extraction batch
- if tauri dev still diverges, diff env vars between plain dev and wrapped launch, not App.tsx

## Recommended extraction order

1. `providerOperationalState`, `providerUsageRatio`, `providerBudgetPressureLevel`
2. `getOperatorRuntimeSurface`, `latestTaskEntries`
3. `getOperatorCockpitSurface`, `getEscalationRuntime`, `getOperatorActions`, `getGovernanceSummary`, `getAutonomyReadinessSummary`, `getSnapshotSectionStats`, `getQueueSummary`
4. `getCommandConsoleSurface`
5. `getPlanShelf`, `getHumanAugmentationRuntime`, `getArandurQueueWriteRequests`
6. `getReviewGateItems`
7. `getCeoCouncilRuntime`
8. `getTaskLifecycleRuntime`, `getFleetHealth`, `getLaneOwnership`, `getLaneHeadroom`
9. `getLaneFitness`, `getRoutableProviders`, `getRuntimeDrift`
10. `getKnowledgeMap`
11. `getOperatingSurfaceReports`
12. layout helpers last

Higher-risk extraction only after the above:
- pulling JSX into `src/components/...`
- splitting routing/stores

## Validation rules for each extraction batch

- import paths resolve under current tsconfig
- exported names match all existing call sites
- no TS type changes
- run `npm run test`
- run `npm run build`
- run `git status` / `git diff` to confirm only extraction moved
- if a batch breaks `tsc`, stop; do not skip fixing before the next batch

## If this gets re-run next session

1. Run the same audit tooling on updated `src/App.tsx`
2. Re-open `ARDA_IMPLEMENTATION_PLAN.md` and this file
3. Continue extraction from the first Batch that still uses getters still inside `App.tsx`
