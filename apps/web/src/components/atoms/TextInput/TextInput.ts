export interface TextInputProps {
  id: string
  name: string
  type?: string
  placeholder?: string
  autoComplete?: string
}

export function createTextInput(props: TextInputProps): HTMLInputElement {
  const input = document.createElement('input')
  input.id = props.id
  input.name = props.name
  input.type = props.type ?? 'text'
  if (props.placeholder) input.placeholder = props.placeholder
  if (props.autoComplete) input.autocomplete = props.autoComplete
  input.className =
    'w-full rounded-lg bg-neutral-200/90 px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-400'

  return input
}
