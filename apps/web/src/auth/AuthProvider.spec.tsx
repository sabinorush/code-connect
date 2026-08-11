import { describe, expect, it } from 'vitest'
import { render, waitFor, fireEvent } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { server } from '../test/msw/server'
import { validSession, validUser } from '../test/msw/handlers'
import { AuthProvider } from './AuthProvider'
import { useAuth } from './useAuth'
import { readToken } from '../services/tokenStorage'

const API_URL = 'http://localhost:3000'

function TestConsumer() {
  const { status, user, login, register, logout } = useAuth()

  // login/register deliberately re-throw so a real page can show the
  // error (see AuthProvider.tsx) — a page-like consumer must catch it.
  function handleLogin() {
    login({ email: 'ada@example.com', password: 'super-secret-1', rememberMe: true }).catch(() => undefined)
  }
  function handleRegister() {
    register({ name: 'Ada Lovelace', email: 'ada@example.com', password: 'super-secret-1', rememberMe: false }).catch(
      () => undefined,
    )
  }

  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="user-name">{user?.name ?? ''}</span>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

function renderConsumer() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>,
  )
}

describe('AuthProvider', () => {
  it('starts anonymous when no token is stored', async () => {
    const { container } = renderConsumer()

    await waitFor(() => {
      expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('anonymous')
    })
  })

  it('restores the session when a valid token is already stored', async () => {
    localStorage.setItem('code-connect:access-token', validSession.accessToken)

    const { container } = renderConsumer()

    await waitFor(() => {
      expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('authenticated')
    })
    expect(container.querySelector('[data-testid="user-name"]')?.textContent).toBe(validUser.name)
  })

  it('clears an invalid stored token and falls back to anonymous', async () => {
    localStorage.setItem('code-connect:access-token', 'garbage-token')

    const { container } = renderConsumer()

    await waitFor(() => {
      expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('anonymous')
    })
    expect(readToken()).toBeNull()
  })

  it('login stores the token and moves to authenticated with the fetched user', async () => {
    const { container } = renderConsumer()
    await waitFor(() => {
      expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('anonymous')
    })

    fireEvent.click(container.querySelector('button')!)

    await waitFor(() => {
      expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('authenticated')
    })
    expect(container.querySelector('[data-testid="user-name"]')?.textContent).toBe(validUser.name)
    expect(readToken()).toBe(validSession.accessToken)
  })

  it('register creates the user then logs in automatically', async () => {
    const { container } = renderConsumer()
    await waitFor(() => {
      expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('anonymous')
    })

    const registerButton = container.querySelectorAll('button')[1]
    fireEvent.click(registerButton)

    await waitFor(() => {
      expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('authenticated')
    })
    expect(container.querySelector('[data-testid="user-name"]')?.textContent).toBe(validUser.name)
  })

  it('logout clears the token and returns to anonymous', async () => {
    localStorage.setItem('code-connect:access-token', validSession.accessToken)
    const { container } = renderConsumer()
    await waitFor(() => {
      expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('authenticated')
    })

    const logoutButton = container.querySelectorAll('button')[2]
    fireEvent.click(logoutButton)

    expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('anonymous')
    expect(readToken()).toBeNull()
  })

  it('login rejects and leaves status anonymous on invalid credentials', async () => {
    server.use(
      http.post(`${API_URL}/sessions`, () =>
        HttpResponse.json(
          { statusCode: 401, message: 'Invalid email or password', error: 'Unauthorized' },
          { status: 401 },
        ),
      ),
    )
    const { container } = renderConsumer()
    await waitFor(() => {
      expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('anonymous')
    })

    fireEvent.click(container.querySelector('button')!)

    await waitFor(() => {
      expect(readToken()).toBeNull()
    })
    expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('anonymous')
  })
})
