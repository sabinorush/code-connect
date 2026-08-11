import { describe, expect, it, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('defaults to unchecked', () => {
    const { container } = render(<Checkbox id="remember-me" name="rememberMe" />)
    const checkbox = container.querySelector('input')!

    expect(checkbox.type).toBe('checkbox')
    expect(checkbox.checked).toBe(false)
  })

  it('respects the initial checked value', () => {
    const { container } = render(<Checkbox id="remember-me" name="rememberMe" checked />)
    const checkbox = container.querySelector('input')!

    expect(checkbox.checked).toBe(true)
  })

  it('calls onChange with the new checked state when toggled', () => {
    const onChange = vi.fn()
    const { container } = render(<Checkbox id="remember-me" name="rememberMe" onChange={onChange} />)
    const checkbox = container.querySelector('input')!

    fireEvent.click(checkbox)

    expect(checkbox.checked).toBe(true)
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
