import { createClient } from "@supabase/supabase-js";

// Basic IndexedDB wrapper for investigation rosters
export class OfflineStorage {
  private dbName = "CrimeIntelOffline";
  private version = 1;
  private db: IDBDatabase | null = null;

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("dossiers")) {
          db.createObjectStore("dossiers", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("rosters")) {
          db.createObjectStore("rosters", { keyPath: "id" });
        }
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = (event: any) => {
        reject(event.target.error);
      };
    });
  }

  async saveDossier(dossier: any) {
    if (!this.db) await this.init();
    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction(["dossiers"], "readwrite");
      const store = transaction.objectStore("dossiers");
      store.put(dossier);
      transaction.oncomplete = () => resolve();
      transaction.onerror = (e) => reject(e);
    });
  }

  async getDossier(id: string) {
    if (!this.db) await this.init();
    return new Promise<any>((resolve, reject) => {
      const transaction = this.db!.transaction(["dossiers"], "readonly");
      const store = transaction.objectStore("dossiers");
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e);
    });
  }

  async getAllDossiers() {
    if (!this.db) await this.init();
    return new Promise<any[]>((resolve, reject) => {
      const transaction = this.db!.transaction(["dossiers"], "readonly");
      const store = transaction.objectStore("dossiers");
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e);
    });
  }
}

export const offlineStorage = typeof window !== "undefined" ? new OfflineStorage() : null;
