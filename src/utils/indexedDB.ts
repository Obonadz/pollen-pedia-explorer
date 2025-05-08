
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
      
      // Create pollen store
      if (!db.objectStoreNames.contains(POLLEN_STORE)) {
        const pollenStore = db.createObjectStore(POLLEN_STORE, { keyPath: 'id' });
        pollenStore.createIndex('latinName', 'latinName', { unique: false });
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
export const savePollens = async (pollens) => {
  const db = await initDB();
  const transaction = db.transaction(POLLEN_STORE, 'readwrite');
  const store = transaction.objectStore(POLLEN_STORE);
  
  // Clear existing data
  store.clear();
  
  // Add each pollen
  pollens.forEach(pollen => {
    store.add(pollen);
  });
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error);
  });
};

// Load pollen data
export const loadPollens = async () => {
  const db = await initDB();
  const transaction = db.transaction(POLLEN_STORE, 'readonly');
  const store = transaction.objectStore(POLLEN_STORE);
  const request = store.getAll();
  
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Save an image to IndexedDB (as base64)
export const saveImage = async (id: string, imageData: string) => {
  const db = await initDB();
  const transaction = db.transaction(IMAGES_STORE, 'readwrite');
  const store = transaction.objectStore(IMAGES_STORE);
  
  store.put({ id, data: imageData });
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error);
  });
};

// Get an image from IndexedDB
export const getImage = async (id: string) => {
  const db = await initDB();
  const transaction = db.transaction(IMAGES_STORE, 'readonly');
  const store = transaction.objectStore(IMAGES_STORE);
  const request = store.get(id);
  
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result ? request.result.data : null);
    request.onerror = () => reject(request.error);
  });
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
