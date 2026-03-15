import { getCurrentDate } from '@rum-core/shared';
import { constants } from '@rum-core/shared';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '../maindb/client';
import { plans, projects, usage } from '../maindb/schema/schema';

export async function incrementUsage(projectKey: string, calls: number) {
    if (calls <= 0) return;

    const project = await db.select({ user_id: projects.user_id, id: projects.id })
        .from(projects)
        .where(eq(projects.project_key, projectKey))
        .limit(1);

    if (!project[0]) {
        throw new Error(`Project not found: ${projectKey}`);
    }

    const userId = project[0].user_id;
    const projectId = project[0].id;
    const currentDate = getCurrentDate();

    await db.insert(usage)
        .values({
            user_id: userId,
            project_key: projectKey,
            project_id: projectId,
            date: currentDate,
            calls_used: calls,
        })
        .onConflictDoUpdate({
            target: [usage.user_id, usage.project_key, usage.date],
            set: {
                calls_used: sql`${usage.calls_used} + ${calls}`,
                updated_at: new Date(),
            },
        });
}

export async function getCallsLeft(projectKey: string): Promise<{ remaining: number; limit: number; used: number }> {
    const project = await db.select({ user_id: projects.user_id })
        .from(projects)
        .where(eq(projects.project_key, projectKey))
        .limit(1);

    if (!project[0]) {
        throw new Error(`Project not found: ${projectKey}`);
    }

    const userId = project[0].user_id;

    const plan = await db.select({ type: plans.type })
        .from(plans)
        .where(eq(plans.user_id, userId))
        .limit(1);

    const planType = plan[0]?.type ?? 'free';
    const limit = constants.plans.PLAN_LIMITS[planType as keyof typeof constants.plans.PLAN_LIMITS].calls_per_day;

    const currentDate = getCurrentDate();

    const todayUsage = await db.select({
        total: sql<number>`SUM(${usage.calls_used})`,
    })
        .from(usage)
        .where(
            and(
                eq(usage.user_id, userId),
                eq(usage.date, currentDate)
            )
        );

    const used = Number(todayUsage[0]?.total) || 0;
    const remaining = Math.max(0, limit - used);

    return { remaining, limit, used };
}
