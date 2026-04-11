import { constants } from "@rum-core/shared";
import { eq } from "drizzle-orm";
import { getMainDB } from "../maindb/client";
import { plans, users } from "../maindb/schema";
import { getRedis } from "./cache.service";

interface UpsertUserParams {
    email: string;
    name: string;
    password?: string;
    verified: boolean;
    avatar_url: string;
    provider: "google" | "github" | "emailpassword";
    provider_id: string;
}

export async function upsertUser(params: UpsertUserParams) {
    if (params.provider === "emailpassword" && !params.password) {
        return null;
    }

    const db = getMainDB();

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, params.email),
    });

    if (existingUser) {
        // same provider — just return
        if (existingUser.provider === params.provider) {
            return existingUser;
        }

        // different provider — update
        const [updated] = await db
            .update(users)
            .set({
                password: params.password,
                provider: params.provider,
                provider_id: params.provider_id,
                verified: params.verified,
                avatar_url: params.avatar_url,
            })
            .where(eq(users.id, existingUser.id))
            .returning();

        return updated ?? null;
    }

    const user = await db.transaction(
        async (tx): Promise<typeof users.$inferSelect> => {
            const [newUser] = await tx
                .insert(users)
                .values({
                    email: params.email,
                    name: params.name,
                    password: params.password,
                    verified: params.verified,
                    avatar_url: params.avatar_url,
                    provider: params.provider,
                    provider_id: params.provider_id,
                })
                .returning();

            if (!newUser) throw new Error("Failed to create user");

            await tx.insert(plans).values({
                user_id: newUser.id,
                type: "free",
                status: "active",
            });

            return newUser;
        },
    );

    return user ?? null;
}

export async function markUserVerified(user_id: string) {
    const db = getMainDB();
    await db.update(users).set({ verified: true }).where(eq(users.id, user_id));
}

export async function getUserByEmail(email: string) {
    const db = getMainDB();
    return await db.query.users.findFirst({
        where: eq(users.email, email),
        columns: {
            id: true,
            email: true,
            password: true,
            name: true,
            verified: true,
        },
    });
}

export async function getUserWithPlan(user_id: string) {
    const db = getMainDB();

    let user = await db.query.users.findFirst({
        where: eq(users.id, user_id),
        with: {
            plan: true,
        },
    });

    // nearly impossible
    if (!user || !user.plan) {
        await db.insert(plans).values({
            user_id: user_id,
            type: "free" as const,
            status: "active",
        });

        user = await db.query.users.findFirst({
            where: eq(users.id, user_id),
            with: {
                plan: true,
            },
        });
    }

    if (!user) {
        return null;
    }

    if (user.password) {
        delete (user as any).password;
    }

    const PLAN_LIMITS = constants.plans.PLAN_LIMITS;
    type PlansType = keyof typeof PLAN_LIMITS;
    const planLimits = PLAN_LIMITS[(user?.plan.type || "free") as PlansType];
    return { ...user, plan_limits: planLimits };
}

export async function setUserSession(userId: string) {
    const r = getRedis();
    const sessionId = crypto.randomUUID();
    await r.set(sessionId, userId, { ex: 120 });
    return sessionId;
}

export async function exchangeSessionForUserId(sessionId: string) {
    const r = getRedis();
    const userId = await r.get<string>(sessionId);
    return userId;
}
