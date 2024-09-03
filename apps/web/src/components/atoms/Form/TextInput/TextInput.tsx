import clsx from 'clsx'
import type { ReactNode } from 'react'
import { forwardRef } from 'react'
import type { FieldErrors } from 'react-hook-form'

import { ErrorInline } from '../ErrorInline/ErrorInline'

interface TextInputProps extends React.HTMLProps<HTMLInputElement> {
  name: string
  label?: string
  labelSize?: 's' | 'm' | 'l'
  hint?: ReactNode
  required?: boolean
  errors?: FieldErrors
  autocomplete?: string
  defaultValue?: string | number
  className?: string
  labelClassName?: string
  inputClassName?: string
  disabled?: boolean
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      labelSize = 's',
      errors,
      hint,
      defaultValue,
      required = true,
      autocomplete,
      className,
      labelClassName,
      inputClassName,
      disabled,
      ...rest
    },
    ref
  ) => {
    const error = errors?.[rest.name]
    return (
      <div className={clsx('govuk-form-group', { 'govuk-form-group--error': Boolean(error) }, className)}>
        <div className="govuk-label-wrapper">
          {label ? (
            <label
              className={clsx('govuk-label', `govuk-label--${labelSize}`, 'govuk-date-input__label', labelClassName)}
              htmlFor={rest.name}
              id={`${rest.name}-label`}
            >
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
          aria-disabled={disabled}
          aria-errormessage={clsx({
            [`${rest.name}-error`]: error,
          })}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
          autoComplete={autocomplete}
          className={clsx('govuk-input', { 'govuk-input--error': Boolean(error) }, inputClassName)}
          defaultValue={defaultValue}
          disabled={disabled}
          id={rest.name}
          type="text"
          {...rest}
          ref={ref}
        />
      </div>
    )
  }
)
