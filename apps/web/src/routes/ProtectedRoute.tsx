import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../auth/useAuth'

export interface ProtectedRouteProps {
  children: ReactNode
}

// Guards routes that require a session (e.g. /home). While the
// AuthProvider is still validating a stored token against GET
// /users/me, render nothing conclusive yet — deciding too early would
// bounce a legitimately logged-in user to /login on every refresh.
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { status } = useAuth()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-400">
        Carregando...
      </div>
    )
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
