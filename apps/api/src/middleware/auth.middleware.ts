import { jwt } from '@elysiajs/jwt';
import { Elysia, t } from 'elysia';
import { ENV } from '../constants/envvars';
import APIErrorResponse from '../lib/error';
import { getUserWithPlan } from '../services/auth.service';

export const jwtConfig = jwt({
    name: 'jwt',
    secret: ENV.JWT_SECRET,
    schema: t.Object({
        sub: t.String()
    })
});

export const cookieConfig = {
    cookie: t.Object({
        auth: t.String(),
        google_state: t.Optional(t.String()),
        google_verifier: t.Optional(t.String()),
        github_state: t.Optional(t.String()),
    })
}

export const authMiddleware = (app: Elysia) => app
    .use(jwtConfig)
    .guard(cookieConfig)
    .derive(async ({ jwt, cookie }) => {
        const token = cookie.auth?.value;
        if (!token) {
            throw new APIErrorResponse("UnauthorizedUserError", 'Unauthorized', 'Invalid token', 401)
        }

        const payload = await jwt.verify(token)
        if (!payload) {
            throw new APIErrorResponse("UnauthorizedUserError", 'Unauthorized', 'Invalid token', 401)
        }
        const user_id = payload.sub;
        const user = await getUserWithPlan(user_id);
        if (!user) {
            throw new APIErrorResponse("UnauthorizedUserError", 'Unauthorized', 'Invalid token or user not found', 401)
        }

        return { user }
    })