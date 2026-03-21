import type { ApiResponse } from '@/types/api'
import { useDialog } from '@/hooks/use-dialog'
import { toast } from 'sonner'

interface FetcherError extends Error {
    status: number
    message: string
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface FetcherOptions {
    method?: Method
    body?: unknown
    headers?: Record<string, string>,
    showToast?: boolean
}

export async function fetcher<T>(url: string, options: FetcherOptions = { showToast: true }): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;
    const showToast = method !== 'GET' && options.showToast;

    let loadingToastId: number | string | null = null;
    if (showToast) {
        const message = method === 'POST' ? 'Creating...' : method === "DELETE" ? 'Deleting...' : 'Updating data...';
        loadingToastId = toast.loading(message);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    })

    if (loadingToastId)
        toast.dismiss(loadingToastId);

    const json: ApiResponse<T> = await res.json()

    if (!res.ok || !json.success) {
        const isLimitExceeded = json.error?.includes('LimitExceeded');

        if (isLimitExceeded) {
            useDialog.getState().openUpgrade(json.message ?? 'You have reached your plan limit.');
        } else if (showToast) {
            toast.error(json.message, {
                description: json.error,
            });
        }

        const error = new Error(json.message) as FetcherError
        error.status = res.status
        error.message = json.error ?? json.message
        throw error
    }

    if (showToast)
        toast.success(json.message);

    return json.data as T
}