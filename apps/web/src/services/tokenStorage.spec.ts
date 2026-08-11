import { describe, expect, it } from 'vitest'
import { clearToken, readToken, saveToken } from './tokenStorage'

describe('tokenStorage', () => {
  it('persists to localStorage when remember is true and reads it back', () => {
    saveToken('abc123', true)

    expect(localStorage.getItem('code-connect:access-token')).toBe('abc123')
    expect(sessionStorage.getItem('code-connect:access-token')).toBeNull()
    expect(readToken()).toBe('abc123')
  })

  it('persists to sessionStorage when remember is false and reads it back', () => {
    saveToken('xyz789', false)

    expect(sessionStorage.getItem('code-connect:access-token')).toBe('xyz789')
    expect(localStorage.getItem('code-connect:access-token')).toBeNull()
    expect(readToken()).toBe('xyz789')
  })

  it('switching remember off clears a previously remembered token', () => {
    saveToken('remembered', true)
    saveToken('not-remembered', false)

    expect(localStorage.getItem('code-connect:access-token')).toBeNull()
    expect(readToken()).toBe('not-remembered')
  })

  it('returns null when no token is stored', () => {
    expect(readToken()).toBeNull()
  })

  it('clearToken removes the token from both storages', () => {
    saveToken('abc123', true)
    saveToken('xyz789', false)

    clearToken()

    expect(readToken()).toBeNull()
  })
})
