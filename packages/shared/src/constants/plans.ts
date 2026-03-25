import type { PlanType, TimeRange } from "../type";

export const PLAN_LIMITS: Record<
    PlanType,
    {
        projects: number;
        calls_per_day: number;
        retention_days: number;
        time_ranges: readonly TimeRange[];
    }
> = {
    free: {
        projects: 2,
        calls_per_day: 50_000,
        retention_days: 7,
        time_ranges: ["24h", "7d"] as const,
    },
    pro: {
        projects: 8,
        calls_per_day: 500_000,
        retention_days: 30,
        time_ranges: ["12h", "24h", "7d", "30d"] as const,
    },
    enterprise: {
        projects: Infinity,
        calls_per_day: Infinity,
        retention_days: Infinity,
        time_ranges: ["12h", "24h", "7d", "30d"] as const,
    },
} as const;

export const RETENTION = {
    events_max_days: 32, // Turso — hard delete after 32 days
    usage_max_days: 92, // Neon — hard delete after 92 days
    usage_display_days: 60, // show 60 days in UI
    monthly_usage_forever: true, // never delete monthly summary
} as const;

export const CACHE_TTL: Record<TimeRange, number> = {
    "12h": 1800, // 30 min
    "24h": 1800, // 30 min
    "7d": 3600, // 1 hour
    "30d": 3600, // 1 hour
} as const;
