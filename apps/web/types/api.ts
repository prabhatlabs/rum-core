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
}

export interface Project {
    id: string
    user_id: string
    name: string
    project_key: string
    origin: string
    created_at: string
}

export interface Plan {
    id: string
    user_id: string
    type: 'free' | 'pro' | 'enterprise'
    status: 'active' | 'inactive'
    created_at: string
    updated_at: string
}