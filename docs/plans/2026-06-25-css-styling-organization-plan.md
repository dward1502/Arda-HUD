# ARDA HUD CSS and Styling Organization Plan

> **For Hermes:** Use the ARDA HUD development workflow if implementing this plan. This is a CSS structure refactor, not a redesign. Keep each batch move-only, verify build output after every batch, and do not change component behavior or visuals intentionally.

**Date:** 2026-06-25

**Goal:** Split the 6557-line `src/index.css` into a navigable style system while preserving current ARDA HUD visuals and runtime behavior.

**Architecture:** Keep `src/index.css` as the single Vite/Tailwind entrypoint imported by `src/main.tsx`. Move rules into `src/styles/**` files grouped by layer and domain, then import them from `index.css` in deterministic order. Use existing `src/styles/` scaffold instead of inventing an unrelated style architecture.

**Tech Stack:** Vite, React, Tailwind v4 CSS entry (`@import "tailwindcss"`), plain CSS, existing `src/styles/tokens/nightcity.tokens.ts`.

---

## Current verified state

- `src/index.css` is 6557 lines.
- CSS imports are currently centralized through `src/main.tsx:6`, which imports `./index.css`.
- Existing CSS/style files:
  - `src/index.css`
  - `src/components/arda/modules/LearningLoopSurface.module.css`
  - `src/styles/INDEX.md`
  - `src/styles/tokens/nightcity.tokens.ts`
- `src/styles/INDEX.md` already exists, so a `src/styles/**` split is supported by current tree evidence.
- `src/styles/INDEX.md` currently references `README.md`, but `src/styles/README.md` is not present. Add it as part of this cleanup.

---

## Guardrails

- Do not redesign the HUD visual language in this pass.
- Do not rename CSS classes unless the same batch updates all TSX call sites and verifies the result.
- Do not move styles into CSS modules broadly. Leave `LearningLoopSurface.module.css` as-is unless a later component-level plan targets it.
- Do not delete rules during the first pass. Move first, deduplicate only after build and visual smoke are stable.
- Keep `src/index.css` as the only CSS imported by `src/main.tsx`.
- Preserve Tailwind directives and import ordering. If import order breaks Tailwind processing, stop and repair the entrypoint before continuing.
- Do not create a parallel theme/token system until the existing `:root` CSS variables and `nightcity.tokens.ts` relationship is documented.

---

## Target structure

Create this structure gradually:

```text
src/styles/
  README.md
  INDEX.md
  foundation/
    tokens.css
    themes.css
    keyframes.css
    base.css
    utilities.css
  layout/
    app-shell.css
    panels.css
    workspace.css
  components/
    cards.css
    controls.css
    modules.css
    data-display.css
    media-library.css
    hermes-dashboard.css
    service-surfaces.css
  scene/
    scene-stage.css
    boardroom.css
    workstations.css
    world.css
    hud-instruments.css
    terminal-surfaces.css
  adapters/
    fleet.css
```

Keep `src/index.css` as:

```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
@import "tailwindcss";

@source "./**/*.{ts,tsx,html}";

@import "./styles/foundation/tokens.css";
@import "./styles/foundation/themes.css";
@import "./styles/foundation/keyframes.css";
@import "./styles/foundation/base.css";
@import "./styles/foundation/utilities.css";
@import "./styles/layout/app-shell.css";
@import "./styles/layout/panels.css";
@import "./styles/layout/workspace.css";
@import "./styles/components/cards.css";
@import "./styles/components/controls.css";
@import "./styles/components/modules.css";
@import "./styles/components/data-display.css";
@import "./styles/components/media-library.css";
@import "./styles/components/hermes-dashboard.css";
@import "./styles/components/service-surfaces.css";
@import "./styles/scene/scene-stage.css";
@import "./styles/scene/boardroom.css";
@import "./styles/scene/workstations.css";
@import "./styles/scene/world.css";
@import "./styles/scene/hud-instruments.css";
@import "./styles/scene/terminal-surfaces.css";
@import "./styles/adapters/fleet.css";
```

If Vite/Tailwind rejects `@source` before later imports, move `@source` after all imports and re-run `npm run build`. The accepted order should be recorded in `src/styles/README.md`.

---

## Phase 0 — baseline and CSS inventory

**Objective:** Capture the current state before moving any rules.

**Commands:**

```bash
cd /var/home/mythos/Eregion/Arda-HUD
git status --short
wc -l src/index.css
find src -maxdepth 4 -type f \( -name '*.css' -o -name '*.module.css' -o -name '*.scss' \) | sort
npm run build
npm test -- --run
```

**Create:**
- `docs/style-index-before.md`

**Suggested inventory command:**

```bash
python - <<'PY' > docs/style-index-before.md
from pathlib import Path
import re
p = Path('src/index.css')
text = p.read_text()
print('# ARDA HUD CSS Selector Index Before Split')
print()
print(f'File: `{p}`')
print(f'Lines: {len(text.splitlines())}')
print()
for i, line in enumerate(text.splitlines(), 1):
    s = line.strip()
    if s.startswith('@keyframes') or s.startswith('@media') or s.startswith(':root') or re.match(r'^[.#][A-Za-z0-9_-]+', s):
        print(f'- line {i}: `{s[:120]}`')
PY
```

**Exit criteria:**
- Baseline build/test pass.
- Selector inventory exists.
- No CSS files have been moved yet.

---

## Phase 1 — create style docs and empty destination files

**Objective:** Add structure without changing loaded CSS behavior.

**Create directories/files:**
- `src/styles/README.md`
- `src/styles/foundation/tokens.css`
- `src/styles/foundation/themes.css`
- `src/styles/foundation/keyframes.css`
- `src/styles/foundation/base.css`
- `src/styles/foundation/utilities.css`
- `src/styles/layout/app-shell.css`
- `src/styles/layout/panels.css`
- `src/styles/layout/workspace.css`
- `src/styles/components/cards.css`
- `src/styles/components/controls.css`
- `src/styles/components/modules.css`
- `src/styles/components/data-display.css`
- `src/styles/components/media-library.css`
- `src/styles/components/hermes-dashboard.css`
- `src/styles/components/service-surfaces.css`
- `src/styles/scene/scene-stage.css`
- `src/styles/scene/boardroom.css`
- `src/styles/scene/workstations.css`
- `src/styles/scene/world.css`
- `src/styles/scene/hud-instruments.css`
- `src/styles/scene/terminal-surfaces.css`
- `src/styles/adapters/fleet.css`

**Update:**
- `src/styles/INDEX.md` to list the new directories and `README.md` accurately.

**Verification:**

```bash
git diff --check -- src/styles docs/plans/2026-06-25-css-styling-organization-plan.md
npm run build
```

**Exit criteria:**
- Empty files/directories do not affect build.
- `src/styles/INDEX.md` matches reality.

---

## Phase 2 — split foundation rules

**Objective:** Move global variables, theme variables, keyframes, base reset, and utility animation classes out of `index.css`.

**Move from `src/index.css`:**
- Lines near 1-41: root tokens into `src/styles/foundation/tokens.css`
- Lines near 43-156: keyframes and animation utility classes into `src/styles/foundation/keyframes.css`
- Lines near 158-210: `:root[data-theme=...]` blocks into `src/styles/foundation/themes.css`
- Base reset/body/root rules into `src/styles/foundation/base.css`
- Generic one-off utilities such as glow/accent/text utility classes into `src/styles/foundation/utilities.css`

**Update `src/index.css`:**
- Keep font import, Tailwind import, `@source`, and imports of the new foundation files.

**Verification:**

```bash
npm run build
npm test -- --run src/test/setup.smoke.test.ts
git diff --check -- src/index.css src/styles/foundation
```

**Exit criteria:**
- Build passes.
- `index.css` line count drops meaningfully.
- No component/scene selectors moved yet.

---

## Phase 3 — split app shell and layout rules

**Objective:** Move high-level layout rules before component-level rules.

**Move to `src/styles/layout/app-shell.css`:**
- `.arda-app*`
- `.arda-header*`
- `.theme-switcher*`
- `.view-mode-switcher*`
- `.window-control*`

**Move to `src/styles/layout/panels.css`:**
- `.module-grid*`
- `.module-card*` if kept as general panel/card shell, otherwise use `components/cards.css`
- `.panel*`
- `.lower-traffic*`

**Move to `src/styles/layout/workspace.css`:**
- `.panel-workspace*`
- `.layout-manager*`
- `.arda-layout*`
- `.workstation-dock*` only if it is shell/dock styling rather than scene styling

**Verification:**

```bash
npm run build
npm test -- --run src/components/arda/modules/SectionFocusModule.test.tsx src/components/arda/modules/DataFreshnessBadge.test.tsx
git diff --check -- src/index.css src/styles/layout
```

**Visual smoke:**
- Browser/Tauri should still show header, theme switcher, module panels, and workspace frame.

---

## Phase 4 — split reusable component rules

**Objective:** Move module/card/control/data-display styling into reusable CSS files.

**Move to `src/styles/components/cards.css`:**
- `.module-card*`
- `.metric-pill*`
- `.source-coverage-badge*`
- `.source-provenance*`

**Move to `src/styles/components/controls.css`:**
- buttons
- refresh affordances
- config tabs/selectors
- command/action controls not specific to terminal rendering

**Move to `src/styles/components/modules.css`:**
- `.section-focus*`
- `.systems-module*`
- `.operating-surface*`
- `.arda-command-console*` if not terminal-specific
- `.review-gate*`
- `.task-list-viewer*`
- `.config-*`

**Move to `src/styles/components/data-display.css`:**
- `.path-list*`
- `.lane-route*`
- `.fitness-card*`
- `.line-list*`
- status chips/KPI/list rows that are not scene-specific

**Move to component-specific files:**
- `media-library.css`: `.media-library*`
- `hermes-dashboard.css`: `.hermes-dashboard*`
- `service-surfaces.css`: `.service-surface*`

**Verification:**

```bash
npm run build
npm test -- --run \
  src/components/arda/modules/OperatingSurfacePlanModule.test.tsx \
  src/components/arda/modules/ReviewGateWorkstation.test.tsx \
  src/components/arda/modules/HermesDashboardModule.test.tsx \
  src/lib/mediaLibrarySurface.test.ts
git diff --check -- src/index.css src/styles/components
```

---

## Phase 5 — split scene and boardroom rules

**Objective:** Move heavy 3D/scene/workstation styling out of general component files.

**Move to `src/styles/scene/scene-stage.css`:**
- `.scene-stage*`
- `.scene-backdrop*`
- `.signal-field*`
- `.scene-transition*`

**Move to `src/styles/scene/boardroom.css`:**
- `.boardroom-scene*`
- `.boardroom-console*`
- `.boardroom-support-deck*`
- `.boardroom-surface-preview*`

**Move to `src/styles/scene/workstations.css`:**
- `.scene-workstation*`
- `.scene-runtime-workstation-layer*`
- `.scene-runtime-card*`
- `.scene-anchor-label*`

**Move to `src/styles/scene/world.css`:**
- `.world-hero*`
- `.world-avatar*`
- `.world-terminals*`
- `.world-district-presence-cue*`

**Move to `src/styles/scene/hud-instruments.css`:**
- `.hud-instrument*`
- control icon/instrument visualizer rules

**Move to `src/styles/scene/terminal-surfaces.css`:**
- `.world-terminal-preview*`
- `.command-core-terminal*`
- `.hermes-desk-terminal*`

**Verification:**

```bash
npm run build
npm test -- --run \
  src/scene/boardroom/boardroomSpatialLayout.test.ts \
  src/scene/boardroom/boardroomVisualRefinement.test.ts \
  src/scene/systems/presenceState.test.ts \
  src/scene/world/worldDistrictPresentation.test.ts \
  src/scene/world/worldTerminalSurfacePreviewModel.test.ts
git diff --check -- src/index.css src/styles/scene
```

**Visual smoke:**
- Boardroom monitor surfaces still render.
- World view still renders.
- Terminal previews still use their expected palette.

---

## Phase 6 — split adapter/proof styles

**Objective:** Isolate recent adapter/workstation proof styles from core scene styles.

**Move to `src/styles/adapters/fleet.css`:**
- `.fleet-preview-surface*`
- `.fleet-focused-view*`

**Verification:**

```bash
npm run build
npm test -- --run \
  src/scene/workstations/viewModels.test.ts \
  src/scene/workstations/adapters/annunimasAdapter.test.ts \
  src/workstations/adapters/genericControlSystemAdapter.test.ts
git diff --check -- src/index.css src/styles/adapters
```

---

## Phase 7 — deduplicate and normalize comments

**Objective:** Clean up only after move-only split is stable.

**Tasks:**
1. Search for duplicate selectors:

```bash
python - <<'PY'
from pathlib import Path
import re
seen = {}
for p in sorted(Path('src/styles').rglob('*.css')):
    for i, line in enumerate(p.read_text().splitlines(), 1):
        s = line.strip()
        m = re.match(r'([^{}]+)\s*\{', s)
        if not m or s.startswith('@'):
            continue
        selector = m.group(1).strip()
        seen.setdefault(selector, []).append(f'{p}:{i}')
for selector, locs in sorted(seen.items()):
    if len(locs) > 1:
        print(selector, '=>', ', '.join(locs))
PY
```

2. Keep duplicates only when they are intentional state modifiers or media overrides.
3. Add file headers naming the ownership domain.
4. Update `src/styles/README.md` with:
   - import order
   - file ownership map
   - rules for adding new styles
   - verification commands

**Verification:**

```bash
npm run build
npm test -- --run
git diff --check -- src/index.css src/styles
```

---

## Phase 8 — create post-cleanup style index

**Objective:** Give future agents a current map of styling ownership.

**Create:**
- `docs/style-tree-index.md`

**Command:**

```bash
cd /var/home/mythos/Eregion/Arda-HUD
{
  echo "# ARDA HUD Style Tree Index"
  echo
  echo "Generated: $(date -Iseconds)"
  echo
  echo "## CSS files"
  echo '```'
  find src -maxdepth 5 -type f \( -name '*.css' -o -name '*.module.css' \) \
    | sort \
    | while read -r file; do printf '%6s  %s\n' "$(wc -l < "$file")" "$file"; done
  echo '```'
  echo
  echo "## CSS imports"
  echo '```'
  grep -R "import .*\.css\|@import" -n src vite.config.ts package.json 2>/dev/null | sed -n '1,240p'
  echo '```'
  echo
  echo "## Large CSS files"
  echo '```'
  find src -maxdepth 5 -type f \( -name '*.css' -o -name '*.module.css' \) \
    | sort \
    | while read -r file; do lines=$(wc -l < "$file"); [ "$lines" -gt 700 ] && printf '%6s  %s\n' "$lines" "$file"; done
  echo '```'
} > docs/style-tree-index.md
```

**Exit criteria:**
- `src/index.css` is only the entry/import file plus any unavoidable global directives.
- No individual CSS file is unexpectedly huge. If one remains over ~700 lines, it has a documented reason.
- `docs/style-tree-index.md` reflects the new structure.

---

## Final verification gate

Run all of these before declaring the CSS organization complete:

```bash
cd /var/home/mythos/Eregion/Arda-HUD
npx tsc --noEmit
npm test -- --run
npm run build
git diff --check
```

Optional visual check:

```bash
npm run dev -- --host 0.0.0.0
```

For Tauri visual parity, use the repo's stable command only after build/test are green:

```bash
npm run tauri:dev:stable
```

---

## Acceptance criteria

- `src/index.css` is reduced from a 6557-line monolith to a small entrypoint/import manifest.
- Styles are organized by foundation, layout, reusable components, scene, and adapter-specific domains.
- `src/styles/README.md` and `src/styles/INDEX.md` accurately document the structure.
- `docs/style-tree-index.md` exists after cleanup.
- No visual redesign is mixed into the structural split.
- `npx tsc --noEmit` passes.
- `npm test -- --run` passes.
- `npm run build` passes.
- `git diff --check` passes.

---

## Suggested commit sequence

1. `docs: add ARDA HUD CSS organization plan`
2. `chore(styles): scaffold CSS ownership directories`
3. `refactor(styles): extract foundation styles from index`
4. `refactor(styles): extract layout and panel styles`
5. `refactor(styles): extract component styles`
6. `refactor(styles): extract scene and boardroom styles`
7. `refactor(styles): extract adapter-specific styles`
8. `docs(styles): add style tree index`
