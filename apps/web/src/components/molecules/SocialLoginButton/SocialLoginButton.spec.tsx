import { describe, expect, it, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { SocialLoginButton } from './SocialLoginButton'

describe('SocialLoginButton', () => {
  it('renders the icon and label', () => {
    const { container } = render(<SocialLoginButton iconSrc="/github.png" alt="GitHub" label="Github" />)
    const button = container.querySelector('button')!
    const img = button.querySelector('img')!

    expect(img.src).toContain('/github.png')
    expect(img.alt).toBe('GitHub')
    expect(button.textContent).toContain('Github')
    expect(button.type).toBe('button')
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    const { container } = render(
      <SocialLoginButton iconSrc="/gmail.png" alt="Gmail" label="Gmail" onClick={onClick} />,
    )
    const button = container.querySelector('button')!

    fireEvent.click(button)

    expect(onClick).toHaveBeenCalledOnce()
  })
})
