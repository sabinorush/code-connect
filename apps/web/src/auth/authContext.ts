import { createContext } from 'react'
import type { UserResponse } from '../services/auth'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

export interface LoginInput {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  rememberMe: boolean
}

export interface AuthContextValue {
  status: AuthStatus
  user: UserResponse | null
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
