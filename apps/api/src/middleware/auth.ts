import { jwt } from '@elysiajs/jwt'
import { eq } from 'drizzle-orm'
import { Elysia, t } from 'elysia'
import { ENV } from '../constants/envvars'
import { db } from '../db'
import { users } from '../db/schema'

export const jwtConfig = jwt({
    name: 'jwt',
    secret: ENV.JWT_SECRET,
    schema: t.Object({
        sub: t.String()
    })
});

export const cookieConfig = {
    cookie: t.Object({
        auth: t.Optional(t.String()),
        google_state: t.Optional(t.String()),
        google_verifier: t.Optional(t.String()),
        github_state: t.Optional(t.String()),
    })
}

export const authMiddleware = new Elysia()
    .use(jwtConfig)
    .guard(cookieConfig)
    .derive(async ({ jwt, cookie, set }) => {
        const token = cookie.auth.value

        if (!token) {
            set.status = 401
            throw new Error('Unauthorized')
        }

        const payload = await jwt.verify(token)

        if (!payload) {
            set.status = 401
            throw new Error('Unauthorized')
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, payload.sub)
        })

        if (!user) {
            set.status = 401
            throw new Error('Unauthorized')
        }

        return { user }
    })