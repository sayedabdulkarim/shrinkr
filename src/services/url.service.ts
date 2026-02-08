import { db } from '../config/db.js';
import { urls } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { encodeBase62 } from '../utils/base62.js';
import { validateUrl as _validateUrl } from '../utils/validate-url.js';
import { setCachedUrl } from './cache.service.js';
import { env } from '../config/env.js';

const START_OFFSET = 100000;

export function validateUrl(url: string) {
  return _validateUrl(url, env.baseUrl);
}

export function createShortUrl(originalUrl: string) {
  // Insert with temp code
  const inserted = db
    .insert(urls)
    .values({ shortCode: '__temp__', originalUrl })
    .returning({ id: urls.id })
    .get();

  // Generate short code from ID
  const shortCode = encodeBase62(inserted.id + START_OFFSET);

  // Update with real short code
  const result = db
    .update(urls)
    .set({ shortCode })
    .where(eq(urls.id, inserted.id))
    .returning()
    .get();

  // Cache in memory
  setCachedUrl(shortCode, originalUrl);

  return {
    id: result.id,
    shortCode: result.shortCode,
    shortUrl: `${env.baseUrl}/${result.shortCode}`,
    originalUrl: result.originalUrl,
    createdAt: result.createdAt,
  };
}

export function getUrlByShortCode(shortCode: string) {
  const result = db
    .select()
    .from(urls)
    .where(eq(urls.shortCode, shortCode))
    .limit(1)
    .get();

  return result || null;
}

export function getRecentUrls(limit = 10) {
  return db
    .select()
    .from(urls)
    .where(eq(urls.isActive, true))
    .orderBy(desc(urls.createdAt))
    .limit(limit)
    .all();
}
