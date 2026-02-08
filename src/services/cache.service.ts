import { getCached, setCache, deleteCache } from '../config/cache.js';

const URL_PREFIX = 'url:';

export function getCachedUrl(shortCode: string): string | null {
  return getCached(`${URL_PREFIX}${shortCode}`);
}

export function setCachedUrl(shortCode: string, originalUrl: string): void {
  setCache(`${URL_PREFIX}${shortCode}`, originalUrl);
}

export function deleteCachedUrl(shortCode: string): void {
  deleteCache(`${URL_PREFIX}${shortCode}`);
}
