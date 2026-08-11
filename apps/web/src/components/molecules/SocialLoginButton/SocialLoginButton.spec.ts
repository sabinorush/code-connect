import { describe, expect, it, vi } from 'vitest'
import { createSocialLoginButton } from './SocialLoginButton'

describe('createSocialLoginButton', () => {
  it('renders the icon and label', () => {
    const button = createSocialLoginButton({ iconSrc: '/github.png', alt: 'GitHub', label: 'Github' })

    const img = button.querySelector('img')!
    expect(img.src).toContain('/github.png')
    expect(img.alt).toBe('GitHub')
    expect(button.textContent).toContain('Github')
    expect(button.type).toBe('button')
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    const button = createSocialLoginButton({ iconSrc: '/gmail.png', alt: 'Gmail', label: 'Gmail', onClick })

    button.click()

    expect(onClick).toHaveBeenCalledOnce()
  })
})
