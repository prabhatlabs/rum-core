# rum-core

A lightweight Real User Monitoring (RUM) tool. A ~5kb browser script intercepts `fetch()` and XHR calls, captures timing and environment data, and sends it to an edge worker for enrichment and storage. Developers get visibility into what real users experience — broken down by ISP, region, device, and more.

## What It Tracks

- **Core Web Vitals** — LCP, FCP, CLS, INP (via `web-vitals/slim`)
- **API Performance** — DNS, TCP, TLS, TTFB, duration for every fetch/XHR call
- **User Environment** — browser, OS, device type, screen resolution, connection type
- **Geo & Network** — country, city, region, ISP (enriched at the edge via Cloudflare Workers)

## How It Works

```
Browser Script (~5kb)
  ├─ Web Vitals → fires once per page load
  └─ Request Events → batched every 10s
       ↓
Cloudflare Worker (enrich with geo/ISP, hash IP)
       ↓
Turso (event storage)
       ↓
Dashboard (Next.js + Bun/Elysia backend)
```

## Monorepo Structure

```
rum-core/
├── apps/
│   ├── web/          → Next.js frontend (dashboard)
│   ├── api/          → Bun + Elysia backend
│   └── worker/       → Cloudflare Worker (ingest)
├── packages/
│   ├── db/           → Drizzle schemas + clients (Neon + Turso)
│   ├── shared/       → Shared types, constants, utilities
│   └── script/       → Browser script (rum-core.js)
```

## Tech Stack

| Layer | Stack |
|---|---|
| Browser Script | Vanilla JS (~5kb), esbuild, web-vitals/slim |
| Edge Worker | Cloudflare Workers, Hono |
| Backend | Bun, Elysia, Drizzle ORM |
| Frontend | Next.js (SSG), SWR, Tailwind CSS, shadcn/ui |
| Event DB | Turso (SQLite) |
| Business DB | Neon (Postgres) |

## Getting Started

```bash
bun install
```

```bash
# run the frontend
bun run dev --filter=web

# run the backend
bun run dev --filter=api
```

## Documentation

For detailed architecture, database schemas, rollup table design, cron jobs, dashboard routing, and subscription plans — see [`planning.md`](./planning.md).
