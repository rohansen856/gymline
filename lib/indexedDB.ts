// IndexedDB utility for offline data storage
const DB_NAME = 'gymline-offline';
const DB_VERSION = 2; // Incremented version for new store

// Store names
export const STORES = {
  DAILY_HABITS: 'dailyHabits',
  EXERCISE_LOGS: 'exerciseLogs',
  EXERCISES: 'exercises',
  FOOD_QUALITY: 'foodQuality',
  WORKOUT_LOGS: 'workoutLogs',
  WORKOUT_PLANS: 'workoutPlans',
  BODY_MEASUREMENTS: 'bodyMeasurements',
  PENDING_SYNC: 'pendingSync',
} as const;

export type StoreNames = typeof STORES[keyof typeof STORES];

interface PendingSyncItem {
  id: string;
  store: StoreNames;
  operation: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores if they don't exist
        Object.values(STORES).forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            if (storeName === STORES.PENDING_SYNC) {
              db.createObjectStore(storeName, { keyPath: 'id' });
            } else {
              db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            }
          }
        });
      };
    });
  }

  async getAll<T>(storeName: StoreNames): Promise<T[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: StoreNames, id: string | number): Promise<T | undefined> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async put<T>(storeName: StoreNames, data: T): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async putMany<T>(storeName: StoreNames, items: T[]): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      items.forEach((item) => {
        store.put(item);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async delete(storeName: StoreNames, id: string | number): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: StoreNames): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Pending sync operations
  async addPendingSync(
    store: StoreNames,
    operation: 'create' | 'update' | 'delete',
    data: any
  ): Promise<void> {
    const syncItem: PendingSyncItem = {
      id: `${store}-${operation}-${Date.now()}-${Math.random()}`,
      store,
      operation,
      data,
      timestamp: Date.now(),
    };
    await this.put(STORES.PENDING_SYNC, syncItem);
  }

  async getPendingSync(): Promise<PendingSyncItem[]> {
    return this.getAll<PendingSyncItem>(STORES.PENDING_SYNC);
  }

  async removePendingSync(id: string): Promise<void> {
    await this.delete(STORES.PENDING_SYNC, id);
  }

  async clearPendingSync(): Promise<void> {
    await this.clear(STORES.PENDING_SYNC);
  }
}

// Singleton instance
const indexedDBService = new IndexedDBService();
export default indexedDBService;

// Helper function to check if we're in a browser environment
export const isBrowser = () => typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
