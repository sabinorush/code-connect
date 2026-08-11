import { describe, expect, it } from 'vitest'
import { createTextInput } from './TextInput'

describe('createTextInput', () => {
  it('renders an input with the given id, name and placeholder', () => {
    const input = createTextInput({ id: 'identifier', name: 'identifier', placeholder: 'usuario123' })

    expect(input.tagName).toBe('INPUT')
    expect(input.id).toBe('identifier')
    expect(input.name).toBe('identifier')
    expect(input.placeholder).toBe('usuario123')
    expect(input.type).toBe('text')
  })

  it('respects a custom type and autoComplete', () => {
    const input = createTextInput({ id: 'password', name: 'password', type: 'password', autoComplete: 'current-password' })

    expect(input.type).toBe('password')
    expect(input.autocomplete).toBe('current-password')
  })
})
