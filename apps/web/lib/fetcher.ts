import type { ApiResponse } from '@/types/api'

interface FetcherError extends Error {
    status: number
    message: string
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface FetcherOptions {
    method?: Method
    body?: unknown
    headers?: Record<string, string>
}

export async function fetcher<T>(url: string, options: FetcherOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    })

    const json: ApiResponse<T> = await res.json()

    if (!res.ok || !json.success) {
        const error = new Error(json.message) as FetcherError
        error.status = res.status
        error.message = json.error ?? json.message
        throw error
    }

    return json.data as T
}