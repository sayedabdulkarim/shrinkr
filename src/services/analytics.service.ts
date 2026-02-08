import { db } from '../config/db.js';
import { clicks, urls } from '../db/schema.js';
import { eq, sql, desc, and, gte } from 'drizzle-orm';
import { parseUserAgent } from '../utils/ua-parser.js';

interface ClickEvent {
  urlId: number;
  ipAddress: string;
  referrer: string | undefined;
  userAgent: string | undefined;
}

export function logClick(event: ClickEvent) {
  const ua = parseUserAgent(event.userAgent);

  db.insert(clicks)
    .values({
      urlId: event.urlId,
      ipAddress: event.ipAddress,
      country: '--',
      city: 'Unknown',
      referrer: event.referrer || null,
      browser: ua.browser,
      os: ua.os,
      deviceType: ua.deviceType,
    })
    .run();
}

export function getStats(shortCode: string) {
  const url = db
    .select()
    .from(urls)
    .where(eq(urls.shortCode, shortCode))
    .limit(1)
    .get();

  if (!url) return null;

  // Total clicks
  const totalResult = db
    .select({ count: sql<number>`count(*)` })
    .from(clicks)
    .where(eq(clicks.urlId, url.id))
    .get();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Clicks over time (last 30 days)
  const clicksOverTime = db
    .select({
      date: sql<string>`date(${clicks.clickedAt})`,
      count: sql<number>`count(*)`,
    })
    .from(clicks)
    .where(and(eq(clicks.urlId, url.id), gte(clicks.clickedAt, thirtyDaysAgo.toISOString())))
    .groupBy(sql`date(${clicks.clickedAt})`)
    .orderBy(sql`date(${clicks.clickedAt})`)
    .all();

  // Top referrers
  const referrers = db
    .select({
      referrer: clicks.referrer,
      count: sql<number>`count(*)`,
    })
    .from(clicks)
    .where(eq(clicks.urlId, url.id))
    .groupBy(clicks.referrer)
    .orderBy(desc(sql`count(*)`))
    .limit(10)
    .all();

  // Country breakdown
  const countries = db
    .select({
      country: clicks.country,
      count: sql<number>`count(*)`,
    })
    .from(clicks)
    .where(eq(clicks.urlId, url.id))
    .groupBy(clicks.country)
    .orderBy(desc(sql`count(*)`))
    .limit(10)
    .all();

  // Browser breakdown
  const browsers = db
    .select({
      browser: clicks.browser,
      count: sql<number>`count(*)`,
    })
    .from(clicks)
    .where(eq(clicks.urlId, url.id))
    .groupBy(clicks.browser)
    .orderBy(desc(sql`count(*)`))
    .limit(10)
    .all();

  // OS breakdown
  const osStats = db
    .select({
      os: clicks.os,
      count: sql<number>`count(*)`,
    })
    .from(clicks)
    .where(eq(clicks.urlId, url.id))
    .groupBy(clicks.os)
    .orderBy(desc(sql`count(*)`))
    .limit(10)
    .all();

  // Device type breakdown
  const devices = db
    .select({
      deviceType: clicks.deviceType,
      count: sql<number>`count(*)`,
    })
    .from(clicks)
    .where(eq(clicks.urlId, url.id))
    .groupBy(clicks.deviceType)
    .orderBy(desc(sql`count(*)`))
    .all();

  return {
    url: {
      id: url.id,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
    },
    totalClicks: totalResult?.count || 0,
    clicksOverTime,
    referrers,
    countries,
    browsers,
    os: osStats,
    devices,
  };
}
