export interface ButtonProps {
  label: string
  type?: 'button' | 'submit'
  icon?: HTMLElement
  onClick?: () => void
}

export function createButton(props: ButtonProps): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = props.type ?? 'button'
  button.className =
    'flex w-full items-center justify-center gap-2 rounded-lg bg-green-400 px-4 py-3 font-semibold text-neutral-950 transition-colors hover:bg-green-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400'

  const label = document.createElement('span')
  label.textContent = props.label
  button.append(label)

  if (props.icon) {
    button.append(props.icon)
  }

  if (props.onClick) {
    button.addEventListener('click', props.onClick)
  }

  return button
}
