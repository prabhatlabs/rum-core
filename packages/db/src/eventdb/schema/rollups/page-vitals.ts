import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const pvHourlySummary = sqliteTable('pv_hourly_summary', {
    project_key: text('project_key').notNull(),
    hour: integer('hour').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp: real('avg_lcp'),
    avg_fcp: real('avg_fcp'),
    avg_cls: real('avg_cls'),
    avg_inp: real('avg_inp'),
    avg_vitals_score: real('avg_vitals_score'),
});

export const pvDailySummary = sqliteTable('pv_daily_summary', {
    project_key: text('project_key').notNull(),
    day: integer('day').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp: real('avg_lcp'),
    avg_fcp: real('avg_fcp'),
    avg_cls: real('avg_cls'),
    avg_inp: real('avg_inp'),
    avg_vitals_score: real('avg_vitals_score'),
});

export const pvHourlyPages = sqliteTable('pv_hourly_pages', {
    project_key: text('project_key').notNull(),
    hour: integer('hour').notNull(),
    page_url: text('page_url').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp: real('avg_lcp'),
    avg_fcp: real('avg_fcp'),
    avg_cls: real('avg_cls'),
    avg_inp: real('avg_inp'),
    avg_vitals_score: real('avg_vitals_score'),
    top_country: text('top_country'),
    device_mobile_pct: real('device_mobile_pct'),
});

export const pvDailyPages = sqliteTable('pv_daily_pages', {
    project_key: text('project_key').notNull(),
    day: integer('day').notNull(),
    page_url: text('page_url').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp: real('avg_lcp'),
    avg_fcp: real('avg_fcp'),
    avg_cls: real('avg_cls'),
    avg_inp: real('avg_inp'),
    avg_vitals_score: real('avg_vitals_score'),
    top_country: text('top_country'),
    device_mobile_pct: real('device_mobile_pct'),
});

export const pvHourlyPageGeo = sqliteTable('pv_hourly_page_geo', {
    project_key: text('project_key').notNull(),
    hour: integer('hour').notNull(),
    page_url: text('page_url').notNull(),
    country: text('country').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp: real('avg_lcp'),
    avg_fcp: real('avg_fcp'),
    avg_cls: real('avg_cls'),
    avg_inp: real('avg_inp'),
    avg_vitals_score: real('avg_vitals_score'),
});

export const pvDailyPageGeo = sqliteTable('pv_daily_page_geo', {
    project_key: text('project_key').notNull(),
    day: integer('day').notNull(),
    page_url: text('page_url').notNull(),
    country: text('country').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp: real('avg_lcp'),
    avg_fcp: real('avg_fcp'),
    avg_cls: real('avg_cls'),
    avg_inp: real('avg_inp'),
    avg_vitals_score: real('avg_vitals_score'),
});

export const pvHourlyPageEnv = sqliteTable('pv_hourly_page_env', {
    project_key: text('project_key').notNull(),
    hour: integer('hour').notNull(),
    page_url: text('page_url').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    session_count: integer('session_count').notNull(),
    avg_lcp: real('avg_lcp'),
    avg_fcp: real('avg_fcp'),
    avg_cls: real('avg_cls'),
    avg_inp: real('avg_inp'),
    avg_vitals_score: real('avg_vitals_score'),
});

export const pvDailyPageEnv = sqliteTable('pv_daily_page_env', {
    project_key: text('project_key').notNull(),
    day: integer('day').notNull(),
    page_url: text('page_url').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    session_count: integer('session_count').notNull(),
    avg_lcp: real('avg_lcp'),
    avg_fcp: real('avg_fcp'),
    avg_cls: real('avg_cls'),
    avg_inp: real('avg_inp'),
    avg_vitals_score: real('avg_vitals_score'),
});

export const pvHourlyGeo = sqliteTable('pv_hourly_geo', {
    project_key: text('project_key').notNull(),
    hour: integer('hour').notNull(),
    country: text('country').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp: real('avg_lcp'),
    avg_fcp: real('avg_fcp'),
    avg_cls: real('avg_cls'),
    avg_inp: real('avg_inp'),
    avg_vitals_score: real('avg_vitals_score'),
    top_device: text('top_device'),
});

export const pvDailyGeo = sqliteTable('pv_daily_geo', {
    project_key: text('project_key').notNull(),
    day: integer('day').notNull(),
    country: text('country').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp: real('avg_lcp'),
    avg_fcp: real('avg_fcp'),
    avg_cls: real('avg_cls'),
    avg_inp: real('avg_inp'),
    avg_vitals_score: real('avg_vitals_score'),
    top_device: text('top_device'),
});

export const pvHourlyGeoDetail = sqliteTable('pv_hourly_geo_detail', {
    project_key: text('project_key').notNull(),
    hour: integer('hour').notNull(),
    country: text('country').notNull(),
    region: text('region'),
    city: text('city'),
    session_count: integer('session_count').notNull(),
    avg_lcp: real('avg_lcp'),
    avg_fcp: real('avg_fcp'),
    avg_cls: real('avg_cls'),
    avg_inp: real('avg_inp'),
    avg_vitals_score: real('avg_vitals_score'),
    top_device: text('top_device'),
});

export const pvDailyGeoDetail = sqliteTable('pv_daily_geo_detail', {
    project_key: text('project_key').notNull(),
    day: integer('day').notNull(),
    country: text('country').notNull(),
    region: text('region'),
    city: text('city'),
    session_count: integer('session_count').notNull(),
    avg_lcp: real('avg_lcp'),
    avg_fcp: real('avg_fcp'),
    avg_cls: real('avg_cls'),
    avg_inp: real('avg_inp'),
    avg_vitals_score: real('avg_vitals_score'),
    top_device: text('top_device'),
});

export const pvHourlyEnv = sqliteTable('pv_hourly_env', {
    project_key: text('project_key').notNull(),
    hour: integer('hour').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    os: text('os'),
    connection_type: text('connection_type'),
    session_count: integer('session_count').notNull(),
    avg_lcp: real('avg_lcp'),
    avg_fcp: real('avg_fcp'),
    avg_cls: real('avg_cls'),
    avg_inp: real('avg_inp'),
    avg_vitals_score: real('avg_vitals_score'),
});

export const pvDailyEnv = sqliteTable('pv_daily_env', {
    project_key: text('project_key').notNull(),
    day: integer('day').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    os: text('os'),
    connection_type: text('connection_type'),
    session_count: integer('session_count').notNull(),
    avg_lcp: real('avg_lcp'),
    avg_fcp: real('avg_fcp'),
    avg_cls: real('avg_cls'),
    avg_inp: real('avg_inp'),
    avg_vitals_score: real('avg_vitals_score'),
});

export const pvHourlyEnvGeo = sqliteTable('pv_hourly_env_geo', {
    project_key: text('project_key').notNull(),
    hour: integer('hour').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    os: text('os'),
    connection_type: text('connection_type'),
    country: text('country').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp: real('avg_lcp'),
    avg_fcp: real('avg_fcp'),
    avg_cls: real('avg_cls'),
    avg_inp: real('avg_inp'),
    avg_vitals_score: real('avg_vitals_score'),
});

export const pvDailyEnvGeo = sqliteTable('pv_daily_env_geo', {
    project_key: text('project_key').notNull(),
    day: integer('day').notNull(),
    device_type: text('device_type'),
    browser: text('browser'),
    os: text('os'),
    connection_type: text('connection_type'),
    country: text('country').notNull(),
    session_count: integer('session_count').notNull(),
    avg_lcp: real('avg_lcp'),
    avg_fcp: real('avg_fcp'),
    avg_cls: real('avg_cls'),
    avg_inp: real('avg_inp'),
    avg_vitals_score: real('avg_vitals_score'),
});
