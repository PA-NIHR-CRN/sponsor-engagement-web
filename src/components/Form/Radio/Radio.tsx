import { forwardRef } from 'react'

type RadioProps = {
  label: string
  value: string
  name?: string
  id?: string
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({ label, value, id, ...rest }, ref) => (
  <div className="govuk-radios__item">
    <input type="radio" className="govuk-radios__input" id={id} value={value} {...rest} ref={ref} />
    <label className="govuk-label govuk-radios__label" htmlFor={id}>
      {label}
    </label>
  </div>
))
