import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import ejs from 'ejs';

import { env } from './config/env.js';
import { db } from './config/db.js';
import { urls, clicks } from './db/schema.js';
import { sql } from 'drizzle-orm';
import { urlRoutes } from './routes/url.js';
import { redirectRoutes } from './routes/redirect.js';
import { analyticsRoutes } from './routes/analytics.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Auto-create tables if they don't exist
db.run(sql`CREATE TABLE IF NOT EXISTS urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  short_code TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  is_active INTEGER NOT NULL DEFAULT 1
)`);
db.run(sql`CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls (short_code)`);

db.run(sql`CREATE TABLE IF NOT EXISTS clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url_id INTEGER NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
  clicked_at TEXT NOT NULL DEFAULT (datetime('now')),
  ip_address TEXT,
  country TEXT,
  city TEXT,
  referrer TEXT,
  browser TEXT,
  os TEXT,
  device_type TEXT
)`);
db.run(sql`CREATE INDEX IF NOT EXISTS idx_clicks_url_id ON clicks (url_id, clicked_at)`);

const fastify = Fastify({
  logger: true,
  trustProxy: true,
});

// Static files
await fastify.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/',
});

// View engine (EJS)
await fastify.register(fastifyView, {
  engine: { ejs },
  root: path.join(__dirname, 'views'),
  layout: 'layouts/main.ejs',
  defaultContext: {
    baseUrl: env.baseUrl,
  },
});

// Routes
await fastify.register(urlRoutes);
await fastify.register(analyticsRoutes);

// Home page
fastify.get('/', async (_request, reply) => {
  return reply.view('pages/home.ejs', {
    title: 'Home',
    baseUrl: env.baseUrl,
  });
});

// Redirect route (last - catches /:shortCode)
await fastify.register(redirectRoutes);

// Start
try {
  await fastify.listen({ port: env.port, host: '0.0.0.0' });
  console.log(`Shrinkr running at ${env.baseUrl}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
