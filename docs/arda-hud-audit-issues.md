# ARDA HUD Issues Audit

Date: 2026-06-23
Scope: `src/`, `package.json`, `tsconfig.json`, repo bootstrap paths

Evidence method: ownership markers + `rg` searches + direct reads. Issues below are
verified against the current tree. Severities follow the established schema: `fatal |
high | medium | low`.

---

1. HIGH — unsound JSON parsing with raw `JSON.parse` + unchecked shapes
   - Owned by: `app.tsx`, `ardaSource.ts`
   - Evidence: `src/App.tsx:2115`, `src/App.tsx:394`, `src/lib/ardaSource.ts:101-140`.
     Every `JSON.parse` uses `as unknown`/`asRecord` with runtime if-checks, so a
     malformed field drops to fallbacks silently.
   - Risk: runtime shapes diverge from types without compile rejection.

2. HIGH — `src/lib/charonLive.ts` missing from tree
   - Owned by: `charon`
   - Evidence: `rg -n "function |export async function |..."` reported
     `src/lib/charonLive.ts: No such file or directory`
   - Risk: any import or contract referencing this path is broken, but the TS build
     did not catch it. Possible phantom diff / stale path.

3. HIGH — `SceneRuntimeCard` is defined but unused
   - Owned by: `app.tsx`
   - Evidence: `rg -n "SceneRuntimeCard"` returned 0 matches in src after the card
     was defined in `src/scene/systems/SceneRuntimeCard.tsx:23`.
   - Risk: dead code inflates bundle and signals incomplete runtime refactor.

4. HIGH — command-lookup helpers swallow surrounding call errors
   - Owned by: `systemActionBus.ts`
   - Evidence: `src/lib/systemActionBus.ts:370-429` wraps to single `try/catch`
     blocks that log generic messages and rethrow wrappers.
   - Risk: the helper hides whether the failure was path/ENOENT/JSON/access.

5. HIGH — hard-coded loopback endpoints in values read from runtime files
   - Owned by: `systemActionBus.ts`
   - Evidence: search for `127.0.0.1|localhost:\\d+` returned 57 matches
     including runtime payload paths and defaults.
   - Risk: works on the host but breaks in containerized/test/native-runtime UI.

6. MEDIUM — projection order instability from object-iteration mappings
   - Owned by: `app.tsx`
   - Evidence: `src/App.tsx:556`, `src/App.tsx:824-878`, `src/App.tsx:887-892`
     iterate `Object.entries(...)` over unordered maps in multiple surfaces.
   - Risk: snapshot tests need seeded objects; currently behavior is non-deterministic.

7. MEDIUM — local-storage coupling without degradation path
   - Owned by: `app.tsx`, `multiWindow.ts`, `systemActionBus.ts`, `boardroomSlotSettings.ts`, `worldSurfaceSettings.ts`
   - Evidence: `src/App.tsx:2113`, `src/utils/multiWindow.ts:44`, `src/lib/systemActionBus.ts:405`,
     `src/lib/boardroomSlotSettings.ts:392`, `src/lib/worldSurfaceSettings.ts:348`.
     All do `storage.getItem` without fallback if storage is disabled/null.
   - Risk: SSR/offscreen/restricted contexts throw or zero state silently.

8. MEDIUM — numerous runtime warnings via `console.warn` in production paths
   - Owned by: `tauriGuard.ts`
   - Evidence: `src/lib/tauriGuard.ts:14-25` warns guard misses in browser mode but
     does not report to structured action bus.
   - Risk: noobservable/actionable semantics in native UI.

9. MEDIUM — fixture-base coverage assumptions leak `window` into node tests
   - Owned by: `test/setup.ts`
   - Evidence: `src/test/setup.ts:1-2` is only `import '@testing-library/jest-dom/vitest'`
     with no jsdom/globals shim.
   - Risk: any test touching localStorage/Window may fail in node-only environments.

10. MEDIUM — duplicate unsafe-to-JSON.parse casts in adapter sources
    - Owned by: `ingest/sources.ts`
    - Evidence: `src/lib/ingest/sources.ts:44`, `src/lib/ingest/sources.ts:52` cast
      `componentType as any || 'auto'`.
    - Risk: typos pass silently; downstream schema normalization gets garbage shapes.

11. LOW — inconsistent companion text compaction semantics
    - Owned by: `companionDisplayState.ts`
    - Evidence: `src/scene/systems/companionDisplayState.ts:64` trims empty strings to
      undefined, then `compactText` calls on `banner` and `inquiry` may both collapse
      to undefined and render nothing in idle-active transitions.
    - Risk: visual gap between presence states; no diagnostic for test coverage.

12. LOW — stale heritage references weaken bundle typediff
    - Owned by: `json5`, `json5/tsconfig.json` (node_modules, excluded from src lint)
    - Evidence: package manifest includes `json5`/`json5/tsconfig.json` in legacy
      dependency ordering even though source does not import it.
    - Risk: future tree-shake/build regressions are harder to spot from stale refs.

---

Checklist to validate:
- item 3: `rg -n "SceneRuntimeCard" src` should produce 0 matches.
- item 4: grep `try/catch` ranges in `systemActionBus.ts` >= 370-1000 for the exact helpers.
- item 5: `rg -n "127.0|localhost:" src` gives candidate files to normalize.
- item 9: add or update test base for `jsdom` and re-run tests.