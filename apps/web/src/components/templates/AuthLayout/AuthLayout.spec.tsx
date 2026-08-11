import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { AuthLayout } from './AuthLayout'

describe('AuthLayout', () => {
  it('renders both the banner and the form content inside the card', () => {
    const { container } = render(
      <AuthLayout banner={<div data-testid="banner" />} formContent={<div data-testid="form-content" />} />,
    )

    expect(container.querySelector('[data-testid="banner"]')).not.toBeNull()
    expect(container.querySelector('[data-testid="form-content"]')).not.toBeNull()
  })
})
