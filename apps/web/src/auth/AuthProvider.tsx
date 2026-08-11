import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { createSession, createUser, fetchCurrentUser } from '../services/auth'
import type { UserResponse } from '../services/auth'
import { clearToken, readToken, saveToken } from '../services/tokenStorage'
import { AuthContext } from './authContext'
import type { AuthStatus, LoginInput, RegisterInput } from './authContext'

export interface AuthProviderProps {
  children: ReactNode
}

// Owns the auth session for the whole app: on mount it checks for a
// stored token and validates it against GET /users/me (a token can be
// present but expired, or signed with an old JWT_SECRET), then exposes
// login/register/logout to everything under it.
export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<UserResponse | null>(null)

  useEffect(() => {
    let cancelled = false

    if (!readToken()) {
      setStatus('anonymous')
      return
    }

    fetchCurrentUser()
      .then((currentUser) => {
        if (cancelled) return
        setUser(currentUser)
        setStatus('authenticated')
      })
      .catch(() => {
        if (cancelled) return
        clearToken()
        setStatus('anonymous')
      })

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async ({ email, password, rememberMe }: LoginInput) => {
    const session = await createSession({ email, password })
    saveToken(session.accessToken, rememberMe)
    const currentUser = await fetchCurrentUser()
    setUser(currentUser)
    setStatus('authenticated')
  }, [])

  // POST /users doesn't return a token (see apps/api/src/users/users.controller.ts),
  // so registering chains straight into login with the same credentials.
  const register = useCallback(
    async ({ name, email, password, rememberMe }: RegisterInput) => {
      await createUser({ name, email, password })
      await login({ email, password, rememberMe })
    },
    [login],
  )

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    setStatus('anonymous')
  }, [])

  return <AuthContext.Provider value={{ status, user, login, register, logout }}>{children}</AuthContext.Provider>
}
