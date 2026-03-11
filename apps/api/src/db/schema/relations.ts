import { relations } from "drizzle-orm";
import { plans, users } from ".";

export const usersRelations = relations(users, ({ one }) => ({
  plan: one(plans, {
    fields: [users.id],
    references: [plans.user_id]
  })
}));

export const plansRelations = relations(plans, ({ one }) => ({
  user: one(users, {
    fields: [plans.user_id],
    references: [users.id]
  })
}));
