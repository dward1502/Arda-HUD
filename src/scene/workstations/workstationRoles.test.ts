// sigil: REPAIR
import { describe, expect, it } from 'vitest'
import {
  WORKSTATION_ROLE_IDS,
  WORKSTATION_ROLE_DEFINITIONS,
  getWorkstationRoleDefinition,
} from './workstationRoles'

describe('workstationRoles', () => {
  it('defines every V1 universal workstation role', () => {
    expect(WORKSTATION_ROLE_IDS).toEqual([
      'fleet',
      'work',
      'decisions',
      'knowledge',
      'evidence',
      'settings',
    ])
    expect(WORKSTATION_ROLE_DEFINITIONS.map((role) => role.id)).toEqual(WORKSTATION_ROLE_IDS)
  })

  it('keeps role ids stable and unique', () => {
    const ids = WORKSTATION_ROLE_DEFINITIONS.map((role) => role.id)

    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) {
      expect(getWorkstationRoleDefinition(id)?.id).toBe(id)
    }
  })

  it('does not enable raw debug surfaces for normal operator roles by default', () => {
    for (const role of WORKSTATION_ROLE_DEFINITIONS.filter((definition) => definition.id !== 'settings')) {
      expect(role.debugRawAllowed).toBe(false)
      expect(role.defaultPresentationModes).toContain('in_scene')
    }
  })
})
