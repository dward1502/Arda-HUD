// sigil: REPAIR
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import HermesDashboardModule from './HermesDashboardModule'

const ensureHermesDashboardSurface = vi.fn()
const readHermesDashboardStatus = vi.fn()

vi.mock('../../../lib/hermesDashboardLauncher', () => ({
  describeHermesDashboardLaunch: (result: { launched_process: boolean, already_listening: boolean, url: string }) => {
    if (result.launched_process) return `Hermes dashboard launched ARDA-owned process: ${result.url}`
    if (result.already_listening) return `Hermes dashboard attached to verified Hermes listener: ${result.url}`
    return `Hermes dashboard focused existing ARDA window: ${result.url}`
  },
  ensureHermesDashboardSurface: (...args: unknown[]) => ensureHermesDashboardSurface(...args),
  readHermesDashboardStatus: (...args: unknown[]) => readHermesDashboardStatus(...args),
}))

function renderModule() {
  return render(
    <HermesDashboardModule
      summary={[]}
      tools={[]}
      runtimeSurfaces={[]}
      auditReadiness={null}
      sourceProvenance={[]}
      tag="test"
    />,
  )
}

describe('HermesDashboardModule', () => {
  beforeEach(() => {
    ensureHermesDashboardSurface.mockReset()
    readHermesDashboardStatus.mockReset()
  })

  it('shows verified Hermes dashboard status after launch', async () => {
    readHermesDashboardStatus.mockResolvedValue({
      url: 'http://127.0.0.1:9119',
      host: '127.0.0.1',
      port: 9119,
      port_open: true,
      identity_verified: true,
      owned_process_running: true,
      state: 'ready',
      message: 'ARDA-owned Hermes dashboard process is running',
    })
    ensureHermesDashboardSurface.mockResolvedValue({
      window_label: 'arda-workstation-hermes_dashboard_workstation',
      url: 'http://127.0.0.1:9119',
      port: 9119,
      launched_process: true,
      already_listening: false,
    })

    renderModule()

    expect(await screen.findByText('Live Hermes dashboard embedded')).toBeInTheDocument()
    expect(screen.getByText(/launched ARDA-owned process/i)).toBeInTheDocument()
    expect(screen.getByText('ready')).toBeInTheDocument()
    expect(screen.getByText('owned process')).toBeInTheDocument()
    expect(screen.getByText('http://127.0.0.1:9119')).toBeInTheDocument()
  })

  it('surfaces launch errors and keeps diagnostics visible', async () => {
    readHermesDashboardStatus.mockResolvedValue({
      url: 'http://127.0.0.1:9119',
      host: '127.0.0.1',
      port: 9119,
      port_open: true,
      identity_verified: false,
      owned_process_running: false,
      state: 'blocked',
      message: 'Port 9119 is listening, but it did not identify as Hermes dashboard',
    })
    ensureHermesDashboardSurface.mockRejectedValue(new Error('Port 9119 is already listening, but it did not identify as Hermes dashboard'))

    renderModule()

    expect(await screen.findByText('Hermes dashboard unavailable')).toBeInTheDocument()
    expect(screen.getAllByText(/did not identify as Hermes dashboard/i).length).toBeGreaterThanOrEqual(1)
    await waitFor(() => expect(screen.getByText('blocked')).toBeInTheDocument())
    expect(screen.getByText('port conflict')).toBeInTheDocument()
  })
})
