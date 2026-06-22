---
title: ARDA HUD Integration Plan
status: pending
owner: arda-hud
updated: 2026-06-22
---

# ARDA HUD Integration Plan

## Goal
Make ARDA HUD consume **core state** and **human plan surfaces** directly so the operator sees live system truth instead of stale snapshots.

## Data Sources
- `core/state/arda_snapshot.json`
- `core/state/control_plane_lockdown.json`
- `core/state/runtime_settings.json`
- `core/projects/Plans/*.md`
- `core/projects/tasks/queue.jsonl`

## Implementation Steps

### 1. Tail core state files on a short interval
Watch the JSON files above. When a write is detected, refresh the corresponding HUD panel. Keep label cardinality low: key by `panel_id` (boardroom, knowledge, finance, operations, governance) and update the panel's top-level data object.

### 2. Render plans as structured surfaces
Parse plan markdown frontmatter and task status sections into a JSON schema:
```ts
{ id, title, status, owner, updatedAt, taskCount, criticalCount }
```
Feed that to the HUD `boardroom` and `operations` panels.

### 3. Surface queue health
Read `queue.jsonl` and project:
- total pending tasks
- in-progress by lane
- stuck intents older than 30 min

Show in `operations` panel as live counters and a short recent-activity list.

### 4. Add explicit status splits
Do not collapse failed / blocked / completed into a single progress bar. Show each status class with its own label and count.

### 5. Local-only fallback mode
When no core path is mounted, HUD should show empty panels with a `LOCAL ONLY` banner and a path for the operator to mount `~/Annunimas` as the core root.

## Verification
- [ ] HUD reloads within 2 seconds of a core state JSON write.
- [ ] Changing a plan markdown file updates the boardroom surface.
- [ ] Queue counters match `cat core/projects/tasks/queue.jsonl | wc -l` minus closed tasks.
- [ ] Local-only mode renders cleanly with zero config.

## Notes
The ARDA HUD binaries exist at:
- `/var/home/mythos/Eregion/arda-hud/arda_hud`
- `/var/home/mythos/Eregion/arda-hud/arda_hud_bin`

The current plan entry is `PROMETHEUS.md` task #6.
