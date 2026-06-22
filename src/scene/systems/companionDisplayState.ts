// sigil: REPAIR
import { DEFAULT_AGENT_PRESENCE_STATE, normalizeAgentPresenceState } from './presenceState'
import type { AgentPresenceState, PresencePhase, PresenceScenario, PresenceSource, PresenceUrgency, SovereignAgentId } from './presenceTypes'

export type CitadelCompanionScenario = 'idle' | 'briefing' | 'routes' | 'collections' | 'recovery'
export type CitadelCompanionEvent = 'idle' | 'inquiry' | 'alert' | 'awaiting_user' | 'action' | 'resolved'

export interface CitadelCompanionPayload {
  schema_version: 'annunimas.citadel.companion.v1'
  scenario: CitadelCompanionScenario
  phase: PresencePhase
  event: CitadelCompanionEvent
  banner?: string
  inquiry?: string
  action?: string
  response?: string
  primary_agent: SovereignAgentId
  support_agents: SovereignAgentId[]
  focus?: SovereignAgentId[]
  urgency: PresenceUrgency
  event_id?: string
  source: PresenceSource
  timestamp: string
  arda_scenario: PresenceScenario
}

const TEXT_LIMITS = {
  banner: 42,
  inquiry: 54,
  action: 58,
  response: 54,
} as const

function companionScenarioForArdaScenario(scenario: PresenceScenario): CitadelCompanionScenario {
  switch (scenario) {
    case 'idle':
      return 'idle'
    case 'routing':
      return 'routes'
    case 'knowledge':
      return 'collections'
    case 'recovery':
    case 'alert':
      return 'recovery'
    case 'briefing':
    case 'council':
    default:
      return 'briefing'
  }
}

function companionEventForPhase(state: AgentPresenceState): CitadelCompanionEvent {
  if (state.phase === 'idle' || state.scenario === 'idle') return 'idle'
  if (state.phase === 'agent_arrival') return 'inquiry'
  if (state.phase === 'alert') return 'alert'
  if (state.phase === 'awaiting_user') return 'awaiting_user'
  if (state.phase === 'action_confirmed') return 'action'
  return 'resolved'
}

function compactText(value: string | undefined, limit: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.replace(/\s+/g, ' ').trim()
  if (trimmed.length === 0) return undefined
  if (trimmed.length <= limit) return trimmed
  return `${trimmed.slice(0, Math.max(0, limit - 1)).trimEnd()}…`
}

function copyAgents(agents: SovereignAgentId[]): SovereignAgentId[] {
  return [...agents]
}

export function toCitadelCompanionPayload(
  state: Partial<AgentPresenceState> | null | undefined,
  fallbackTimestamp = new Date().toISOString(),
): CitadelCompanionPayload {
  const normalized = normalizeAgentPresenceState(state ?? DEFAULT_AGENT_PRESENCE_STATE, fallbackTimestamp)
  const idle = normalized.scenario === 'idle' && normalized.phase === 'idle'
  const payload: CitadelCompanionPayload = {
    schema_version: 'annunimas.citadel.companion.v1',
    scenario: companionScenarioForArdaScenario(normalized.scenario),
    phase: normalized.phase,
    event: companionEventForPhase(normalized),
    primary_agent: normalized.primaryAgent,
    support_agents: copyAgents(normalized.supportAgents),
    urgency: normalized.urgency,
    source: normalized.source,
    timestamp: normalized.timestamp,
    arda_scenario: normalized.scenario,
  }

  if (!idle) {
    const banner = compactText(normalized.banner, TEXT_LIMITS.banner)
    const inquiry = compactText(normalized.inquiry ?? normalized.banner, TEXT_LIMITS.inquiry)
    const action = compactText(normalized.action, TEXT_LIMITS.action)
    const response = compactText(normalized.response, TEXT_LIMITS.response)
    if (banner) payload.banner = banner
    if (inquiry) payload.inquiry = inquiry
    if (action) payload.action = action
    if (response) payload.response = response
    if (normalized.focus.length > 0) payload.focus = copyAgents(normalized.focus)
  }

  const eventId = compactText(normalized.eventId, 80)
  if (eventId) payload.event_id = eventId

  return payload
}
