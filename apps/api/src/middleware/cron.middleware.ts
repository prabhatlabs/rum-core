import { APIErrorResponse } from "@rum-core/shared";
import Elysia from "elysia";

const CRON_SECRET = process.env.CRON_SECRET!;

export const cronMiddleware = new Elysia()
    .onBeforeHandle(({ request }) => {
        const secret = request.headers.get("x-cron-secret");
        if (!secret || secret !== CRON_SECRET) {
            throw new APIErrorResponse("UnauthorizedUserError", "Invalid secret", "Cron secret invalid, or it's not provided", 401)
        }
    });
