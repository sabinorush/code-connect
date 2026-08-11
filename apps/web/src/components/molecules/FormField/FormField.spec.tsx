import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { FormField } from './FormField'
import { TextInput } from '../../atoms/TextInput/TextInput'

describe('FormField', () => {
  it('renders a label wired to the input via htmlFor/id and contains the input', () => {
    const { container } = render(
      <FormField
        label="Email ou usuário"
        htmlFor="identifier"
        input={<TextInput id="identifier" name="identifier" />}
      />,
    )

    const label = container.querySelector('label')!
    expect(label.textContent).toBe('Email ou usuário')
    expect(label.htmlFor).toBe('identifier')
    expect(container.querySelector('#identifier')).not.toBeNull()
  })
})
