# App.tsx Refactor Handoff Plan

> **For Hermes:** If an agent implements this plan, use the ARDA HUD development workflow and keep each extraction batch small. Do not start a broad JSX/store split until pure derivations are extracted and verified.

**Date:** 2026-06-25

**Goal:** Give a human or follow-up agent a safe path to reduce `src/App.tsx` by extracting pure data derivation and layout helpers without changing runtime behavior.

**Current verified state:**
- `src/App.tsx` is 4417 lines.
- `docs/arda-hud-audit-issues.md` has been addressed through Batch D, but the worktree still contains many active/staged/untracked files from recent batches.
- `docs/App.tsx-refactor-audit.md` is the right next source document for the refactor path.
- The next cleanup should be guide-first: write/keep this plan, let the human perform the refactor and manual file/folder cleanup, then run a file tree index for a fresh agent handoff.

**Architecture:**
Extract pure functions first, leave `App()` and JSX in place until every derivation batch is covered by tests and build gates. Use one or two lib files as seams; do not introduce new store/routing architecture during the first pass.

---

## Recommended direction

Yes: this is the right path forward.

Reasoning:
1. `docs/arda-hud-audit-issues.md` was about hardening correctness risks.
2. `docs/App.tsx-refactor-audit.md` is about reducing the main structural risk now left in the UI: `App.tsx` mixing data transforms, runtime assumptions, layout helpers, and root JSX.
3. A written guide is safer than immediate large edits because the repo has many active changes and the user plans manual cleanup.
4. A post-cleanup file tree index is the right handoff artifact for the next agent because it prevents stale assumptions about moved/removed files.

---

## Guardrails

- Do not split JSX first.
- Do not introduce `src/services` or a parallel service layer.
- Do not create speculative style directories or CSS architecture.
- Do not rewrite behavior while extracting. This pass is move-only plus tests.
- After every extraction batch, run:
  - `npx tsc --noEmit`
  - targeted tests if added/changed
  - `npm run build`
- Run the full suite at phase boundaries:
  - `npm test -- --run`
- If TypeScript breaks, stop and repair before extracting the next batch.
- If a batch needs behavioral change, split it into a separate issue after the move-only extraction lands.

---

## Phase 0 — freeze and prepare

**Objective:** Make sure the refactor starts from a known baseline.

**Steps:**
1. Review current worktree:
   - `git status --short`
   - `git diff --stat`
2. Decide whether to commit/stash current Batch D and workstation changes before extraction.
3. Re-run baseline gates:
   - `npx tsc --noEmit`
   - `npm test -- --run`
   - `npm run build`
4. If any gate fails, fix the baseline before refactoring.

**Exit criteria:**
- You know exactly which files are dirty.
- Baseline tests/build pass.
- There is either a commit/stash boundary or an explicit decision to continue on the current dirty tree.

---

## Phase 1 — create the pure surface extraction file

**Objective:** Create the destination for pure bundle-derived helpers.

**Create:**
- `src/lib/ardaSurfaces.ts`

**Move candidates from `src/App.tsx`:**
- small generic helpers used only by surface derivations:
  - `getString`
  - `getNumber`
  - `getBoolean`
  - `formatPercent`
  - `formatMetric`
  - `getTimestamp`
  - `formatBytes`
- pure section/workstation lookups only if they are needed by extracted helpers:
  - `getSectionById`
  - `getSceneZoneById`
  - `getWorkstationManifestByZoneId`
  - `getWorkstationManifestById`

**Do not move yet:**
- React hooks
- `App()`
- JSX components
- `FleetFocusedWorkstationView`
- localStorage helpers

**Verification:**
- `npx tsc --noEmit`
- `npm run build`

---

## Phase 2 — extract operator/runtime derivations

**Objective:** Move the safest pure bundle derivations first.

**Move to:**
- `src/lib/ardaSurfaces.ts`

**Extract in this order:**
1. `getHumanDocs`
2. `getHumanNotes`
3. `getAgents`
4. `getPackageTools`
5. `getPackageEnablement`
6. `getPackageRuntimeActivation`
7. `getStorageStores`
8. `getStoragePressureSummary`
9. `getOutputTopology`
10. `getOutputAccounting`
11. `getGovernanceRuntimeSignals`
12. `getOperationsFlowSummary`
13. `getPaperclipAlignment`

**Why first:**
These are mostly pure mapping/normalization functions and create the import/export pattern before riskier review gate and provider routing functions move.

**Verification:**
- `npx tsc --noEmit`
- `npm test -- --run src/lib/ardaSource.remoteConfidence.test.ts src/lib/ardaProvenance.test.ts`
- `npm run build`

---

## Phase 3 — extract operator cockpit and summary derivations

**Objective:** Move the audit-identified Block A functions that already had deterministic-order hardening.

**Move to:**
- `src/lib/ardaSurfaces.ts`

**Extract in this order:**
1. `getEscalationRuntime`
2. `getOperatorActions`
3. `getGovernanceSummary`
4. `getAutonomyReadinessSummary`
5. `getSnapshotSectionStats`
6. `getQueueSummary`
7. `latestTaskEntries`
8. `getOperatorRuntimeSurface`
9. `providerOperationalState`
10. `providerUsageRatio`
11. `providerBudgetPressureLevel`
12. `getOperatorCockpitSurface`

**Add tests:**
- `src/lib/ardaSurfaces.test.ts`

**Minimum coverage:**
- object-entry derived lists are sorted deterministically
- missing/partial bundle data returns fallback-safe summaries
- provider pressure helpers preserve existing labels/states

**Verification:**
- `npm test -- --run src/lib/ardaSurfaces.test.ts src/lib/systemActionBus.test.ts`
- `npx tsc --noEmit`
- `npm run build`

---

## Phase 4 — extract command console and review gate derivations

**Objective:** Move functions with more action/review semantics only after the basic surface seam is stable.

**Primary option:** keep in `src/lib/ardaSurfaces.ts` for now.

**Optional split:** create `src/lib/reviewGateDerivation.ts` only if `ardaSurfaces.ts` becomes too large.

**Extract in this order:**
1. `getCommandConsoleSurface`
2. `getPlanShelf`
3. `getHumanAugmentationRuntime`
4. `getArandurQueueWriteRequests`
5. `getReviewGateItems`
6. `getCeoCouncilRuntime`
7. `getTaskLifecycleRuntime`

**Tests:**
- Add/extend `src/lib/ardaSurfaces.test.ts`, or create `src/lib/reviewGateDerivation.test.ts` if split.

**Minimum coverage:**
- review gate items preserve IDs/titles/risk labels
- queue write requests degrade safely on missing source data
- command console actions are derived without raw JSON rendering

**Verification:**
- `npm test -- --run src/lib/ardaSurfaces.test.ts src/lib/systemActionBus.test.ts`
- `npx tsc --noEmit`
- `npm run build`

---

## Phase 5 — extract provider/routing derivations

**Objective:** Move routing/provider helpers while preserving the new workstation adapter seams.

**Recommended file:**
- Start in `src/lib/ardaSurfaces.ts`
- Split later to `src/lib/providerRouting.ts` only if tests and imports stay simple.

**Extract in this order:**
1. `getTaskLifecycleRuntime`
2. `getFleetHealth`
3. `getLaneOwnership`
4. `getLaneHeadroom`
5. `getLaneFitness`
6. `getRoutableProviders`
7. `getRuntimeDrift`

**Watchpoints:**
- There are already workstation adapter files under `src/scene/workstations/` and `src/workstations/adapters/`; do not duplicate their responsibilities.
- Keep this extraction as a compatibility bridge for `App.tsx`, not a redesign of the adapter model.

**Verification:**
- `npm test -- --run src/scene/workstations/viewModels.test.ts src/scene/workstations/adapters/annunimasAdapter.test.ts src/workstations/adapters/genericControlSystemAdapter.test.ts src/lib/ardaSurfaces.test.ts`
- `npx tsc --noEmit`
- `npm run build`

---

## Phase 6 — extract knowledge and operating surface reports

**Objective:** Move Block B only after Block A is outside `App.tsx`.

**Move to:**
- `src/lib/ardaSurfaces.ts`, or if the file is too large:
  - `src/lib/operatingSurfaceDerivation.ts`

**Extract:**
1. `getKnowledgeMap`
2. `getOperatingSurfaceReports`

**Tests:**
- Missing projection inputs yield fallback/gap states.
- Evidence/path strings are preserved.
- No raw JSON becomes primary UI content.

**Verification:**
- `npm test -- --run src/lib/ardaSurfaces.test.ts`
- `npx tsc --noEmit`
- `npm run build`

---

## Phase 7 — extract layout-only helpers last

**Objective:** Reduce remaining non-JSX helpers without moving React root behavior.

**Recommended file:**
- `src/lib/settingsLayout.ts`

**Move:**
- `readStoredModuleOrder`
- `moveModule`
- `sectionToPanelLayout`
- `formatSectionStatus`
- `formatPanelStatus`
- `formatProviderLabel`
- `asModuleId`
- `titleForSectionOrPanel`

**Tests:**
- `src/lib/settingsLayout.test.ts`

**Minimum coverage:**
- bad localStorage JSON returns default module order
- restricted storage access does not throw
- module movement is bounded
- unknown section/panel IDs fall back to current labels

**Verification:**
- `npm test -- --run src/lib/settingsLayout.test.ts`
- `npx tsc --noEmit`
- `npm run build`

---

## Phase 8 — only then consider JSX/component splitting

**Objective:** Decide whether JSX extraction is still worth it after pure derivations are gone.

**Candidates after data extraction:**
- `FleetFocusedWorkstationView` into a focused workstation component.
- Root layout sections into `src/components/arda/app/` only if the directory exists or is intentionally created.

**Do not do this phase in the same commit as Phases 1-7.**

**Verification:**
- Full tests and build.
- Visual smoke check in browser/Tauri if JSX changes affect scene/workstation rendering.

---

## Manual cleanup guidance

After the refactor batches are done, manually inspect and remove only confirmed leftovers:

1. Search for exact or near-duplicate helper files:
   - `find src -type f | sort`
   - compare likely scratch files with `diff -q` or hashes.
2. Remove obsolete scratch/extraction files only after imports no longer reference them.
3. Do not delete docs or plans in bulk without choosing merge targets first.
4. Preserve these docs as current handoff authority until superseded:
   - `docs/arda-hud-audit-issues.md`
   - `docs/App.tsx-refactor-audit.md`
   - this plan

---

## File tree index handoff

After manual cleanup, run a file tree index so a new agent can get the lay of the land without stale assumptions.

Recommended command:

```bash
cd /var/home/mythos/Eregion/Arda-HUD
{
  echo "# ARDA HUD File Tree Index"
  echo
  echo "Generated: $(date -Iseconds)"
  echo
  echo "## Git status"
  echo '```'
  git status --short
  echo '```'
  echo
  echo "## Source tree"
  echo '```'
  find src docs -maxdepth 4 -type f \
    | sort \
    | sed 's#^#- #'
  echo '```'
  echo
  echo "## App.tsx extracted symbol check"
  echo '```'
  python - <<'PY'
from pathlib import Path
p = Path('src/App.tsx')
print(f'{p}: {len(p.read_text().splitlines())} lines')
for i, line in enumerate(p.read_text().splitlines(), 1):
    s = line.strip()
    if s.startswith('function ') or (s.startswith('const ') and '=>' in s and not s.startswith('const [')):
        print(f'{i}: {s[:140]}')
PY
  echo '```'
} > docs/file-tree-index.md
```

Then run:

```bash
git status --short
npx tsc --noEmit
npm test -- --run
npm run build
git diff --check
```

---

## Acceptance criteria

The refactor is complete when:

- `src/App.tsx` no longer owns pure bundle derivation logic.
- `App.tsx` primarily wires hooks, memoized calls, handlers, and JSX.
- Extracted derivations have focused tests.
- `npx tsc --noEmit` passes.
- `npm test -- --run` passes.
- `npm run build` passes.
- `git diff --check` passes.
- `docs/file-tree-index.md` exists after manual cleanup and reflects the final tree.

---

## Suggested commit sequence

1. `docs: add App.tsx refactor handoff plan`
2. `refactor: extract ARDA surface derivation helpers`
3. `test: cover ARDA surface derivations`
4. `refactor: extract review gate and routing derivations`
5. `refactor: extract App layout helpers`
6. `docs: refresh ARDA HUD file tree index`
