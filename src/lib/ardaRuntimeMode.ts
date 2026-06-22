// sigil: REPAIR
export type ArdaRuntimeMode = 'tauri-native' | 'tauri-dev' | 'static-preview' | 'browser-dev'

export interface ArdaRuntimeModeStatus {
  mode: ArdaRuntimeMode
  isTauri: boolean
  isDev: boolean
  dataSource: 'tauri-ipc' | 'unavailable'
  nativeProofRequired: boolean
  label: string
  detail: string
}

export function detectArdaRuntimeMode(): ArdaRuntimeModeStatus {
  const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window
  const isDev = import.meta.env.DEV
  const mode: ArdaRuntimeMode = isTauri
    ? isDev ? 'tauri-dev' : 'tauri-native'
    : isDev ? 'browser-dev' : 'static-preview'

  const labels: Record<ArdaRuntimeMode, string> = {
    'tauri-native': 'Tauri native',
    'tauri-dev': 'Tauri dev',
    'static-preview': 'Static preview',
    'browser-dev': 'Browser dev',
  }

  const details: Record<ArdaRuntimeMode, string> = {
    'tauri-native': 'Canonical ARDA runtime: WebKit plus Tauri IPC file access.',
    'tauri-dev': 'Native shell with development frontend; validate against production native before release.',
    'static-preview': 'Built frontend preview without Tauri IPC; useful for layout only.',
    'browser-dev': 'Vite browser mode without Tauri IPC; useful for layout only.',
  }

  return {
    mode,
    isTauri,
    isDev,
    dataSource: isTauri ? 'tauri-ipc' : 'unavailable',
    nativeProofRequired: mode !== 'tauri-native',
    label: labels[mode],
    detail: details[mode],
  }
}
