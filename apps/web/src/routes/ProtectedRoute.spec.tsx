import { describe, expect, it } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { AuthProvider } from '../auth/AuthProvider'
import { validSession } from '../test/msw/handlers'
import { ProtectedRoute } from './ProtectedRoute'

function renderProtected(initialPath: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/protected',
        element: (
          <ProtectedRoute>
            <div data-testid="secret">Segredo</div>
          </ProtectedRoute>
        ),
      },
      { path: '/login', element: <div data-testid="login-page">Login</div> },
    ],
    { initialEntries: [initialPath] },
  )
  return render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>,
  )
}

describe('ProtectedRoute', () => {
  it('redirects to /login when there is no session', async () => {
    const { container } = renderProtected('/protected')

    await waitFor(() => {
      expect(container.querySelector('[data-testid="login-page"]')).not.toBeNull()
    })
    expect(container.querySelector('[data-testid="secret"]')).toBeNull()
  })

  it('renders the protected content when authenticated', async () => {
    localStorage.setItem('code-connect:access-token', validSession.accessToken)

    const { container } = renderProtected('/protected')

    await waitFor(() => {
      expect(container.querySelector('[data-testid="secret"]')).not.toBeNull()
    })
    expect(container.querySelector('[data-testid="login-page"]')).toBeNull()
  })
})
