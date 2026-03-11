import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    avatar_url: text('avatar_url'),
    provider: varchar('provider', { length: 20 }).notNull(),
    provider_id: varchar('provider_id', { length: 255 }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
});