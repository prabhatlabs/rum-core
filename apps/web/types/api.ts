export interface ApiResponse<T = null> {
    success: boolean
    message: string
    data: T | null
    error: string | null
}

export interface User {
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