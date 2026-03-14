import { date, decimal, index, integer, pgTable, text, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    avatar_url: text('avatar_url'),
    provider: varchar('provider', { length: 20 }).notNull(),
    provider_id: varchar('provider_id', { length: 255 }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
    unique().on(t.provider, t.provider_id),
]);

export const projects = pgTable('projects', {
    id:          uuid('id').primaryKey().defaultRandom(),
    user_id:     uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name:        varchar('name', { length: 255 }).notNull(),
    project_key: varchar('project_key', { length: 64 }).unique().notNull(),
    origin:      text('origin').notNull(),
    created_at:  timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
    index('idx_projects_user_id').on(t.user_id),
    index('idx_projects_project_key').on(t.project_key),
]);

export const plans = pgTable('plans', {
    id:         uuid('id').primaryKey().defaultRandom(),
    user_id:    uuid('user_id').unique().notNull().references(() => users.id, { onDelete: 'cascade' }),
    type:       varchar('type', { length: 20 }).notNull().default('free'),
    status:     varchar('status', { length: 20 }).notNull().default('active'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const usage = pgTable('usage', {
    id:          uuid('id').primaryKey().defaultRandom(),
    user_id:     uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    project_key: varchar('project_key', { length: 64 }).notNull(),
    project_id: uuid('project_id').notNull().references(() => projects.id),
    date:        date('date').notNull(),
    calls_used:  integer('calls_used').notNull().default(0),
    created_at:  timestamp('created_at').defaultNow().notNull(),
    updated_at:  timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
    unique().on(t.user_id, t.project_key, t.date),
    index('idx_usage_user_date').on(t.user_id, t.date),
    index('idx_usage_user_project_date').on(t.user_id, t.project_key, t.date),
]);

export const monthly_usage = pgTable('monthly_usage', {
    id:            uuid('id').primaryKey().defaultRandom(),
    user_id:       uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    month:         date('month').notNull(),
    calls_million: decimal('calls_million', { precision: 10, scale: 4 }).notNull().default('0'),
    created_at:    timestamp('created_at').defaultNow().notNull(),
}, (t) => [
    unique().on(t.user_id, t.month),
    index('idx_monthly_usage_user_month').on(t.user_id, t.month),
]);