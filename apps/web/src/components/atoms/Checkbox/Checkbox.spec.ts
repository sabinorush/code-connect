import { describe, expect, it, vi } from 'vitest'
import { createCheckbox } from './Checkbox'

describe('createCheckbox', () => {
  it('defaults to unchecked', () => {
    const checkbox = createCheckbox({ id: 'remember-me', name: 'rememberMe' })

    expect(checkbox.type).toBe('checkbox')
    expect(checkbox.checked).toBe(false)
  })

  it('respects the initial checked value', () => {
    const checkbox = createCheckbox({ id: 'remember-me', name: 'rememberMe', checked: true })

    expect(checkbox.checked).toBe(true)
  })

  it('calls onChange with the new checked state when toggled', () => {
    const onChange = vi.fn()
    const checkbox = createCheckbox({ id: 'remember-me', name: 'rememberMe', onChange })

    checkbox.click()
    checkbox.dispatchEvent(new Event('change'))

    expect(onChange).toHaveBeenCalledWith(true)
  })
})
