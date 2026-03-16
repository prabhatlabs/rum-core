import { APIErrorResponse, constants, getCurrentDate, getCutoffTimestamp } from '@rum-core/shared';
import { and, eq, lt, sql } from 'drizzle-orm';
import { getMainDB } from '../maindb/client';
import { plans, projects, usage } from '../maindb/schema/schema';

export async function incrementUsage(projectKey: string, calls: number) {
    if (calls <= 0) {
        throw new Error(`incrementUsage called with invalid calls value: ${calls}`);
    }

    const currentDate = getCurrentDate();
    const db = getMainDB();
    await db.transaction(async (tx) => {
        const project = await tx
            .select({ user_id: projects.user_id, id: projects.id })
            .from(projects)
            .where(eq(projects.project_key, projectKey))
            .for('update')          // row-level lock prevents concurrent races
            .limit(1);

        if (!project[0]) {
            throw new APIErrorResponse('NotFoundError', 'Project not found', 'Project not found', 404);
        }

        await tx.insert(usage)
            .values({
                user_id: project[0].user_id,
                project_id: project[0].id,
                project_key: projectKey,
                date: currentDate,
                calls_used: calls,
            })
            .onConflictDoUpdate({
                target: [usage.user_id, usage.project_key, usage.date],
                set: {
                    calls_used: sql`${usage.calls_used} + ${calls}`,
                    updated_at: sql`CURRENT_TIMESTAMP`,
                },
            });
    });
}

export async function getCallsLeft(projectKey: string): Promise<{ remaining: number; limit: number; used: number, origin: string }> {
    const currentDate = getCurrentDate();

    const db = getMainDB();
    const result = await db
        .select({
            user_id: projects.user_id,
            plan_type: sql<string>`COALESCE(${plans.type}, 'free')`,
            used: sql<number>`COALESCE(SUM(${usage.calls_used}), 0)`,
            origin: projects.origin
        })
        .from(projects)
        .leftJoin(plans, eq(plans.user_id, projects.user_id))
        .leftJoin(
            usage,
            and(
                eq(usage.user_id, projects.user_id),
                eq(usage.date, currentDate)
            )
        )
        .where(eq(projects.project_key, projectKey))
        .groupBy(projects.user_id, plans.type)
        .limit(1);

    if (!result[0]) {
        throw new APIErrorResponse('NotFoundError', 'Project not found', 'Project not found', 404);
    }

    const origin = result[0].origin as string;
    const planType = result[0].plan_type as keyof typeof constants.plans.PLAN_LIMITS;
    const limit = constants.plans.PLAN_LIMITS[planType].calls_per_day;
    const used = Number(result[0].used);
    const remaining = Math.max(0, limit - used);

    return { remaining, limit, used, origin };
}

export async function cleanupUsage(): Promise<void> {
    const cutoff92Days = getCutoffTimestamp(constants.plans.RETENTION.usage_max_days);
    const cutoffDate = new Date(cutoff92Days).toISOString().split('T')[0]!;

    const db = getMainDB();
    await db.delete(usage).where(lt(usage.date, cutoffDate));
}