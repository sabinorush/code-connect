import { describe, expect, it, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders the given label and respects the type prop', () => {
    const { container } = render(<Button label="Login" type="submit" />)
    const button = container.querySelector('button')!

    expect(button.type).toBe('submit')
    expect(button.textContent).toContain('Login')
  })

  it('defaults to type "button"', () => {
    const { container } = render(<Button label="Login" />)
    const button = container.querySelector('button')!

    expect(button.type).toBe('button')
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    const { container } = render(<Button label="Login" onClick={onClick} />)
    const button = container.querySelector('button')!

    fireEvent.click(button)

    expect(onClick).toHaveBeenCalledOnce()
  })
})
