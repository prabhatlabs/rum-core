import { APIErrorResponse } from "@rum-core/shared";
import { createMiddleware } from "hono/factory";
import { getCallsLeftHttp } from "../../../../packages/db/src/services/usage.service";

export const validateRequest = createMiddleware(async (c, next) => {
     if (c.req.method === 'OPTIONS') {
        return next()
    }
    const origin = c.req.header('origin');
    const projectKey = (await c.req.json()).project_key;

    if (!projectKey) {
        throw new APIErrorResponse('ValidationError', 'Missing project key', 'Missing project key', 400);
    }

    const { remaining, origin: allowedOrigin } = await getCallsLeftHttp(projectKey);

    if (allowedOrigin && origin !== allowedOrigin) {
        throw new APIErrorResponse('ForbiddenError', 'Invalid origin', 'Origin is not allowed', 403);
    }

    if (remaining <= 0) {
        throw new APIErrorResponse('RateLimitError', 'Daily limit reached', 'Daily limit reached', 429);
    }

    await next();
});