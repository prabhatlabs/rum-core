import { maindbClient } from '../maindb/client';
import {
    aggregateDailyFromHourly,
    aggregateHourlyFromRaw,
    cleanupHourlyRollups,
    cleanupOldData,
    vacuumTurso
} from './rollup.service';
import { cleanupUsage } from './usage.service';

export async function runHourlyCron(): Promise<void> {
    await aggregateHourlyFromRaw();
}

export async function runDailyCron(): Promise<void> {
    await aggregateDailyFromHourly();
    await cleanupHourlyRollups();
    await cleanupOldData();
    await vacuumTurso();
    await cleanupUsage();
}

export async function runMonthlySummary(): Promise<void> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getUTCFullYear(), now.getUTCMonth() - 1, 1);
    const monthStr = firstDayOfMonth.toISOString().split('T')[0];

    await maindbClient.query(`
        INSERT INTO monthly_usage (user_id, month, calls_million)
        SELECT 
            user_id,
            '${monthStr}' as month,
            SUM(calls_used) / 1000000.0 as calls_million
        FROM usage
        WHERE date >= '${monthStr}' AND date < '${now.toISOString().split('T')[0]}'
        GROUP BY user_id
        ON CONFLICT(user_id, month) DO UPDATE SET
            calls_million = excluded.calls_million
    `);
}
