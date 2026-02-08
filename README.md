# Shrinkr

A fast URL shortener with built-in click analytics. Paste a long URL, get a short trackable link, and see who's clicking.

![Shrinkr](https://img.shields.io/badge/Built%20with-Fastify%20%2B%20TypeScript-10b981)

## Features

- **URL Shortening** - Base62 encoded short codes with zero collision risk
- **Click Analytics** - Track clicks with browser, OS, device type, and referrer data
- **Analytics Dashboard** - Visual charts powered by Chart.js
- **In-Memory Caching** - Fast redirects with TTL-based cache
- **302 Redirects** - Accurate click tracking (no browser caching)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 22 LTS |
| Language | TypeScript + ESM |
| Framework | Fastify v5 |
| Database | SQLite (better-sqlite3) |
| ORM | Drizzle ORM |
| Frontend | EJS + Chart.js |
| Cache | In-memory (Map with TTL) |

## Getting Started

```bash
# Clone
git clone https://github.com/sayedabdulkarim/base64Studio.git
cd Shrinkr

# Install
npm install

# Create env file
cp .env.example .env

# Run
npm run dev
```

Open `http://localhost:3000` - that's it. No Docker, no external databases.

## Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production build |
| `npm test` | Run tests |
| `npm run typecheck` | Type check without emitting |

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/` | Home page |
| `POST` | `/api/urls` | Create short URL |
| `GET` | `/api/urls` | List recent URLs |
| `GET` | `/api/urls/:shortCode/stats` | Get click analytics (JSON) |
| `GET` | `/:shortCode` | Redirect to original URL |
| `GET` | `/dashboard/:shortCode` | Analytics dashboard page |

## Deploy on Railway

1. Push to GitHub
2. Connect repo on [Railway](https://railway.app)
3. Set env variable: `BASE_URL=https://your-app.up.railway.app`
4. Deploy

## Author

Made with ♥ by **Sayed Abdul Karim**
