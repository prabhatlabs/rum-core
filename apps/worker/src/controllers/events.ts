import { eventsService } from "@rum-core/db";
import { APIErrorResponse, getCurrentTime, okResponse } from "@rum-core/shared";
import type { Context } from "hono";
import { getGeo, hashIp } from "../lib/enrich";

export async function ingestRequestEvents(c: Context) {
    const { events } = await c.req.json();

    if (!events || !Array.isArray(events) || events.length === 0) {
        throw new APIErrorResponse('ValueError', 'Invalid events', 'Events is not an array', 400);
    }

    if (events.length > 100) {
        throw new APIErrorResponse('ValueError', 'Too many events', 'Events is too long', 400);
    }

    // compute once per batch, stamp on all events
    const geo = getGeo(c);
    const ipHash = await hashIp(c);

    const enriched = events.map((event: any) => ({
        ...event,
        ...geo,
        timestamp: getCurrentTime(),
        ip_hash: ipHash,
    }));

    await eventsService.bulkInsertRequestEvents(enriched);

    return c.json(okResponse({ total_events: events.length }));
}

export async function ingestPageVitals(c: Context) {
    const vitals = await c.req.json();

    if (!vitals || typeof vitals !== "object" || Array.isArray(vitals)) {
        throw new APIErrorResponse('ValueError', 'Invalid vitals', 'Vitals must be an object', 400);
    }

    const geo = getGeo(c);
    const ipHash = await hashIp(c);

    const enriched = {
        ...vitals,
        ...geo,
        timestamp: getCurrentTime(),
        ip_hash: ipHash
    };

    await eventsService.bulkInsertPageVitals(enriched);

    return c.json(okResponse({ success: true }));
}