---
soterion:
  sigil: "SCROLL"
  glyph: "📜"
  code_point: "U+1F4DC"
  role: "documentation"
  owner: "HADES"
  status: "active"
  last_reviewed: "2026-06-02"
---

> 🜏 Soterion: 📜 documentation | owner: HADES | status: active | reviewed: 2026-06-02

# sigil: REPAIR
# MYTHOS - ARDA HUD Complete Specification

**Source:** Prompt from Grok collaboration  
**Date:** 2026-02-23  
**Status:** Vision archive / idea bank, not the current execution plan.

> Current execution lives in `ARDA_OPERATING_SURFACE_PLAN_2026-05-27.md`,
> `ARDA_IMPLEMENTATION_PLAN.md`, and `RUNTIME.md`. Use this file only as the
> broad MYTHOS/ARDA vision source. Supporting detail from the former
> `ARDA_UNIFIED_PATH_FORWARD_2026-05-22.md` is now incorporated into
> `ARDA_OPERATING_SURFACE_PLAN_2026-05-27.md` Appendix A.

---

## Core Vision

> "This is no longer an app. This is your personal Night City where you are the netrunner god-king and every agent is your crew."

---

## 1. Rust Tauri Backend (The Real Gibson Core)

- Persistent WebSocket server (tauri-plugin-websocket + custom Rust actor)
- Secure auth (API keys + Tailscale/Cloudflare Tunnel fallback)
- Agent registry: every agent registers on spawn → unique cube ID
- Metrics pipeline: gRPC or WS → live updates (health, tokens/sec, decision latency, errors, queue depth)

---

## 2. Multi-Agent Orchestrator Layer

- Hook into CrewAI / LangGraph / AutoGen / custom Rust agents
- Every agent gets:
  - Position in 3D space
  - Current task
  - Last 10 actions
  - Connections to other agents
- Cloud extension: agents on Modal / Fly.io / AWS report to same WS endpoint → distant glowing spires

---

## 3. State & Sync Engine

- Zustand + WebSocket sync (local-first, sync on reconnect)
- Offline mode: cached in Tauri SQLite
- Remote laptop anywhere → connects to home PC in <300ms (or cloud relay)

---

## 4. Voice Control (Your Wild Ideas)

- Web Speech API → local Ollama (or tiny LLM) parser
- Tauri shell.execute or agent trigger
- Example: "SUPER, analyze the Q3 metrics and spawn a research agent."
- Franky voice response: "SUUUUUPER — agent deployed, choom!"

---

## 5. 3D File Trees = Living Nodes

- Folders = tall glowing obelisks/towers (height = file count)
- Files = smaller cubes orbiting or stacked inside
- Click folder → smooth expansion animation (branches grow like neon vines)
- Drag & drop between towers = fs::rename via Tauri
- Agents physically fly between towers when they read/write — with glowing trails

---

## 6. Live Agent Action Visualization

- Particle paths + floating action bubbles ("read contract.pdf → summarized → passed to legal-agent")
- Hover any cube → instant replay timeline hologram

---

## 7. Document Editing

- Double-click file cube → holographic floating pane (CSS3DRenderer)
- Inside: full Monaco Editor + live preview pane
- Code flows as scrolling data ribbons
- Edit, save, commit — all without leaving 3D world
- AI highlights glow magenta on code

---

## 8. Casual Conversation Zone

- Dedicated "Chill Spire" in back of metropolis
- Low neon lounge, Franky-Rache avatar on crate
- Voice or text, zero task pressure

---

## 9. Instant Section Switching

- Keyboard 1-9 or voice command or floating neon district signs:
  - 1 = Core Metropolis (agents)
  - 2 = File Forest
  - 3 = Business District (metrics/economy)
  - 4 = Security Black Ice
  - 5 = Lounge (casual)
- Camera tweens smoothly with cinematic bloom flash

---

## 10. Remote-First Design

- Laptop at coffee shop → "Connect to Home Base" → secure WS tunnel
- Home PC runs heavy agents + file system
- Cloud agents auto-appear as satellite towers connected by data beams
- Works on any machine, any network

---

## 11. Extra Ideas (God-Tier)

- Git as neon rivers — branches as glowing flowing streams, merges = particle explosions
- Decision trace graphs — 3D mind-map of every agent thought
- In-scene floating terminal — cyberpunk font, follows camera
- Agent marketplace stall — drag-and-drop new agent templates
- Live shader dashboards — metrics render directly on cube surfaces (custom GLSL sparklines)
- Multi-window Tauri — one window pure 3D, second window detailed inspector
- AR toggle — WebXR mode (same scene, just on glasses later)

---

## Visual References

- stockcake.com
- fanruan.com  
- designbundles.net
- alamy.com

---

## Status

This is a vision source and idea bank. Active ARDA HUD development should follow
the current app-level execution documents and should stay scoped to the active
Three.js/WebGL scene runtime plus native Tauri validation boundary unless a new
planning decision deliberately reopens broader MYTHOS scope.

The vision is clear: MYTHOS = your personal Night City, you are the netrunner god-king.
