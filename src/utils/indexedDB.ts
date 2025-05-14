
// Utility functions for IndexedDB operations
const DB_NAME = 'pollenPediaDB';
const DB_VERSION = 1;
const POLLEN_STORE = 'pollens';
const IMAGES_STORE = 'images';

// Initialize database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    
    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Create pollen store with indexes
      if (!db.objectStoreNames.contains(POLLEN_STORE)) {
        const pollenStore = db.createObjectStore(POLLEN_STORE, { keyPath: 'id' });
        pollenStore.createIndex('latinName', 'latinName', { unique: false });
        pollenStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
      
      // Create images store
      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        db.createObjectStore(IMAGES_STORE, { keyPath: 'id' });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
  });
};

// Save pollen data
export const savePollens = async (pollens: any[]): Promise<boolean> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(POLLEN_STORE, 'readwrite');
    const store = transaction.objectStore(POLLEN_STORE);
    
    // Clear existing data
    store.clear();
    
    // Process each pollen and ensure proper date format
    const processedPollens = pollens.map(pollen => ({
      ...pollen,
      createdAt: pollen.createdAt instanceof Date 
        ? pollen.createdAt.toISOString() 
        : pollen.createdAt
    }));
    
    // Add each pollen
    for (const pollen of processedPollens) {
      store.put(pollen);
    }
    
    return new Promise<boolean>((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log(`Successfully saved ${pollens.length} pollen entries to IndexedDB`);
        resolve(true);
      };
      transaction.onerror = () => {
        console.error("Error saving pollens:", transaction.error);
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error("Critical error saving pollens:", error);
    return false;
  }
};

// Load pollen data
export const loadPollens = async (): Promise<any[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(POLLEN_STORE, 'readonly');
    const store = transaction.objectStore(POLLEN_STORE);
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log(`Successfully loaded ${request.result.length} pollen entries from IndexedDB`);
        resolve(request.result);
      };
      request.onerror = () => {
        console.error("Error loading pollens:", request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("Critical error loading pollens:", error);
    return [];
  }
};

// Save an image to IndexedDB (as base64)
export const saveImage = async (id: string, imageData: string): Promise<boolean> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(IMAGES_STORE, 'readwrite');
    const store = transaction.objectStore(IMAGES_STORE);
    
    store.put({ id, data: imageData });
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log(`Image ${id} saved successfully to IndexedDB`);
        resolve(true);
      };
      transaction.onerror = () => {
        console.error("Error saving image:", transaction.error);
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error("Critical error saving image:", error);
    return false;
  }
};

// Get an image from IndexedDB
export const getImage = async (id: string): Promise<string | null> => {
  try {
    // If the id seems to be a URL, return it as is
    if (id.startsWith('http')) {
      return id;
    }
    
    const db = await initDB();
    const transaction = db.transaction(IMAGES_STORE, 'readonly');
    const store = transaction.objectStore(IMAGES_STORE);
    const request = store.get(id);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        if (request.result) {
          console.log(`Image ${id} retrieved successfully from IndexedDB`);
          resolve(request.result.data);
        } else {
          console.warn(`Image ${id} not found in IndexedDB`);
          resolve(null);
        }
      };
      request.onerror = () => {
        console.error("Error retrieving image:", request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("Critical error getting image:", error);
    return null;
  }
};

// Convert a file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Convert image URL to base64
export const imageUrlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return fileToBase64(new File([blob], 'image.jpg', { type: blob.type }));
};
