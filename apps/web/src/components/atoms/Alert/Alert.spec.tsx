import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders the message with an alert role so screen readers announce it', () => {
    const { container } = render(<Alert message="Email ou senha inválidos." />)

    const alert = container.querySelector('[role="alert"]')
    expect(alert).not.toBeNull()
    expect(alert?.textContent).toBe('Email ou senha inválidos.')
  })
})
