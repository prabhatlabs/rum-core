import { constants } from "@rum-core/shared";
import { eq } from 'drizzle-orm';
import { getMainDB } from '../maindb/client';
import { plans, users } from '../maindb/schema';

const db = getMainDB();

interface UpsertUserParams {
    email: string
    name: string
    avatar_url: string
    provider: 'google' | 'github'
    provider_id: string
}

export async function upsertUser(params: UpsertUserParams) {
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, params.email)
    })

    if (existingUser) {
        // same provider — just return
        if (existingUser.provider === params.provider) {
            return existingUser
        }

        // different provider — update
        const [updated] = await db.update(users)
            .set({
                provider: params.provider,
                provider_id: params.provider_id,
                avatar_url: params.avatar_url,
            })
            .where(eq(users.id, existingUser.id))
            .returning()

        return updated ?? null
    }

    const user = await db.transaction(async (tx): Promise<typeof users.$inferSelect> => {
        const [newUser] = await tx.insert(users).values({
            email: params.email,
            name: params.name,
            avatar_url: params.avatar_url,
            provider: params.provider,
            provider_id: params.provider_id,
        }).returning()

        if (!newUser) throw new Error('Failed to create user')

        await tx.insert(plans).values({
            user_id: newUser.id,
            type: 'free',
            status: 'active',
        })

        return newUser
    })

    return user ?? null
}

export async function getUserWithPlan(user_id: string) {
    let user = await db.query.users.findFirst({
        where: eq(users.id, user_id),
        with: {
            plan: true
        },
    })

    // nearly impossible 
    if (!user || !user.plan) {
        await db.insert(plans).values({
            user_id: user_id,
            type: 'free' as const,
            status: 'active',
        });

        user = await db.query.users.findFirst({
            where: eq(users.id, user_id),
            with: {
                plan: true
            }
        })
    }

    if (!user) {
        return null;
    }

    const PLAN_LIMITS = constants.plans.PLAN_LIMITS;
    type PlansType = keyof typeof PLAN_LIMITS 
    const planLimits = PLAN_LIMITS[(user?.plan.type || 'free') as PlansType];
    return { ...user, plan_limits: planLimits };
}
