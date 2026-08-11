import { describe, expect, it, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { CadastroForm } from './CadastroForm'

describe('CadastroForm', () => {
  it('renders the name, email and password fields, remember-me checked by default, and the submit button', () => {
    const { container } = render(<CadastroForm />)

    expect(container.querySelector('#name')).not.toBeNull()
    expect(container.querySelector('#email')).not.toBeNull()
    expect(container.querySelector('#password')).not.toBeNull()
    expect((container.querySelector('#remember-me') as HTMLInputElement).checked).toBe(true)
    expect(container.querySelector('button[type="submit"]')?.textContent).toContain('Cadastrar')
  })

  it('submits the entered values without navigating and calls onSubmit', () => {
    const onSubmit = vi.fn()
    const { container } = render(<CadastroForm onSubmit={onSubmit} />)

    const name = container.querySelector<HTMLInputElement>('#name')!
    const email = container.querySelector<HTMLInputElement>('#email')!
    const password = container.querySelector<HTMLInputElement>('#password')!
    fireEvent.change(name, { target: { value: 'Ana Silva' } })
    fireEvent.change(email, { target: { value: 'ana@example.com' } })
    fireEvent.change(password, { target: { value: 'segredo123' } })

    const form = container.querySelector('form')!
    const notCancelled = fireEvent.submit(form)

    expect(notCancelled).toBe(false)
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Ana Silva',
      email: 'ana@example.com',
      password: 'segredo123',
      rememberMe: true,
    })
  })

  it('reports rememberMe: false when the checkbox is unchecked before submit', () => {
    const onSubmit = vi.fn()
    const { container } = render(<CadastroForm onSubmit={onSubmit} />)

    fireEvent.click(container.querySelector('#remember-me')!)

    const form = container.querySelector('form')!
    fireEvent.submit(form)

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ rememberMe: false }))
  })

  it('calls onGithubLogin and onGmailLogin when the respective social buttons are clicked', () => {
    const onGithubLogin = vi.fn()
    const onGmailLogin = vi.fn()
    const { container } = render(<CadastroForm onGithubLogin={onGithubLogin} onGmailLogin={onGmailLogin} />)

    const socialButtons = container.querySelectorAll('button[type="button"]')
    fireEvent.click(socialButtons[0])
    fireEvent.click(socialButtons[1])

    expect(onGithubLogin).toHaveBeenCalledOnce()
    expect(onGmailLogin).toHaveBeenCalledOnce()
  })

  it('does not render a forgot-password link, only the login prompt link', () => {
    const { container } = render(<CadastroForm />)

    const links = container.querySelectorAll('a')
    expect(links).toHaveLength(1)
    expect(links[0].textContent).toContain('Faça seu login!')
    expect(links[0].getAttribute('href')).toBe('/login')
  })
})
