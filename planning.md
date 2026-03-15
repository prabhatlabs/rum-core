# rum-core — Tech Stack & Architecture
> Real User Monitoring | Planning Phase | March 2026

---

## 1. Project Overview

rum-core is a lightweight Real User Monitoring (RUM) tool. A small browser script intercepts `fetch()` and XHR calls, captures timing and environment data, and sends it to an edge worker for enrichment and storage. Developers get visibility into what real users experience — broken down by ISP, region, device, and more.

---

## 2. System Architecture

```
Browser Script
     ↓
Two event types:
  1. Web Vitals     → fires immediately on collect (once per page load)
  2. Request Events → batched every 10s (fetch/XHR calls)
     ↓
POST to Cloudflare Worker
  /ingest/vitals   → page vitals
  /ingest/events   → request events
     ↓
Worker enriches with geo/ISP + hashes IP → writes to Turso
     ↓
Main Server reads for dashboard
```

| Layer | Responsibility | Service |
|---|---|---|
| Browser Script | Intercept requests, capture timings, collect web vitals, send events | jsDelivr + GitHub CDN |
| Edge Worker | Receive events, enrich with geo/ISP/ip_hash, write to event DB | Cloudflare Workers |
| Event Database | Store page vitals + request events at scale | Turso |
| Main Server | Auth, dashboard, data reads, project management | Bun + Elysia |
| Business Database | Users, projects, billing, API keys, plans | Neon (Postgres) |

---

## 3. Full Tech Stack

### Browser Script
| Component | Choice |
|---|---|
| Script delivery | jsDelivr + GitHub |
| Script format | Vanilla JS (~5kb bundled) |
| Build tool | esbuild — bundle + minify before pushing to GitHub |
| Web Vitals | `web-vitals/slim` bundled in — onLCP, onFCP, onCLS, onINP |
| Request interception | Monkey-patch fetch + XHR |
| Timing API | `Performance.getEntriesByType()` |
| Data sending | `navigator.sendBeacon` / fetch |
| Vitals batching | Fire immediately on collect — one POST per page load |
| Request batching | Collect events for 10s window, send one POST |
| Flush on exit | `visibilitychange` event — flush request queue immediately on tab close |
| Payload | Metrics only (no response body) — ~200-300 bytes per event |
| Null handling | All numeric fields are either a valid number or `null` — never `0` as a fallback. Zero is a valid metric value (e.g. perfect CLS = 0) so `null`/`undefined` is used to indicate "not collected" (e.g. INP requires user interaction so may never fire) |
| URL normalization | Done in browser before sending — numeric/UUID segments replaced with `:id`. Full URL preserved including origin (e.g. `https://api.stripe.com/v1/customers/:id`) to track third-party API performance |

> 200 request events in a 10s window = ~60kb per batch POST. One worker request consumed per batch regardless of event count. Vitals POST is a single tiny payload per page load.

### Edge Layer
| Component | Choice |
|---|---|
| Edge runtime | Cloudflare Workers |
| Geo enrichment | Native `request.cf` object (country, city, region, timezone) |
| ISP enrichment | Native `request.cf.asn` + `request.cf.asOrganization` |
| IP hashing | SHA-256 in Worker — computed once per request, stamped on all events in batch |

> Geo & ISP data is read once per batch from `request.cf` and stamped on all events. No external API, no caching needed — zero latency, zero cost.

### Main Backend
| Component | Choice |
|---|---|
| Runtime | Bun |
| Framework | Elysia |
| ORM | Drizzle |
| DB Driver | Neon serverless driver (`@neondatabase/serverless`) |
| Cache (later) | Upstash Redis |
| Auth | Custom implementation — Google OAuth + GitHub OAuth |
| Auth (later) | Password + email login |

### Frontend
| Component | Choice |
|---|---|
| Framework | Next.js |
| Rendering | SSG + client-side fetch (no SSR) |
| Data fetching | SWR |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |

### Cloudflare Worker
| Component | Choice |
|---|---|
| Language | TypeScript |
| Framework | Hono |

### Databases
| Database | Service | Free Tier |
|---|---|---|
| Event DB | Turso | 10M writes/mo, 5GB storage |
| Business DB | Neon (Postgres) | 0.5GB, 60k MAU auth |

---

## 4. Data Captured

### Request Events (per fetch/XHR call)
| Group | Fields | Source |
|---|---|---|
| Request Info | URL (with origin), method, status code, request/response size | Browser |
| Timing Breakdown | DNS, TCP, TLS, TTFB, total duration | Browser |
| Page Context | Current page URL, referrer, timestamp | Browser |
| User Environment | Browser, OS, device type, screen res, connection type, language | Browser |
| Geo & Network | Country, city, region, ISP/ASN, timezone, hashed IP | Cloudflare Worker |
| Identity | Project API key, session ID | Browser |

### Page Vitals (once per page load)
| Group | Fields | Source |
|---|---|---|
| Web Vitals | LCP, FCP, CLS, INP | Browser (web-vitals/slim) |
| Vitals Score | Computed score (0-100) based on Good/NI/Poor thresholds | Browser |
| Page Context | Page URL, referrer, timestamp | Browser |
| User Environment | Browser, OS, device type, screen res, connection type, language | Browser |
| Geo & Network | Country, city, region, ISP/ASN, timezone, hashed IP | Cloudflare Worker |
| Identity | Project API key, session ID | Browser |

---

## 5. Session & Identity Model

```
Project → Session → Events (request_events + page_vitals)
```

| Identifier | Source | Purpose |
|---|---|---|
| Project API Key | Browser (script tag `data-key` attribute) | Which project/customer |
| Anonymous Session ID | Browser (generated on load, e.g. `sess_xk29dj`) | Which user visit |
| Event ID | Worker (nanoid assigned on receipt) | Which unique event |

---

## 6. Free Tier Summary

| Service | Free Limit | Est. Usage (5 projects, ~5 users each) |
|---|---|---|
| Cloudflare Workers | 100,000 req/day | ~5,000 req/day (5%) |
| Turso | 10M writes/month | ~150,000 writes/month (1.5%) |
| Neon (Postgres) | 0.5GB, 60k MAU | Minimal |
| jsDelivr | Unlimited | Static file only |
| Render | 750 hours/month, sleeps after 15min inactivity | Dev/testing — kept alive via UptimeRobot |
| Koyeb | 1 instance, never sleeps | Production — swap older project to Render at launch |

---

## 7. Subscription Plans

| Feature | Free | Pro | Enterprise |
|---|---|---|---|
| Projects | 2 | 8 | Unlimited |
| Calls/day | 50k across projects | 500k across projects | Custom |
| Data retention | 7 days | 30 days | Custom |
| Time ranges | 12h, 24h, 7d | 12h, 24h, 7d, 30d | Custom |
| Price | $0 | TBD | Contact us |

> Pro plan UI will be visible but disabled at launch — shows "Contact us" dialog. Billing infrastructure to be added later.

---

## 8. Upstash Redis — Planned Usage

Redis is **not** needed for geo enrichment (handled natively by Cloudflare). Planned usage:
- Daily call counter per user per project (enforce plan limits, power usage dashboard)
- API key rate limiting
- Dashboard query caching (main server side)

### Dashboard Cache TTL

Default time range: **24h**

| Time Range | Cache TTL |
|---|---|
| 12h | 1 min |
| 24h (default) | 5 min |
| 7d | 30 min |
| 30d | 1 hour |

> Cache is keyed by `project_key + tab + time_range`. One API call per tab, returns all aggregated data for that tab only. No pagination — data is pre-aggregated on backend (~50-100 rows max per tab). Frontend does client-side sort/filter only.

Cache key structure:
```
cache:{project_key}:summary:24h
cache:{project_key}:pages:24h
cache:{project_key}:pages:{page_url}:24h
cache:{project_key}:endpoints:24h
cache:{project_key}:endpoints:{url}:{method}:24h
cache:{project_key}:geography:24h
cache:{project_key}:geography:{country_code}:24h
cache:{project_key}:geography:{country_code}:{region}:24h
cache:{project_key}:environment:24h
cache:{project_key}:environment:{dimension}:{value}:24h
```

On project delete or origin change → invalidate all `cache:{project_key}:*` keys and `project:{project_key}` key from Redis.

---

## 9. Dashboard UI

### Layout
- Top bar — project switcher + time range selector (default 24h)
- Sidebar navigation for all sections

### Routing Structure
```
/dashboard/[project_key]/                                     → summary
/dashboard/[project_key]/pages/                               → pages list
/dashboard/[project_key]/pages/[page_url]                     → page detail
/dashboard/[project_key]/endpoints/                           → endpoints list
/dashboard/[project_key]/endpoints/[url]/[method]             → endpoint detail
/dashboard/[project_key]/geography/                           → map + country list
/dashboard/[project_key]/geography/[country_code]             → country detail + city/region list
/dashboard/[project_key]/geography/[country_code]/[region]    → region detail
/dashboard/[project_key]/environment/                         → environment overview
/dashboard/[project_key]/environment/[dimension]/[value]      → environment detail
```

---

### Summary (/)
Health overview — answers "is everything okay right now?"

- Overall vitals score (0-100) — prominent
- Stat cards — total requests, avg TTFB, error rate %, active sessions
- Single timeline — request volume + error spikes together (line chart)
- Quick callouts — "3 endpoints with >10% error rate", "2 pages with poor LCP"

---

### Pages (/pages)
Focused entirely on web vitals per page. Data from `page_vitals`.

**Pages list table:**
- Page URL
- Vitals score
- LCP, FCP, CLS, INP (avg)
- Session count
- Top country (e.g. 🇮🇳 IN)
- Device split (e.g. "72% mobile")

**Page detail (/pages/[page_url]):**
- Vitals score over time (line chart)
- LCP / FCP / CLS / INP cards — each showing Good / Needs Improvement / Poor breakdown with count, %, min, avg, max
- Country table — Country, Score, LCP, FCP, CLS, INP, Sessions
- Device table — Device type, Score, Sessions, %
- Browser table — Browser, Score, Sessions, %

**Web Vital ranges (Google official thresholds):**

| Metric | Good | Needs Improvement | Poor |
|---|---|---|---|
| LCP (Largest Contentful Paint) | ≤ 2.5s | 2.5s – 4.0s | > 4.0s |
| FCP (First Contentful Paint) | ≤ 1.8s | 1.8s – 3.0s | > 3.0s |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | 0.1 – 0.25 | > 0.25 |
| INP (Interaction to Next Paint) | ≤ 200ms | 200ms – 500ms | > 500ms |

---

### Endpoints (/endpoints)
Focused entirely on API/request performance. Data from `request_events`.

**Endpoints list table:**
- Endpoint URL (with origin — tracks third-party APIs too)
- Method
- Avg TTFB
- Avg duration
- Error rate %
- Total requests
- Top country
- Device split (e.g. "68% mobile")

**Endpoint detail (/endpoints/[url]/[method]):**
- Request volume over time (line chart)
- TTFB over time (line chart)
- Timing breakdown cards — DNS, TCP, TLS, TTFB, duration
- Status code distribution — 4xx vs 5xx (bar chart)
- Country table — Country, Avg TTFB, Avg duration, Error rate %, Requests
- Device table — Device type, Avg TTFB, Avg duration, Error rate %, Requests, %
- Browser table — Browser, Avg TTFB, Avg duration, Error rate %, Requests

---

### Geography (/geography)
Cross-cutting view across both `request_events` and `page_vitals`. Two levels of drill down.

**Geography main (/geography):**
- World map heatmap — request density by country
- Country list table — Flag + Country, Total requests, Avg TTFB, Error rate %, Vitals score, Top device split

**Country detail (/geography/[country_code]):**
- Request volume over time (line chart)
- Vitals score over time (line chart)
- Top endpoints table — Endpoint, Avg TTFB, Error rate %, Requests
- Top pages table — Page URL, Vitals score, Sessions
- City/Region list table — City, Region, Total requests, Avg TTFB, Error rate %, Vitals score, Top device split

**Region detail (/geography/[country_code]/[region]):**
- Request volume over time (line chart)
- Vitals score over time (line chart)
- Top endpoints table — Endpoint, Avg TTFB, Error rate %, Requests
- Top pages table — Page URL, Vitals score, Sessions
- Environment breakdown — device, browser, connection type specific to that region

---

### Environment (/environment)
Cross-cutting view across both data types showing performance by browser, device, OS, connection.

**Environment main (/environment):**
- 4 distribution charts — device type donut, browser bar, OS bar, connection type donut
- Unified table — Browser, OS, Device type, Connection type, Total requests, Avg TTFB, Error rate %, Vitals score, %

**Environment detail (/environment/[dimension]/[value]):**
Examples: `/environment/browser/chrome`, `/environment/device/mobile`, `/environment/connection/4g`
- Request volume over time (line chart)
- Vitals score over time (line chart)
- Top endpoints — Endpoint, Avg TTFB, Error rate %, Requests
- Top pages — Page URL, Vitals score, Sessions
- Geography breakdown — which countries are these users in

---

### Client-side filter & sort
All list tables load in one API call and filter/sort entirely in the browser. Safe because most projects have under 100 unique normalized endpoints/pages. No pagination needed.

### URL Normalization
Dynamic segments are normalized in the browser script before sending. Full origin is preserved:
```
https://api.stripe.com/v1/customers/123  →  https://api.stripe.com/v1/customers/:id
/api/users/456                           →  http://localhost:5000/api/users/:id
```

---

## 10. Monorepo Structure

Managed with **Bun workspaces** — no extra tooling, native to Bun, simple for solo dev.

```
rum-core/
├── apps/
│   ├── web/          → Next.js frontend
│   ├── api/          → Bun + Elysia backend
│   └── worker/       → Cloudflare Worker + Hono
├── packages/
│   ├── db/           → Drizzle schemas + clients (maindb + eventdb)
│   │   ├── src/
│   │   │   ├── maindb/    → Neon (Postgres) — users, projects, plans, usage
│   │   │   ├── eventdb/   → Turso (SQLite) — request_events, page_vitals
│   │   │   ├── services/  → shared DB service functions
│   │   │   └── index.ts
│   │   └── drizzle.config.ts
│   └── script/       → Browser script (rum-core.js)
├── .github/
│   └── workflows/
│       └── release-script.yml
├── package.json      → workspace root
└── README.md
```

---

## 11. Deployment

| Service | Platform | Notes |
|---|---|---|
| Browser Script | jsDelivr + GitHub (separate repo) | Auto built + tagged via GitHub Actions on push to main |
| Cloudflare Worker | Cloudflare | Free, 100k req/day — ingest only, no cron |
| Main Backend (dev/testing) | Render + UptimeRobot | Free, UptimeRobot pings `/health` every 5min to prevent sleep |
| Main Backend (launch) | Koyeb | Never sleeps, free — swap older project to Render at launch |
| Frontend | Vercel | Free, perfect for Next.js SSG |
| Cron jobs | GitHub Actions | Scheduled workflows POST to Koyeb `/internal/cron/*` — free tier (2,000 min/month), each cron run takes seconds |

---

## 12. Data Retention & Cleanup

### Plan-based data visibility
Data is filtered at the **API level** based on user plan — never trust the client:

```
Free  → query events WHERE timestamp > NOW() - 7 days
Pro   → query events WHERE timestamp > NOW() - 30 days
```

Frontend hides unavailable time ranges based on plan, but backend always validates and returns 403 if a free user requests 30d data.

### Turso (event data) — delete after 32 days
- Data lives for 32 days max (2 day buffer beyond 30 day Pro limit)
- Free users see 7 days, Pro users see 30 days — enforced at API level
- Daily cron deletes rows older than 32 days from both tables:
```sql
DELETE FROM request_events WHERE timestamp < NOW() - INTERVAL '32 days';
DELETE FROM page_vitals WHERE timestamp < NOW() - INTERVAL '32 days';
```
- ⚠️ **VACUUM required after bulk deletes** — Turso is SQLite and doesn't free storage automatically after deletes. Run `VACUUM` after the cleanup cron to reclaim disk space.

### Neon (usage data) — delete after 92 days
- Show 90 days in UI, keep 92 for safety buffer
- Daily cron deletes rows older than 92 days:
```sql
DELETE FROM usage WHERE date < NOW() - INTERVAL '92 days'
```

### Usage tracking flow
```
Batch arrives at worker (e.g. 150 events)
     ↓
Increment Redis counter by 150 (per project)
     ↓
If SUM of all project counters for user > plan limit → drop remaining events
     ↓
Write accepted events to Turso
```

Redis key structure:
```
key:    usage:{user_id}:{date}:{project_key}  → daily call count per project
key:    project:{project_key}                 → { user_id, origin }
expiry: usage keys — 25 hours (auto cleanup)
expiry: project keys — no expiry (or 30 days, refreshed on access)
```

> No separate total counter — user total is always derived as `SUM` across all project keys for that `user_id + date`. With a max of 8 projects (Pro plan), this is trivial to compute anywhere — Redis, Neon, or frontend.

Worker validation flow on every batch:
```
Batch arrives at worker
     ↓
Check Origin header → match against project:{project_key}.origin in Redis
     ↓ mismatch → reject 403
     ↓
Check SUM of usage:{user_id}:{date}:* → compare against plan limit
     ↓ over limit → reject 429
     ↓
Increment usage:{user_id}:{date}:{project_key} by batch.events.length
     ↓
Enrich all events with request.cf geo data + SHA-256 ip_hash (computed once per batch)
     ↓
Write to Turso (request_events or page_vitals depending on endpoint)
```

Every 30 min — bulk sync Redis → Neon to persist counts (protects against Redis data loss).

### Cron jobs

**Trigger: GitHub Actions scheduled workflows**
**Execution: Internal API endpoints on Koyeb (`/internal/cron/*`)**

GitHub Actions fires the schedule and POSTs to the Koyeb API. All heavy DB work (Turso + Neon) runs inside the Elysia handler on Koyeb. Zero Cloudflare Worker budget consumed.

All `/internal/cron/*` endpoints are protected by a shared secret:
```
x-cron-secret: <CRON_SECRET>
```
`CRON_SECRET` stored as a GitHub Actions secret and as an env var on Koyeb.

| Job | GitHub Actions Schedule | Endpoint | Action |
|---|---|---|---|
| Usage sync | `*/30 * * * *` | `POST /internal/cron/usage-sync` | Redis → Neon bulk upsert of daily counters |
| Hourly rollup | `0 * * * *` | `POST /internal/cron/hourly-rollup` | Aggregate previous completed hour from raw tables → 16 hourly rollup tables |
| Daily cron | `0 0 * * *` | `POST /internal/cron/daily` | Runs 5 steps in order — see below |
| Monthly summary | `0 2 1 * *` | `POST /internal/cron/monthly-summary` | Aggregate previous month daily usage → monthly_usage table |

**Daily cron — midnight UTC (5 steps in order):**
```
1. Aggregate previous day from hourly rollups → 16 daily rollup tables
        ↓
2. DELETE hourly rollup rows older than 24h from all 16 hourly tables
   (already aggregated into daily, no longer needed)
        ↓
3. DELETE raw + daily rollup rows older than 32 days from all 18 tables
   (2 raw + 16 daily rollup tables)
        ↓
4. VACUUM Turso (reclaim storage after bulk deletes)
        ↓
5. DELETE usage rows older than 92 days from Neon
```

> Order matters — aggregation must run before deletes. Steps 2 and 3 are separate: hourly rollups have a 24h retention, raw and daily rollups have 32 day retention.

**Turso table retention summary:**

| Tables | Count | Retention | Deleted by |
|---|---|---|---|
| Raw (`request_events`, `page_vitals`) | 2 | 32 days | Daily cron step 3 |
| Hourly rollups (`re_hourly_*`, `pv_hourly_*`) | 16 | 24 hours | Daily cron step 2 |
| Daily rollups (`re_daily_*`, `pv_daily_*`) | 16 | 32 days | Daily cron step 3 |

**Hourly rollup safety rule:**
Hourly rollup runs at top of every hour and only processes the previous completed hour:
```
cron fires at 14:00 UTC
→ aggregates window: 13:00:00 - 13:59:59 (complete)
→ skips: 14:00:00 - now (incomplete)
```
This prevents partial hourly rows from being written and queried as complete data.

---

## 13. Database Schemas

### Neon (Postgres) Schema

**users**
```sql
id            UUID          PRIMARY KEY DEFAULT gen_random_uuid()
email         VARCHAR(255)  UNIQUE NOT NULL
name          VARCHAR(255)  NOT NULL
avatar_url    TEXT
provider      VARCHAR(20)   NOT NULL  -- 'google' | 'github'
provider_id   VARCHAR(255)  NOT NULL
created_at    TIMESTAMP     DEFAULT NOW()

UNIQUE(provider, provider_id)
```

**projects**
```sql
id            UUID          PRIMARY KEY DEFAULT gen_random_uuid()
user_id       UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE
name          VARCHAR(255)  NOT NULL
project_key   VARCHAR(64)   UNIQUE NOT NULL  -- immutable, never changes
origin        TEXT          NOT NULL
created_at    TIMESTAMP     DEFAULT NOW()
```

**Project rules:**
- `project_key` is immutable — generated once on creation, never changed
- `origin` can be updated later — only affects future requests, stored events unaffected
- On project delete → hard delete all events in Turso for that `project_key`, usage data kept in Neon (auto deleted after 92 days)

**plans**
```sql
id            UUID          PRIMARY KEY DEFAULT gen_random_uuid()
user_id       UUID          UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE
type          VARCHAR(20)   NOT NULL DEFAULT 'free'    -- 'free' | 'pro' | 'enterprise'
status        VARCHAR(20)   NOT NULL DEFAULT 'active'  -- 'active' | 'inactive'
created_at    TIMESTAMP     DEFAULT NOW()
updated_at    TIMESTAMP     DEFAULT NOW()
```

**usage** (daily per project, kept 92 days, shown 90 days in UI)
```sql
id            UUID          PRIMARY KEY DEFAULT gen_random_uuid()
user_id       UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE
project_key   VARCHAR(64)   NOT NULL
date          DATE          NOT NULL
calls_used    INTEGER       NOT NULL DEFAULT 0
created_at    TIMESTAMP     DEFAULT NOW()
updated_at    TIMESTAMP     DEFAULT NOW()

UNIQUE(user_id, project_key, date)
```

**monthly_usage** (internal only, kept forever, unit in millions)
```sql
id            UUID          PRIMARY KEY DEFAULT gen_random_uuid()
user_id       UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE
month         DATE          NOT NULL  -- first day of month e.g. 2026-03-01
calls_million DECIMAL(10,4) NOT NULL DEFAULT 0
created_at    TIMESTAMP     DEFAULT NOW()

UNIQUE(user_id, month)
```

**Indexes**
```sql
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_project_key ON projects(project_key);
CREATE INDEX idx_usage_user_date ON usage(user_id, date);
CREATE INDEX idx_usage_user_project_date ON usage(user_id, project_key, date);
CREATE INDEX idx_monthly_usage_user_month ON monthly_usage(user_id, month);
```

---

### Turso (SQLite) Schema

**request_events** (one row per fetch/XHR call captured by browser script)
```sql
id                TEXT          PRIMARY KEY  -- nanoid, generated by worker

-- Identity
project_key       TEXT          NOT NULL
session_id        TEXT          NOT NULL

-- Request Info
url               TEXT          NOT NULL     -- normalized URL with origin e.g. https://api.stripe.com/v1/customers/:id
method            TEXT          NOT NULL     -- GET | POST | PUT | DELETE etc.
status_code       INTEGER                    -- nullable
request_size      INTEGER                    -- bytes, nullable
response_size     INTEGER                    -- bytes, nullable

-- Timing (all REAL in ms, nullable — null not 0)
dns               REAL                       -- DNS lookup
tcp               REAL                       -- TCP connect
tls               REAL                       -- TLS handshake
ttfb              REAL                       -- Time to First Byte
duration          REAL                       -- total duration

-- Page Context
page_url          TEXT                       -- full current page URL
referrer          TEXT                       -- nullable
timestamp         INTEGER       NOT NULL     -- Unix timestamp ms

-- User Environment (all nullable)
browser           TEXT
browser_version   TEXT
os                TEXT
os_version        TEXT
device_type       TEXT                       -- mobile | desktop | tablet
screen_res        TEXT                       -- e.g. 1920x1080
connection_type   TEXT                       -- wifi | 4g | 3g | 2g etc.
language          TEXT                       -- e.g. en-US

-- Geo & Network (enriched by worker, all nullable)
country           TEXT                       -- e.g. IN
city              TEXT
region            TEXT
timezone          TEXT
isp               TEXT
asn               INTEGER
ip_hash           TEXT                       -- SHA-256 hashed IP, computed once per batch
```

**page_vitals** (one row per page load)
```sql
id                TEXT          PRIMARY KEY  -- nanoid, generated by worker

-- Identity
project_key       TEXT          NOT NULL
session_id        TEXT          NOT NULL

-- Page Context
page_url          TEXT          NOT NULL     -- which page these vitals are for
referrer          TEXT
timestamp         INTEGER       NOT NULL     -- Unix timestamp ms

-- Web Vitals (all REAL, nullable — null means not collected)
lcp               REAL                       -- Largest Contentful Paint (ms)
fcp               REAL                       -- First Contentful Paint (ms)
cls               REAL                       -- Cumulative Layout Shift (unitless score)
inp               REAL                       -- Interaction to Next Paint (ms)
vitals_score      REAL                       -- computed 0-100 score based on Good/NI/Poor thresholds

-- User Environment (all nullable)
browser           TEXT
browser_version   TEXT
os                TEXT
os_version        TEXT
device_type       TEXT
screen_res        TEXT
connection_type   TEXT
language          TEXT

-- Geo & Network (enriched by worker, all nullable)
country           TEXT
city              TEXT
region            TEXT
timezone          TEXT
isp               TEXT
asn               INTEGER
ip_hash           TEXT
```

**Indexes**
```sql
-- request_events
CREATE INDEX idx_request_events_project_key ON request_events(project_key);                       -- project delete cron
CREATE INDEX idx_request_events_timestamp ON request_events(timestamp);                           -- 32-day cleanup cron
CREATE INDEX idx_request_events_project_timestamp ON request_events(project_key, timestamp);      -- all dashboard queries base
CREATE INDEX idx_request_events_project_url ON request_events(project_key, url);                  -- endpoints list + detail
CREATE INDEX idx_request_events_project_status ON request_events(project_key, status_code);       -- errors page
CREATE INDEX idx_request_events_project_country ON request_events(project_key, country);          -- geography queries
CREATE INDEX idx_request_events_project_device ON request_events(project_key, device_type);       -- environment queries
CREATE INDEX idx_request_events_session_id ON request_events(session_id);                         -- session lookups

-- page_vitals
CREATE INDEX idx_page_vitals_project_key ON page_vitals(project_key);                             -- project delete cron
CREATE INDEX idx_page_vitals_timestamp ON page_vitals(timestamp);                                 -- 32-day cleanup cron
CREATE INDEX idx_page_vitals_project_timestamp ON page_vitals(project_key, timestamp);            -- all dashboard queries base
CREATE INDEX idx_page_vitals_project_page_url ON page_vitals(project_key, page_url);              -- pages list + detail
CREATE INDEX idx_page_vitals_project_country ON page_vitals(project_key, country);                -- geography queries
CREATE INDEX idx_page_vitals_project_device ON page_vitals(project_key, device_type);             -- environment queries
CREATE INDEX idx_page_vitals_session_id ON page_vitals(session_id);                               -- session lookups
```

**Index notes:**
- All performance-critical indexes are composite starting with `project_key` — matches the `WHERE project_key = ? AND ...` pattern on every query
- Single column indexes on `project_key` kept for DELETE cleanup cron (deletes by project on project delete)
- Single column index on `timestamp` kept for the 32-day cleanup cron (DELETE WHERE timestamp < ?)
- `session_id` indexes kept single column — only used for session-level lookups, not aggregations
- More indexes = slower writes — these are the minimum needed to cover all dashboard query patterns without over-indexing

**Raw table notes:**
- No FK constraints in SQLite/Turso — `project_key` is plain TEXT reference
- `cls` is a unitless score (e.g. 0.05), all other vitals are in ms
- `vitals_score` is computed in the browser before sending based on Google thresholds
- All nullable numeric fields use `null` not `0` — zero is a valid metric value
- Raw tables are **write-only** from the dashboard perspective — never read directly
- `ip_hash` computed once per batch in worker, stamped on all events in that batch

---

### Rollup Tables

Raw tables are append-only. Dashboard reads exclusively from rollup tables.
Hourly rollups are aggregated from raw tables every hour (previous completed hour only).
Daily rollups are aggregated from hourly rollups at midnight UTC.
All rollup tables share the same 32-day retention as raw tables.

**Total Turso tables: 34**
- 2 raw tables: `request_events`, `page_vitals`
- 16 request_events rollups (8 hourly + 8 daily)
- 16 page_vitals rollups (8 hourly + 8 daily)

---

#### request_events rollups

---

**re_hourly_summary** + **re_daily_summary**
Used by: Summary page — requests over time chart, stat cards
```sql
-- re_hourly_summary
project_key       TEXT     NOT NULL
hour              INTEGER  NOT NULL  -- Unix timestamp, rounded to hour (e.g. 1710000000)
total_requests    INTEGER  NOT NULL
error_count       INTEGER  NOT NULL  -- status_code >= 400
avg_ttfb          REAL
avg_duration      REAL
PRIMARY KEY (project_key, hour)

-- re_daily_summary
project_key       TEXT     NOT NULL
day               INTEGER  NOT NULL  -- Unix timestamp, rounded to day (midnight UTC)
total_requests    INTEGER  NOT NULL
error_count       INTEGER  NOT NULL
avg_ttfb          REAL
avg_duration      REAL
PRIMARY KEY (project_key, day)
```

---

**re_hourly_endpoints** + **re_daily_endpoints**
Used by: Endpoints list, Endpoint detail — over time charts
```sql
-- re_hourly_endpoints
project_key       TEXT     NOT NULL
hour              INTEGER  NOT NULL
url               TEXT     NOT NULL
method            TEXT     NOT NULL
total_requests    INTEGER  NOT NULL
error_count       INTEGER  NOT NULL
avg_ttfb          REAL
avg_duration      REAL
avg_dns           REAL
avg_tcp           REAL
avg_tls           REAL
top_country       TEXT                -- most frequent country this hour
device_mobile_pct REAL                -- % of requests from mobile
PRIMARY KEY (project_key, hour, url, method)

-- re_daily_endpoints
project_key       TEXT     NOT NULL
day               INTEGER  NOT NULL
url               TEXT     NOT NULL
method            TEXT     NOT NULL
total_requests    INTEGER  NOT NULL
error_count       INTEGER  NOT NULL
avg_ttfb          REAL
avg_duration      REAL
avg_dns           REAL
avg_tcp           REAL
avg_tls           REAL
top_country       TEXT
device_mobile_pct REAL
PRIMARY KEY (project_key, day, url, method)
```

---

**re_hourly_endpoint_geo** + **re_daily_endpoint_geo**
Used by: Endpoint detail — by country table, Geography country detail — top endpoints table
```sql
-- re_hourly_endpoint_geo
project_key       TEXT     NOT NULL
hour              INTEGER  NOT NULL
url               TEXT     NOT NULL
method            TEXT     NOT NULL
country           TEXT     NOT NULL
total_requests    INTEGER  NOT NULL
error_count       INTEGER  NOT NULL
avg_ttfb          REAL
avg_duration      REAL
PRIMARY KEY (project_key, hour, url, method, country)

-- re_daily_endpoint_geo
project_key       TEXT     NOT NULL
day               INTEGER  NOT NULL
url               TEXT     NOT NULL
method            TEXT     NOT NULL
country           TEXT     NOT NULL
total_requests    INTEGER  NOT NULL
error_count       INTEGER  NOT NULL
avg_ttfb          REAL
avg_duration      REAL
PRIMARY KEY (project_key, day, url, method, country)
```

---

**re_hourly_endpoint_env** + **re_daily_endpoint_env**
Used by: Endpoint detail — by device/browser table, Environment detail — top endpoints table
```sql
-- re_hourly_endpoint_env
project_key       TEXT     NOT NULL
hour              INTEGER  NOT NULL
url               TEXT     NOT NULL
method            TEXT     NOT NULL
device_type       TEXT
browser           TEXT
total_requests    INTEGER  NOT NULL
error_count       INTEGER  NOT NULL
avg_ttfb          REAL
avg_duration      REAL
PRIMARY KEY (project_key, hour, url, method, device_type, browser)

-- re_daily_endpoint_env
project_key       TEXT     NOT NULL
day               INTEGER  NOT NULL
url               TEXT     NOT NULL
method            TEXT     NOT NULL
device_type       TEXT
browser           TEXT
total_requests    INTEGER  NOT NULL
error_count       INTEGER  NOT NULL
avg_ttfb          REAL
avg_duration      REAL
PRIMARY KEY (project_key, day, url, method, device_type, browser)
```

---

**re_hourly_geo** + **re_daily_geo**
Used by: Geography list — country table
```sql
-- re_hourly_geo
project_key       TEXT     NOT NULL
hour              INTEGER  NOT NULL
country           TEXT     NOT NULL
total_requests    INTEGER  NOT NULL
error_count       INTEGER  NOT NULL
avg_ttfb          REAL
avg_duration      REAL
top_device        TEXT                -- most frequent device_type
PRIMARY KEY (project_key, hour, country)

-- re_daily_geo
project_key       TEXT     NOT NULL
day               INTEGER  NOT NULL
country           TEXT     NOT NULL
total_requests    INTEGER  NOT NULL
error_count       INTEGER  NOT NULL
avg_ttfb          REAL
avg_duration      REAL
top_device        TEXT
PRIMARY KEY (project_key, day, country)
```

---

**re_hourly_geo_detail** + **re_daily_geo_detail**
Used by: Geography country detail — city/region table, Geography region detail
```sql
-- re_hourly_geo_detail
project_key       TEXT     NOT NULL
hour              INTEGER  NOT NULL
country           TEXT     NOT NULL
region            TEXT
city              TEXT
total_requests    INTEGER  NOT NULL
error_count       INTEGER  NOT NULL
avg_ttfb          REAL
avg_duration      REAL
top_device        TEXT
PRIMARY KEY (project_key, hour, country, region, city)

-- re_daily_geo_detail
project_key       TEXT     NOT NULL
day               INTEGER  NOT NULL
country           TEXT     NOT NULL
region            TEXT
city              TEXT
total_requests    INTEGER  NOT NULL
error_count       INTEGER  NOT NULL
avg_ttfb          REAL
avg_duration      REAL
top_device        TEXT
PRIMARY KEY (project_key, day, country, region, city)
```

---

**re_hourly_env** + **re_daily_env**
Used by: Environment list — unified table + charts
```sql
-- re_hourly_env
project_key       TEXT     NOT NULL
hour              INTEGER  NOT NULL
device_type       TEXT
browser           TEXT
os                TEXT
connection_type   TEXT
total_requests    INTEGER  NOT NULL
error_count       INTEGER  NOT NULL
avg_ttfb          REAL
avg_duration      REAL
PRIMARY KEY (project_key, hour, device_type, browser, os, connection_type)

-- re_daily_env
project_key       TEXT     NOT NULL
day               INTEGER  NOT NULL
device_type       TEXT
browser           TEXT
os                TEXT
connection_type   TEXT
total_requests    INTEGER  NOT NULL
error_count       INTEGER  NOT NULL
avg_ttfb          REAL
avg_duration      REAL
PRIMARY KEY (project_key, day, device_type, browser, os, connection_type)
```

---

**re_hourly_env_geo** + **re_daily_env_geo**
Used by: Environment detail — by country table
```sql
-- re_hourly_env_geo
project_key       TEXT     NOT NULL
hour              INTEGER  NOT NULL
device_type       TEXT
browser           TEXT
os                TEXT
connection_type   TEXT
country           TEXT     NOT NULL
total_requests    INTEGER  NOT NULL
error_count       INTEGER  NOT NULL
avg_ttfb          REAL
PRIMARY KEY (project_key, hour, device_type, browser, os, connection_type, country)

-- re_daily_env_geo
project_key       TEXT     NOT NULL
day               INTEGER  NOT NULL
device_type       TEXT
browser           TEXT
os                TEXT
connection_type   TEXT
country           TEXT     NOT NULL
total_requests    INTEGER  NOT NULL
error_count       INTEGER  NOT NULL
avg_ttfb          REAL
PRIMARY KEY (project_key, day, device_type, browser, os, connection_type, country)
```

---

#### page_vitals rollups

---

**pv_hourly_summary** + **pv_daily_summary**
Used by: Summary page — vitals score over time
```sql
-- pv_hourly_summary
project_key       TEXT     NOT NULL
hour              INTEGER  NOT NULL
session_count     INTEGER  NOT NULL
avg_lcp           REAL
avg_fcp           REAL
avg_cls           REAL
avg_inp           REAL
avg_vitals_score  REAL
PRIMARY KEY (project_key, hour)

-- pv_daily_summary
project_key       TEXT     NOT NULL
day               INTEGER  NOT NULL
session_count     INTEGER  NOT NULL
avg_lcp           REAL
avg_fcp           REAL
avg_cls           REAL
avg_inp           REAL
avg_vitals_score  REAL
PRIMARY KEY (project_key, day)
```

---

**pv_hourly_pages** + **pv_daily_pages**
Used by: Pages list, Page detail — score over time chart
```sql
-- pv_hourly_pages
project_key       TEXT     NOT NULL
hour              INTEGER  NOT NULL
page_url          TEXT     NOT NULL
session_count     INTEGER  NOT NULL
avg_lcp           REAL
avg_fcp           REAL
avg_cls           REAL
avg_inp           REAL
avg_vitals_score  REAL
top_country       TEXT
device_mobile_pct REAL
PRIMARY KEY (project_key, hour, page_url)

-- pv_daily_pages
project_key       TEXT     NOT NULL
day               INTEGER  NOT NULL
page_url          TEXT     NOT NULL
session_count     INTEGER  NOT NULL
avg_lcp           REAL
avg_fcp           REAL
avg_cls           REAL
avg_inp           REAL
avg_vitals_score  REAL
top_country       TEXT
device_mobile_pct REAL
PRIMARY KEY (project_key, day, page_url)
```

---

**pv_hourly_page_geo** + **pv_daily_page_geo**
Used by: Page detail — by country table, Geography country detail — top pages table
```sql
-- pv_hourly_page_geo
project_key       TEXT     NOT NULL
hour              INTEGER  NOT NULL
page_url          TEXT     NOT NULL
country           TEXT     NOT NULL
session_count     INTEGER  NOT NULL
avg_lcp           REAL
avg_fcp           REAL
avg_cls           REAL
avg_inp           REAL
avg_vitals_score  REAL
PRIMARY KEY (project_key, hour, page_url, country)

-- pv_daily_page_geo
project_key       TEXT     NOT NULL
day               INTEGER  NOT NULL
page_url          TEXT     NOT NULL
country           TEXT     NOT NULL
session_count     INTEGER  NOT NULL
avg_lcp           REAL
avg_fcp           REAL
avg_cls           REAL
avg_inp           REAL
avg_vitals_score  REAL
PRIMARY KEY (project_key, day, page_url, country)
```

---

**pv_hourly_page_env** + **pv_daily_page_env**
Used by: Page detail — by device/browser table, Environment detail — top pages table
```sql
-- pv_hourly_page_env
project_key       TEXT     NOT NULL
hour              INTEGER  NOT NULL
page_url          TEXT     NOT NULL
device_type       TEXT
browser           TEXT
session_count     INTEGER  NOT NULL
avg_lcp           REAL
avg_fcp           REAL
avg_cls           REAL
avg_inp           REAL
avg_vitals_score  REAL
PRIMARY KEY (project_key, hour, page_url, device_type, browser)

-- pv_daily_page_env
project_key       TEXT     NOT NULL
day               INTEGER  NOT NULL
page_url          TEXT     NOT NULL
device_type       TEXT
browser           TEXT
session_count     INTEGER  NOT NULL
avg_lcp           REAL
avg_fcp           REAL
avg_cls           REAL
avg_inp           REAL
avg_vitals_score  REAL
PRIMARY KEY (project_key, day, page_url, device_type, browser)
```

---

**pv_hourly_geo** + **pv_daily_geo**
Used by: Geography list — vitals by country table
```sql
-- pv_hourly_geo
project_key       TEXT     NOT NULL
hour              INTEGER  NOT NULL
country           TEXT     NOT NULL
session_count     INTEGER  NOT NULL
avg_lcp           REAL
avg_fcp           REAL
avg_cls           REAL
avg_inp           REAL
avg_vitals_score  REAL
top_device        TEXT
PRIMARY KEY (project_key, hour, country)

-- pv_daily_geo
project_key       TEXT     NOT NULL
day               INTEGER  NOT NULL
country           TEXT     NOT NULL
session_count     INTEGER  NOT NULL
avg_lcp           REAL
avg_fcp           REAL
avg_cls           REAL
avg_inp           REAL
avg_vitals_score  REAL
top_device        TEXT
PRIMARY KEY (project_key, day, country)
```

---

**pv_hourly_geo_detail** + **pv_daily_geo_detail**
Used by: Geography country detail — vitals by region/city, Geography region detail
```sql
-- pv_hourly_geo_detail
project_key       TEXT     NOT NULL
hour              INTEGER  NOT NULL
country           TEXT     NOT NULL
region            TEXT
city              TEXT
session_count     INTEGER  NOT NULL
avg_lcp           REAL
avg_fcp           REAL
avg_cls           REAL
avg_inp           REAL
avg_vitals_score  REAL
top_device        TEXT
PRIMARY KEY (project_key, hour, country, region, city)

-- pv_daily_geo_detail
project_key       TEXT     NOT NULL
day               INTEGER  NOT NULL
country           TEXT     NOT NULL
region            TEXT
city              TEXT
session_count     INTEGER  NOT NULL
avg_lcp           REAL
avg_fcp           REAL
avg_cls           REAL
avg_inp           REAL
avg_vitals_score  REAL
top_device        TEXT
PRIMARY KEY (project_key, day, country, region, city)
```

---

**pv_hourly_env** + **pv_daily_env**
Used by: Environment list — vitals by env table + charts
```sql
-- pv_hourly_env
project_key       TEXT     NOT NULL
hour              INTEGER  NOT NULL
device_type       TEXT
browser           TEXT
os                TEXT
connection_type   TEXT
session_count     INTEGER  NOT NULL
avg_lcp           REAL
avg_fcp           REAL
avg_cls           REAL
avg_inp           REAL
avg_vitals_score  REAL
PRIMARY KEY (project_key, hour, device_type, browser, os, connection_type)

-- pv_daily_env
project_key       TEXT     NOT NULL
day               INTEGER  NOT NULL
device_type       TEXT
browser           TEXT
os                TEXT
connection_type   TEXT
session_count     INTEGER  NOT NULL
avg_lcp           REAL
avg_fcp           REAL
avg_cls           REAL
avg_inp           REAL
avg_vitals_score  REAL
PRIMARY KEY (project_key, day, device_type, browser, os, connection_type)
```

---

**pv_hourly_env_geo** + **pv_daily_env_geo**
Used by: Environment detail — by country table
```sql
-- pv_hourly_env_geo
project_key       TEXT     NOT NULL
hour              INTEGER  NOT NULL
device_type       TEXT
browser           TEXT
os                TEXT
connection_type   TEXT
country           TEXT     NOT NULL
session_count     INTEGER  NOT NULL
avg_lcp           REAL
avg_fcp           REAL
avg_cls           REAL
avg_inp           REAL
avg_vitals_score  REAL
PRIMARY KEY (project_key, hour, device_type, browser, os, connection_type, country)

-- pv_daily_env_geo
project_key       TEXT     NOT NULL
day               INTEGER  NOT NULL
device_type       TEXT
browser           TEXT
os                TEXT
connection_type   TEXT
country           TEXT     NOT NULL
session_count     INTEGER  NOT NULL
avg_lcp           REAL
avg_fcp           REAL
avg_cls           REAL
avg_inp           REAL
avg_vitals_score  REAL
PRIMARY KEY (project_key, day, device_type, browser, os, connection_type, country)
```

---

### Rollup Table Notes
- All rollup tables use composite PRIMARY KEY — serves as both uniqueness constraint and index, no extra indexes needed
- `hour` and `day` stored as Unix timestamps (INTEGER) rounded to hour/day boundary in UTC — fast range queries, no timezone math at query time
- `avg_*` fields are weighted correctly during daily rollup: `SUM(avg_ttfb * total_requests) / SUM(total_requests)` not `AVG(avg_ttfb)`
- `top_country` and `top_device` are denormalized for list views — avoids extra join to get the most common value
- `device_mobile_pct` denormalized on endpoint/page rollups — needed for list view device split column
- NULL dimensions (e.g. unknown device_type) stored as empty string `''` not NULL — keeps PRIMARY KEY constraint valid in SQLite
- Dashboard always queries hourly rollups for 12h/24h views, daily rollups for 7d/30d views
- On project delete → hard delete all rows across all 34 tables for that `project_key`

---

## 14. Open TODOs

- [ ] Password + email auth — planned for later
- [ ] Billing infrastructure + Stripe integration
- [ ] Sampling strategy for high-traffic sites
- [x] Web Vitals — web-vitals/slim bundled into rum-core.js
- [x] Two separate event types — request_events + page_vitals
- [x] URL normalization preserves origin for third-party API tracking
- [x] Dashboard structure — summary + pages + endpoints + geography + environment with drilldown
- [x] Geography — two level drilldown (country → region/city)
- [x] Environment — per dimension drilldown (browser/device/OS/connection)
- [x] Pre-aggregation strategy — 34 Turso tables (2 raw + 32 rollups), dashboard reads rollups only
- [x] Rollup table schemas — 16 for request_events, 16 for page_vitals (hourly + daily pairs)
- [x] Cron infrastructure — GitHub Actions scheduled workflows → Koyeb internal API endpoints
- [ ] Map library decision — react-simple-maps (lightweight SVG) recommended
- [ ] Data export feature — allow users to export tracking data as XLS or CSV
- [ ] Vitals score algorithm — define exact weighting for 0-100 score computation