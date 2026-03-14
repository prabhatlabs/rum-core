import { APIErrorResponse, okResponse } from "@rum-core/shared";
import type { Context } from "hono";

export async function saveBulkEvents(c: Context) {
    const { events } = await c.req.json();

    if (!events || !Array.isArray(events) || events?.length === 0) {
        throw new APIErrorResponse('ValueError', 'Invalid events', 'Events is not an array', 400);
    }

    if (events.length > 100) {
        throw new APIErrorResponse('ValueError', 'Invalid events', 'Events is too long', 400);
    }

    // todo: event data type validation and db operation

    const res = {
        total_events: events.length
    };

    return c.json(okResponse(res));
}