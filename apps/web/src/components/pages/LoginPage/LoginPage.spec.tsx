import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { LoginPage } from './LoginPage'
import { axeConfig } from '../../../test/a11y'

describe('LoginPage', () => {
  it('renders the login banner and the login form', () => {
    const { container } = render(<LoginPage />)

    expect(container.querySelector('img[alt*="Code Connect"]')).not.toBeNull()
    expect(container.querySelector('form')).not.toBeNull()
    expect(container.querySelector('h1')?.textContent).toBe('Login')
  })

  it('não tem violações de acessibilidade (WCAG 2.1 AA)', async () => {
    const { container } = render(<LoginPage />)

    expect(await axe(container, axeConfig)).toHaveNoViolations()
  })
})
