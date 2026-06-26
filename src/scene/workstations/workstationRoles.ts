// sigil: REPAIR

export type WorkstationRoleId = 'fleet' | 'work' | 'decisions' | 'knowledge' | 'evidence' | 'settings'
export type WorkstationPresentationMode = 'in_scene' | 'native_window'

export interface WorkstationRoleDefinition {
  id: WorkstationRoleId
  label: string
  description: string
  defaultPresentationModes: WorkstationPresentationMode[]
  debugRawAllowed: boolean
}

export const WORKSTATION_ROLE_IDS: WorkstationRoleId[] = [
  'fleet',
  'work',
  'decisions',
  'knowledge',
  'evidence',
  'settings',
]

export const WORKSTATION_ROLE_DEFINITIONS: WorkstationRoleDefinition[] = [
  {
    id: 'fleet',
    label: 'Fleet',
    description: 'Operator and provider fleet health, routing, lane ownership, and capacity.',
    defaultPresentationModes: ['in_scene', 'native_window'],
    debugRawAllowed: false,
  },
  {
    id: 'work',
    label: 'Work',
    description: 'Current queue, active tasks, lifecycle state, and execution flow.',
    defaultPresentationModes: ['in_scene', 'native_window'],
    debugRawAllowed: false,
  },
  {
    id: 'decisions',
    label: 'Decisions',
    description: 'Governed approvals, recommendations, and decision gates.',
    defaultPresentationModes: ['in_scene', 'native_window'],
    debugRawAllowed: false,
  },
  {
    id: 'knowledge',
    label: 'Knowledge',
    description: 'Knowledge triage, memory, source maps, and context surfaces.',
    defaultPresentationModes: ['in_scene', 'native_window'],
    debugRawAllowed: false,
  },
  {
    id: 'evidence',
    label: 'Evidence',
    description: 'Evidence ledger, provenance, source freshness, and audit trails.',
    defaultPresentationModes: ['in_scene', 'native_window'],
    debugRawAllowed: false,
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Operator settings and guarded configuration surfaces.',
    defaultPresentationModes: ['in_scene'],
    debugRawAllowed: true,
  },
]

const WORKSTATION_ROLE_DEFINITION_BY_ID = new Map(
  WORKSTATION_ROLE_DEFINITIONS.map((definition) => [definition.id, definition]),
)

export function getWorkstationRoleDefinition(roleId: string | null | undefined): WorkstationRoleDefinition | null {
  if (!roleId) return null
  return WORKSTATION_ROLE_DEFINITION_BY_ID.get(roleId as WorkstationRoleId) ?? null
}
