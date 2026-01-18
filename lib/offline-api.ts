'use client'

import indexedDBService, { STORES, type StoreNames, isBrowser } from './indexedDB'

interface FetchWithOfflineOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  storeName?: StoreNames
  useCache?: boolean
}

/**
 * Fetch wrapper that handles offline scenarios
 * - Stores failed requests for later sync
 * - Returns cached data when offline
 * - Caches successful GET requests
 */
export async function fetchWithOffline<T>(
  url: string,
  options: FetchWithOfflineOptions = {}
): Promise<T> {
  const { method = 'GET', body, storeName, useCache = true } = options

  // For non-GET requests, try to send but queue if offline
  if (method !== 'GET') {
    try {
      const response = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Cache the result if it's an object with an id
      if (isBrowser() && storeName && data && typeof data === 'object') {
        if (Array.isArray(data)) {
          await indexedDBService.putMany(storeName, data)
        } else {
          await indexedDBService.put(storeName, data)
        }
      }

      return data
    } catch (error) {
      // If request fails and we have a store name, queue for later sync
      if (isBrowser() && storeName && body) {
        console.warn(`Request failed, queuing for sync: ${url}`, error)
        
        const operation = method === 'DELETE' ? 'delete' : 
                         method === 'POST' || method === 'PUT' ? 'create' : 'update'
        
        await indexedDBService.addPendingSync(storeName, operation, body)

        // For POST/PUT, optimistically store the data locally
        if (operation === 'create' && body) {
          // Add a temporary ID if not present
          const dataWithId = { ...body, id: body.id || `temp-${Date.now()}` }
          await indexedDBService.put(storeName, dataWithId)
          return dataWithId as T
        }
      }

      throw error
    }
  }

  // For GET requests
  try {
    const response = await fetch(url, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Cache the successful response
    if (isBrowser() && storeName && useCache && data) {
      if (Array.isArray(data)) {
        await indexedDBService.putMany(storeName, data)
      } else if (data && typeof data === 'object') {
        await indexedDBService.put(storeName, data)
      }
    }

    return data
  } catch (error) {
    // If GET fails and we have cached data, return it
    if (isBrowser() && storeName && useCache) {
      console.warn(`Fetch failed, using cached data: ${url}`, error)
      
      // Check if URL has query params that might indicate a specific item
      const urlParams = new URL(url, window.location.origin).searchParams
      const date = urlParams.get('date')
      const id = urlParams.get('id')

      if (date || id) {
        // Try to find specific item
        const cachedData = await indexedDBService.getAll<any>(storeName)
        const item = cachedData.find((d: any) => 
          (date && d.log_date === date) || (id && d.id === id)
        )
        return (item || null) as T
      }

      // Return all cached data
      const cachedData = await indexedDBService.getAll<T>(storeName)
      return cachedData as T
    }

    throw error
  }
}

/**
 * Delete with offline support
 */
export async function deleteWithOffline(
  url: string,
  storeName: StoreNames,
  identifier: { id?: string | number; date?: string }
): Promise<void> {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Remove from local cache
    if (isBrowser() && identifier.id) {
      await indexedDBService.delete(storeName, identifier.id)
    }
  } catch (error) {
    // Queue for later sync
    if (isBrowser()) {
      console.warn(`Delete failed, queuing for sync: ${url}`, error)
      await indexedDBService.addPendingSync(storeName, 'delete', identifier)

      // Optimistically remove from local cache
      if (identifier.id) {
        await indexedDBService.delete(storeName, identifier.id)
      }
    }

    throw error
  }
}
