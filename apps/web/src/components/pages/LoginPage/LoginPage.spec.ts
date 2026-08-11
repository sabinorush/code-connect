import { describe, expect, it } from 'vitest'
import { createLoginPage } from './LoginPage'

describe('createLoginPage', () => {
  it('renders the login banner and the login form', () => {
    const page = createLoginPage()

    expect(page.querySelector('img[alt*="Code Connect"]')).not.toBeNull()
    expect(page.querySelector('form')).not.toBeNull()
    expect(page.querySelector('h1')?.textContent).toBe('Login')
  })
})
