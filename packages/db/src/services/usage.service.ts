import { APIErrorResponse, constants, getCurrentDate, getCutoffTimestamp } from '@rum-core/shared';
import { and, eq, lt, sql } from 'drizzle-orm';
import { getMainDB, getMainDBHttp } from '../maindb/client';
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

export async function incrementUsageHttp(projectKey: string, calls: number) {
    if (calls <= 0) {
        throw new Error(`incrementUsage called with invalid calls value: ${calls}`);
    }

    const currentDate = getCurrentDate();
    const db = getMainDBHttp();

    const result = await db.execute(sql`
        WITH project AS (
            SELECT id, user_id
            FROM projects
            WHERE project_key = ${projectKey}
            LIMIT 1
        )
        INSERT INTO usage (user_id, project_id, project_key, date, calls_used)
        SELECT user_id, id, ${projectKey}, ${currentDate}, ${calls}
        FROM project
        ON CONFLICT (user_id, project_key, date)
        DO UPDATE SET
            calls_used = usage.calls_used + EXCLUDED.calls_used,
            updated_at = CURRENT_TIMESTAMP
        RETURNING user_id
    `);

    if (result.rows.length === 0) {
        throw new APIErrorResponse('NotFoundError', 'Project not found', 'Project not found', 404);
    }
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
        .groupBy(projects.user_id, plans.type, projects.origin)
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

export async function getCallsLeftHttp(projectKey: string): Promise<{ remaining: number; limit: number; used: number; origin: string }> {
    const currentDate = getCurrentDate();
    const db = getMainDBHttp();

    const result = await db
        .select({
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
        .groupBy(projects.user_id, plans.type, projects.origin)
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

export interface UsageByDate {
    date: string;
    calls_used: number;
}

export async function getUserUsageByDate(userId: string, timeRange: 'today' | '7d' | '30d' | '60d'): Promise<UsageByDate[]> {
    const db = getMainDB();
    const today = getCurrentDate();

    let startDate: string;
    if (timeRange === 'today') {
        startDate = today;
    } else {
        const days = timeRange === '7d' ? 7 : timeRange === "30d" ? 30 : 60;
        const startTimestamp = getCutoffTimestamp(days);
        startDate = new Date(startTimestamp).toISOString().split('T')[0]!;
    }

    const result = await db
        .select({
            date: usage.date,
            calls_used: sql<number>`SUM(${usage.calls_used})`,
        })
        .from(usage)
        .where(
            and(
                eq(usage.user_id, userId),
                sql`${usage.date} >= ${startDate}`,
                sql`${usage.date} <= ${today}`,
            )
        )
        .groupBy(usage.date)
        .orderBy(usage.date);

    return result.map(row => ({
        date: row.date,
        calls_used: Number(row.calls_used),
    }));
}