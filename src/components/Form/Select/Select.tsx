import clsx from 'clsx'
import { forwardRef, HTMLProps, ReactNode } from 'react'
import { FieldErrors } from 'react-hook-form'

import { ErrorInline } from '../ErrorInline/ErrorInline'

type SelectProps = {
  children: ReactNode
  label: string
  name: string
  hint?: ReactNode
  required?: boolean
  errors: FieldErrors
  defaultValue: string | undefined
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, label, errors, hint, defaultValue, required = true, ...rest }, ref) => {
    const error = errors[rest.name]

    return (
      <div className={clsx('govuk-form-group', { 'govuk-form-group--error': !!error })}>
        <div className="govuk-label-wrapper">
          <label id={`${rest.name}-label`} className="govuk-label govuk-label--s" htmlFor={rest.name}>
            {label}
          </label>
          {hint && (
            <div id={`${rest.name}-hint`} className="govuk-hint">
              {hint}
            </div>
          )}
        </div>
        <ErrorInline name={rest.name} errors={errors} />
        <select
          className="govuk-select"
          id={rest.name}
          aria-required={required}
          aria-invalid={!!error ? 'true' : 'false'}
          aria-errormessage={clsx({
            [`${rest.name}-error`]: error,
          })}
          aria-describedby={clsx({
            [`${rest.name}-hint`]: hint,
            [`${rest.name}-error`]: error,
          })}
          defaultValue={defaultValue}
          {...rest}
          ref={ref}
        >
          {children}
        </select>
      </div>
    )
  }
)

export function Option({ children, value }: HTMLProps<HTMLOptionElement> & { children: string }) {
  return <option value={value}>{children}</option>
}
