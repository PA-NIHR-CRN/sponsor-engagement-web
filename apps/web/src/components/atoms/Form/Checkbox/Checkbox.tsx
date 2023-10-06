import { forwardRef } from 'react'

export interface CheckboxProps {
  label: string
  value: string
  name?: string
  id?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ label, value, id, ...rest }, ref) => (
  <div className="govuk-checkboxes__item">
    <input className="govuk-checkboxes__input" id={id} type="checkbox" value={value} {...rest} ref={ref} />
    <label className="govuk-label govuk-checkboxes__label" htmlFor={id}>
      {label}
    </label>
  </div>
))
