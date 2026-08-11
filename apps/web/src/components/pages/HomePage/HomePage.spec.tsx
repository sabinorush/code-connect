import { describe, expect, it } from 'vitest'
import { waitFor, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { HomePage } from './HomePage'
import { axeConfig } from '../../../test/a11y'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { validSession, validUser } from '../../../test/msw/handlers'
import { readToken } from '../../../services/tokenStorage'

function renderAuthenticated() {
  localStorage.setItem('code-connect:access-token', validSession.accessToken)
  return renderWithProviders(<HomePage />)
}

describe('HomePage', () => {
  it('greets the logged-in user by name and shows their email', async () => {
    const { container } = renderAuthenticated()

    await waitFor(() => {
      expect(container.querySelector('h1')?.textContent).toBe(`Olá, ${validUser.name}`)
    })
    expect(container.textContent).toContain(validUser.email)
  })

  it('clears the session when "Sair" is clicked', async () => {
    const { container } = renderAuthenticated()

    await waitFor(() => {
      expect(container.querySelector('h1')?.textContent).toBe(`Olá, ${validUser.name}`)
    })

    fireEvent.click(container.querySelector('button')!)

    expect(readToken()).toBeNull()
  })

  it('não tem violações de acessibilidade (WCAG 2.1 AA)', async () => {
    const { container } = renderAuthenticated()

    await waitFor(() => {
      expect(container.querySelector('h1')?.textContent).toBe(`Olá, ${validUser.name}`)
    })
    expect(await axe(container, axeConfig)).toHaveNoViolations()
  })
})
