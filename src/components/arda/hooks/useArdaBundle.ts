// sigil: REPAIR
import { useCallback, useEffect, useState } from 'react'
import type { ArdaBundle, ArdaDataSource } from '../../../lib/ardaBundleTypes'

interface UseArdaBundleOptions {
  source: ArdaDataSource
  refreshIntervalMs?: number
  onLoaded?: (bundle: ArdaBundle) => void
}

export function useArdaBundle({ source, refreshIntervalMs = 5000, onLoaded }: UseArdaBundleOptions) {
  const [bundle, setBundle] = useState<ArdaBundle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshBundle = useCallback(async () => {
    setIsLoading(true)
    try {
      const nextBundle = await source.loadBundle()
      setBundle(nextBundle)
      setError(null)
      onLoaded?.(nextBundle)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unknown load failure')
    } finally {
      setIsLoading(false)
    }
  }, [onLoaded, source])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (cancelled) return
      await refreshBundle()
    }

    void load()
    const interval = window.setInterval(() => void load(), refreshIntervalMs)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [refreshBundle, refreshIntervalMs])

  return {
    bundle,
    error,
    isLoading,
    refreshBundle,
  }
}
