export interface CheckboxProps {
  id: string
  name: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export function Checkbox({ id, name, checked = false, onChange }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      id={id}
      name={name}
      defaultChecked={checked}
      onChange={onChange ? (event) => onChange(event.target.checked) : undefined}
      className="h-4 w-4 rounded border-neutral-500 bg-neutral-200 accent-green-400 focus:ring-2 focus:ring-green-400"
    />
  )
}
