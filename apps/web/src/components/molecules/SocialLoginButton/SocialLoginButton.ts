export interface SocialLoginButtonProps {
  iconSrc: string
  alt: string
  label: string
  onClick?: () => void
}

export function createSocialLoginButton(props: SocialLoginButtonProps): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'flex flex-col items-center gap-2 text-sm text-neutral-300 transition-opacity hover:opacity-80'

  const icon = document.createElement('img')
  icon.src = props.iconSrc
  icon.alt = props.alt
  icon.className = 'h-8 w-8'

  const label = document.createElement('span')
  label.textContent = props.label

  button.append(icon, label)

  if (props.onClick) {
    button.addEventListener('click', props.onClick)
  }

  return button
}
