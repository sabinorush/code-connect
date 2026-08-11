import { describe, expect, it } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'
import { HttpResponse, http } from 'msw'
import { LoginPage } from './LoginPage'
import { axeConfig } from '../../../test/a11y'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { server } from '../../../test/msw/server'
import { validSession } from '../../../test/msw/handlers'
import { readToken } from '../../../services/tokenStorage'

const API_URL = 'http://localhost:3000'

describe('LoginPage', () => {
  it('renders the login banner and the login form', async () => {
    const { container } = renderWithProviders(<LoginPage />, { initialEntries: ['/login'] })

    await waitFor(() => {
      expect(container.querySelector('form')).not.toBeNull()
    })
    expect(container.querySelector('img[alt*="Code Connect"]')).not.toBeNull()
    expect(container.querySelector('h1')?.textContent).toBe('Login')
  })

  it('logs in and stores the session on valid credentials', async () => {
    const { container } = renderWithProviders(<LoginPage />, { initialEntries: ['/login'] })
    await waitFor(() => expect(container.querySelector('form')).not.toBeNull())

    fireEvent.change(container.querySelector('#email')!, { target: { value: 'ada@example.com' } })
    fireEvent.change(container.querySelector('#password')!, { target: { value: 'super-secret-1' } })
    fireEvent.submit(container.querySelector('form')!)

    await waitFor(() => {
      expect(readToken()).toBe(validSession.accessToken)
    })
  })

  it('shows an error message and re-enables the form on invalid credentials', async () => {
    server.use(
      http.post(`${API_URL}/sessions`, () =>
        HttpResponse.json(
          { statusCode: 401, message: 'Invalid email or password', error: 'Unauthorized' },
          { status: 401 },
        ),
      ),
    )
    const { container } = renderWithProviders(<LoginPage />, { initialEntries: ['/login'] })
    await waitFor(() => expect(container.querySelector('form')).not.toBeNull())

    fireEvent.change(container.querySelector('#email')!, { target: { value: 'ada@example.com' } })
    fireEvent.change(container.querySelector('#password')!, { target: { value: 'wrong-password' } })
    fireEvent.submit(container.querySelector('form')!)

    await waitFor(() => {
      expect(container.querySelector('[role="alert"]')?.textContent).toBe('Email ou senha inválidos.')
    })
    expect((container.querySelector('button[type="submit"]') as HTMLButtonElement).disabled).toBe(false)
    expect(readToken()).toBeNull()
  })

  it('não tem violações de acessibilidade (WCAG 2.1 AA)', async () => {
    const { container } = renderWithProviders(<LoginPage />, { initialEntries: ['/login'] })
    await waitFor(() => expect(container.querySelector('form')).not.toBeNull())

    expect(await axe(container, axeConfig)).toHaveNoViolations()
  })
})
