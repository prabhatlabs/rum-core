import { relations } from "drizzle-orm";
import { plans, projects, usage, users } from ".";

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

export const projectsRelations = relations(projects, ({ many }) => ({
  usage: many(usage, {
    relationName: 'project_usage',
  })
}));