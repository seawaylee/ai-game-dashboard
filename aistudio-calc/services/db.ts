
const DB_NAME = 'UltraCalcDB_v1';
const STORE_NAME = 'assets';

export interface Asset {
  id: string; // URL or Name is the key
  blob: Blob;
}

const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
};

export const getCachedImage = async (key: string): Promise<string | null> => {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        if (req.result) {
          resolve(URL.createObjectURL(req.result.blob));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null; 
  }
};

export const cacheImage = async (url: string): Promise<void> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ id: url, blob: blob });
  } catch (e) {
    console.error("Failed to cache", url, e);
  }
};

// New function to save Base64 data directly
export const cacheBase64Image = async (key: string, base64Data: string): Promise<void> => {
    try {
        const res = await fetch(base64Data);
        const blob = await res.blob();
        
        const db = await getDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        // We use the Ultraman Name as the key for AI generated images to make them easy to find
        store.put({ id: key, blob: blob });
    } catch (e) {
        console.error("Failed to save base64", e);
    }
}
