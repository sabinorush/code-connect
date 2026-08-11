import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { CadastroPage } from './CadastroPage'
import { axeConfig } from '../../../test/a11y'

describe('CadastroPage', () => {
  it('renders the cadastro banner and the cadastro form', () => {
    const { container } = render(<CadastroPage />)

    expect(container.querySelector('img[alt*="Code Connect"]')).not.toBeNull()
    expect(container.querySelector('form')).not.toBeNull()
    expect(container.querySelector('h1')?.textContent).toBe('Cadastro')
  })

  it('não tem violações de acessibilidade (WCAG 2.1 AA)', async () => {
    const { container } = render(<CadastroPage />)

    expect(await axe(container, axeConfig)).toHaveNoViolations()
  })
})
