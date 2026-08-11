import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { TextInput } from './TextInput'

describe('TextInput', () => {
  it('renders an input with the given id, name and placeholder', () => {
    const { container } = render(<TextInput id="identifier" name="identifier" placeholder="usuario123" />)
    const input = container.querySelector('input')!

    expect(input.id).toBe('identifier')
    expect(input.name).toBe('identifier')
    expect(input.placeholder).toBe('usuario123')
    expect(input.type).toBe('text')
  })

  it('respects a custom type and autoComplete', () => {
    const { container } = render(
      <TextInput id="password" name="password" type="password" autoComplete="current-password" />,
    )
    const input = container.querySelector('input')!

    expect(input.type).toBe('password')
    expect(input.autocomplete).toBe('current-password')
  })
})
