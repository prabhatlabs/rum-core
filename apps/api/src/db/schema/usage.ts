import { date, integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

export const usage = pgTable('usage', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  calls_used: integer('calls_used').notNull().default(0),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});