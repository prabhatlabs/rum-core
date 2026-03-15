import { eventdb } from '../eventdb/client';
import { requestEvents } from '../eventdb/schema/request-events';
import { pageVitals } from '../eventdb/schema/page-vitals';
import { incrementUsage } from './usage.service';
import type { InferInsertModel } from 'drizzle-orm';

export type InsertRequestEvent = InferInsertModel<typeof requestEvents>;
export type InsertPageVitals = InferInsertModel<typeof pageVitals>;

export async function bulkInsertRequestEvents(events: InsertRequestEvent[]) {
    if (events.length === 0) return;
    
    await eventdb.insert(requestEvents).values(events).onConflictDoNothing();

    const projectKey = events[0]?.project_key;
    if (projectKey) {
        await incrementUsage(projectKey, events.length);
    }
}

export async function bulkInsertPageVitals(vitals: InsertPageVitals[]) {
    if (vitals.length === 0) return;
    
    await eventdb.insert(pageVitals).values(vitals).onConflictDoNothing();

    const projectKey = vitals[0]?.project_key;
    if (projectKey) {
        await incrementUsage(projectKey, vitals.length);
    }
}
