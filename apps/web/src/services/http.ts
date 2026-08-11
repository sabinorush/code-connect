import axios from 'axios'
import { clearToken, readToken } from './tokenStorage'

// Shared axios instance for every call to the Code Connect API.
// apps/api enables CORS for the Vite dev origin (see apps/api/src/main.ts),
// so no dev-server proxy is needed — this just talks to it directly.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
})

http.interceptors.request.use((config) => {
  const token = readToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Only clear the stored token when the *rejected* request actually
    // carried one. POST /sessions also answers 401 on bad credentials,
    // but that request never has a token attached — clearing here would
    // wipe an unrelated, still-valid session.
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof error.config?.headers.Authorization === 'string'
    ) {
      clearToken()
    }
    return Promise.reject(error)
  },
)
