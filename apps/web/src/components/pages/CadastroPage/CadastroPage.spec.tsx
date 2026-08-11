import { describe, expect, it } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'
import { HttpResponse, http } from 'msw'
import { CadastroPage } from './CadastroPage'
import { axeConfig } from '../../../test/a11y'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { server } from '../../../test/msw/server'
import { validSession } from '../../../test/msw/handlers'
import { readToken } from '../../../services/tokenStorage'

const API_URL = 'http://localhost:3000'

describe('CadastroPage', () => {
  it('renders the cadastro banner and the cadastro form', async () => {
    const { container } = renderWithProviders(<CadastroPage />, { initialEntries: ['/cadastro'] })

    await waitFor(() => {
      expect(container.querySelector('form')).not.toBeNull()
    })
    expect(container.querySelector('img[alt*="Code Connect"]')).not.toBeNull()
    expect(container.querySelector('h1')?.textContent).toBe('Cadastro')
  })

  it('registers and auto-logs-in on valid data, storing the session', async () => {
    const { container } = renderWithProviders(<CadastroPage />, { initialEntries: ['/cadastro'] })
    await waitFor(() => expect(container.querySelector('form')).not.toBeNull())

    fireEvent.change(container.querySelector('#name')!, { target: { value: 'Ada Lovelace' } })
    fireEvent.change(container.querySelector('#email')!, { target: { value: 'ada@example.com' } })
    fireEvent.change(container.querySelector('#password')!, { target: { value: 'super-secret-1' } })
    fireEvent.submit(container.querySelector('form')!)

    await waitFor(() => {
      expect(readToken()).toBe(validSession.accessToken)
    })
  })

  it('shows an error message and re-enables the form when the email is already registered', async () => {
    server.use(
      http.post(`${API_URL}/users`, () =>
        HttpResponse.json(
          { statusCode: 409, message: 'Email already registered', error: 'Conflict' },
          { status: 409 },
        ),
      ),
    )
    const { container } = renderWithProviders(<CadastroPage />, { initialEntries: ['/cadastro'] })
    await waitFor(() => expect(container.querySelector('form')).not.toBeNull())

    fireEvent.change(container.querySelector('#name')!, { target: { value: 'Ada Lovelace' } })
    fireEvent.change(container.querySelector('#email')!, { target: { value: 'ada@example.com' } })
    fireEvent.change(container.querySelector('#password')!, { target: { value: 'super-secret-1' } })
    fireEvent.submit(container.querySelector('form')!)

    await waitFor(() => {
      expect(container.querySelector('[role="alert"]')?.textContent).toBe('Este email já está cadastrado.')
    })
    expect((container.querySelector('button[type="submit"]') as HTMLButtonElement).disabled).toBe(false)
    expect(readToken()).toBeNull()
  })

  it('não tem violações de acessibilidade (WCAG 2.1 AA)', async () => {
    const { container } = renderWithProviders(<CadastroPage />, { initialEntries: ['/cadastro'] })
    await waitFor(() => expect(container.querySelector('form')).not.toBeNull())

    expect(await axe(container, axeConfig)).toHaveNoViolations()
  })
})
