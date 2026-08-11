export interface FormFieldProps {
  label: string
  input: HTMLInputElement
}

export function createFormField(props: FormFieldProps): HTMLDivElement {
  const field = document.createElement('div')
  field.className = 'flex flex-col gap-2'

  const label = document.createElement('label')
  label.htmlFor = props.input.id
  label.textContent = props.label
  label.className = 'text-sm text-neutral-200'

  field.append(label, props.input)

  return field
}
