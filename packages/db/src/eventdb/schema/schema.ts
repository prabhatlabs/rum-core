import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
    // Identity
    id: text("id").primaryKey(),                    
    project_key: text("project_key").notNull(),
    session_id: text("session_id").notNull(),
    request_id: text("request_id").notNull(),

    // Request Info
    url: text("url").notNull(),
    method: text("method").notNull(),
    status_code: integer("status_code"),
    request_size: integer("request_size"),
    response_size: integer("response_size"),

    // Timing (all REAL, nullable — null not 0)
    dns: real("dns"),
    tcp: real("tcp"),
    tls: real("tls"),
    ttfb: real("ttfb"),
    duration: real("duration"),

    // Page Context
    page_url: text("page_url"),
    referrer: text("referrer"),
    timestamp: integer("timestamp").notNull(),

    // User Environment
    browser: text("browser"),
    browser_version: text("browser_version"),
    os: text("os"),
    os_version: text("os_version"),
    device_type: text("device_type"),
    screen_res: text("screen_res"),
    connection_type: text("connection_type"),
    language: text("language"),

    // Web Vitals
    lcp: real("lcp"),
    fcp: real("fcp"),
    cls: real("cls"),
    inp: real("inp"),

    // Geo & Network
    country: text("country"),
    city: text("city"),
    region: text("region"),
    timezone: text("timezone"),
    isp: text("isp"),
    asn: integer("asn"),
    ip_hash: text("ip_hash"),
}, (t) => [
    index("idx_events_project_key").on(t.project_key),
    index("idx_events_timestamp").on(t.timestamp),
    index("idx_events_project_timestamp").on(t.project_key, t.timestamp),
    index("idx_events_session_id").on(t.session_id),
    index("idx_events_status_code").on(t.status_code),
    index("idx_events_url").on(t.url),
]);