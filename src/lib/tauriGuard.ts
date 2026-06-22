// sigil: REPAIR
import { invoke } from '@tauri-apps/api/core'

/**
 * Tauri environment detection and safe invocation wrapper
 */

export function isTauriEnvironment(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window
}

export function requireTauri(operation: string): void {
  if (!isTauriEnvironment()) {
    console.warn(`[Tauri Guard] ${operation} requires Tauri environment - running in browser mode`)
    throw new Error(`${operation} is only available in Tauri desktop app`)
  }
}

export function safeTauriInvoke<T>(
  command: string,
  args?: Record<string, unknown>
): Promise<T> {
  if (!isTauriEnvironment()) {
    console.warn(`[Tauri Guard] Cannot invoke '${command}' - not in Tauri environment`)
    return Promise.reject(new Error('Tauri not available - running in browser mode'))
  }

  return invoke(command, args) as Promise<T>
}
