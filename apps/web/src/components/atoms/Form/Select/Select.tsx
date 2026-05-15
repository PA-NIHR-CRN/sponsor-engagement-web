import clsx from 'clsx'
import type { ReactNode} from 'react';
import { forwardRef, useRef } from 'react'
import type { FieldErrors } from 'react-hook-form'

import { ErrorInline } from '../ErrorInline/ErrorInline'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string
  label?: string
  labelSize?: 's' | 'm' | 'l'
  hint?: ReactNode
  required?: boolean
  errors?: FieldErrors
  displayInlineError?: boolean
  defaultValue?: string | number
  className?: string
  labelClassName?: string
  inputClassName?: string
  disabled?: boolean
  options: ReactNode[]
  submitOnChange?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      name,
      label,
      labelSize = 's',
      errors,
      displayInlineError = true,
      hint,
      required = true,
      className,
      labelClassName,
      inputClassName,
      disabled,
      options,
      submitOnChange,
      ...rest
    },
    ref
  ) => {
    const error = errors?.[name]
    const submitRef = useRef<HTMLButtonElement>(null)

    const { onChange, ...selectProps } = rest

    return (
      <div
        className={clsx(
          'govuk-form-group',
          { 'govuk-form-group--error': Boolean(error) },
          className
        )}
      >
        <div className="govuk-label-wrapper">
          {label ? <label
              className={clsx('govuk-label', `govuk-label--${labelSize}`, labelClassName)}
              htmlFor={name}
              id={`${name}-label`}
            >
              {label}
            </label> : null}

          {hint ? <div className="govuk-hint" id={`${name}-hint`}>
              {hint}
            </div> : null}
        </div>

        {errors && displayInlineError ? <ErrorInline errors={errors} name={name} /> : null}

        <select
          aria-describedby={clsx({
            [`${name}-hint`]: hint,
            [`${name}-error`]: error,
          })}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
          className={clsx(
            'govuk-select',
            { 'govuk-select--error': Boolean(error) },
            inputClassName
          )}
          disabled={disabled}
          id={name}
          name={name}
          onChange={(e) => {
            if (submitOnChange) submitRef.current?.click()
            onChange?.(e)
          }}
          ref={ref}
          {...selectProps}
        >
          {options}
        </select>

        {submitOnChange ? <button
            className="govuk-button govuk-button--secondary govuk-!-margin-left-3 govuk-!-margin-bottom-0"
            ref={submitRef}
            type="submit"
          >
            Submit
          </button> : null}
      </div>
    )
  }
)