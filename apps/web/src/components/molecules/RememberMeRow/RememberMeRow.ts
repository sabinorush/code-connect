import { createLink } from '../../atoms/Link/Link'

export interface RememberMeRowProps {
  checkbox: HTMLInputElement
  checkboxLabel: string
  forgotPasswordHref: string
}

export function createRememberMeRow(props: RememberMeRowProps): HTMLDivElement {
  const row = document.createElement('div')
  row.className = 'flex items-center justify-between text-sm'

  const checkboxWrapper = document.createElement('label')
  checkboxWrapper.className = 'flex items-center gap-2 text-neutral-200'
  checkboxWrapper.htmlFor = props.checkbox.id

  const checkboxLabel = document.createElement('span')
  checkboxLabel.textContent = props.checkboxLabel

  checkboxWrapper.append(props.checkbox, checkboxLabel)

  const forgotPasswordLink = createLink({ label: 'Esqueci a senha', href: props.forgotPasswordHref })

  row.append(checkboxWrapper, forgotPasswordLink)

  return row
}
