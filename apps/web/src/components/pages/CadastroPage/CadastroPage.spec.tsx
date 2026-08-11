import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { CadastroPage } from './CadastroPage'

describe('CadastroPage', () => {
  it('renders the cadastro banner and the cadastro form', () => {
    const { container } = render(<CadastroPage />)

    expect(container.querySelector('img[alt*="Code Connect"]')).not.toBeNull()
    expect(container.querySelector('form')).not.toBeNull()
    expect(container.querySelector('h1')?.textContent).toBe('Cadastro')
  })
})
