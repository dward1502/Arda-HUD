---
soterion:
  sigil: "SCROLL"
  glyph: "📜"
  code_point: "U+1F4DC"
  role: "documentation"
  owner: "HADES"
  status: "active"
  last_reviewed: "2026-05-21"
---

> 🜏 Soterion: 📜 documentation | owner: HADES | status: active | reviewed: 2026-05-21

# sigil: REPAIR
# ARDA HUD Event Schema (v1)

Status: Active reference  
Version: `1.0.0`

> **Disposition:** Keep. This document describes the event shape implemented in
> `src/lib/hudEventSchema.ts`. It is still relevant for legacy HUD feed logic
> and future scene/workstation event ingestion.
>
> **Last triage:** 2026-04-29.

This schema standardizes all log/combat-feed events shown in ARDA HUD so data from UI actions, local tasks, and backend telemetry can be rendered and audited uniformly.

## Core Fields

```ts
{
  id: string
  timestamp: Date
  severity: 'debug' | 'info' | 'warn' | 'error' | 'critical'
  source: string
  message: string
  refs: Array<{ type: 'agent' | 'mission' | 'node'; id: string }>
  pinned: boolean
  schemaVersion: '1.0.0'
  kind: string
  domain: 'system' | 'operations' | 'agent' | 'mission' | 'inventory' | 'dock' | 'governance' | 'security' | 'telemetry' | 'knowledge' | 'external' | 'unknown'
}
```

## Optional Extensions

```ts
{
  sigils?: string[]            // Soterion/UI signal tags, example: ['∇','⚡','◈']
  tags?: string[]              // Fast filters/grouping
  metrics?: {
    jwEstimated?: number       // JouleWork estimate
    leScore?: number           // Love Equation score
    triadScore?: number        // Triad aggregate score
    durationMs?: number        // Execution latency
  }
  trace?: {
    taskId?: string
    missionId?: string
    agentId?: string
    correlationId?: string
  }
  raw?: Record<string, unknown> // Original event payload for audit/debug
}
```

## Event Kinds (initial)

- `operations.system_action` for action-bus execution results
- `telemetry.<operation>` for parsed JSONL telemetry streams
- `telemetry.joulework` for legacy JouleWork log parsing fallback
- `<domain>.event` default when producer did not set kind

## Ingestion Rules

- All producers pass through `normalizeHudEvent(...)`.
- Missing fields are defaulted (id, timestamp, schemaVersion, domain, kind).
- `setEvents(...)` and `addEvent(...)` normalize every event before storing.
- `arda:system-action-result` browser events are converted into schema events and appended to the HUD log feed.
- Native telemetry merge in provider pulls from:
  - `data/hades/hades_log.jsonl`
  - `data/hades/joulework.jsonl`
  - `data/athena/digest.jsonl`
  - `data/athena/deep_graph.jsonl`
  - `data/prometheus/orders.jsonl`
  - `data/prometheus/escalations.jsonl`
  - `data/prometheus/autopilot/metrics.jsonl`

## Feed Health Snapshot

HUD also computes per-feed observability metrics each refresh cycle:

```ts
{
  feedId: string
  status: 'healthy' | 'stale' | 'offline' | 'error'
  lastEventAt: Date | null
  lastEventAgeSec: number | null
  linesRead: number
  eventsParsed: number
  parseErrors: number
}
```

## Example

```json
{
  "id": "action-status_report-1741511200000",
  "timestamp": "2026-03-09T20:13:20.000Z",
  "severity": "info",
  "source": "action:voice",
  "message": "Action status_report completed via weathertop-http",
  "refs": [],
  "pinned": false,
  "schemaVersion": "1.0.0",
  "kind": "operations.system_action",
  "domain": "operations",
  "sigils": ["∇", "⚡"],
  "tags": ["status_report", "frankyrache", "success", "weathertop-http"],
  "metrics": { "durationMs": 215 },
  "trace": { "correlationId": "status_report:1741511200000" }
}
```
