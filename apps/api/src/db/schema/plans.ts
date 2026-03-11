import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

export const plans = pgTable('plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }), // on delete cascade, delete all associated plans
  type: varchar('type', { length: 20 }).notNull().default('free'),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});