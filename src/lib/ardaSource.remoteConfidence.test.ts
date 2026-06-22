// sigil: REPAIR
import { describe, expect, it, vi } from 'vitest'
import { createCoreStateSource } from './ardaSource'
import { DEFAULT_ARDA_HUD_SETTINGS } from './ardaHudSettings'
import { fetchInventoryTree, readFile } from './weathertop'

vi.mock('./ardaHudSettings', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./ardaHudSettings')>()
  return {
    ...actual,
    loadArdaHudSettings: vi.fn(async () => ({
      rootPath: '/annunimas',
      settingsPath: '/annunimas/config/arda_hud.settings.json',
      settings: actual.DEFAULT_ARDA_HUD_SETTINGS,
    })),
  }
})

vi.mock('./weathertop', () => ({
  fetchInventoryTree: vi.fn(),
  readFile: vi.fn(),
}))

const mockedReadFile = vi.mocked(readFile)
const mockedFetchInventoryTree = vi.mocked(fetchInventoryTree)

function fileResult(path: string, content: string | null) {
  return {
    success: content !== null,
    content,
    error: content === null ? 'not found' : null,
    path,
  }
}

describe('ARDA remote confidence runtime projection', () => {
  it('loads core/state/remote_confidence_snapshot.json into the durable bundle without external writes', async () => {
    const remoteConfidenceSnapshot = {
      schema_version: 'annunimas.remote_confidence_snapshot.v1',
      generated_at_utc: '2026-05-30T00:00:00.000Z',
      mode: 'local_runtime_published',
      status: 'attention_required',
      side_effect_policy: {
        writes_generated_state: true,
        external_messages_sent: false,
        service_restart: false,
        credential_change: false,
      },
      arda_hud: {
        projection_mode: 'local_runtime_state_file',
        target_state_path: 'core/state/remote_confidence_snapshot.json',
      },
    }

    mockedFetchInventoryTree.mockResolvedValue(fileResult('/annunimas/tree', JSON.stringify({
      name: 'empty',
      relative_path: 'empty',
      path: '/annunimas/empty',
      is_dir: true,
      children: [],
    })))
    mockedReadFile.mockImplementation(async (path: string) => {
      if (path === '/annunimas/core/state/remote_confidence_snapshot.json') {
        return fileResult(path, JSON.stringify(remoteConfidenceSnapshot))
      }
      if (path === '/annunimas/core/projects/tasks/queue.jsonl') {
        return fileResult(path, '')
      }
      return fileResult(path, null)
    })

    const bundle = await createCoreStateSource().loadBundle()

    expect(mockedReadFile).toHaveBeenCalledWith('/annunimas/core/state/remote_confidence_snapshot.json')
    expect(mockedReadFile).toHaveBeenCalledWith(`/annunimas/${DEFAULT_ARDA_HUD_SETTINGS.task_queue_path}`)
    expect(bundle.remoteConfidenceSnapshot).toMatchObject({
      schema_version: 'annunimas.remote_confidence_snapshot.v1',
      mode: 'local_runtime_published',
      side_effect_policy: {
        writes_generated_state: true,
        external_messages_sent: false,
        service_restart: false,
        credential_change: false,
      },
      arda_hud: {
        projection_mode: 'local_runtime_state_file',
        target_state_path: 'core/state/remote_confidence_snapshot.json',
      },
    })
  })

  it('loads data/prometheus/safe_local_work_cycle_preflight.json as a local-only ARDA projection', async () => {
    const safeLocalPreflight = {
      schema_version: 'annunimas.safe_local_work_cycle_preflight.v1',
      mode: 'safe_local_preflight_report',
      candidate_summary: {
        total_count: 12,
        safe_local_count: 9,
        human_gated_count: 1,
      },
      side_effect_policy: {
        writes_local_report: true,
        read_only_intake: true,
        external_messages_sent: false,
        service_restart: false,
        credential_change: false,
        destructive_operations: false,
        mutates_task_status: false,
        live_discord_validation: 'human_gated_separate',
      },
      arda_hud: {
        projection_mode: 'local_report_file',
        new_rail_required: false,
        forks_autonomy_logic: false,
      },
    }

    mockedFetchInventoryTree.mockResolvedValue(fileResult('/annunimas/tree', JSON.stringify({
      name: 'empty',
      relative_path: 'empty',
      path: '/annunimas/empty',
      is_dir: true,
      children: [],
    })))
    mockedReadFile.mockImplementation(async (path: string) => {
      if (path === '/annunimas/data/prometheus/safe_local_work_cycle_preflight.json') {
        return fileResult(path, JSON.stringify(safeLocalPreflight))
      }
      if (path === '/annunimas/core/projects/tasks/queue.jsonl') {
        return fileResult(path, '')
      }
      return fileResult(path, null)
    })

    const bundle = await createCoreStateSource().loadBundle()

    expect(mockedReadFile).toHaveBeenCalledWith('/annunimas/data/prometheus/safe_local_work_cycle_preflight.json')
    expect(bundle.safeLocalWorkCyclePreflight).toMatchObject({
      schema_version: 'annunimas.safe_local_work_cycle_preflight.v1',
      mode: 'safe_local_preflight_report',
      candidate_summary: {
        total_count: 12,
        safe_local_count: 9,
        human_gated_count: 1,
      },
      side_effect_policy: {
        external_messages_sent: false,
        service_restart: false,
        credential_change: false,
        destructive_operations: false,
        mutates_task_status: false,
        live_discord_validation: 'human_gated_separate',
      },
      arda_hud: {
        projection_mode: 'local_report_file',
        new_rail_required: false,
        forks_autonomy_logic: false,
      },
    })
  })
})
