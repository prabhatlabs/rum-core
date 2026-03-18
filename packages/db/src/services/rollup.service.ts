import {
    APIErrorResponse,
    constants,
    getCutoffTimestamp,
    getPreviousDayTimestamp,
    getPreviousHourTimestamp,
    okResponse,
    type ApiResponse,
    type TimeRange,
} from "@rum-core/shared";
import { eq } from "drizzle-orm";
import { getEventDBClient } from "../eventdb/client";
import { getMainDB } from "../maindb/client";
import { plans, projects } from "../maindb/schema";
const RETENTION = constants.plans.RETENTION;
const RAW_TABLES = ["request_events", "page_vitals"];
const HOURLY_TABLES = [
    "re_hourly_summary",
    "re_hourly_endpoints",
    "re_hourly_endpoint_geo",
    "re_hourly_endpoint_env",
    "re_hourly_geo",
    "re_hourly_geo_detail",
    "re_hourly_env",
    "re_hourly_env_geo",
    "pv_hourly_summary",
    "pv_hourly_pages",
    "pv_hourly_page_geo",
    "pv_hourly_page_env",
    "pv_hourly_geo",
    "pv_hourly_geo_detail",
    "pv_hourly_env",
    "pv_hourly_env_geo",
];
const DAILY_TABLES = [
    "re_daily_summary",
    "re_daily_endpoints",
    "re_daily_endpoint_geo",
    "re_daily_endpoint_env",
    "re_daily_geo",
    "re_daily_geo_detail",
    "re_daily_env",
    "re_daily_env_geo",
    "pv_daily_summary",
    "pv_daily_pages",
    "pv_daily_page_geo",
    "pv_daily_page_env",
    "pv_daily_geo",
    "pv_daily_geo_detail",
    "pv_daily_env",
    "pv_daily_env_geo",
];

export async function aggregateHourlyFromRaw(): Promise<void> {
    const hourTimestamp = getPreviousHourTimestamp();
    const hourStart = hourTimestamp;
    const hourEnd = hourTimestamp + 3600000 - 1; // 59 min, 59 sec, 999 ms

    const reSummary = `
        INSERT INTO re_hourly_summary (project_key, hour, total_requests, error_count, avg_ttfb, avg_duration)
        SELECT 
            project_key,
            ${hourTimestamp} as hour,
            COUNT(*) as total_requests,
            SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count,
            AVG(ttfb) as avg_ttfb,
            AVG(duration) as avg_duration
        FROM request_events
        WHERE timestamp >= ${hourStart} AND timestamp <= ${hourEnd}
        GROUP BY project_key
        ON CONFLICT(project_key, hour) DO UPDATE SET
            total_requests = excluded.total_requests,
            error_count = excluded.error_count,
            avg_ttfb = excluded.avg_ttfb,
            avg_duration = excluded.avg_duration
    `;

    const reEndpoints = `
        INSERT INTO re_hourly_endpoints (project_key, hour, url, method, total_requests, error_count, avg_ttfb, avg_duration, avg_dns, avg_tcp, avg_tls, top_country, device_mobile_pct)
        SELECT 
            project_key,
            ${hourTimestamp} as hour,
            url,
            method,
            COUNT(*) as total_requests,
            SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count,
            AVG(ttfb) as avg_ttfb,
            AVG(duration) as avg_duration,
            AVG(dns) as avg_dns,
            AVG(tcp) as avg_tcp,
            AVG(tls) as avg_tls,
            (SELECT country FROM request_events r2 WHERE r2.project_key = request_events.project_key AND r2.url = request_events.url AND r2.method = request_events.method AND r2.timestamp >= ${hourStart} AND r2.timestamp <= ${hourEnd} GROUP BY country ORDER BY COUNT(*) DESC LIMIT 1) as top_country,
            (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM request_events r4 WHERE r4.project_key = request_events.project_key AND r4.url = request_events.url AND r4.method = request_events.method AND r4.timestamp >= ${hourStart} AND r4.timestamp <= ${hourEnd}) FROM request_events r3 WHERE r3.project_key = request_events.project_key AND r3.url = request_events.url AND r3.method = request_events.method AND r3.timestamp >= ${hourStart} AND r3.timestamp <= ${hourEnd} AND r3.device_type = 'mobile')
        FROM request_events
        WHERE timestamp >= ${hourStart} AND timestamp <= ${hourEnd}
        GROUP BY project_key, url, method
        ON CONFLICT(project_key, hour, url, method) DO UPDATE SET
            total_requests = excluded.total_requests,
            error_count = excluded.error_count,
            avg_ttfb = excluded.avg_ttfb,
            avg_duration = excluded.avg_duration,
            avg_dns = excluded.avg_dns,
            avg_tcp = excluded.avg_tcp,
            avg_tls = excluded.avg_tls,
            top_country = excluded.top_country,
            device_mobile_pct = excluded.device_mobile_pct
    `;

    const reEndpointGeo = `
        INSERT INTO re_hourly_endpoint_geo (project_key, hour, url, method, country, total_requests, error_count, avg_ttfb, avg_duration)
        SELECT 
            project_key,
            ${hourTimestamp} as hour,
            url,
            method,
            COALESCE(country, '') as country,
            COUNT(*) as total_requests,
            SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count,
            AVG(ttfb) as avg_ttfb,
            AVG(duration) as avg_duration
        FROM request_events
        WHERE timestamp >= ${hourStart} AND timestamp <= ${hourEnd}
        GROUP BY project_key, url, method, country
        ON CONFLICT(project_key, hour, url, method, country) DO UPDATE SET
            total_requests = excluded.total_requests,
            error_count = excluded.error_count,
            avg_ttfb = excluded.avg_ttfb,
            avg_duration = excluded.avg_duration
    `;

    const reEndpointEnv = `
        INSERT INTO re_hourly_endpoint_env (project_key, hour, url, method, device_type, browser, total_requests, error_count, avg_ttfb, avg_duration)
        SELECT 
            project_key,
            ${hourTimestamp} as hour,
            url,
            method,
            COALESCE(device_type, '') as device_type,
            COALESCE(browser, '') as browser,
            COUNT(*) as total_requests,
            SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count,
            AVG(ttfb) as avg_ttfb,
            AVG(duration) as avg_duration
        FROM request_events
        WHERE timestamp >= ${hourStart} AND timestamp <= ${hourEnd}
        GROUP BY project_key, url, method, device_type, browser
        ON CONFLICT(project_key, hour, url, method, device_type, browser) DO UPDATE SET
            total_requests = excluded.total_requests,
            error_count = excluded.error_count,
            avg_ttfb = excluded.avg_ttfb,
            avg_duration = excluded.avg_duration
    `;

    const reGeo = `
        INSERT INTO re_hourly_geo (project_key, hour, country, total_requests, error_count, avg_ttfb, avg_duration, top_device)
        SELECT 
            project_key,
            ${hourTimestamp} as hour,
            COALESCE(country, '') as country,
            COUNT(*) as total_requests,
            SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count,
            AVG(ttfb) as avg_ttfb,
            AVG(duration) as avg_duration,
            (SELECT device_type FROM request_events r2 WHERE r2.project_key = request_events.project_key AND r2.country = request_events.country AND r2.timestamp >= ${hourStart} AND r2.timestamp <= ${hourEnd} GROUP BY device_type ORDER BY COUNT(*) DESC LIMIT 1) as top_device
        FROM request_events
        WHERE timestamp >= ${hourStart} AND timestamp <= ${hourEnd}
        GROUP BY project_key, country
        ON CONFLICT(project_key, hour, country) DO UPDATE SET
            total_requests = excluded.total_requests,
            error_count = excluded.error_count,
            avg_ttfb = excluded.avg_ttfb,
            avg_duration = excluded.avg_duration,
            top_device = excluded.top_device
    `;

    const reGeoDetail = `
        INSERT INTO re_hourly_geo_detail (project_key, hour, country, region, city, total_requests, error_count, avg_ttfb, avg_duration, top_device)
        SELECT 
            project_key,
            ${hourTimestamp} as hour,
            COALESCE(country, '') as country,
            COALESCE(region, '') as region,
            COALESCE(city, '') as city,
            COUNT(*) as total_requests,
            SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count,
            AVG(ttfb) as avg_ttfb,
            AVG(duration) as avg_duration,
            (SELECT device_type FROM request_events r2 WHERE r2.project_key = request_events.project_key AND r2.country = request_events.country AND r2.region = request_events.region AND r2.city = request_events.city AND r2.timestamp >= ${hourStart} AND r2.timestamp <= ${hourEnd} GROUP BY device_type ORDER BY COUNT(*) DESC LIMIT 1) as top_device
        FROM request_events
        WHERE timestamp >= ${hourStart} AND timestamp <= ${hourEnd}
        GROUP BY project_key, country, region, city
        ON CONFLICT(project_key, hour, country, region, city) DO UPDATE SET
            total_requests = excluded.total_requests,
            error_count = excluded.error_count,
            avg_ttfb = excluded.avg_ttfb,
            avg_duration = excluded.avg_duration,
            top_device = excluded.top_device
    `;

    const reEnv = `
        INSERT INTO re_hourly_env (project_key, hour, device_type, browser, os, connection_type, total_requests, error_count, avg_ttfb, avg_duration)
        SELECT 
            project_key,
            ${hourTimestamp} as hour,
            COALESCE(device_type, '') as device_type,
            COALESCE(browser, '') as browser,
            COALESCE(os, '') as os,
            COALESCE(connection_type, '') as connection_type,
            COUNT(*) as total_requests,
            SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count,
            AVG(ttfb) as avg_ttfb,
            AVG(duration) as avg_duration
        FROM request_events
        WHERE timestamp >= ${hourStart} AND timestamp <= ${hourEnd}
        GROUP BY project_key, device_type, browser, os, connection_type
        ON CONFLICT(project_key, hour, device_type, browser, os, connection_type) DO UPDATE SET
            total_requests = excluded.total_requests,
            error_count = excluded.error_count,
            avg_ttfb = excluded.avg_ttfb,
            avg_duration = excluded.avg_duration
    `;

    const reEnvGeo = `
        INSERT INTO re_hourly_env_geo (project_key, hour, device_type, browser, os, connection_type, country, total_requests, error_count, avg_ttfb)
        SELECT 
            project_key,
            ${hourTimestamp} as hour,
            COALESCE(device_type, '') as device_type,
            COALESCE(browser, '') as browser,
            COALESCE(os, '') as os,
            COALESCE(connection_type, '') as connection_type,
            COALESCE(country, '') as country,
            COUNT(*) as total_requests,
            SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count,
            AVG(ttfb) as avg_ttfb
        FROM request_events
        WHERE timestamp >= ${hourStart} AND timestamp <= ${hourEnd}
        GROUP BY project_key, device_type, browser, os, connection_type, country
        ON CONFLICT(project_key, hour, device_type, browser, os, connection_type, country) DO UPDATE SET
            total_requests = excluded.total_requests,
            error_count = excluded.error_count,
            avg_ttfb = excluded.avg_ttfb
    `;

    const pvSummary = `
        INSERT INTO pv_hourly_summary (project_key, hour, session_count, avg_lcp, avg_fcp, avg_cls, avg_inp, avg_vitals_score)
        SELECT 
            project_key,
            ${hourTimestamp} as hour,
            COUNT(DISTINCT session_id) as session_count,
            AVG(lcp) as avg_lcp,
            AVG(fcp) as avg_fcp,
            AVG(cls) as avg_cls,
            AVG(inp) as avg_inp,
            AVG(vitals_score) as avg_vitals_score
        FROM page_vitals
        WHERE timestamp >= ${hourStart} AND timestamp <= ${hourEnd}
        GROUP BY project_key
        ON CONFLICT(project_key, hour) DO UPDATE SET
            session_count = excluded.session_count,
            avg_lcp = excluded.avg_lcp,
            avg_fcp = excluded.avg_fcp,
            avg_cls = excluded.avg_cls,
            avg_inp = excluded.avg_inp,
            avg_vitals_score = excluded.avg_vitals_score
    `;

    const pvPages = `
        INSERT INTO pv_hourly_pages (project_key, hour, page_url, session_count, avg_lcp, avg_fcp, avg_cls, avg_inp, avg_vitals_score, top_country, device_mobile_pct)
        SELECT 
            project_key,
            ${hourTimestamp} as hour,
            page_url,
            COUNT(DISTINCT session_id) as session_count,
            AVG(lcp) as avg_lcp,
            AVG(fcp) as avg_fcp,
            AVG(cls) as avg_cls,
            AVG(inp) as avg_inp,
            AVG(vitals_score) as avg_vitals_score,
            (
                SELECT country 
                FROM page_vitals pv2 
                WHERE pv2.project_key = page_vitals.project_key 
                AND pv2.page_url = page_vitals.page_url 
                AND pv2.timestamp >= ${hourStart} AND pv2.timestamp < ${hourEnd}
                GROUP BY country 
                ORDER BY COUNT(*) DESC 
                LIMIT 1
            ) as top_country,
            (
                SELECT COUNT(*) * 100.0 / (
                    SELECT COUNT(*) 
                    FROM page_vitals pv4 
                    WHERE pv4.project_key = page_vitals.project_key 
                    AND pv4.page_url = page_vitals.page_url 
                    AND pv4.timestamp >= ${hourStart} AND pv4.timestamp < ${hourEnd}
                )
                FROM page_vitals pv3 
                WHERE pv3.project_key = page_vitals.project_key 
                AND pv3.page_url = page_vitals.page_url 
                AND pv3.timestamp >= ${hourStart} AND pv3.timestamp < ${hourEnd}
                AND pv3.device_type = 'mobile'
            ) as device_mobile_pct
        FROM page_vitals
        WHERE timestamp >= ${hourStart} AND timestamp < ${hourEnd}
        GROUP BY project_key, page_url
        ON CONFLICT(project_key, hour, page_url) DO UPDATE SET
            session_count = excluded.session_count,
            avg_lcp = excluded.avg_lcp,
            avg_fcp = excluded.avg_fcp,
            avg_cls = excluded.avg_cls,
            avg_inp = excluded.avg_inp,
            avg_vitals_score = excluded.avg_vitals_score,
            top_country = excluded.top_country,
            device_mobile_pct = excluded.device_mobile_pct
    `;

    const pvPageGeo = `
        INSERT INTO pv_hourly_page_geo (project_key, hour, page_url, country, session_count, avg_lcp, avg_fcp, avg_cls, avg_inp, avg_vitals_score)
        SELECT 
            project_key,
            ${hourTimestamp} as hour,
            page_url,
            COALESCE(country, '') as country,
            COUNT(DISTINCT session_id) as session_count,
            AVG(lcp) as avg_lcp,
            AVG(fcp) as avg_fcp,
            AVG(cls) as avg_cls,
            AVG(inp) as avg_inp,
            AVG(vitals_score) as avg_vitals_score
        FROM page_vitals
        WHERE timestamp >= ${hourStart} AND timestamp <= ${hourEnd}
        GROUP BY project_key, page_url, country
        ON CONFLICT(project_key, hour, page_url, country) DO UPDATE SET
            session_count = excluded.session_count,
            avg_lcp = excluded.avg_lcp,
            avg_fcp = excluded.avg_fcp,
            avg_cls = excluded.avg_cls,
            avg_inp = excluded.avg_inp,
            avg_vitals_score = excluded.avg_vitals_score
    `;

    const pvPageEnv = `
        INSERT INTO pv_hourly_page_env (project_key, hour, page_url, device_type, browser, session_count, avg_lcp, avg_fcp, avg_cls, avg_inp, avg_vitals_score)
        SELECT 
            project_key,
            ${hourTimestamp} as hour,
            page_url,
            COALESCE(device_type, '') as device_type,
            COALESCE(browser, '') as browser,
            COUNT(DISTINCT session_id) as session_count,
            AVG(lcp) as avg_lcp,
            AVG(fcp) as avg_fcp,
            AVG(cls) as avg_cls,
            AVG(inp) as avg_inp,
            AVG(vitals_score) as avg_vitals_score
        FROM page_vitals
        WHERE timestamp >= ${hourStart} AND timestamp <= ${hourEnd}
        GROUP BY project_key, page_url, device_type, browser
        ON CONFLICT(project_key, hour, page_url, device_type, browser) DO UPDATE SET
            session_count = excluded.session_count,
            avg_lcp = excluded.avg_lcp,
            avg_fcp = excluded.avg_fcp,
            avg_cls = excluded.avg_cls,
            avg_inp = excluded.avg_inp,
            avg_vitals_score = excluded.avg_vitals_score
    `;

    const pvGeo = `
        INSERT INTO pv_hourly_geo (project_key, hour, country, session_count, avg_lcp, avg_fcp, avg_cls, avg_inp, avg_vitals_score, top_device)
        SELECT 
            project_key,
            ${hourTimestamp} as hour,
            COALESCE(country, '') as country,
            COUNT(DISTINCT session_id) as session_count,
            AVG(lcp) as avg_lcp,
            AVG(fcp) as avg_fcp,
            AVG(cls) as avg_cls,
            AVG(inp) as avg_inp,
            AVG(vitals_score) as avg_vitals_score,
            (SELECT device_type FROM page_vitals pv2 WHERE pv2.project_key = page_vitals.project_key AND pv2.country = page_vitals.country AND pv2.timestamp >= ${hourStart} AND pv2.timestamp <= ${hourEnd} GROUP BY device_type ORDER BY COUNT(*) DESC LIMIT 1) as top_device
        FROM page_vitals
        WHERE timestamp >= ${hourStart} AND timestamp <= ${hourEnd}
        GROUP BY project_key, country
        ON CONFLICT(project_key, hour, country) DO UPDATE SET
            session_count = excluded.session_count,
            avg_lcp = excluded.avg_lcp,
            avg_fcp = excluded.avg_fcp,
            avg_cls = excluded.avg_cls,
            avg_inp = excluded.avg_inp,
            avg_vitals_score = excluded.avg_vitals_score,
            top_device = excluded.top_device
    `;

    const pvGeoDetail = `
        INSERT INTO pv_hourly_geo_detail (project_key, hour, country, region, city, session_count, avg_lcp, avg_fcp, avg_cls, avg_inp, avg_vitals_score, top_device)
        SELECT 
            project_key,
            ${hourTimestamp} as hour,
            COALESCE(country, '') as country,
            COALESCE(region, '') as region,
            COALESCE(city, '') as city,
            COUNT(DISTINCT session_id) as session_count,
            AVG(lcp) as avg_lcp,
            AVG(fcp) as avg_fcp,
            AVG(cls) as avg_cls,
            AVG(inp) as avg_inp,
            AVG(vitals_score) as avg_vitals_score,
            (SELECT device_type FROM page_vitals pv2 WHERE pv2.project_key = page_vitals.project_key AND pv2.country = page_vitals.country AND pv2.region = page_vitals.region AND pv2.city = page_vitals.city AND pv2.timestamp >= ${hourStart} AND pv2.timestamp <= ${hourEnd} GROUP BY device_type ORDER BY COUNT(*) DESC LIMIT 1) as top_device
        FROM page_vitals
        WHERE timestamp >= ${hourStart} AND timestamp <= ${hourEnd}
        GROUP BY project_key, country, region, city
        ON CONFLICT(project_key, hour, country, region, city) DO UPDATE SET
            session_count = excluded.session_count,
            avg_lcp = excluded.avg_lcp,
            avg_fcp = excluded.avg_fcp,
            avg_cls = excluded.avg_cls,
            avg_inp = excluded.avg_inp,
            avg_vitals_score = excluded.avg_vitals_score,
            top_device = excluded.top_device
    `;

    const pvEnv = `
        INSERT INTO pv_hourly_env (project_key, hour, device_type, browser, os, connection_type, session_count, avg_lcp, avg_fcp, avg_cls, avg_inp, avg_vitals_score)
        SELECT 
            project_key,
            ${hourTimestamp} as hour,
            COALESCE(device_type, '') as device_type,
            COALESCE(browser, '') as browser,
            COALESCE(os, '') as os,
            COALESCE(connection_type, '') as connection_type,
            COUNT(DISTINCT session_id) as session_count,
            AVG(lcp) as avg_lcp,
            AVG(fcp) as avg_fcp,
            AVG(cls) as avg_cls,
            AVG(inp) as avg_inp,
            AVG(vitals_score) as avg_vitals_score
        FROM page_vitals
        WHERE timestamp >= ${hourStart} AND timestamp <= ${hourEnd}
        GROUP BY project_key, device_type, browser, os, connection_type
        ON CONFLICT(project_key, hour, device_type, browser, os, connection_type) DO UPDATE SET
            session_count = excluded.session_count,
            avg_lcp = excluded.avg_lcp,
            avg_fcp = excluded.avg_fcp,
            avg_cls = excluded.avg_cls,
            avg_inp = excluded.avg_inp,
            avg_vitals_score = excluded.avg_vitals_score
    `;

    const pvEnvGeo = `
        INSERT INTO pv_hourly_env_geo (project_key, hour, device_type, browser, os, connection_type, country, session_count, avg_lcp, avg_fcp, avg_cls, avg_inp, avg_vitals_score)
        SELECT 
            project_key,
            ${hourTimestamp} as hour,
            COALESCE(device_type, '') as device_type,
            COALESCE(browser, '') as browser,
            COALESCE(os, '') as os,
            COALESCE(connection_type, '') as connection_type,
            COALESCE(country, '') as country,
            COUNT(DISTINCT session_id) as session_count,
            AVG(lcp) as avg_lcp,
            AVG(fcp) as avg_fcp,
            AVG(cls) as avg_cls,
            AVG(inp) as avg_inp,
            AVG(vitals_score) as avg_vitals_score
        FROM page_vitals
        WHERE timestamp >= ${hourStart} AND timestamp <= ${hourEnd}
        GROUP BY project_key, device_type, browser, os, connection_type, country
        ON CONFLICT(project_key, hour, device_type, browser, os, connection_type, country) DO UPDATE SET
            session_count = excluded.session_count,
            avg_lcp = excluded.avg_lcp,
            avg_fcp = excluded.avg_fcp,
            avg_cls = excluded.avg_cls,
            avg_inp = excluded.avg_inp,
            avg_vitals_score = excluded.avg_vitals_score
    `;

    const eventDBClient = getEventDBClient();
    await eventDBClient.execute({ sql: reSummary });
    await eventDBClient.execute({ sql: reEndpoints });
    await eventDBClient.execute({ sql: reEndpointGeo });
    await eventDBClient.execute({ sql: reEndpointEnv });
    await eventDBClient.execute({ sql: reGeo });
    await eventDBClient.execute({ sql: reGeoDetail });
    await eventDBClient.execute({ sql: reEnv });
    await eventDBClient.execute({ sql: reEnvGeo });
    await eventDBClient.execute({ sql: pvSummary });
    await eventDBClient.execute({ sql: pvPages });
    await eventDBClient.execute({ sql: pvPageGeo });
    await eventDBClient.execute({ sql: pvPageEnv });
    await eventDBClient.execute({ sql: pvGeo });
    await eventDBClient.execute({ sql: pvGeoDetail });
    await eventDBClient.execute({ sql: pvEnv });
    await eventDBClient.execute({ sql: pvEnvGeo });
}

export async function aggregateDailyFromHourly(): Promise<void> {
    const dayTimestamp = getPreviousDayTimestamp();
    const dayStart = dayTimestamp;
    const dayEnd = dayTimestamp + 86399999;

    const reSummary = `
        INSERT INTO re_daily_summary (project_key, day, total_requests, error_count, avg_ttfb, avg_duration)
        SELECT 
            project_key,
            ${dayTimestamp} as day,
            SUM(total_requests) as total_requests,
            SUM(error_count) as error_count,
            SUM(avg_ttfb * total_requests) / NULLIF(SUM(total_requests), 0) as avg_ttfb,
            SUM(avg_duration * total_requests) / NULLIF(SUM(total_requests), 0) as avg_duration
        FROM re_hourly_summary
        WHERE hour >= ${dayStart} AND hour <= ${dayEnd}
        GROUP BY project_key
        ON CONFLICT(project_key, day) DO UPDATE SET
            total_requests = excluded.total_requests,
            error_count = excluded.error_count,
            avg_ttfb = excluded.avg_ttfb,
            avg_duration = excluded.avg_duration
    `;

    const reEndpoints = `
        INSERT INTO re_daily_endpoints (project_key, day, url, method, total_requests, error_count, avg_ttfb, avg_duration, avg_dns, avg_tcp, avg_tls, top_country, device_mobile_pct)
        SELECT 
            project_key,
            ${dayTimestamp} as day,
            url,
            method,
            SUM(total_requests) as total_requests,
            SUM(error_count) as error_count,
            SUM(avg_ttfb * total_requests) / NULLIF(SUM(total_requests), 0) as avg_ttfb,
            SUM(avg_duration * total_requests) / NULLIF(SUM(total_requests), 0) as avg_duration,
            SUM(avg_dns * total_requests) / NULLIF(SUM(total_requests), 0) as avg_dns,
            SUM(avg_tcp * total_requests) / NULLIF(SUM(total_requests), 0) as avg_tcp,
            SUM(avg_tls * total_requests) / NULLIF(SUM(total_requests), 0) as avg_tls,
            (SELECT top_country FROM re_hourly_endpoints WHERE project_key = re_hourly_endpoints.project_key AND url = re_hourly_endpoints.url AND method = re_hourly_endpoints.method AND hour >= ${dayStart} AND hour <= ${dayEnd} ORDER BY total_requests DESC LIMIT 1) as top_country,
            AVG(device_mobile_pct) as device_mobile_pct
        FROM re_hourly_endpoints
        WHERE hour >= ${dayStart} AND hour <= ${dayEnd}
        GROUP BY project_key, url, method
        ON CONFLICT(project_key, day, url, method) DO UPDATE SET
            total_requests = excluded.total_requests,
            error_count = excluded.error_count,
            avg_ttfb = excluded.avg_ttfb,
            avg_duration = excluded.avg_duration,
            avg_dns = excluded.avg_dns,
            avg_tcp = excluded.avg_tcp,
            avg_tls = excluded.avg_tls,
            top_country = excluded.top_country,
            device_mobile_pct = excluded.device_mobile_pct
    `;

    const reEndpointGeo = `
        INSERT INTO re_daily_endpoint_geo (project_key, day, url, method, country, total_requests, error_count, avg_ttfb, avg_duration)
        SELECT 
            project_key,
            ${dayTimestamp} as day,
            url,
            method,
            country,
            SUM(total_requests) as total_requests,
            SUM(error_count) as error_count,
            SUM(avg_ttfb * total_requests) / NULLIF(SUM(total_requests), 0) as avg_ttfb,
            SUM(avg_duration * total_requests) / NULLIF(SUM(total_requests), 0) as avg_duration
        FROM re_hourly_endpoint_geo
        WHERE hour >= ${dayStart} AND hour <= ${dayEnd}
        GROUP BY project_key, url, method, country
        ON CONFLICT(project_key, day, url, method, country) DO UPDATE SET
            total_requests = excluded.total_requests,
            error_count = excluded.error_count,
            avg_ttfb = excluded.avg_ttfb,
            avg_duration = excluded.avg_duration
    `;

    const reEndpointEnv = `
        INSERT INTO re_daily_endpoint_env (project_key, day, url, method, device_type, browser, total_requests, error_count, avg_ttfb, avg_duration)
        SELECT 
            project_key,
            ${dayTimestamp} as day,
            url,
            method,
            device_type,
            browser,
            SUM(total_requests) as total_requests,
            SUM(error_count) as error_count,
            SUM(avg_ttfb * total_requests) / NULLIF(SUM(total_requests), 0) as avg_ttfb,
            SUM(avg_duration * total_requests) / NULLIF(SUM(total_requests), 0) as avg_duration
        FROM re_hourly_endpoint_env
        WHERE hour >= ${dayStart} AND hour <= ${dayEnd}
        GROUP BY project_key, url, method, device_type, browser
        ON CONFLICT(project_key, day, url, method, device_type, browser) DO UPDATE SET
            total_requests = excluded.total_requests,
            error_count = excluded.error_count,
            avg_ttfb = excluded.avg_ttfb,
            avg_duration = excluded.avg_duration
    `;

    const reGeo = `
        INSERT INTO re_daily_geo (project_key, day, country, total_requests, error_count, avg_ttfb, avg_duration, top_device)
        SELECT 
            project_key,
            ${dayTimestamp} as day,
            country,
            SUM(total_requests) as total_requests,
            SUM(error_count) as error_count,
            SUM(avg_ttfb * total_requests) / NULLIF(SUM(total_requests), 0) as avg_ttfb,
            SUM(avg_duration * total_requests) / NULLIF(SUM(total_requests), 0) as avg_duration,
            (SELECT top_device FROM re_hourly_geo WHERE project_key = re_hourly_geo.project_key AND country = re_hourly_geo.country AND hour >= ${dayStart} AND hour <= ${dayEnd} ORDER BY total_requests DESC LIMIT 1) as top_device
        FROM re_hourly_geo
        WHERE hour >= ${dayStart} AND hour <= ${dayEnd}
        GROUP BY project_key, country
        ON CONFLICT(project_key, day, country) DO UPDATE SET
            total_requests = excluded.total_requests,
            error_count = excluded.error_count,
            avg_ttfb = excluded.avg_ttfb,
            avg_duration = excluded.avg_duration,
            top_device = excluded.top_device
    `;

    const reGeoDetail = `
        INSERT INTO re_daily_geo_detail (project_key, day, country, region, city, total_requests, error_count, avg_ttfb, avg_duration, top_device)
        SELECT 
            project_key,
            ${dayTimestamp} as day,
            country,
            region,
            city,
            SUM(total_requests) as total_requests,
            SUM(error_count) as error_count,
            SUM(avg_ttfb * total_requests) / NULLIF(SUM(total_requests), 0) as avg_ttfb,
            SUM(avg_duration * total_requests) / NULLIF(SUM(total_requests), 0) as avg_duration,
            (SELECT top_device FROM re_hourly_geo_detail WHERE project_key = re_hourly_geo_detail.project_key AND country = re_hourly_geo_detail.country AND region = re_hourly_geo_detail.region AND city = re_hourly_geo_detail.city AND hour >= ${dayStart} AND hour <= ${dayEnd} ORDER BY total_requests DESC LIMIT 1) as top_device
        FROM re_hourly_geo_detail
        WHERE hour >= ${dayStart} AND hour <= ${dayEnd}
        GROUP BY project_key, country, region, city
        ON CONFLICT(project_key, day, country, region, city) DO UPDATE SET
            total_requests = excluded.total_requests,
            error_count = excluded.error_count,
            avg_ttfb = excluded.avg_ttfb,
            avg_duration = excluded.avg_duration,
            top_device = excluded.top_device
    `;

    const reEnv = `
        INSERT INTO re_daily_env (project_key, day, device_type, browser, os, connection_type, total_requests, error_count, avg_ttfb, avg_duration)
        SELECT 
            project_key,
            ${dayTimestamp} as day,
            device_type,
            browser,
            os,
            connection_type,
            SUM(total_requests) as total_requests,
            SUM(error_count) as error_count,
            SUM(avg_ttfb * total_requests) / NULLIF(SUM(total_requests), 0) as avg_ttfb,
            SUM(avg_duration * total_requests) / NULLIF(SUM(total_requests), 0) as avg_duration
        FROM re_hourly_env
        WHERE hour >= ${dayStart} AND hour <= ${dayEnd}
        GROUP BY project_key, device_type, browser, os, connection_type
        ON CONFLICT(project_key, day, device_type, browser, os, connection_type) DO UPDATE SET
            total_requests = excluded.total_requests,
            error_count = excluded.error_count,
            avg_ttfb = excluded.avg_ttfb,
            avg_duration = excluded.avg_duration
    `;

    const reEnvGeo = `
        INSERT INTO re_daily_env_geo (project_key, day, device_type, browser, os, connection_type, country, total_requests, error_count, avg_ttfb)
        SELECT 
            project_key,
            ${dayTimestamp} as day,
            device_type,
            browser,
            os,
            connection_type,
            country,
            SUM(total_requests) as total_requests,
            SUM(error_count) as error_count,
            SUM(avg_ttfb * total_requests) / NULLIF(SUM(total_requests), 0) as avg_ttfb
        FROM re_hourly_env_geo
        WHERE hour >= ${dayStart} AND hour <= ${dayEnd}
        GROUP BY project_key, device_type, browser, os, connection_type, country
        ON CONFLICT(project_key, day, device_type, browser, os, connection_type, country) DO UPDATE SET
            total_requests = excluded.total_requests,
            error_count = excluded.error_count,
            avg_ttfb = excluded.avg_ttfb
    `;

    const pvSummary = `
        INSERT INTO pv_daily_summary (project_key, day, session_count, avg_lcp, avg_fcp, avg_cls, avg_inp, avg_vitals_score)
        SELECT 
            project_key,
            ${dayTimestamp} as day,
            SUM(session_count) as session_count,
            SUM(avg_lcp * session_count) / NULLIF(SUM(session_count), 0) as avg_lcp,
            SUM(avg_fcp * session_count) / NULLIF(SUM(session_count), 0) as avg_fcp,
            SUM(avg_cls * session_count) / NULLIF(SUM(session_count), 0) as avg_cls,
            SUM(avg_inp * session_count) / NULLIF(SUM(session_count), 0) as avg_inp,
            SUM(avg_vitals_score * session_count) / NULLIF(SUM(session_count), 0) as avg_vitals_score
        FROM pv_hourly_summary
        WHERE hour >= ${dayStart} AND hour <= ${dayEnd}
        GROUP BY project_key
        ON CONFLICT(project_key, day) DO UPDATE SET
            session_count = excluded.session_count,
            avg_lcp = excluded.avg_lcp,
            avg_fcp = excluded.avg_fcp,
            avg_cls = excluded.avg_cls,
            avg_inp = excluded.avg_inp,
            avg_vitals_score = excluded.avg_vitals_score
    `;

    const pvPages = `
        INSERT INTO pv_daily_pages (project_key, day, page_url, session_count, avg_lcp, avg_fcp, avg_cls, avg_inp, avg_vitals_score, top_country, device_mobile_pct)
        SELECT 
            project_key,
            ${dayTimestamp} as day,
            page_url,
            SUM(session_count) as session_count,
            SUM(avg_lcp * session_count) / NULLIF(SUM(session_count), 0) as avg_lcp,
            SUM(avg_fcp * session_count) / NULLIF(SUM(session_count), 0) as avg_fcp,
            SUM(avg_cls * session_count) / NULLIF(SUM(session_count), 0) as avg_cls,
            SUM(avg_inp * session_count) / NULLIF(SUM(session_count), 0) as avg_inp,
            SUM(avg_vitals_score * session_count) / NULLIF(SUM(session_count), 0) as avg_vitals_score,
            (SELECT top_country FROM pv_hourly_pages WHERE project_key = pv_hourly_pages.project_key AND page_url = pv_hourly_pages.page_url AND hour >= ${dayStart} AND hour <= ${dayEnd} ORDER BY session_count DESC LIMIT 1) as top_country,
            AVG(device_mobile_pct) as device_mobile_pct
        FROM pv_hourly_pages
        WHERE hour >= ${dayStart} AND hour <= ${dayEnd}
        GROUP BY project_key, page_url
        ON CONFLICT(project_key, day, page_url) DO UPDATE SET
            session_count = excluded.session_count,
            avg_lcp = excluded.avg_lcp,
            avg_fcp = excluded.avg_fcp,
            avg_cls = excluded.avg_cls,
            avg_inp = excluded.avg_inp,
            avg_vitals_score = excluded.avg_vitals_score,
            top_country = excluded.top_country,
            device_mobile_pct = excluded.device_mobile_pct
    `;

    const pvPageGeo = `
        INSERT INTO pv_daily_page_geo (project_key, day, page_url, country, session_count, avg_lcp, avg_fcp, avg_cls, avg_inp, avg_vitals_score)
        SELECT 
            project_key,
            ${dayTimestamp} as day,
            page_url,
            country,
            SUM(session_count) as session_count,
            SUM(avg_lcp * session_count) / NULLIF(SUM(session_count), 0) as avg_lcp,
            SUM(avg_fcp * session_count) / NULLIF(SUM(session_count), 0) as avg_fcp,
            SUM(avg_cls * session_count) / NULLIF(SUM(session_count), 0) as avg_cls,
            SUM(avg_inp * session_count) / NULLIF(SUM(session_count), 0) as avg_inp,
            SUM(avg_vitals_score * session_count) / NULLIF(SUM(session_count), 0) as avg_vitals_score
        FROM pv_hourly_page_geo
        WHERE hour >= ${dayStart} AND hour <= ${dayEnd}
        GROUP BY project_key, page_url, country
        ON CONFLICT(project_key, day, page_url, country) DO UPDATE SET
            session_count = excluded.session_count,
            avg_lcp = excluded.avg_lcp,
            avg_fcp = excluded.avg_fcp,
            avg_cls = excluded.avg_cls,
            avg_inp = excluded.avg_inp,
            avg_vitals_score = excluded.avg_vitals_score
    `;

    const pvPageEnv = `
        INSERT INTO pv_daily_page_env (project_key, day, page_url, device_type, browser, session_count, avg_lcp, avg_fcp, avg_cls, avg_inp, avg_vitals_score)
        SELECT 
            project_key,
            ${dayTimestamp} as day,
            page_url,
            device_type,
            browser,
            SUM(session_count) as session_count,
            SUM(avg_lcp * session_count) / NULLIF(SUM(session_count), 0) as avg_lcp,
            SUM(avg_fcp * session_count) / NULLIF(SUM(session_count), 0) as avg_fcp,
            SUM(avg_cls * session_count) / NULLIF(SUM(session_count), 0) as avg_cls,
            SUM(avg_inp * session_count) / NULLIF(SUM(session_count), 0) as avg_inp,
            SUM(avg_vitals_score * session_count) / NULLIF(SUM(session_count), 0) as avg_vitals_score
        FROM pv_hourly_page_env
        WHERE hour >= ${dayStart} AND hour <= ${dayEnd}
        GROUP BY project_key, page_url, device_type, browser
        ON CONFLICT(project_key, day, page_url, device_type, browser) DO UPDATE SET
            session_count = excluded.session_count,
            avg_lcp = excluded.avg_lcp,
            avg_fcp = excluded.avg_fcp,
            avg_cls = excluded.avg_cls,
            avg_inp = excluded.avg_inp,
            avg_vitals_score = excluded.avg_vitals_score
    `;

    const pvGeo = `
        INSERT INTO pv_daily_geo (project_key, day, country, session_count, avg_lcp, avg_fcp, avg_cls, avg_inp, avg_vitals_score, top_device)
        SELECT 
            project_key,
            ${dayTimestamp} as day,
            country,
            SUM(session_count) as session_count,
            SUM(avg_lcp * session_count) / NULLIF(SUM(session_count), 0) as avg_lcp,
            SUM(avg_fcp * session_count) / NULLIF(SUM(session_count), 0) as avg_fcp,
            SUM(avg_cls * session_count) / NULLIF(SUM(session_count), 0) as avg_cls,
            SUM(avg_inp * session_count) / NULLIF(SUM(session_count), 0) as avg_inp,
            SUM(avg_vitals_score * session_count) / NULLIF(SUM(session_count), 0) as avg_vitals_score,
            (SELECT top_device FROM pv_hourly_geo WHERE project_key = pv_hourly_geo.project_key AND country = pv_hourly_geo.country AND hour >= ${dayStart} AND hour <= ${dayEnd} ORDER BY session_count DESC LIMIT 1) as top_device
        FROM pv_hourly_geo
        WHERE hour >= ${dayStart} AND hour <= ${dayEnd}
        GROUP BY project_key, country
        ON CONFLICT(project_key, day, country) DO UPDATE SET
            session_count = excluded.session_count,
            avg_lcp = excluded.avg_lcp,
            avg_fcp = excluded.avg_fcp,
            avg_cls = excluded.avg_cls,
            avg_inp = excluded.avg_inp,
            avg_vitals_score = excluded.avg_vitals_score,
            top_device = excluded.top_device
    `;

    const pvGeoDetail = `
        INSERT INTO pv_daily_geo_detail (project_key, day, country, region, city, session_count, avg_lcp, avg_fcp, avg_cls, avg_inp, avg_vitals_score, top_device)
        SELECT 
            project_key,
            ${dayTimestamp} as day,
            country,
            region,
            city,
            SUM(session_count) as session_count,
            SUM(avg_lcp * session_count) / NULLIF(SUM(session_count), 0) as avg_lcp,
            SUM(avg_fcp * session_count) / NULLIF(SUM(session_count), 0) as avg_fcp,
            SUM(avg_cls * session_count) / NULLIF(SUM(session_count), 0) as avg_cls,
            SUM(avg_inp * session_count) / NULLIF(SUM(session_count), 0) as avg_inp,
            SUM(avg_vitals_score * session_count) / NULLIF(SUM(session_count), 0) as avg_vitals_score,
            (SELECT top_device FROM pv_hourly_geo_detail WHERE project_key = pv_hourly_geo_detail.project_key AND country = pv_hourly_geo_detail.country AND region = pv_hourly_geo_detail.region AND city = pv_hourly_geo_detail.city AND hour >= ${dayStart} AND hour <= ${dayEnd} ORDER BY session_count DESC LIMIT 1) as top_device
        FROM pv_hourly_geo_detail
        WHERE hour >= ${dayStart} AND hour <= ${dayEnd}
        GROUP BY project_key, country, region, city
        ON CONFLICT(project_key, day, country, region, city) DO UPDATE SET
            session_count = excluded.session_count,
            avg_lcp = excluded.avg_lcp,
            avg_fcp = excluded.avg_fcp,
            avg_cls = excluded.avg_cls,
            avg_inp = excluded.avg_inp,
            avg_vitals_score = excluded.avg_vitals_score,
            top_device = excluded.top_device
    `;

    const pvEnv = `
        INSERT INTO pv_daily_env (project_key, day, device_type, browser, os, connection_type, session_count, avg_lcp, avg_fcp, avg_cls, avg_inp, avg_vitals_score)
        SELECT 
            project_key,
            ${dayTimestamp} as day,
            device_type,
            browser,
            os,
            connection_type,
            SUM(session_count) as session_count,
            SUM(avg_lcp * session_count) / NULLIF(SUM(session_count), 0) as avg_lcp,
            SUM(avg_fcp * session_count) / NULLIF(SUM(session_count), 0) as avg_fcp,
            SUM(avg_cls * session_count) / NULLIF(SUM(session_count), 0) as avg_cls,
            SUM(avg_inp * session_count) / NULLIF(SUM(session_count), 0) as avg_inp,
            SUM(avg_vitals_score * session_count) / NULLIF(SUM(session_count), 0) as avg_vitals_score
        FROM pv_hourly_env
        WHERE hour >= ${dayStart} AND hour <= ${dayEnd}
        GROUP BY project_key, device_type, browser, os, connection_type
        ON CONFLICT(project_key, day, device_type, browser, os, connection_type) DO UPDATE SET
            session_count = excluded.session_count,
            avg_lcp = excluded.avg_lcp,
            avg_fcp = excluded.avg_fcp,
            avg_cls = excluded.avg_cls,
            avg_inp = excluded.avg_inp,
            avg_vitals_score = excluded.avg_vitals_score
    `;

    const pvEnvGeo = `
        INSERT INTO pv_daily_env_geo (project_key, day, device_type, browser, os, connection_type, country, session_count, avg_lcp, avg_fcp, avg_cls, avg_inp, avg_vitals_score)
        SELECT 
            project_key,
            ${dayTimestamp} as day,
            device_type,
            browser,
            os,
            connection_type,
            country,
            SUM(session_count) as session_count,
            SUM(avg_lcp * session_count) / NULLIF(SUM(session_count), 0) as avg_lcp,
            SUM(avg_fcp * session_count) / NULLIF(SUM(session_count), 0) as avg_fcp,
            SUM(avg_cls * session_count) / NULLIF(SUM(session_count), 0) as avg_cls,
            SUM(avg_inp * session_count) / NULLIF(SUM(session_count), 0) as avg_inp,
            SUM(avg_vitals_score * session_count) / NULLIF(SUM(session_count), 0) as avg_vitals_score
        FROM pv_hourly_env_geo
        WHERE hour >= ${dayStart} AND hour <= ${dayEnd}
        GROUP BY project_key, device_type, browser, os, connection_type, country
        ON CONFLICT(project_key, day, device_type, browser, os, connection_type, country) DO UPDATE SET
            session_count = excluded.session_count,
            avg_lcp = excluded.avg_lcp,
            avg_fcp = excluded.avg_fcp,
            avg_cls = excluded.avg_cls,
            avg_inp = excluded.avg_inp,
            avg_vitals_score = excluded.avg_vitals_score
    `;

    const eventDBClient = getEventDBClient();
    await eventDBClient.execute({ sql: reSummary });
    await eventDBClient.execute({ sql: reEndpoints });
    await eventDBClient.execute({ sql: reEndpointGeo });
    await eventDBClient.execute({ sql: reEndpointEnv });
    await eventDBClient.execute({ sql: reGeo });
    await eventDBClient.execute({ sql: reGeoDetail });
    await eventDBClient.execute({ sql: reEnv });
    await eventDBClient.execute({ sql: reEnvGeo });
    await eventDBClient.execute({ sql: pvSummary });
    await eventDBClient.execute({ sql: pvPages });
    await eventDBClient.execute({ sql: pvPageGeo });
    await eventDBClient.execute({ sql: pvPageEnv });
    await eventDBClient.execute({ sql: pvGeo });
    await eventDBClient.execute({ sql: pvGeoDetail });
    await eventDBClient.execute({ sql: pvEnv });
    await eventDBClient.execute({ sql: pvEnvGeo });
}

export async function cleanupHourlyRollups(): Promise<void> {
    const cutoff24h = Date.now() - 24 * 60 * 60 * 1000;
    const eventDBClient = getEventDBClient();
    await Promise.all(
        HOURLY_TABLES.map(table => eventDBClient.execute({ sql: `DELETE FROM ${table} WHERE hour < ${cutoff24h}` }))
    );
}

export async function cleanupOldData(): Promise<void> {
    const cutoff32Days = getCutoffTimestamp(RETENTION.events_max_days);
    const eventDBClient = getEventDBClient();
    await Promise.all([
        ...RAW_TABLES.map(table =>
            eventDBClient.execute({ sql: `DELETE FROM ${table} WHERE timestamp < ${cutoff32Days}` })
        ),
        ...DAILY_TABLES.map(table =>
            eventDBClient.execute({ sql: `DELETE FROM ${table} WHERE day < ${cutoff32Days}` })
        ),
    ]);
}

export async function fetchRollupTables(
    userId: string,
    projectId: string,
    timeRange: TimeRange,
    tableNames: string[]
): Promise<ApiResponse<Record<string, unknown[]>>> {
    const eventDBClient = getEventDBClient();
    const mainDB = getMainDB();
    const [project, userPlan] = await Promise.all([
        mainDB.query.projects.findFirst({ where: eq(projects.id, projectId) }),
        mainDB.query.plans.findFirst({ where: eq(plans.user_id, userId) }),
    ]);
    
    if (!project || project.user_id !== userId) {
        throw new APIErrorResponse("UnauthorizedUserError", "Forbidden", "Project not found or access denied", 403);
    }

    const planType = (userPlan?.type ?? 'free') as keyof typeof constants.plans.PLAN_LIMITS;
    const allowedTimeRanges: TimeRange[] = [...constants.plans.PLAN_LIMITS[planType].time_ranges];

    if (!allowedTimeRanges.includes(timeRange)) {
        throw new APIErrorResponse("LimitExceeded", "Forbidden", `Time range '${timeRange}' not allowed for your plan`, 403);
    }

    const now = Date.now();
    const isHourly = timeRange === '12h' || timeRange === '24h';
    const days = parseInt(timeRange.replace('h', '').replace('d', ''));
    const isDays = timeRange.includes('d');
    const rangeMs = isDays ? days * 24 * 60 * 60 * 1000 : days * 60 * 60 * 1000;
    const startTime = now - rangeMs;

    const data: Record<string, any[]> = {};

    const queries = tableNames.map(async (tableName) => {
        const validTables = isHourly ? new Set(HOURLY_TABLES) : new Set(DAILY_TABLES);

        if (!validTables.has(tableName)) {
            return { tableName, data: [] };
        }

        const timeColumn = isHourly ? 'hour' : 'day';
        const sql = `SELECT * FROM ${tableName} WHERE project_key = ? AND ${timeColumn} >= ? AND ${timeColumn} <= ?`;

        const result = await eventDBClient.execute({
            sql,
            args: [project.project_key, startTime, now],
        });

        return { tableName, data: result.rows };
    });

    const results = await Promise.all(queries);

    for (const { tableName, data: tableData } of results) {
        data[tableName] = tableData;
    }

    return okResponse(data, "Data fetched successfully");
}
