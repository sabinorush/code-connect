import { describe, expect, it } from 'vitest'
import { createFormField } from './FormField'
import { createTextInput } from '../../atoms/TextInput/TextInput'

describe('createFormField', () => {
  it('renders a label wired to the input via htmlFor/id and contains the input', () => {
    const input = createTextInput({ id: 'identifier', name: 'identifier' })
    const field = createFormField({ label: 'Email ou usuário', input })

    const label = field.querySelector('label')!
    expect(label.textContent).toBe('Email ou usuário')
    expect(label.htmlFor).toBe('identifier')
    expect(field.contains(input)).toBe(true)
  })
})
