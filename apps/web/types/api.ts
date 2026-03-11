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

export interface Project {
    id: string
    user_id: string
    name: string
    project_key: string
    origin: string
    created_at: string
}