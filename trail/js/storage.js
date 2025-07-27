// IndexedDB storage for large videos
const VideoStorage = {
    dbName: 'MathCenterDB',
    dbVersion: 1,
    videoStore: 'videos',
    metadataStore: 'metadata',
    
    // Open database connection
    openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = (event) => {
                reject('Error opening database: ' + event.target.errorCode);
            };
            
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create video store for large files
                if (!db.objectStoreNames.contains(this.videoStore)) {
                    db.createObjectStore(this.videoStore, { keyPath: 'id' });
                }
                
                // Create metadata store for video information
                if (!db.objectStoreNames.contains(this.metadataStore)) {
                    db.createObjectStore(this.metadataStore, { keyPath: 'id' });
                }
            };
        });
    },
    
    // Save video file
    saveVideo(id, videoBlob) {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.openDB();
                const transaction = db.transaction([this.videoStore], 'readwrite');
                const store = transaction.objectStore(this.videoStore);
                
                const request = store.put({
                    id: id,
                    blob: videoBlob,
                    timestamp: new Date().getTime()
                });
                
                request.onsuccess = () => {
                    resolve(id);
                };
                
                request.onerror = (event) => {
                    reject('Error saving video: ' + event.target.errorCode);
                };
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Save video metadata
    saveMetadata(metadata) {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.openDB();
                const transaction = db.transaction([this.metadataStore], 'readwrite');
                const store = transaction.objectStore(this.metadataStore);
                
                const request = store.put(metadata);
                
                request.onsuccess = () => {
                    resolve(metadata.id);
                };
                
                request.onerror = (event) => {
                    reject('Error saving metadata: ' + event.target.errorCode);
                };
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Get video file by ID
    getVideo(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.openDB();
                const transaction = db.transaction([this.videoStore], 'readonly');
                const store = transaction.objectStore(this.videoStore);
                
                const request = store.get(id);
                
                request.onsuccess = (event) => {
                    if (event.target.result) {
                        resolve(event.target.result.blob);
                    } else {
                        reject('Video not found');
                    }
                };
                
                request.onerror = (event) => {
                    reject('Error getting video: ' + event.target.errorCode);
                };
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Get all video metadata
    getAllMetadata() {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.openDB();
                const transaction = db.transaction([this.metadataStore], 'readonly');
                const store = transaction.objectStore(this.metadataStore);
                
                const request = store.getAll();
                
                request.onsuccess = (event) => {
                    resolve(event.target.result);
                };
                
                request.onerror = (event) => {
                    reject('Error getting metadata: ' + event.target.errorCode);
                };
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Delete video and its metadata
    deleteVideo(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.openDB();
                
                // Delete video file
                const videoTransaction = db.transaction([this.videoStore], 'readwrite');
                const videoStore = videoTransaction.objectStore(this.videoStore);
                videoStore.delete(id);
                
                // Delete metadata
                const metadataTransaction = db.transaction([this.metadataStore], 'readwrite');
                const metadataStore = metadataTransaction.objectStore(this.metadataStore);
                metadataStore.delete(id);
                
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }
};