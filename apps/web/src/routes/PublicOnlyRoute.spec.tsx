import { describe, expect, it } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { AuthProvider } from '../auth/AuthProvider'
import { validSession } from '../test/msw/handlers'
import { PublicOnlyRoute } from './PublicOnlyRoute'

function renderPublicOnly(initialPath: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/login',
        element: (
          <PublicOnlyRoute>
            <div data-testid="login-form">Login</div>
          </PublicOnlyRoute>
        ),
      },
      { path: '/home', element: <div data-testid="home-page">Home</div> },
    ],
    { initialEntries: [initialPath] },
  )
  return render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>,
  )
}

describe('PublicOnlyRoute', () => {
  it('renders the public content when there is no session', async () => {
    const { container } = renderPublicOnly('/login')

    await waitFor(() => {
      expect(container.querySelector('[data-testid="login-form"]')).not.toBeNull()
    })
  })

  it('redirects to /home when already authenticated', async () => {
    localStorage.setItem('code-connect:access-token', validSession.accessToken)

    const { container } = renderPublicOnly('/login')

    await waitFor(() => {
      expect(container.querySelector('[data-testid="home-page"]')).not.toBeNull()
    })
    expect(container.querySelector('[data-testid="login-form"]')).toBeNull()
  })
})
