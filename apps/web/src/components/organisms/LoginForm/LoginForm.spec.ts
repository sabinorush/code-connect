import { describe, expect, it, vi } from 'vitest'
import { createLoginForm } from './LoginForm'

describe('createLoginForm', () => {
  it('renders the identifier and password fields, remember-me checked by default, and the submit button', () => {
    const form = createLoginForm()

    expect(form.querySelector('#identifier')).not.toBeNull()
    expect(form.querySelector('#password')).not.toBeNull()
    expect((form.querySelector('#remember-me') as HTMLInputElement).checked).toBe(true)
    expect(form.querySelector('button[type="submit"]')?.textContent).toContain('Login')
  })

  it('submits the entered values without navigating and calls onSubmit', () => {
    const onSubmit = vi.fn()
    const form = createLoginForm({ onSubmit })

    const identifier = form.querySelector<HTMLInputElement>('#identifier')!
    const password = form.querySelector<HTMLInputElement>('#password')!
    identifier.value = 'usuario123'
    password.value = 'segredo'

    const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
    form.dispatchEvent(submitEvent)

    expect(submitEvent.defaultPrevented).toBe(true)
    expect(onSubmit).toHaveBeenCalledWith({
      identifier: 'usuario123',
      password: 'segredo',
      rememberMe: true,
    })
  })

  it('calls onGithubLogin and onGmailLogin when the respective social buttons are clicked', () => {
    const onGithubLogin = vi.fn()
    const onGmailLogin = vi.fn()
    const form = createLoginForm({ onGithubLogin, onGmailLogin })

    const socialButtons = form.querySelectorAll('button[type="button"]')
    ;(socialButtons[0] as HTMLButtonElement).click()
    ;(socialButtons[1] as HTMLButtonElement).click()

    expect(onGithubLogin).toHaveBeenCalledOnce()
    expect(onGmailLogin).toHaveBeenCalledOnce()
  })
})
