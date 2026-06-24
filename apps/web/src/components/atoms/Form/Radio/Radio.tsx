import { forwardRef } from 'react'

export interface RadioProps {
  label: string
  value: string
  name?: string
  id?: string
  hint?: string
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({ label, value, id, hint, ...rest }, ref) => (
  <div className="govuk-radios__item">
    <input
      aria-describedby={`${id}-hint`}
      className="govuk-radios__input"
      id={id}
      type="radio"
      value={value}
      {...rest}
      ref={ref}
    />
    <label className="govuk-label govuk-radios__label" htmlFor={id}>
      {label}
    </label>
    {hint ? (
      <div className="govuk-hint govuk-radios__hint" id={`${id}-hint`}>
        {hint}
      </div>
    ) : null}
  </div>
))
