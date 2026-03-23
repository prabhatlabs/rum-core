import { constants, type TimeRange } from "@rum-core/shared";
import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

export function initRedis(url: string, token: string) {
    if (_redis) return;
    _redis = new Redis({ url, token });
    console.log("Connected to Upstash Redis");
}

export function getRedis(): Redis {
    if (!_redis) {
        throw new Error("Redis not initialized");
    }
    return _redis;
}

function buildKey(projectKey: string, timeRange: TimeRange, tableNames: string[]): string {
    const sorted = [...tableNames].sort().join(",");
    return `cache:${projectKey}:${timeRange}:${sorted}`;
}

export async function get(projectKey: string, timeRange: TimeRange, tableNames: string[]): Promise<Record<string, unknown[]> | null> {
    const key = buildKey(projectKey, timeRange, tableNames);
    const data = await getRedis().get(key);
    return data as Record<string, unknown[]> | null;
}

export async function set(projectKey: string, timeRange: TimeRange, tableNames: string[], data: Record<string, unknown[]>): Promise<void> {
    const key = buildKey(projectKey, timeRange, tableNames);
    const ttl = constants.plans.CACHE_TTL[timeRange];
    await getRedis().set(key, JSON.stringify(data), { ex: ttl });
}

export async function invalidateProject(projectKey: string): Promise<void> {
    const redis = getRedis();
    const pattern = `cache:${projectKey}:*`;
    let cursor = 0;
    do {
        const [nextCursor, keys] = await redis.scan(cursor, { match: pattern, count: 100 });
        cursor = Number(nextCursor);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    } while (cursor !== 0);
}
