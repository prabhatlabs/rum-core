import { and, eq } from 'drizzle-orm'
import { db } from '../db'
import { plans, users } from '../db/schema'

interface UpsertUserParams {
    email: string
    name: string
    avatar_url: string
    provider: 'google' | 'github'
    provider_id: string
}

export async function upsertUser(params: UpsertUserParams) {
    let user = await db.query.users.findFirst({
        where: and(
            eq(users.provider, params.provider),
            eq(users.provider_id, params.provider_id)
        )
    })

    if (!user) {
        user = await db.transaction(async (tx) => {
            const [newUser] = await tx.insert(users).values({
                email: params.email,
                name: params.name,
                avatar_url: params.avatar_url,
                provider: params.provider,
                provider_id: params.provider_id,
            }).returning()

            if (!newUser) {
                throw new Error('Failed to create user')
            }

            await tx.insert(plans).values({
                user_id: newUser.id,
                type: 'free',
                status: 'active',
            })

            return newUser
        })
    }

    return user ?? null;
}