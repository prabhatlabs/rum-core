export interface ApiResponse<T = null> {
    success: boolean
    message: string
    data: T | null
    error: string | null
}

export type PlanLimits = {
    readonly projects: 2;
    readonly calls_per_day: 50000;
    readonly retention_days: 7;
    readonly time_ranges: readonly ["12h", "24h", "7d"];
} | {
    readonly projects: 8;
    readonly calls_per_day: 500000;
    readonly retention_days: 30;
    readonly time_ranges: readonly["12h", "24h", "7d", "30d"];
} | {
    readonly projects: number;
    readonly calls_per_day: number;
    readonly retention_days: number;
    readonly time_ranges: readonly["12h", "24h", "7d", "30d"];
}

export interface User {
    plan_limits: PlanLimits,
    id: string
    name: string
    email: string
    avatar_url: string | null
    provider: 'google' | 'github'
    created_at: string
    plan: Plan
}

export interface Plan {
    id: string;
    user_id: string;
    created_at: Date | null;
    type: string;
    status: string;
    updated_at: Date | null;
};

export interface Usage {
    date: string;
    id: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
    project_id: string;
    calls_used: number;
}

export interface Project {
    id: string;
    name: string;
    user_id: string;
    created_at: Date;
    project_key: string;
    origin: string;
    usage: Usage[];
}