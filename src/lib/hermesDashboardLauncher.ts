// sigil: REPAIR
import { safeTauriInvoke } from './tauriGuard'

export interface HermesDashboardWindowResult {
  window_label: string
  url: string
  port: number
  launched_process: boolean
  already_listening: boolean
}

export interface HermesDashboardStatus {
  url: string
  host: string
  port: number
  port_open: boolean
  identity_verified: boolean
  owned_process_running: boolean
  state: 'offline' | 'starting' | 'ready' | 'blocked' | string
  message: string
}

export function describeHermesDashboardLaunch(result: HermesDashboardWindowResult): string {
  const mode = result.launched_process
    ? 'launched ARDA-owned process'
    : result.already_listening
      ? 'attached to verified Hermes listener'
      : 'focused existing ARDA window'
  return `Hermes dashboard ${mode}: ${result.url}`
}

export async function ensureHermesDashboardSurface(): Promise<HermesDashboardWindowResult> {
  return safeTauriInvoke<HermesDashboardWindowResult>('ensure_hermes_dashboard_surface')
}

export async function readHermesDashboardStatus(): Promise<HermesDashboardStatus> {
  return safeTauriInvoke<HermesDashboardStatus>('read_hermes_dashboard_status')
}

export async function openHermesDashboardWindow(): Promise<HermesDashboardWindowResult> {
  return safeTauriInvoke<HermesDashboardWindowResult>('open_hermes_dashboard_window')
}
