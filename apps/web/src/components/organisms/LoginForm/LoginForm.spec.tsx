import { describe, expect, it, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('renders the email and password fields, remember-me checked by default, and the submit button', () => {
    const { container } = render(<LoginForm />)

    expect(container.querySelector('#email')).not.toBeNull()
    expect(container.querySelector('#password')).not.toBeNull()
    expect((container.querySelector('#remember-me') as HTMLInputElement).checked).toBe(true)
    expect(container.querySelector('button[type="submit"]')?.textContent).toContain('Login')
  })

  it('submits the entered values without navigating and calls onSubmit', () => {
    const onSubmit = vi.fn()
    const { container } = render(<LoginForm onSubmit={onSubmit} />)

    const email = container.querySelector<HTMLInputElement>('#email')!
    const password = container.querySelector<HTMLInputElement>('#password')!
    fireEvent.change(email, { target: { value: 'ada@example.com' } })
    fireEvent.change(password, { target: { value: 'segredo' } })

    const form = container.querySelector('form')!
    const notCancelled = fireEvent.submit(form)

    expect(notCancelled).toBe(false)
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'ada@example.com',
      password: 'segredo',
      rememberMe: true,
    })
  })

  it('submits rememberMe: false when the checkbox is unchecked before submitting', () => {
    const onSubmit = vi.fn()
    const { container } = render(<LoginForm onSubmit={onSubmit} />)

    const email = container.querySelector<HTMLInputElement>('#email')!
    const password = container.querySelector<HTMLInputElement>('#password')!
    fireEvent.change(email, { target: { value: 'ada@example.com' } })
    fireEvent.change(password, { target: { value: 'segredo' } })
    fireEvent.click(container.querySelector('#remember-me')!)

    const form = container.querySelector('form')!
    fireEvent.submit(form)

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'ada@example.com',
      password: 'segredo',
      rememberMe: false,
    })
  })

  it('calls onGithubLogin and onGmailLogin when the respective social buttons are clicked', () => {
    const onGithubLogin = vi.fn()
    const onGmailLogin = vi.fn()
    const { container } = render(<LoginForm onGithubLogin={onGithubLogin} onGmailLogin={onGmailLogin} />)

    const socialButtons = container.querySelectorAll('button[type="button"]')
    fireEvent.click(socialButtons[0])
    fireEvent.click(socialButtons[1])

    expect(onGithubLogin).toHaveBeenCalledOnce()
    expect(onGmailLogin).toHaveBeenCalledOnce()
  })

  it('shows the error message and disables the fields while submitting', () => {
    const { container } = render(<LoginForm isSubmitting errorMessage="Email ou senha inválidos." />)

    expect(container.querySelector('[role="alert"]')?.textContent).toBe('Email ou senha inválidos.')
    expect((container.querySelector('#email') as HTMLInputElement).disabled).toBe(true)
    expect((container.querySelector('#password') as HTMLInputElement).disabled).toBe(true)
    expect((container.querySelector('#remember-me') as HTMLInputElement).disabled).toBe(true)
    expect((container.querySelector('button[type="submit"]') as HTMLButtonElement).disabled).toBe(true)
    expect(container.querySelector('button[type="submit"]')?.textContent).toContain('Entrando...')
  })
})
