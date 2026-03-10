import { useAuthStore } from '@/stores/auth'
import { useEffect } from 'react'

export function useAuth() {
    const { user, isLoading, isAuthenticated, setUser, setLoading, logout } = useAuthStore()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me')
                if (res.ok) {
                    const data = await res.json()
                    setUser(data.user)
                } else {
                    setUser(null)
                }
            } catch {
                setUser(null)
            }
        }

        fetchUser()
    }, [])

    return { user, isLoading, isAuthenticated, logout }
}