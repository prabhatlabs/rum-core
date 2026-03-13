import { relations } from "drizzle-orm";
import { plans } from "./plans";
import { projects } from "./projects";
import { usage } from "./usage";
import { users } from "./users";

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

export const usageRelations = relations(usage, ({ one }) => ({
  project: one(projects, {
    fields: [usage.project_id],
    references: [projects.id],
    relationName: 'project_usage',
  })
}))