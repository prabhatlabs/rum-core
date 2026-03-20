import { integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// --- SUMMARY --------------------------------------------------------------------------

export const pvHourlySummary = sqliteTable('pv_hourly_summary', {
    project_key: text('project_key').notNull(),
    hour_at: integer('hour_at').notNull(),          // unix timestamp (ms) — start of hour
    session_count: integer('session_count').notNull(),
    avg_lcp_ms: real('avg_lcp_ms'),
    avg_fcp_ms: real('avg_fcp_ms'),
    avg_cls_score: real('avg_cls_score'),
    avg_inp_ms: real('avg_inp_ms'),
    avg_vitals_score: real('avg_vitals_score'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.hour_at] }),
]);

export const pvDailySummary = sqliteTable('pv_daily_summary', {
    project_key: text('project_key').notNull(),
    day_at: integer('day_at').notNull(),            // unix timestamp (ms) — start of day
    session_count: integer('session_count').notNull(),
    avg_lcp_ms: real('avg_lcp_ms'),
    avg_fcp_ms: real('avg_fcp_ms'),
    avg_cls_score: real('avg_cls_score'),
    avg_inp_ms: real('avg_inp_ms'),
    avg_vitals_score: real('avg_vitals_score'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.day_at] }),
]);

// --- PAGES --------------------------------------------------------------------------

export const pvHourlyPages = sqliteTable('pv_hourly_pages', {
    project_key: text('project_key').notNull(),
    hour_at: integer('hour_at').notNull(),
    page_url: text('page_url').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp_ms: real('avg_lcp_ms'),
    avg_fcp_ms: real('avg_fcp_ms'),
    avg_cls_score: real('avg_cls_score'),
    avg_inp_ms: real('avg_inp_ms'),
    avg_vitals_score: real('avg_vitals_score'),
    top_country: text('top_country'),
    device_mobile_pct: real('device_mobile_pct'),   // 0.0 - 1.0
}, (t) => [
    primaryKey({ columns: [t.project_key, t.hour_at, t.page_url] }),
]);

export const pvDailyPages = sqliteTable('pv_daily_pages', {
    project_key: text('project_key').notNull(),
    day_at: integer('day_at').notNull(),
    page_url: text('page_url').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp_ms: real('avg_lcp_ms'),
    avg_fcp_ms: real('avg_fcp_ms'),
    avg_cls_score: real('avg_cls_score'),
    avg_inp_ms: real('avg_inp_ms'),
    avg_vitals_score: real('avg_vitals_score'),
    top_country: text('top_country'),
    device_mobile_pct: real('device_mobile_pct'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.day_at, t.page_url] }),
]);

// --- PAGE GEO --------------------------------------------------------------------------

export const pvHourlyPageGeo = sqliteTable('pv_hourly_page_geo', {
    project_key: text('project_key').notNull(),
    hour_at: integer('hour_at').notNull(),
    page_url: text('page_url').notNull(),
    country: text('country').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp_ms: real('avg_lcp_ms'),
    avg_fcp_ms: real('avg_fcp_ms'),
    avg_cls_score: real('avg_cls_score'),
    avg_inp_ms: real('avg_inp_ms'),
    avg_vitals_score: real('avg_vitals_score'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.hour_at, t.page_url, t.country] }),
]);

export const pvDailyPageGeo = sqliteTable('pv_daily_page_geo', {
    project_key: text('project_key').notNull(),
    day_at: integer('day_at').notNull(),
    page_url: text('page_url').notNull(),
    country: text('country').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp_ms: real('avg_lcp_ms'),
    avg_fcp_ms: real('avg_fcp_ms'),
    avg_cls_score: real('avg_cls_score'),
    avg_inp_ms: real('avg_inp_ms'),
    avg_vitals_score: real('avg_vitals_score'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.day_at, t.page_url, t.country] }),
]);

// --- PAGE ENV --------------------------------------------------------------------------

export const pvHourlyPageEnv = sqliteTable('pv_hourly_page_env', {
    project_key: text('project_key').notNull(),
    hour_at: integer('hour_at').notNull(),
    page_url: text('page_url').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    session_count: integer('session_count').notNull(),
    avg_lcp_ms: real('avg_lcp_ms'),
    avg_fcp_ms: real('avg_fcp_ms'),
    avg_cls_score: real('avg_cls_score'),
    avg_inp_ms: real('avg_inp_ms'),
    avg_vitals_score: real('avg_vitals_score'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.hour_at, t.page_url, t.device_type, t.browser] }),
]);

export const pvDailyPageEnv = sqliteTable('pv_daily_page_env', {
    project_key: text('project_key').notNull(),
    day_at: integer('day_at').notNull(),
    page_url: text('page_url').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    session_count: integer('session_count').notNull(),
    avg_lcp_ms: real('avg_lcp_ms'),
    avg_fcp_ms: real('avg_fcp_ms'),
    avg_cls_score: real('avg_cls_score'),
    avg_inp_ms: real('avg_inp_ms'),
    avg_vitals_score: real('avg_vitals_score'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.day_at, t.page_url, t.device_type, t.browser] }),
]);

// --- GEO --------------------------------------------------------------------------

export const pvHourlyGeo = sqliteTable('pv_hourly_geo', {
    project_key: text('project_key').notNull(),
    hour_at: integer('hour_at').notNull(),
    country: text('country').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp_ms: real('avg_lcp_ms'),
    avg_fcp_ms: real('avg_fcp_ms'),
    avg_cls_score: real('avg_cls_score'),
    avg_inp_ms: real('avg_inp_ms'),
    avg_vitals_score: real('avg_vitals_score'),
    top_device: text('top_device'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.hour_at, t.country] }),
]);

export const pvDailyGeo = sqliteTable('pv_daily_geo', {
    project_key: text('project_key').notNull(),
    day_at: integer('day_at').notNull(),
    country: text('country').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp_ms: real('avg_lcp_ms'),
    avg_fcp_ms: real('avg_fcp_ms'),
    avg_cls_score: real('avg_cls_score'),
    avg_inp_ms: real('avg_inp_ms'),
    avg_vitals_score: real('avg_vitals_score'),
    top_device: text('top_device'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.day_at, t.country] }),
]);

// --- GEO DETAIL --------------------------------------------------------------------------

export const pvHourlyGeoDetail = sqliteTable('pv_hourly_geo_detail', {
    project_key: text('project_key').notNull(),
    hour_at: integer('hour_at').notNull(),
    country: text('country').notNull(),
    region: text('region'),
    city: text('city'),
    session_count: integer('session_count').notNull(),
    avg_lcp_ms: real('avg_lcp_ms'),
    avg_fcp_ms: real('avg_fcp_ms'),
    avg_cls_score: real('avg_cls_score'),
    avg_inp_ms: real('avg_inp_ms'),
    avg_vitals_score: real('avg_vitals_score'),
    top_device: text('top_device'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.hour_at, t.country, t.region, t.city] }),
]);

export const pvDailyGeoDetail = sqliteTable('pv_daily_geo_detail', {
    project_key: text('project_key').notNull(),
    day_at: integer('day_at').notNull(),
    country: text('country').notNull(),
    region: text('region'),
    city: text('city'),
    session_count: integer('session_count').notNull(),
    avg_lcp_ms: real('avg_lcp_ms'),
    avg_fcp_ms: real('avg_fcp_ms'),
    avg_cls_score: real('avg_cls_score'),
    avg_inp_ms: real('avg_inp_ms'),
    avg_vitals_score: real('avg_vitals_score'),
    top_device: text('top_device'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.day_at, t.country, t.region, t.city] }),
]);

// --- ENV --------------------------------------------------------------------------

export const pvHourlyEnv = sqliteTable('pv_hourly_env', {
    project_key: text('project_key').notNull(),
    hour_at: integer('hour_at').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    os: text('os'),
    connection_type: text('connection_type'),
    session_count: integer('session_count').notNull(),
    avg_lcp_ms: real('avg_lcp_ms'),
    avg_fcp_ms: real('avg_fcp_ms'),
    avg_cls_score: real('avg_cls_score'),
    avg_inp_ms: real('avg_inp_ms'),
    avg_vitals_score: real('avg_vitals_score'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.hour_at, t.device_type, t.browser, t.os, t.connection_type] }),
]);

export const pvDailyEnv = sqliteTable('pv_daily_env', {
    project_key: text('project_key').notNull(),
    day_at: integer('day_at').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    os: text('os'),
    connection_type: text('connection_type'),
    session_count: integer('session_count').notNull(),
    avg_lcp_ms: real('avg_lcp_ms'),
    avg_fcp_ms: real('avg_fcp_ms'),
    avg_cls_score: real('avg_cls_score'),
    avg_inp_ms: real('avg_inp_ms'),
    avg_vitals_score: real('avg_vitals_score'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.day_at, t.device_type, t.browser, t.os, t.connection_type] }),
]);

// --- ENV GEO --------------------------------------------------------------------------

export const pvHourlyEnvGeo = sqliteTable('pv_hourly_env_geo', {
    project_key: text('project_key').notNull(),
    hour_at: integer('hour_at').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    os: text('os'),
    connection_type: text('connection_type'),
    country: text('country').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp_ms: real('avg_lcp_ms'),
    avg_fcp_ms: real('avg_fcp_ms'),
    avg_cls_score: real('avg_cls_score'),
    avg_inp_ms: real('avg_inp_ms'),
    avg_vitals_score: real('avg_vitals_score'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.hour_at, t.device_type, t.browser, t.os, t.connection_type, t.country] }),
]);

export const pvDailyEnvGeo = sqliteTable('pv_daily_env_geo', {
    project_key: text('project_key').notNull(),
    day_at: integer('day_at').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    os: text('os'),
    connection_type: text('connection_type'),
    country: text('country').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp_ms: real('avg_lcp_ms'),
    avg_fcp_ms: real('avg_fcp_ms'),
    avg_cls_score: real('avg_cls_score'),
    avg_inp_ms: real('avg_inp_ms'),
    avg_vitals_score: real('avg_vitals_score'),
}, (t) => [
    primaryKey({ columns: [t.project_key, t.day_at, t.device_type, t.browser, t.os, t.connection_type, t.country] }),
]);