import { integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// --- SUMMARY -----------------------------------------------------------------------

export const reHourlySummary = sqliteTable('re_hourly_summary', {
    project_key: text('project_key').notNull(),
    hour_at: integer('hour_at').notNull(),          // unix timestamp (ms) — start of hour
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb_ms: real('avg_ttfb_ms'),
    avg_duration_ms: real('avg_duration_ms'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.hour_at] }),
]);

export const reDailySummary = sqliteTable('re_daily_summary', {
    project_key: text('project_key').notNull(),
    day_at: integer('day_at').notNull(),            // unix timestamp (ms) — start of day
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb_ms: real('avg_ttfb_ms'),
    avg_duration_ms: real('avg_duration_ms'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.day_at] }),
]);

// --- ENDPOINTS -----------------------------------------------------------------------

export const reHourlyEndpoints = sqliteTable('re_hourly_endpoints', {
    project_key: text('project_key').notNull(),
    hour_at: integer('hour_at').notNull(),
    url: text('url').notNull(),
    method: text('method').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb_ms: real('avg_ttfb_ms'),
    avg_duration_ms: real('avg_duration_ms'),
    avg_dns_ms: real('avg_dns_ms'),
    avg_tcp_ms: real('avg_tcp_ms'),
    avg_tls_ms: real('avg_tls_ms'),
    top_country: text('top_country'),
    device_mobile_pct: real('device_mobile_pct'),   // 0.0 - 1.0
}, (t) => [
    primaryKey({ columns: [t.project_key, t.hour_at, t.url, t.method] }),
]);

export const reDailyEndpoints = sqliteTable('re_daily_endpoints', {
    project_key: text('project_key').notNull(),
    day_at: integer('day_at').notNull(),
    url: text('url').notNull(),
    method: text('method').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb_ms: real('avg_ttfb_ms'),
    avg_duration_ms: real('avg_duration_ms'),
    avg_dns_ms: real('avg_dns_ms'),
    avg_tcp_ms: real('avg_tcp_ms'),
    avg_tls_ms: real('avg_tls_ms'),
    top_country: text('top_country'),
    device_mobile_pct: real('device_mobile_pct'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.day_at, t.url, t.method] }),
]);

// --- ENDPOINT GEO -----------------------------------------------------------------------

export const reHourlyEndpointGeo = sqliteTable('re_hourly_endpoint_geo', {
    project_key: text('project_key').notNull(),
    hour_at: integer('hour_at').notNull(),
    url: text('url').notNull(),
    method: text('method').notNull(),
    country: text('country').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb_ms: real('avg_ttfb_ms'),
    avg_duration_ms: real('avg_duration_ms'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.hour_at, t.url, t.method, t.country] }),
]);

export const reDailyEndpointGeo = sqliteTable('re_daily_endpoint_geo', {
    project_key: text('project_key').notNull(),
    day_at: integer('day_at').notNull(),
    url: text('url').notNull(),
    method: text('method').notNull(),
    country: text('country').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb_ms: real('avg_ttfb_ms'),
    avg_duration_ms: real('avg_duration_ms'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.day_at, t.url, t.method, t.country] }),
]);

// --- ENDPOINT ENV -----------------------------------------------------------------------

export const reHourlyEndpointEnv = sqliteTable('re_hourly_endpoint_env', {
    project_key: text('project_key').notNull(),
    hour_at: integer('hour_at').notNull(),
    url: text('url').notNull(),
    method: text('method').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb_ms: real('avg_ttfb_ms'),
    avg_duration_ms: real('avg_duration_ms'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.hour_at, t.url, t.method, t.device_type, t.browser] }),
]);

export const reDailyEndpointEnv = sqliteTable('re_daily_endpoint_env', {
    project_key: text('project_key').notNull(),
    day_at: integer('day_at').notNull(),
    url: text('url').notNull(),
    method: text('method').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb_ms: real('avg_ttfb_ms'),
    avg_duration_ms: real('avg_duration_ms'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.day_at, t.url, t.method, t.device_type, t.browser] }),
]);

// --- GEO -----------------------------------------------------------------------

export const reHourlyGeo = sqliteTable('re_hourly_geo', {
    project_key: text('project_key').notNull(),
    hour_at: integer('hour_at').notNull(),
    country: text('country').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb_ms: real('avg_ttfb_ms'),
    avg_duration_ms: real('avg_duration_ms'),
    top_device: text('top_device'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.hour_at, t.country] }),
]);

export const reDailyGeo = sqliteTable('re_daily_geo', {
    project_key: text('project_key').notNull(),
    day_at: integer('day_at').notNull(),
    country: text('country').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb_ms: real('avg_ttfb_ms'),
    avg_duration_ms: real('avg_duration_ms'),
    top_device: text('top_device'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.day_at, t.country] }),
]);

// --- GEO DETAIL -----------------------------------------------------------------------

export const reHourlyGeoDetail = sqliteTable('re_hourly_geo_detail', {
    project_key: text('project_key').notNull(),
    hour_at: integer('hour_at').notNull(),
    country: text('country').notNull(),
    region: text('region'),
    city: text('city'),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb_ms: real('avg_ttfb_ms'),
    avg_duration_ms: real('avg_duration_ms'),
    top_device: text('top_device'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.hour_at, t.country, t.region, t.city] }),
]);

export const reDailyGeoDetail = sqliteTable('re_daily_geo_detail', {
    project_key: text('project_key').notNull(),
    day_at: integer('day_at').notNull(),
    country: text('country').notNull(),
    region: text('region'),
    city: text('city'),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb_ms: real('avg_ttfb_ms'),
    avg_duration_ms: real('avg_duration_ms'),
    top_device: text('top_device'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.day_at, t.country, t.region, t.city] }),
]);

// --- ENV -----------------------------------------------------------------------

export const reHourlyEnv = sqliteTable('re_hourly_env', {
    project_key: text('project_key').notNull(),
    hour_at: integer('hour_at').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    os: text('os'),
    connection_type: text('connection_type'),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb_ms: real('avg_ttfb_ms'),
    avg_duration_ms: real('avg_duration_ms'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.hour_at, t.device_type, t.browser, t.os, t.connection_type] }),
]);

export const reDailyEnv = sqliteTable('re_daily_env', {
    project_key: text('project_key').notNull(),
    day_at: integer('day_at').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    os: text('os'),
    connection_type: text('connection_type'),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb_ms: real('avg_ttfb_ms'),
    avg_duration_ms: real('avg_duration_ms'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.day_at, t.device_type, t.browser, t.os, t.connection_type] }),
]);

// --- ENV GEO -----------------------------------------------------------------------

export const reHourlyEnvGeo = sqliteTable('re_hourly_env_geo', {
    project_key: text('project_key').notNull(),
    hour_at: integer('hour_at').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    os: text('os'),
    connection_type: text('connection_type'),
    country: text('country').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb_ms: real('avg_ttfb_ms'),
    avg_duration_ms: real('avg_duration_ms'),   // was missing in original reHourlyEnvGeo
}, (t) => [
    primaryKey({ columns: [t.project_key, t.hour_at, t.device_type, t.browser, t.os, t.connection_type, t.country] }),
]);

export const reDailyEnvGeo = sqliteTable('re_daily_env_geo', {
    project_key: text('project_key').notNull(),
    day_at: integer('day_at').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    os: text('os'),
    connection_type: text('connection_type'),
    country: text('country').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb_ms: real('avg_ttfb_ms'),
    avg_duration_ms: real('avg_duration_ms'),   // was missing in original reDailyEnvGeo
}, (t) => [
    primaryKey({ columns: [t.project_key, t.day_at, t.device_type, t.browser, t.os, t.connection_type, t.country] }),
]);