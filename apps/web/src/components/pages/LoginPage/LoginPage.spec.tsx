import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { LoginPage } from './LoginPage'

describe('LoginPage', () => {
  it('renders the login banner and the login form', () => {
    const { container } = render(<LoginPage />)

    expect(container.querySelector('img[alt*="Code Connect"]')).not.toBeNull()
    expect(container.querySelector('form')).not.toBeNull()
    expect(container.querySelector('h1')?.textContent).toBe('Login')
  })
})
