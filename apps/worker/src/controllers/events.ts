import { eventsService } from "@rum-core/db";
import { APIErrorResponse, okResponse } from "@rum-core/shared";
import type { Context } from "hono";

export async function ingestRequestEvents(c: Context) {
    const { events } = await c.req.json();

    if (!events || !Array.isArray(events) || events?.length === 0) {
        throw new APIErrorResponse('ValueError', 'Invalid events', 'Events is not an array', 400);
    }

    if (events.length > 100) {
        throw new APIErrorResponse('ValueError', 'Invalid events', 'Events is too long', 400);
    }

    await eventsService.bulkInsertRequestEvents(events);

    const res = {
        total_events: events.length
    };

    return c.json(okResponse(res));
}

export async function ingestPageVitals(c: Context) {
    const { vitals } = await c.req.json();

    if (!vitals || !Array.isArray(vitals) || vitals?.length === 0) {
        throw new APIErrorResponse('ValueError', 'Invalid vitals', 'Vitals is not an array', 400);
    }

    if (vitals.length > 100) {
        throw new APIErrorResponse('ValueError', 'Invalid vitals', 'Vitals is too long', 400);
    }

    await eventsService.bulkInsertPageVitals(vitals);

    const res = {
        total_vitals: vitals.length
    };

    return c.json(okResponse(res));
}