// sigil: REPAIR
import { useCallback, useEffect, useState } from 'react'
import { loadCharonLiveSnapshot, type CharonLiveSnapshot } from '../../../lib/charonLive'

export function useCharonLiveSnapshot(refreshIntervalMs = 5000) {
  const [snapshot, setSnapshot] = useState<CharonLiveSnapshot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const nextSnapshot = await loadCharonLiveSnapshot()
      setSnapshot(nextSnapshot)
      setError(null)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unknown Charon live snapshot failure')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!cancelled) {
        await refresh()
      }
    }
    void load()
    const interval = window.setInterval(() => void load(), refreshIntervalMs)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [refresh, refreshIntervalMs])

  return { snapshot, error, isLoading, refresh }
}
