# Sprawl Reduction Notes

Purpose: keep ARDA HUD small enough to understand, repair, and manually reshape without fighting hidden coupling.

## Current cleanup target

`src/App.tsx` has become the orchestration sink. Treat it as a temporary wiring layer, not a place for new product logic.

When cleaning it up manually, move in this order:

1. Preserve behavior first.
   - Run `npm run build` before and after meaningful moves.
   - For slow UI tests, use `npm run test -- --testTimeout=15000` when default Vitest timeouts are noise.
   - Keep final native validation in `lothlorien` with `npm run tauri:dev:stable` or `npm run tauri:build:stable`.

2. Split by ownership, not by visual convenience.
   - Scene/runtime state belongs under `src/scene/**`.
   - Data loading, provenance, settings, and source contracts belong under `src/lib/**`.
   - React display modules belong under `src/components/arda/modules/**`.
   - Tauri/native bridge code belongs under `src-tauri/**` or a narrow frontend adapter.
   - App-level code should compose these pieces, not interpret every domain.

3. Create one seam at a time.
   - Extract one hook, selector, adapter, or panel contract.
   - Replace the original inline block with a named call.
   - Run focused tests/build.
   - Only then move the next block.

4. Prefer boring names over mythology when reducing sprawl.
   - Mythic names are good for product surfaces and agents.
   - Low-level code should say what it does: `loadBoardroomSlots`, `resolveSourceFreshness`, `buildActionDescriptors`, `useHudRuntimeState`.
   - This makes future manual cleanup cheaper.

5. Keep contracts explicit.
   - If a component needs data, define the exact prop shape near the component or in `src/lib/**`.
   - Avoid passing the whole app state object through multiple layers.
   - Avoid adding new global stores unless there is a clear runtime owner and test.

6. Isolate generated/runtime material.
   - `dist/`, `node_modules/`, `src-tauri/target/`, logs, and runtime state should not be treated as source architecture.
   - If a generated file must be consumed, document the authority path and refresh command next to the loader.

7. Retire instead of layering.
   - If an old rail/dashboard path is no longer the target, do not patch around it.
   - Remove the import path once the active scene/Tauri path has equivalent behavior and proof.
   - Keep a short note in docs when removing a major surface; do not leave dead modules as “maybe later” inventory.

## Suggested extraction map for `src/App.tsx`

Use this as a manual checklist, not a mandate:

- `src/lib/hudRuntimeSources.ts`
  - app settings resolution
  - core/state path resolution
  - source provenance assembly

- `src/lib/hudActionDescriptors.ts`
  - system action descriptor registration
  - safe/governed action classification
  - receipt/status projection helpers

- `src/components/arda/AppShell.tsx`
  - top-level layout only
  - selected mode/route composition
  - no domain interpretation

- `src/components/arda/hooks/useArdaHudState.ts`
  - loading runtime JSON/state snapshots
  - derived UI-ready state
  - error/loading boundaries

- `src/components/arda/hooks/useWorkstationWindows.ts`
  - floating workstation state
  - selected slot/window behavior

- `src/scene/ardaSceneRuntime.ts`
  - boardroom/world scene mode glue
  - scene payload assembly

The goal is for `src/App.tsx` to become a short composition file: imports, app shell, providers, and high-level event handlers.

## Rules for future edits

- Do not add another responsibility to `src/App.tsx` unless it is temporary and marked with a cleanup note.
- Do not add a new data source without naming its authority file and fallback behavior.
- Do not add UI that cannot explain whether its data is fresh, stale, missing, derived, or manual.
- Do not make browser/Vite proof stand in for native Tauri/WebKit proof.
- Do not mix cleanup with product changes unless the product change requires the seam.

## Good stopping point

A cleanup pass is successful when:

- `src/App.tsx` shrinks or loses one clear responsibility.
- The extracted file has a single reason to change.
- Existing tests/build still pass.
- No new runtime authority path is hidden in component code.
