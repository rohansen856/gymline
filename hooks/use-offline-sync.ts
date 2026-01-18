'use client'

import { useEffect, useState, useCallback } from 'react'
import indexedDBService, { STORES, isBrowser } from '@/lib/indexedDB'

interface UseOfflineSyncOptions {
  onSyncComplete?: () => void
  onSyncError?: (error: Error) => void
}

export function useOfflineSync(options: UseOfflineSyncOptions = {}) {
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  // Update online status
  useEffect(() => {
    if (!isBrowser()) return

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Check pending sync count
  const checkPendingCount = useCallback(async () => {
    if (!isBrowser()) return
    try {
      const pending = await indexedDBService.getPendingSync()
      setPendingCount(pending.length)
    } catch (error) {
      console.error('Error checking pending sync count:', error)
    }
  }, [])

  // Sync pending data to server
  const syncPendingData = useCallback(async () => {
    if (!isBrowser() || !isOnline || isSyncing) return

    setIsSyncing(true)

    try {
      const pendingItems = await indexedDBService.getPendingSync()

      if (pendingItems.length === 0) {
        setIsSyncing(false)
        return
      }

      console.log(`Syncing ${pendingItems.length} pending items...`)

      for (const item of pendingItems) {
        try {
          // Map store names to API endpoints
          const endpoint = getEndpointForStore(item.store)
          
          if (!endpoint) {
            console.warn(`No endpoint found for store: ${item.store}`)
            await indexedDBService.removePendingSync(item.id)
            continue
          }

          let response: Response | null = null

          if (item.operation === 'create' || item.operation === 'update') {
            response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item.data),
            })
          } else if (item.operation === 'delete') {
            const deleteUrl = getDeleteUrl(endpoint, item.data)
            response = await fetch(deleteUrl, {
              method: 'DELETE',
            })
          }

          if (response && response.ok) {
            // Remove from pending sync
            await indexedDBService.removePendingSync(item.id)
            console.log(`Synced item: ${item.id}`)
          } else {
            console.error(`Failed to sync item: ${item.id}`, response?.statusText)
          }
        } catch (error) {
          console.error(`Error syncing item ${item.id}:`, error)
          // Continue with next item
        }
      }

      await checkPendingCount()
      options.onSyncComplete?.()
    } catch (error) {
      console.error('Error during sync:', error)
      options.onSyncError?.(error as Error)
    } finally {
      setIsSyncing(false)
    }
  }, [isOnline, isSyncing, checkPendingCount, options])

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && !isSyncing) {
      syncPendingData()
    }
  }, [isOnline, isSyncing, syncPendingData])

  // Check pending count on mount
  useEffect(() => {
    checkPendingCount()
  }, [checkPendingCount])

  return {
    isOnline,
    isSyncing,
    pendingCount,
    syncNow: syncPendingData,
    refreshPendingCount: checkPendingCount,
  }
}

// Helper function to map store names to API endpoints
function getEndpointForStore(storeName: string): string | null {
  const mapping: Record<string, string> = {
    [STORES.DAILY_HABITS]: '/api/daily-habits',
    [STORES.EXERCISE_LOGS]: '/api/exercise-logs',
    [STORES.EXERCISES]: '/api/exercises',
    [STORES.FOOD_QUALITY]: '/api/food-quality',
    [STORES.WORKOUT_LOGS]: '/api/workout-logs',
    [STORES.WORKOUT_PLANS]: '/api/workout-plans',
  }

  return mapping[storeName] || null
}

// Helper function to construct delete URLs
function getDeleteUrl(endpoint: string, data: any): string {
  if (data.date || data.log_date) {
    return `${endpoint}?date=${data.date || data.log_date}`
  }
  if (data.id) {
    return `${endpoint}?id=${data.id}`
  }
  return endpoint
}
