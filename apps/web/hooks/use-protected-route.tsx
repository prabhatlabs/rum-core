'use client'

import { LoadingPage } from '@/components/Loading'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading && !user) {
        return <LoadingPage />
    }

    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}
