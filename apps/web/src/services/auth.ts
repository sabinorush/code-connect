import { http } from './http'

// Mirrors apps/api/src/auth/dto/session-response.dto.ts and
// apps/api/src/users/dto/user-response.dto.ts.
export interface SessionResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface UserResponse {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

// Payloads are built field by field (never spread from the form data)
// because apps/api's ValidationPipe runs with forbidNonWhitelisted:
// true — an extra property like rememberMe would 400 the request.
export function createSession({ email, password }: LoginPayload): Promise<SessionResponse> {
  return http.post<SessionResponse>('/sessions', { email, password }).then((res) => res.data)
}

export function createUser({ name, email, password }: RegisterPayload): Promise<UserResponse> {
  return http.post<UserResponse>('/users', { name, email, password }).then((res) => res.data)
}

export function fetchCurrentUser(): Promise<UserResponse> {
  return http.get<UserResponse>('/users/me').then((res) => res.data)
}
