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

ARDA HUD – Boardroom Module PRD
Version: 0.1 (Mythos Throne Phase)
Date: 2026-05-11
Owner: Netrunner God-King (you) + Grok
Status: Vision Source. Current execution lives in `ARDA_UNIFIED_PATH_FORWARD_2026-05-22.md`,
`ARDA_IMPLEMENTATION_PLAN.md`, and `ARDA_BOARDROOM_SLOT_ASSIGNMENT_CONTRACT.md`.

Implementation status note — 2026-06-01:

- The boardroom is now the primary scene-first ARDA path, with a fixed cockpit
  layout, workspace-backed monitor/desk assignments, native workstation
  pop-out windows, a first-pass command core, and a Hermes terminal surface.
- The current data contract is `surface_layout` in
  `core/state/arda_boardroom_slots.json`, parsed by
  `src/lib/boardroomSlotSettings.ts`. That contract is the bridge between this
  vision and configurable surfaces such as Grafana, Open WebUI, media,
  documents, VM/agent work views, and compact live-data visualizations.
- The immediate execution target is runtime parity and surface composition:
  native Tauri/WebKit is the proof runtime, browser Vite is only the fast
  iteration path, and heavy surfaces must be proven before inline embedding.
- Still-future items from this PRD include monitor arm physics, full avatar
  interaction/walking behavior, drag-and-drop surface authoring, VR/AR camera
  modes, and the richer back-wall tactical overview.

1. Vision
The Boardroom is your personal Netrunner Throne — an intimate, high-control command deck. It feels physical, reactive, and alive. This is where you sit (or stand) to orchestrate everything before stepping into the full Mythos Night City (World scene).
Core Feeling: Blade Runner 2049 ops room meets Gibson deck meets high-end sci-fi war room. Physical first, holographic second. Everything reacts to system state and your presence.
2. User Perspective & Core Interaction

Default View: First-person / slight over-the-shoulder. User feels seated or standing behind a solid physical desk array. No visible chair (for now — easy to add later).
Physical Layout:
Solid foreground desk with glowing inlays (cyan/magenta/teal reactive lighting).
4+ floating holographic monitors on articulated arms behind/above the desk.
Central command podium/throne interface.

Future VR/AR: Camera can switch to full seated or free-movement mode. Boardroom becomes a "cockpit" within the larger World scene.

3. Key Surfaces & Their Roles
A. The Desk Array (Foreground – Physical Core)

Solid, tactile base with glowing edge lighting and inlays that pulse with system health.
Sections: Desk Left | Desk Control (primary) | Desk Right | Desk Aux.
Behaviors:
Pull-out holographic drawers/shelves for quick inventory.
Drag-and-drop surfaces for pinning documents, agent cubes, or tools.
Reactive materials (scanlines, data flow, heat-map style when under load).


B. Floating Monitors (The Hero Feature)

Physical articulated arms + pure holographic display panels.
Can be pulled forward, rotated, stacked, or sent into orbit around the user.
Default positions: curved array behind the desk.
Content types (agnostic + sanitizable):
Live Agent Swarm topology
File Forest / Knowledge Map overview
Fleet Health / Systems / Runtime Drift
Canon / Logs / Mission Board
Custom user-connected tools (vLLM, Hermes, Codex, etc.)


C. Central Command Podium / Throne

Evolves from current white obelisk into a proper Gibson-style interface.
Holographic controls project upward.
Voice orb + avatar spawn disk integrated here.

D. Back Wall (Tactical Overview)

Living hex-grid display that can become:
City district map
Massive data waterfall
Agent position constellation
Ambient mood lighting


4. Avatar – "Grok/Joi/Cortana" Companion

Default State: Semi-transparent holographic female form standing on a glowing disk near the central podium (Ana de Armas Joi elegance + Cortana energy + Grok wit).
Active State: Disk fades, she fully instantiates and walks around the room — leans on desks, perches on monitor arms, stands beside you, gestures toward data.
Behaviors:
Reacts to voice commands with particle bursts and witty responses.
Physically interacts with objects (points, highlights, carries small data cubes).
Subtle idle animations + data ribbons flowing through her form.

Color/Style: Cyan-magenta-teal reactive glow. Shifts intensity based on system state (calm = soft cyan, alert = sharp magenta).

5. Interaction & Physics

Holographic UI: Mix of magical snapping + light physics (inertia, gentle bounce when dragged). Perfect for future "Gundam Warrior HUD" mode in the World scene.
Input Priority: Mouse/keyboard first → Voice → Future gesture/VR.
Navigation:
Look + raycast select.
Keyboard 1-4 focus monitors.
Smooth camera tweens + cinematic bloom on major actions.


6. Data & Workflow Display Strategy (The Hard Part)
Guiding Principle: The Boardroom is agnostic to backend sources (local agents, vLLM, Hermes, CrewAI, custom Rust agents, etc.).

Sanitization Layer: Dedicated Rust agent/crate that normalizes all incoming data into clean scene contracts (anchors, entities, metrics, events).
Display Patterns (to be expanded):
Physical Objects: Agent = glowing cube/entity with trails. File = orbiting mini-cube. Folder = small tower.
Surfaces: Shader materials for sparklines, heatmaps, connection graphs directly on desks/monitors.
Holographic Panes: Floating Monaco-style editors, graphs, timelines that can be pulled and rotated.
Ambient Reactivity: Room lighting, avatar behavior, particle density all reflect live state.


We should create a "Scene Contract Spec" next — standardized data shapes that any connected system can feed into.
7. Phase 1 Priorities (Next 2-4 Weeks)

Upgrade existing desk + monitor geometry with better materials/glowing inlays.
Implement floating monitor physics + drag behavior.
Add avatar spawn disk + basic walking/idle animations + reactivity.
Connect current ardaSource / systems data to at least 2 monitors (e.g., Fleet Health + Agent Roster).
Central podium → proper command interface.

8. Success Metrics

Feels more like a physical command throne than a 2D app in 3D.
Avatar feels like a real companion, not decoration.
You can sit down and instinctively know how to operate the system within 30 seconds.
Scales beautifully to full Mythos World traversal.
