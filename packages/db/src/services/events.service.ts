import type { InferInsertModel } from "drizzle-orm";
import { getEventDB } from "../eventdb/client";
import { pageVitals } from "../eventdb/schema/page-vitals";
import { requestEvents } from "../eventdb/schema/request-events";
import { incrementUsageHttp } from "./usage.service";

export type InsertRequestEvent = InferInsertModel<typeof requestEvents>;
export type InsertPageVitals = InferInsertModel<typeof pageVitals>;

export async function bulkInsertRequestEvents(events: InsertRequestEvent[]) {
    if (events.length === 0) return;

    const eventdb = getEventDB();
    await eventdb.insert(requestEvents).values(events).onConflictDoNothing();

    const projectKey = events[0]?.project_key;
    if (projectKey) {
        await incrementUsageHttp(projectKey, events.length);
    }
}

export async function bulkInsertPageVitals(vitals: InsertPageVitals[]) {
    if (vitals.length === 0) return;

    const eventdb = getEventDB();
    await eventdb.insert(pageVitals).values(vitals).onConflictDoNothing();

    const projectKey = vitals[0]?.project_key;
    if (projectKey) {
        await incrementUsageHttp(projectKey, vitals.length);
    }
}
