import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const reHourlySummary = sqliteTable('re_hourly_summary', {
    project_key: text('project_key').notNull(),
    hour: integer('hour').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb: real('avg_ttfb'),
    avg_duration: real('avg_duration'),
});

export const reDailySummary = sqliteTable('re_daily_summary', {
    project_key: text('project_key').notNull(),
    day: integer('day').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb: real('avg_ttfb'),
    avg_duration: real('avg_duration'),
});

export const reHourlyEndpoints = sqliteTable('re_hourly_endpoints', {
    project_key: text('project_key').notNull(),
    hour: integer('hour').notNull(),
    url: text('url').notNull(),
    method: text('method').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb: real('avg_ttfb'),
    avg_duration: real('avg_duration'),
    avg_dns: real('avg_dns'),
    avg_tcp: real('avg_tcp'),
    avg_tls: real('avg_tls'),
    top_country: text('top_country'),
    device_mobile_pct: real('device_mobile_pct'),
});

export const reDailyEndpoints = sqliteTable('re_daily_endpoints', {
    project_key: text('project_key').notNull(),
    day: integer('day').notNull(),
    url: text('url').notNull(),
    method: text('method').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb: real('avg_ttfb'),
    avg_duration: real('avg_duration'),
    avg_dns: real('avg_dns'),
    avg_tcp: real('avg_tcp'),
    avg_tls: real('avg_tls'),
    top_country: text('top_country'),
    device_mobile_pct: real('device_mobile_pct'),
});

export const reHourlyEndpointGeo = sqliteTable('re_hourly_endpoint_geo', {
    project_key: text('project_key').notNull(),
    hour: integer('hour').notNull(),
    url: text('url').notNull(),
    method: text('method').notNull(),
    country: text('country').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb: real('avg_ttfb'),
    avg_duration: real('avg_duration'),
});

export const reDailyEndpointGeo = sqliteTable('re_daily_endpoint_geo', {
    project_key: text('project_key').notNull(),
    day: integer('day').notNull(),
    url: text('url').notNull(),
    method: text('method').notNull(),
    country: text('country').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb: real('avg_ttfb'),
    avg_duration: real('avg_duration'),
});

export const reHourlyEndpointEnv = sqliteTable('re_hourly_endpoint_env', {
    project_key: text('project_key').notNull(),
    hour: integer('hour').notNull(),
    url: text('url').notNull(),
    method: text('method').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb: real('avg_ttfb'),
    avg_duration: real('avg_duration'),
});

export const reDailyEndpointEnv = sqliteTable('re_daily_endpoint_env', {
    project_key: text('project_key').notNull(),
    day: integer('day').notNull(),
    url: text('url').notNull(),
    method: text('method').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb: real('avg_ttfb'),
    avg_duration: real('avg_duration'),
});

export const reHourlyGeo = sqliteTable('re_hourly_geo', {
    project_key: text('project_key').notNull(),
    hour: integer('hour').notNull(),
    country: text('country').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb: real('avg_ttfb'),
    avg_duration: real('avg_duration'),
    top_device: text('top_device'),
});

export const reDailyGeo = sqliteTable('re_daily_geo', {
    project_key: text('project_key').notNull(),
    day: integer('day').notNull(),
    country: text('country').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb: real('avg_ttfb'),
    avg_duration: real('avg_duration'),
    top_device: text('top_device'),
});

export const reHourlyGeoDetail = sqliteTable('re_hourly_geo_detail', {
    project_key: text('project_key').notNull(),
    hour: integer('hour').notNull(),
    country: text('country').notNull(),
    region: text('region'),
    city: text('city'),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb: real('avg_ttfb'),
    avg_duration: real('avg_duration'),
    top_device: text('top_device'),
});

export const reDailyGeoDetail = sqliteTable('re_daily_geo_detail', {
    project_key: text('project_key').notNull(),
    day: integer('day').notNull(),
    country: text('country').notNull(),
    region: text('region'),
    city: text('city'),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb: real('avg_ttfb'),
    avg_duration: real('avg_duration'),
    top_device: text('top_device'),
});

export const reHourlyEnv = sqliteTable('re_hourly_env', {
    project_key: text('project_key').notNull(),
    hour: integer('hour').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    os: text('os'),
    connection_type: text('connection_type'),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb: real('avg_ttfb'),
    avg_duration: real('avg_duration'),
});

export const reDailyEnv = sqliteTable('re_daily_env', {
    project_key: text('project_key').notNull(),
    day: integer('day').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    os: text('os'),
    connection_type: text('connection_type'),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb: real('avg_ttfb'),
    avg_duration: real('avg_duration'),
});

export const reHourlyEnvGeo = sqliteTable('re_hourly_env_geo', {
    project_key: text('project_key').notNull(),
    hour: integer('hour').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    os: text('os'),
    connection_type: text('connection_type'),
    country: text('country').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb: real('avg_ttfb'),
});

export const reDailyEnvGeo = sqliteTable('re_daily_env_geo', {
    project_key: text('project_key').notNull(),
    day: integer('day').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    os: text('os'),
    connection_type: text('connection_type'),
    country: text('country').notNull(),
    total_requests: integer('total_requests').notNull(),
    error_count: integer('error_count').notNull(),
    avg_ttfb: real('avg_ttfb'),
});
