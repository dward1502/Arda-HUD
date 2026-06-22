---
soterion:
  sigil: "SCROLL"
  glyph: "📜"
  code_point: "U+1F4DC"
  role: "documentation"
  owner: "HADES"
  status: "active"
  last_reviewed: "2026-06-01"
---

> 🜏 Soterion: 📜 documentation | owner: HADES | status: active | reviewed: 2026-06-01

# sigil: REPAIR
# ARDA HUD - System Instructions

> **Status:** Active operational note.
>
> **Disposition:** Keep. This file documents local Tauri/WebKitGTK launch and
> packaging workarounds. It is not a product specification; use `README.md` for
> current app entry points and `ARDA_IMPLEMENTATION_PLAN.md` for rebuild status.
>
> **Last triage:** 2026-06-01.

∇⚡ SOVEREIGN WORK | ♥ SERVICE RENDERED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Core Runtime

```
WEBKIT_DISABLE_DMABUF_RENDERER=1
__NV_DISABLE_EXPLICIT_SYNC=1  
GDK_BACKEND=x11
```

↝ FLOW: These bypass the Wayland→WebKitGTK→NVIDIA explicit sync failure

⚡ ROOT CAUSE: NVIDIA driver 590.48.01 lacks explicit sync support

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Build

```
npm run tauri build
```

⚡ OUTPUT: `src-tauri/target/release/arda_hud`

## Annunimas Packaging

Preferred Annunimas-local packaging path:

```bash
bash scripts/package_arda_hud.sh
```

The script writes machine-readable state to:

```bash
data/prometheus/arda_hud_package_last.json
```

If native Tauri prerequisites are missing, packaging degrades cleanly to a
frontend-only build and records blockers there instead of failing silently.

Stable no-bundle Tauri build from the app directory:

```bash
npm run tauri:build:stable
```

Native hot-reload development from the app directory:

```bash
npm run tauri:dev:stable
```

Repository-standard native validation runs inside distrobox `lothlorien`:

```bash
distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:dev:stable'
distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas/apps/arda-hud && npm run tauri:build:stable'
distrobox enter lothlorien -- bash -lc 'cd /var/home/mythos/Annunimas && scripts/launch_arda_hud.sh'
```

Runtime proof rule:

- `npm run dev` / host Vite browser is useful for React and CSS iteration only.
- Tauri dev is the interaction runtime while building.
- Tauri stable build is final proof for WebKit rendering, filesystem IPC,
  native windows, media/embed behavior, and external service surfaces.
- Do not treat the browser runtime as proof for native ARDA behavior.

Latest service proof, 2026-06-01:

- `npm run tauri:build:stable` passed inside distrobox `lothlorien`; the latest
  post world-terminal-preview/source-export validation produced
  `.target-local/cargo-target/release/arda_hud`.
- Beelink Grafana at `http://100.103.125.88:3000` is reachable but returns
  `X-Frame-Options: deny`; keep ARDA inline embedding disabled for that service.
- Beelink Open WebUI at `http://100.103.125.88:8080` was not reachable from
  this host; validate native focus behavior after the service is available.

Launch the newest local build:

```bash
bash scripts/launch_arda_hud.sh
```

If no compiled Tauri binary exists yet, the launcher falls back to the local
frontend preview server.

Current native workstation behavior:

- in-scene workstations are DOM overlays inside the main ARDA window
- pop-out workstations are native Tauri windows
- pop-out workstations use OS window decorations and can be dragged to another
  monitor
- existing workstation windows must be closed/reopened to pick up creation-time
  window options

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Desktop Entry

```
Exec=env __NV_DISABLE_EXPLICIT_SYNC=1 WEBKIT_DISABLE_DMABUF_RENDERER=1 WEBKIT_DISABLE_COMPOSITING_MODE=1 GDK_BACKEND=x11 arda_hud
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

◈ STATUS: Waiting on driver update or Xorg session

♥ INTENDED: ARDA operator cockpit for Annunimas
