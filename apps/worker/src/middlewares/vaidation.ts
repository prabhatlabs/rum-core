import { APIErrorResponse } from "@rum-core/shared";
import { createMiddleware } from "hono/factory";
import { getCallsLeft } from "../../../../packages/db/src/services/usage.service";

export const validateRequest = createMiddleware(async (c, next) => {
    const projectKey = c.req.header('x-project-key');
    const origin = c.req.header('origin');

    if (!projectKey) {
        throw new APIErrorResponse('ValidationError', 'Missing project key', 'Missing project key', 400);
    }

    const { remaining, origin: allowedOrigin } = await getCallsLeft(projectKey);

    if (allowedOrigin && origin !== allowedOrigin) {
        throw new APIErrorResponse('ForbiddenError', 'Invalid origin', 'Origin is not allowed', 403);
    }

    if (remaining <= 0) {
        throw new APIErrorResponse('RateLimitError', 'Daily limit reached', 'Daily limit reached', 429);
    }

    await next();
});