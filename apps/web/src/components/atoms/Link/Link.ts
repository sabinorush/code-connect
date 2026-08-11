export interface LinkProps {
  label: string
  href: string
  icon?: HTMLElement
}

export function createLink(props: LinkProps): HTMLAnchorElement {
  const link = document.createElement('a')
  link.href = props.href
  link.className = 'inline-flex items-center gap-1 text-green-400 hover:text-green-300 hover:underline'

  const label = document.createElement('span')
  label.textContent = props.label
  link.append(label)

  if (props.icon) {
    link.append(props.icon)
  }

  return link
}
