'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, isLoggingOut } = useAuth()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated && !hasRedirected) {
      setHasRedirected(true)
      router.replace('/auth/login')
    }
  }, [loading, isAuthenticated, router, hasRedirected])

  // If logging out, don't show anything to avoid flash
  if (isLoggingOut) {
    return null
  }

  // If not authenticated and not loading, redirect immediately without showing anything
  if (!loading && !isAuthenticated) {
    return null
  }

  // Show loading only for initial authentication check when user is not yet determined
  if (loading && user === null && !isLoggingOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    )
  }

  // If we have a user or we're still loading but had a user before, show content
  return <>{children}</>
}