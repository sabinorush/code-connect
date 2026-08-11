export interface CheckboxProps {
  id: string
  name: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export function createCheckbox(props: CheckboxProps): HTMLInputElement {
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.id = props.id
  checkbox.name = props.name
  checkbox.checked = props.checked ?? false
  checkbox.className =
    'h-4 w-4 rounded border-neutral-500 bg-neutral-200 accent-green-400 focus:ring-2 focus:ring-green-400'

  if (props.onChange) {
    const onChange = props.onChange
    checkbox.addEventListener('change', () => onChange(checkbox.checked))
  }

  return checkbox
}
