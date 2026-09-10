/**
 * THE DEVIL'S EYE - High Performance Storage & IndexedDB Cache
 * 
 * Provides:
 * - IndexedDB storage for large project datasets, frame vectors & timelines
 * - LocalStorage graceful fallback for sandboxed iframes
 * - Debouncing & deduplication for AI Director and rendering commands
 * - Caching for multi-pass video intelligence analyses
 */

import { Project } from '../types';

const DB_NAME = 'DevilsEyeCinemaDb';
const DB_VERSION = 1;
const STORE_PROJECTS = 'projects';
const STORE_CACHE = 'ai_cache';

class StorageService {
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private inFlightRequests: Map<string, Promise<unknown>> = new Map();

  constructor() {
    this.initDb();
  }

  private initDb(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;

    if (typeof window === 'undefined' || !window.indexedDB) {
      this.dbPromise = Promise.resolve(null);
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve) => {
      try {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
            db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_CACHE)) {
            db.createObjectStore(STORE_CACHE, { keyPath: 'key' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  // Persist project into IndexedDB with LocalStorage backup
  public async saveProject(project: Project): Promise<void> {
    try {
      const db = await this.initDb();
      if (db) {
        const tx = db.transaction(STORE_PROJECTS, 'readwrite');
        tx.objectStore(STORE_PROJECTS).put(project);
      }
    } catch {
      // ignore
    }

    // LocalStorage fallback for instant synchronous boot
    try {
      localStorage.setItem(`devils_eye_proj_${project.id}`, JSON.stringify({
        id: project.id,
        title: project.title,
        updatedAt: project.lastEdited
      }));
    } catch {
      // storage full safe
    }
  }

  // Load project from IndexedDB
  public async getProject(id: string): Promise<Project | null> {
    try {
      const db = await this.initDb();
      if (!db) return null;
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_PROJECTS, 'readonly');
        const req = tx.objectStore(STORE_PROJECTS).get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  // Deduplicate in-flight asynchronous operations
  public async deduplicateRequest<T>(key: string, fn: () => Promise<T>): Promise<T> {
    if (this.inFlightRequests.has(key)) {
      return this.inFlightRequests.get(key) as Promise<T>;
    }
    const promise = fn().finally(() => {
      this.inFlightRequests.delete(key);
    });
    this.inFlightRequests.set(key, promise);
    return promise;
  }

  // Cache AI analysis responses
  public async setAiCache(key: string, value: unknown): Promise<void> {
    try {
      const db = await this.initDb();
      if (db) {
        const tx = db.transaction(STORE_CACHE, 'readwrite');
        tx.objectStore(STORE_CACHE).put({ key, value, timestamp: Date.now() });
      }
    } catch {
      // ignore
    }
  }

  public async getAiCache<T>(key: string): Promise<T | null> {
    try {
      const db = await this.initDb();
      if (!db) return null;
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_CACHE, 'readonly');
        const req = tx.objectStore(STORE_CACHE).get(key);
        req.onsuccess = () => resolve(req.result?.value || null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }
}

export const storageService = new StorageService();

/**
 * Utility debounce function for inputs and AI queries
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
