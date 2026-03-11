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
Intercepts fetch() / XHR → captures timings + environment
     ↓
POST to Cloudflare Worker
     ↓
Worker enriches with geo/ISP → writes to Turso
     ↓
Main Server reads for dashboard
```

| Layer | Responsibility | Service |
|---|---|---|
| Browser Script | Intercept requests, capture timings, send batched events | jsDelivr + GitHub CDN |
| Edge Worker | Receive events, enrich with geo/ISP, write to event DB | Cloudflare Workers |
| Event Database | Store all raw tracking events at scale | Turso |
| Main Server | Auth, dashboard, data reads, project management | Bun + Elysia |
| Business Database | Users, projects, billing, API keys, plans | Neon (Postgres) |

---

## 3. Full Tech Stack

### Browser Script
| Component | Choice |
|---|---|
| Script delivery | jsDelivr + GitHub |
| Script format | Vanilla JS (~5kb bundled) |
| Build tool | esbuild or tsup — bundle + minify before pushing to GitHub |
| Web Vitals | `web-vitals/slim` bundled in — onLCP, onFCP, onCLS, onINP |
| Request interception | Monkey-patch fetch + XHR |
| Timing API | `Performance.getEntriesByType()` |
| Data sending | `navigator.sendBeacon` / fetch |
| Batching | Collect events for 10s window, send one POST |
| Flush on exit | `visibilitychange` event — flush immediately on tab close |
| Payload | Metrics only (no response body) — ~200-300 bytes per event |
| Null handling | All numeric fields are either a valid number or `null` — never `0` as a fallback. Zero is a valid metric value (e.g. perfect CLS = 0) so `null`/`undefined` is used to indicate "not collected" (e.g. INP requires user interaction so may never fire) |
| URL normalization | Done in browser before sending — numeric/UUID segments replaced with `:id` |

> 200 events in a 10s window = ~60kb per batch POST. One worker request consumed per batch regardless of event count.

### Edge Layer
| Component | Choice |
|---|---|
| Edge runtime | Cloudflare Workers |
| Geo enrichment | Native `request.cf` object (country, city, region, timezone) |
| ISP enrichment | Native `request.cf.asn` + `request.cf.asOrganization` |
| IP hashing | SHA-256 in Worker |

> Geo & ISP data is read once per batch from `request.cf` and stamped on all events. No external API, no caching needed — zero latency, zero cost. Caching geo data is unnecessary since `request.cf` is instantaneous.

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

| Group | Fields | Source |
|---|---|---|
| Request Info | URL, method, status code, request/response size | Browser |
| Timing Breakdown | DNS, TCP, TLS, TTFB, total duration | Browser |
| Page Context | Current URL, referrer, timestamp | Browser |
| User Environment | Browser, OS, device type, screen res, connection type, language | Browser |
| Web Vitals | LCP, FID/INP, CLS, FCP, TTFB | Browser |
| Geo & Network | Country, city, region, ISP/ASN, timezone, hashed IP | Cloudflare Worker |
| Session & Identity | Project API key, session ID, request ID | Browser + Worker |

---

## 5. Session & Identity Model

```
Project → Session → Request
```

| Identifier | Source | Purpose |
|---|---|---|
| Project API Key | Browser (script tag param `?key=abc123`) | Which project/customer |
| Anonymous Session ID | Browser (generated on load, e.g. `sess_xk29dj`) | Which user visit |
| Request ID | Worker (assigned on receipt) | Which unique event |

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

## 8. Subscription Plans

| Feature | Free | Pro | Enterprise |
|---|---|---|---|
| Projects | 2 | 8 | Unlimited |
| Calls/day | 50k across projects | 500k across projects | Custom |
| Data retention | 7 days | 30 days | Custom |
| Time ranges | 12h, 24h, 7d | 12h, 24h, 7d, 30d | Custom |
| Price | $0 | TBD | Contact us |

> Pro plan UI will be visible but disabled at launch — shows "Contact us" dialog. Billing infrastructure to be added later.

---

## 9. Upstash Redis — Planned Usage

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
cache:{project_key}:overview:24h
cache:{project_key}:performance:24h
cache:{project_key}:errors:24h
cache:{project_key}:geography:24h
cache:{project_key}:environment:24h
```

On project delete or origin change → invalidate all `cache:{project_key}:*` keys and `project:{project_key}` key from Redis.

---

## 10. Dashboard UI

### Layout
- Top bar — project switcher + time range selector (default 24h)
- Overview stat cards — total requests, avg TTFB (Time to First Byte), error rate %, active sessions
- Tabbed navigation for all sections

### Tabs

**Overview**
- Stat cards (total requests, avg TTFB, error rate, active sessions)
- Requests over time (line chart)
- TTFB (Time to First Byte) over time (line chart)
- Web Vitals — 4 cards (2x2 grid) for LCP, FCP, CLS, INP. Each card shows 3 groups (Good / Needs Improvement / Poor) with session count, % of total, min, avg, max per group. Missing values shown as "No data" (e.g. INP requires user interaction so may be absent)

**Web Vital ranges (Google official thresholds):**

| Metric | Good | Needs Improvement | Poor |
|---|---|---|---|
| LCP (Largest Contentful Paint) | ≤ 2.5s | 2.5s – 4.0s | > 4.0s |
| FCP (First Contentful Paint) | ≤ 1.8s | 1.8s – 3.0s | > 3.0s |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | 0.1 – 0.25 | > 0.25 |
| INP (Interaction to Next Paint) | ≤ 200ms | 200ms – 500ms | > 500ms |

**Performance**
- One table with sort + filter (client-side)
- Fields: Endpoint, Total requests, Avg TTFB, Avg DNS (Domain Name System), Avg TCP (Transmission Control Protocol), Avg TLS (Transport Layer Security), Avg duration, Error rate %
- Filter: endpoint search, method dropdown, status code dropdown

**Errors**
- Error rate over time (line chart)
- Status code breakdown 4xx vs 5xx (bar chart)
- One table with sort + filter (client-side)
- Fields: Endpoint, Status code, Count, % of total errors, Last seen

**Geography**
- World map heatmap (requests by country)
- One table with sort + filter (client-side)
- Fields: Flag + Country, City, Region, Total requests, Avg TTFB, Error rate %
- ISP table — ISP name, ASN (Autonomous System Number), Total requests, Avg TTFB, Error rate %

**Environment**
- One table with sort + filter (client-side)
- Fields: Browser, OS (Operating System), Device type, Connection type, Total requests, % of total, Avg TTFB
- Charts: device type donut, connection type donut, browser bar chart, OS bar chart

### Client-side filter & sort
All tables load in one API call per tab and filter/sort entirely in the browser. Safe because most projects have under 100 unique normalized endpoints. No pagination needed.

### URL Normalization
Dynamic segments are normalized in the browser script before sending:
```
/api/users/123     →  /api/users/:id
/api/posts/abc-xyz →  /api/posts/:id
```
Keeps unique endpoint count low (~50-100 per project) making client-side table handling trivial.

---

## 11. Monorepo Structure

Managed with **Bun workspaces** — no extra tooling, native to Bun, simple for solo dev.

```
rum-core/
├── apps/
│   ├── web/          → Next.js frontend
│   ├── api/          → Bun + Elysia backend
│   └── worker/       → Cloudflare Worker + Hono
├── packages/
│   └── script/       → Browser script (rum-core.js)
├── package.json      → workspace root
└── README.md
```

---

## 12. Deployment

| Service | Platform | Notes |
|---|---|---|
| Browser Script | jsDelivr + GitHub | Auto served on push |
| Cloudflare Worker | Cloudflare | Free, 100k req/day |
| Main Backend (dev/testing) | Render + UptimeRobot | Free, UptimeRobot pings `/health` every 5min to prevent sleep |
| Main Backend (launch) | Koyeb | Never sleeps, free — swap older project to Render at launch |
| Frontend | Vercel | Free, perfect for Next.js SSG |

---

## 13. Data Retention & Cleanup

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
- Daily cron deletes rows older than 32 days:
```sql
DELETE FROM events WHERE timestamp < NOW() - INTERVAL '32 days'
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
Enrich all events with request.cf geo data
     ↓
Write to Turso
```

Every 30 min — bulk sync Redis → Neon to persist counts (protects against Redis data loss).

### Cron jobs (all on Cloudflare Cron Triggers — free)

| Job | Schedule | Action |
|---|---|---|
| Usage sync | Every 30 min | Redis → Neon bulk upsert of daily counters |
| Neon cleanup | Daily midnight UTC | Delete usage rows older than 92 days |
| Turso cleanup | Daily midnight UTC | Delete events older than 32 days + VACUUM |
| Monthly summary | 1st of month, 2am UTC | Aggregate previous month daily usage → monthly_usage table (background, user never affected) |

---

## 14. Database Schemas

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
origin        TEXT          NOT NULL         -- e.g. https://mysite.com, no localhost allowed
created_at    TIMESTAMP     DEFAULT NOW()
```

**Project rules:**
- `project_key` is immutable — generated once on creation, never changed
- `origin` is validated as a valid URL format on project creation — no special rules, localhost is allowed, user is responsible for what they enter
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
project_key   VARCHAR(64)   NOT NULL  -- which project this usage belongs to
date          DATE          NOT NULL
calls_used    INTEGER       NOT NULL DEFAULT 0
created_at    TIMESTAMP     DEFAULT NOW()
updated_at    TIMESTAMP     DEFAULT NOW()

UNIQUE(user_id, project_key, date)
```

> No separate total row — user total for any given day is always `SUM(calls_used)` across all project_key rows for that user + date. With a max of 8 projects (Pro), this is trivial to compute.

**monthly_usage** (internal only, kept forever, unit in millions)
```sql
id            UUID          PRIMARY KEY DEFAULT gen_random_uuid()
user_id       UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE
month         DATE          NOT NULL  -- first day of month e.g. 2026-03-01
calls_million DECIMAL(10,4) NOT NULL DEFAULT 0  -- e.g. 1.2345 = 1.2345 million
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

**events** (one row per fetch/XHR call captured by browser script)
```sql
id                TEXT          PRIMARY KEY  -- nanoid, generated by worker
project_key       TEXT          NOT NULL     -- no FK in SQLite, references projects.project_key
session_id        TEXT          NOT NULL     -- anonymous session ID
request_id        TEXT          NOT NULL     -- unique per event, assigned by worker

-- Request Info
url               TEXT          NOT NULL     -- normalized URL e.g. /api/users/:id
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
browser           TEXT                       -- Chrome | Firefox | Safari etc.
browser_version   TEXT
os                TEXT                       -- Windows | macOS | Linux | iOS | Android
os_version        TEXT
device_type       TEXT                       -- mobile | desktop | tablet
screen_res        TEXT                       -- e.g. 1920x1080
connection_type   TEXT                       -- wifi | 4g | 3g | 2g etc.
language          TEXT                       -- e.g. en-US

-- Web Vitals (all REAL, nullable — null means not collected)
lcp               REAL                       -- Largest Contentful Paint (ms)
fcp               REAL                       -- First Contentful Paint (ms)
cls               REAL                       -- Cumulative Layout Shift (score, not ms)
inp               REAL                       -- Interaction to Next Paint (ms)

-- Geo & Network (enriched by worker via request.cf, all nullable)
country           TEXT                       -- e.g. IN
city              TEXT                       -- e.g. Raipur
region            TEXT                       -- e.g. Chhattisgarh
timezone          TEXT                       -- e.g. Asia/Kolkata
isp               TEXT                       -- e.g. Jio
asn               INTEGER                    -- Autonomous System Number
ip_hash           TEXT                       -- SHA-256 hashed IP
```

**Indexes**
```sql
CREATE INDEX idx_events_project_key ON events(project_key);
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_events_project_timestamp ON events(project_key, timestamp);
CREATE INDEX idx_events_session_id ON events(session_id);
CREATE INDEX idx_events_status_code ON events(status_code);
CREATE INDEX idx_events_url ON events(url);
```

**Notes:**
- No FK constraints in SQLite/Turso — `project_key` is plain TEXT reference
- `cls` is a unitless score (e.g. 0.05), all other vitals are in ms
- Each fetch/XHR call in a batch = one row — 50k calls/day = 50k rows/day per user
- `nanoid` for `id` — shorter than UUID, URL safe, fast to generate at edge
- All nullable numeric fields use `null` not `0` — zero is a valid metric value

---

## 15. Open TODOs

- [ ] Password + email auth — planned for later
- [ ] Billing infrastructure + Stripe integration
- [ ] Sampling strategy for high-traffic sites
- [x] Web Vitals — web-vitals/slim bundled into rum-core.js
- [ ] Map library decision — react-simple-maps (lightweight SVG) recommended
- [ ] Data export feature — allow users to export tracking data as XLS or CSV