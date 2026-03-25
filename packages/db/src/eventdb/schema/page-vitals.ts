import {
    index,
    integer,
    real,
    sqliteTable,
    text,
} from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const pageVitals = sqliteTable(
    "page_vitals",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => nanoid()),
        project_key: text("project_key").notNull(),
        session_id: text("session_id").notNull(),
        page_url: text("page_url").notNull(),
        referrer: text("referrer"),
        timestamp: integer("timestamp").notNull(),
        lcp: real("lcp"),
        fcp: real("fcp"),
        cls: real("cls"),
        inp: real("inp"),
        vitals_score: real("vitals_score"),
        browser: text("browser"),
        browser_version: text("browser_version"),
        os: text("os"),
        os_version: text("os_version"),
        device_type: text("device_type"),
        screen_res: text("screen_res"),
        connection_type: text("connection_type"),
        language: text("language"),
        country: text("country"),
        city: text("city"),
        region: text("region"),
        timezone: text("timezone"),
        isp: text("isp"),
        asn: integer("asn"),
        ip_hash: text("ip_hash"),
    },
    (t) => [
        index("idx_page_vitals_project_key").on(t.project_key),
        index("idx_page_vitals_timestamp").on(t.timestamp),
        index("idx_page_vitals_project_timestamp").on(
            t.project_key,
            t.timestamp,
        ),
        index("idx_page_vitals_project_page_url").on(t.project_key, t.page_url),
        index("idx_page_vitals_project_country").on(t.project_key, t.country),
        index("idx_page_vitals_project_device").on(
            t.project_key,
            t.device_type,
        ),
        index("idx_page_vitals_session_id").on(t.session_id),
    ],
);
