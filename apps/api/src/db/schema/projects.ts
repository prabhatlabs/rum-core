import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

export const projects = pgTable('projects', {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    project_key: varchar('project_key', { length: 64 }).unique().notNull(),
    origin: varchar('origin', { length: 150 }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
});