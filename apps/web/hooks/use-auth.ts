import { fetcher } from '@/lib/fetcher'
import type { User } from '@/types/api'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'

export function useAuth() {
    const { data, isLoading, error } = useSWR<User | null>('/auth/me', {
        revalidateOnFocus: true,
        dedupingInterval: 10,
    })
    const router = useRouter()

    const logout = async () => {
        await fetcher('/auth/logout', { method: 'POST' })
        router.push('/login')
    }

    return {
        user: data ?? null,
        isLoading,
        isAuthenticated: !!data,
        error,
        logout
    }
}

export function useLogin() {
    const router = useRouter()

    const loginWithGoogle = () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
        router.push(url)
    }

    const loginWithGithub = () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;
        router.push(url)
    }

    return { loginWithGoogle, loginWithGithub }
}
