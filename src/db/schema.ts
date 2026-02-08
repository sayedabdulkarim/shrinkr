import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const urls = sqliteTable(
  'urls',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    shortCode: text('short_code').unique().notNull(),
    originalUrl: text('original_url').notNull(),
    createdAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  },
  (table) => [
    index('idx_urls_short_code').on(table.shortCode),
  ]
);

export const clicks = sqliteTable(
  'clicks',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    urlId: integer('url_id').references(() => urls.id, { onDelete: 'cascade' }).notNull(),
    clickedAt: text('clicked_at').default(sql`(datetime('now'))`).notNull(),
    ipAddress: text('ip_address'),
    country: text('country'),
    city: text('city'),
    referrer: text('referrer'),
    browser: text('browser'),
    os: text('os'),
    deviceType: text('device_type'),
  },
  (table) => [
    index('idx_clicks_url_id').on(table.urlId, table.clickedAt),
  ]
);
