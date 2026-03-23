import { jwt } from '@elysiajs/jwt';
import { authService } from '@rum-core/db';
import { APIErrorResponse } from '@rum-core/shared';
import Elysia, { t } from 'elysia';
import { ENV } from '../constants/envvars';

export const jwtConfig = jwt({
    name: 'jwt',
    secret: ENV.JWT_SECRET,
    schema: t.Object({
        sub: t.String(),
        status: t.Boolean()
    })
});

export const cookieConfig = {
    cookie: t.Object({
        pending_auth: t.Optional(t.String()), 
        auth: t.Optional(t.String()), 
        google_state: t.Optional(t.String()),
        google_verifier: t.Optional(t.String()),
        github_state: t.Optional(t.String()),
    })
}

export const authMiddleware = new Elysia()
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

        if (!payload.status) {
            throw new APIErrorResponse("UnauthorizedUserError", 'Unauthorized', 'Invalid token', 401)
        }

        const user_id = payload.sub;
        const user = await authService.getUserWithPlan(user_id);
        if (!user) {
            throw new APIErrorResponse("UnauthorizedUserError", 'Unauthorized', 'Invalid token or user not found', 401)
        }

        return { user };
    })
    .as("scoped");