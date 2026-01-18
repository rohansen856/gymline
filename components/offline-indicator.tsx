'use client'

import { useOfflineSync } from '@/hooks/use-offline-sync'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { WifiOff, Wifi, RefreshCw, CloudUpload } from 'lucide-react'

export function OfflineIndicator() {
  const { isOnline, isSyncing, pendingCount, syncNow } = useOfflineSync({
    onSyncComplete: () => {
      console.log('Sync completed successfully')
    },
    onSyncError: (error) => {
      console.error('Sync error:', error)
    },
  })

  if (isOnline && pendingCount === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      {!isOnline && (
        <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
          <WifiOff className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertDescription className="text-sm text-yellow-800 dark:text-yellow-200">
            You're offline. Changes will be saved locally and synced when connection is restored.
          </AlertDescription>
        </Alert>
      )}

      {isOnline && pendingCount > 0 && (
        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
                {pendingCount} change{pendingCount > 1 ? 's' : ''} pending sync
              </AlertDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={syncNow}
              disabled={isSyncing}
              className="ml-2 h-8"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <CloudUpload className="h-3 w-3 mr-1" />
                  Sync Now
                </>
              )}
            </Button>
          </div>
        </Alert>
      )}
    </div>
  )
}
