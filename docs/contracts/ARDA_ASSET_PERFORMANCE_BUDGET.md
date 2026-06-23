---
soterion:
  sigil: "SCROLL"
  glyph: "📜"
  code_point: "U+1F4DC"
  role: "performance_contract"
  owner: "HADES"
  status: "active"
  last_reviewed: "2026-06-23"
---

> 🜏 Soterion: 📜 performance_contract | owner: HADES | status: active | reviewed: 2026-06-23

# ARDA Asset Performance Budget

Purpose: make ARDA scene asset polish measurable before the next Blender pass.

This budget does not replace visual refinement. It defines the size gates that
starter assets must satisfy before they are treated as production-ready runtime
assets.

## Runtime Budget

| Asset class | Budget | Current action when exceeded |
| --- | ---: | --- |
| GLB/GLTF model | 5 MB per runtime asset | Decimate mesh, remove embedded texture payloads, split/lazy-load focused model |
| Texture/image channel | 2 MB per runtime asset | Resize, compress, or move to GPU-compressed texture format |
| HDR/environment | 3 MB per runtime asset | Downsample or ship LDR preview where reflections are not needed |
| JS runtime chunk | 750 KB per chunk | Split/defer non-critical code |
| Total `dist/assets` payload | 65 MB | Reduce high-weight scene assets before native proof |

The implementation model lives in
`src/scene/systems/assetPerformanceBudget.ts` and is covered by
`src/scene/systems/assetPerformanceBudget.test.ts`.

## 2026-06-01 Initial Build Snapshot

Observed after the first budget pass:

| Asset | Size | Budget result | Required next action |
| --- | ---: | --- | --- |
| `boardroom_main_desk-ZfJB1Q42.glb` | 29,575,352 bytes | fail | Replace with optimized production desk or split/lazy-load |
| `boardroom_main_desk_flux2-BW9jZosy.glb` | 22,105,868 bytes | fail | Remove duplicate/heavy variant from default runtime path or optimize |
| `boardroom_wall_ao-H8Bri2t8.png` | 7,978,084 bytes | fail | Resize/compress/convert AO channel |
| `center_console-D4RPipqJ.glb` | 2,586,524 bytes | warn | Keep under watch during bevel/material pass |
| `boardroom_wall_emissive-_scY76-5.png` | 2,210,802 bytes | fail | Resize/compress emissive wall channel |
| `boardroom_environment-CJDuDhPb.hdr` | 2,097,202 bytes | ok | Within HDR budget |
| `boardroom_floor_ao-CLvf0vbG.jpg` | 2,062,254 bytes | fail | Resize/compress AO channel |

Initial `dist/assets` total observed by `du` was about 86 MB, above the 65 MB
budget.

## 2026-06-01 Default Runtime Deferral

After excluding unused heavy starter desk variants from the default GLB URL
glob and removing oversized boardroom AO/emissive channels from the default
material texture glob, `npm run build` produced about 25 MB under
`dist/assets`.

Current largest default runtime assets:

| Asset | Size | Budget result | Note |
| --- | ---: | --- | --- |
| `center_console-D4RPipqJ.glb` | 2,586,524 bytes | ok | Largest default model; keep under watch during Blender pass |
| `boardroom_environment-CJDuDhPb.hdr` | 2,097,202 bytes | ok | Within HDR budget |
| `world_route_marker_albedo-SxYJFI31.png` | 989,654 bytes | ok | Largest default texture |
| `vendor-three-core-C4SSXDVm.js` | 724,936 bytes | ok | Below script chunk budget |

Deferred source assets remain available under `src/assets/scene/`, but they no
longer ship in the default runtime until optimized or intentionally lazy-loaded:

- `src/assets/scene/world/boardroom_main_desk/boardroom_main_desk.glb`
- `src/assets/scene/world/boardroom_main_desk_flux2/boardroom_main_desk_flux2.glb`
- oversized boardroom wall/floor/monitor AO and wall emissive channels

## Blender Refinement Checklist

When the procedural starter assets are refined in Blender, each promoted asset
needs:

- bevels and hard-surface proportions tuned for the cockpit scale
- glass/screen surfaces separated from housing and trim materials
- emissive accents applied through material channels, not duplicate geometry
- mesh decimation or retopology before export
- external/shared textures instead of embedded duplicate texture payloads
- exported GLB checked against the budget model before replacing runtime assets

2026-06-01 runtime refinement bridge:

- `src/scene/boardroom/boardroomVisualRefinement.ts` now makes screen glass and
  trim requirements measurable before binary Blender asset promotion.
- `BoardroomViewport` renders monitor and desk screens as separate physical
  glass panes plus metallic trim bars, instead of one flat translucent box.
- This does not replace the Blender art pass; it gives the current runtime a
  clearer glass/screen/trim separation while keeping the default build payload
  unchanged.
- Validation:
  `npm test -- --run src/scene/boardroom/boardroomVisualRefinement.test.ts
  src/scene/boardroom/boardroomSpatialLayout.test.ts
  src/scene/boardroom/boardroomSurfacePreviewModel.test.ts
  src/scene/systems/assetPerformanceBudget.test.ts` passed on 2026-06-01.

## Exit Criteria

The asset/performance pass is not complete until:

- default boardroom/world runtime assets satisfy the per-asset budget or have a
  documented lazy-load exception
- total `dist/assets` payload is at or below 65 MB, or a native-load benchmark
  justifies a temporary exception
- oversized starter variants are archived, optimized, or removed from the
  default import graph
- native Tauri/WebKit validation confirms scene load and interaction are still
  acceptable after optimization
