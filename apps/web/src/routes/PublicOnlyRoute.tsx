import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../auth/useAuth'

export interface PublicOnlyRouteProps {
  children: ReactNode
}

// Mirror of ProtectedRoute: keeps an already-authenticated user from
// landing back on /login or /cadastro (e.g. via browser back button).
export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { status } = useAuth()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-400">
        Carregando...
      </div>
    )
  }

  if (status === 'authenticated') {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}
