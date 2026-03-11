import { date, decimal, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

export const monthly_usage = pgTable('monthly_usage', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  month: date('month').notNull(),
  calls_million: decimal('calls_million', { precision: 10, scale: 4 }).notNull().default('0'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});