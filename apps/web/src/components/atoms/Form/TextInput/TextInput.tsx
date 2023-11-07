import clsx from 'clsx'
import type { ReactNode } from 'react'
import { forwardRef } from 'react'
import type { FieldErrors } from 'react-hook-form'
import { ErrorInline } from '../ErrorInline/ErrorInline'

interface TextInputProps {
  name: string
  label?: string
  hint?: ReactNode
  required?: boolean
  errors?: FieldErrors
  autocomplete?: string
  defaultValue?: string
  className?: string
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, errors, hint, defaultValue, required = true, autocomplete, className, ...rest }, ref) => {
    const error = errors?.[rest.name]
    return (
      <div className={clsx('govuk-form-group', { 'govuk-form-group--error': Boolean(error) }, className)}>
        <div className="govuk-label-wrapper">
          {label ? (
            <label className="govuk-label govuk-label--s" htmlFor={rest.name} id={`${rest.name}-label`}>
              {label}
            </label>
          ) : null}
          {hint ? (
            <div className="govuk-hint" id={`${rest.name}-hint`}>
              {hint}
            </div>
          ) : null}
        </div>
        {errors ? <ErrorInline errors={errors} name={rest.name} /> : null}
        <input
          aria-describedby={clsx({
            [`${rest.name}-hint`]: hint,
            [`${rest.name}-error`]: error,
          })}
          aria-errormessage={clsx({
            [`${rest.name}-error`]: error,
          })}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
          autoComplete={autocomplete}
          className={clsx('govuk-input', { 'govuk-input--error': Boolean(error) })}
          defaultValue={defaultValue}
          id={rest.name}
          type="text"
          {...rest}
          ref={ref}
        />
      </div>
    )
  }
)
