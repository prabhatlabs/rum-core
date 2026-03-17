import {
    getCurrentMonthStr,
    getPreviousMonthStr
} from "@rum-core/shared";
import { getMainDBHttp } from '../maindb/client';
import {
    aggregateDailyFromHourly,
    aggregateHourlyFromRaw,
    cleanupHourlyRollups,
    cleanupOldData
} from './rollup.service';
import { cleanupUsage } from './usage.service';


export async function runHourlyCron(): Promise<void> {
    await aggregateHourlyFromRaw();
}

export async function runDailyCron(): Promise<void> {
    await aggregateDailyFromHourly();
    await cleanupHourlyRollups();
    await cleanupOldData();
    await cleanupUsage();
}

export async function runMonthlySummary(): Promise<void> {
    const db = getMainDBHttp();
    
    const previousMonthStr = getPreviousMonthStr();
    const currentMonthStr = getCurrentMonthStr();

    await db.execute(`
        INSERT INTO monthly_usage (user_id, month, calls_million)
        SELECT 
            user_id,
            '${previousMonthStr}' as month,
            SUM(calls_used) / 1000000.0 as calls_million
        FROM usage
        WHERE date >= '${previousMonthStr}' AND date < '${currentMonthStr}'
        GROUP BY user_id
        ON CONFLICT(user_id, month) DO UPDATE SET
            calls_million = excluded.calls_million
    `);
}
