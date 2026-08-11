import { describe, expect, it, vi } from 'vitest'
import { createButton } from './Button'

describe('createButton', () => {
  it('renders the given label and respects the type prop', () => {
    const button = createButton({ label: 'Login', type: 'submit' })

    expect(button.tagName).toBe('BUTTON')
    expect(button.type).toBe('submit')
    expect(button.textContent).toContain('Login')
  })

  it('defaults to type "button"', () => {
    const button = createButton({ label: 'Login' })

    expect(button.type).toBe('button')
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    const button = createButton({ label: 'Login', onClick })

    button.click()

    expect(onClick).toHaveBeenCalledOnce()
  })
})
