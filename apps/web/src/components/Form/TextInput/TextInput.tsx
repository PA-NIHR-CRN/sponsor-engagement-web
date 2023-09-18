import clsx from 'clsx'
import { forwardRef, ReactNode } from 'react'
import { FieldErrors } from 'react-hook-form'

import { ErrorInline } from '../ErrorInline/ErrorInline'

type TextInputProps = {
  label: string
  name: string
  hint?: ReactNode
  required?: boolean
  errors: FieldErrors
  autocomplete?: string
  defaultValue: string | undefined
  className?: string
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, errors, hint, defaultValue, required = true, autocomplete, className, ...rest }, ref) => {
    const error = errors[rest.name]

    return (
      <>
        <div className={clsx('govuk-form-group', { 'govuk-form-group--error': !!error }, className)}>
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
          <input
            type="text"
            autoComplete={autocomplete}
            className={clsx('govuk-input', { 'govuk-input--error': !!error })}
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
          />
        </div>
      </>
    )
  }
)
